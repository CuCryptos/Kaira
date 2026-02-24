# Finish Replicate Integration — Design

## Problem

The MCP server and WordPress theme both have working Replicate integrations, but they diverge in identity prompts, preset names, preset availability, and polling timeouts. This causes inconsistent image generation results depending on which tool is used.

## Decision

MCP server (`wp-mcp-server/prompts/kaira-presets.js`) is the canonical source of truth for all prompts and presets. A build script generates a PHP file that the theme consumes, keeping both in sync automatically.

## Architecture

```
kaira-presets.js (source of truth)
        |
  sync-presets.js (build script)
        |
  kaira-presets-generated.php (committed, auto-generated)
        |
  image-studio.php + replicate-api.php (consume generated file)
```

## Changes

### 1. Build Script — `scripts/sync-presets.js`

Node script that imports `kaira-presets.js` and outputs `kaira-theme/inc/kaira-presets-generated.php` containing:

- `KAIRA_BASE_PROMPT` constant
- `KAIRA_NEGATIVE_PROMPT` constant
- `kaira_get_presets()` function returning all 12 presets
- `kaira_build_prompt()` function matching MCP's `buildKairaPrompt()`
- Auto-generated header warning not to edit

### 2. Theme Updates — `kaira-theme/inc/image-studio.php`

- Replace hardcoded 8 presets with `kaira_get_presets()` from generated file
- Replace hardcoded identity prompt with `kaira_build_prompt()`
- Rename `gym_workout` to `gym_fitness` (via generated presets)
- All 12 presets appear in dropdown

### 3. Theme Replicate Client — `kaira-theme/inc/replicate-api.php`

- Update polling from 60 to 120 attempts (2 min → 4 min)
- Use `kaira_build_prompt()` for prompt assembly instead of hardcoded string

### 4. Commit Generated File

`kaira-presets-generated.php` is committed to git so the theme works standalone without running the build script. The script is run when presets change.

## What Stays Unchanged

- MCP server code (complete)
- MCP presets file structure
- Theme AJAX workflow and UI layout
- Theme admin menu registration
