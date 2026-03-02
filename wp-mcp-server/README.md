# WordPress MCP Server

An MCP (Model Context Protocol) server that gives Claude Code full WordPress admin capabilities: create/edit posts and pages, manage media, handle categories and tags, and optionally generate content with AI.

## What You Get

**20 WordPress tools** that work with any WordPress site, plus **8 optional AI tools**:

| Module | Tools | Requires |
|--------|-------|----------|
| **WordPress** (20) | Posts, pages, categories, tags, media, site info, block patterns | WP credentials only |
| **AI Content** (5) | Travel posts, descriptions, SEO metadata, image prompts | ANTHROPIC_API_KEY |
| **AI Images** (3) | Destination photography, Kaira portraits, presets | GEMINI / REPLICATE keys |

The WordPress tools work on any WordPress site. The AI tools are optional — the server starts and works fine without any API keys.

## Quick Setup

### 1. Install dependencies

```bash
cd wp-mcp-server
npm install
```

### 2. Create a WordPress Application Password

This is how the MCP server authenticates with your WordPress site.

1. Log into your WordPress admin: `https://your-site.com/wp-admin/`
2. Go to **Users → Profile** (or visit `https://your-site.com/wp-admin/profile.php`)
3. Scroll down to **Application Passwords**
4. Enter a name like "Claude Code MCP" and click **Add New Application Password**
5. Copy the generated password (it looks like `xxxx xxxx xxxx xxxx xxxx xxxx`)

**Troubleshooting Application Passwords:**
- If you don't see the Application Passwords section, your site may need HTTPS enabled or the feature may be disabled by a plugin
- The user account must have **Administrator** or **Editor** role for full access
- Application Passwords require WordPress 5.6+ (but you should be on 6.x)
- Some security plugins (Wordfence, iThemes) can block Application Passwords — check their settings
- Some hosts block the REST API — test by visiting `https://your-site.com/wp-json/wp/v2/posts` in your browser

### 3. Configure Claude Code

Add to your project's `.mcp.json` file (create it in your project root if it doesn't exist):

```json
{
  "mcpServers": {
    "my-site": {
      "command": "node",
      "args": ["/full/path/to/wp-mcp-server/index.js"],
      "env": {
        "WP_SITE_URL": "https://your-site.com",
        "WP_USERNAME": "your_wordpress_username",
        "WP_APP_PASSWORD": "xxxx xxxx xxxx xxxx xxxx xxxx"
      }
    }
  }
}
```

**Important:**
- `args` must be the **full absolute path** to `index.js` (not relative)
- `WP_SITE_URL` should NOT have a trailing slash
- `WP_USERNAME` is your WordPress login username (or email if you log in with email)
- `WP_APP_PASSWORD` is the application password from step 2 (NOT your regular WordPress password)

### 4. Restart Claude Code

MCP servers load on startup. After changing `.mcp.json`, restart Claude Code to connect.

### 5. Verify it works

In Claude Code, try: "List my WordPress posts" — you should see your site's posts.

## Using Multiple Sites

You can manage multiple WordPress sites by adding multiple entries to `.mcp.json`. Each gets its own name prefix:

```json
{
  "mcpServers": {
    "site-one": {
      "command": "node",
      "args": ["/full/path/to/wp-mcp-server/index.js"],
      "env": {
        "WP_SITE_URL": "https://site-one.com",
        "WP_USERNAME": "admin",
        "WP_APP_PASSWORD": "xxxx xxxx xxxx xxxx xxxx xxxx",
        "MCP_SERVER_NAME": "site-one"
      }
    },
    "site-two": {
      "command": "node",
      "args": ["/full/path/to/wp-mcp-server/index.js"],
      "env": {
        "WP_SITE_URL": "https://site-two.com",
        "WP_USERNAME": "admin",
        "WP_APP_PASSWORD": "yyyy yyyy yyyy yyyy yyyy yyyy",
        "MCP_SERVER_NAME": "site-two"
      }
    }
  }
}
```

Claude Code will show tools prefixed with the server name (e.g., `site-one__wp_list_posts`, `site-two__wp_list_posts`).

## Optional: Enable AI Features

Add API keys to the `env` block to enable AI content generation:

```json
"env": {
  "WP_SITE_URL": "https://your-site.com",
  "WP_USERNAME": "admin",
  "WP_APP_PASSWORD": "xxxx xxxx xxxx xxxx xxxx xxxx",
  "ANTHROPIC_API_KEY": "sk-ant-...",
  "GEMINI_API_KEY": "your_gemini_key"
}
```

| Key | What it enables | Where to get it |
|-----|----------------|-----------------|
| `ANTHROPIC_API_KEY` | AI blog posts, descriptions, SEO metadata | [console.anthropic.com](https://console.anthropic.com/) |
| `GEMINI_API_KEY` | AI destination photography (no people) | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| `REPLICATE_API_TOKEN` + `KAIRA_MODEL_VERSION` | Kaira-specific portrait generation | [replicate.com](https://replicate.com/) (requires trained LoRA) |

If a key is missing, the corresponding tools still appear but display a helpful "not configured" message.

## Available WordPress Tools

These work on **any** WordPress site with Application Passwords:

| Tool | Description |
|------|-------------|
| `wp_list_posts` | List posts (filter by status, category, search) |
| `wp_get_post` | Get a single post by ID |
| `wp_create_post` | Create a new post (title, content, categories, tags, etc.) |
| `wp_update_post` | Update an existing post |
| `wp_delete_post` | Delete/trash a post |
| `wp_list_pages` | List pages |
| `wp_get_page` | Get a single page by ID |
| `wp_create_page` | Create a new page |
| `wp_update_page` | Update an existing page |
| `wp_delete_page` | Delete/trash a page |
| `wp_list_categories` | List all categories |
| `wp_create_category` | Create a new category |
| `wp_list_tags` | List all tags |
| `wp_create_tag` | Create a new tag |
| `wp_list_media` | List media library items |
| `wp_upload_media` | Upload image from local file path |
| `wp_set_featured_image` | Set featured image on a post |
| `wp_get_site_info` | Get WordPress site name, version, URL |
| `wp_get_block_patterns` | List registered Gutenberg block patterns |
| `wp_get_post_as_template` | Get raw block markup of a published post |

## Configuration Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `WP_SITE_URL` | **Yes** | — | WordPress site URL (no trailing slash) |
| `WP_USERNAME` | **Yes** | — | WordPress username or email |
| `WP_APP_PASSWORD` | **Yes** | — | Application password from wp-admin profile |
| `MCP_SERVER_NAME` | No | `wp-mcp-server` | Server name (useful for multi-site) |
| `MCP_SERVER_VERSION` | No | `1.0.0` | Server version |
| `ANTHROPIC_API_KEY` | No | — | Enables AI content generation |
| `AI_MODEL` | No | `claude-sonnet-4-20250514` | Claude model for content generation |
| `AI_MAX_TOKENS` | No | `4096` | Max tokens for AI responses |
| `GEMINI_API_KEY` | No | — | Enables AI scenery image generation |
| `IMAGE_MODEL` | No | `imagen-4.0-generate-001` | Google Imagen model |
| `IMAGE_ASPECT_RATIO` | No | `16:9` | Default image aspect ratio |
| `IMAGE_OUTPUT_DIR` | No | `./output/generated-images` | Where generated images are saved locally |
| `REPLICATE_API_TOKEN` | No | — | Enables Replicate image generation |
| `KAIRA_MODEL_VERSION` | No | — | Trained LoRA model version hash |
| `KAIRA_TRIGGER_TOKEN` | No | `KAIRA` | LoRA trigger word |
| `CUSTOM_PROMPTS_PATH` | No | — | Path to custom AI voice prompts file |

## Customizing the AI Voice

The AI content tools use prompts defined in `prompts/system-prompts.js`. By default these are tuned for Kaira's luxury travel voice. To customize for your site:

**Option 1: Custom prompts file (recommended)**

Create a `.js` file that exports the prompts you want to override:

```js
// my-prompts.js
export const VOICE_BASE = `You are writing as [Your Author Name] for [Your Blog Name]...`;

export const TRAVEL_POST_PROMPT = `${VOICE_BASE}\n\nWrite a blog post about...`;
```

Then set `CUSTOM_PROMPTS_PATH=/path/to/my-prompts.js` in your env. Any prompts you don't export will fall back to defaults.

**Option 2: Edit the defaults**

Edit `prompts/system-prompts.js` directly. The key constant is `VOICE_BASE` — it defines the writing personality.

## Common Issues

**"Configuration errors: WP_SITE_URL is required"**
→ Your `.mcp.json` env block is missing required variables. Check the path and env values.

**Tools appear but return "Error: Request failed with status 401"**
→ Application password is wrong or the WordPress user doesn't have sufficient permissions. Regenerate the application password and update `.mcp.json`.

**Tools return "Error: Request failed with status 403"**
→ Your WordPress site or hosting provider is blocking REST API access. Check for security plugins or server-level blocks.

**"Error: fetch failed" or connection errors**
→ The `WP_SITE_URL` may be wrong, the site may be down, or HTTPS is required. Test by visiting `https://your-site.com/wp-json/wp/v2/` in a browser.

**AI tools say "ANTHROPIC_API_KEY not set"**
→ Expected if you didn't add the key. The WordPress tools still work. Add the key to enable AI features.

**Changes to .mcp.json don't take effect**
→ You must restart Claude Code after any `.mcp.json` changes.

## Architecture

```
wp-mcp-server/
├── index.js                    # MCP server entry point & tool dispatcher
├── package.json                # Dependencies
├── .env.example                # Environment variable reference
├── lib/
│   ├── config.js               # Configuration from env vars
│   ├── wp-client.js            # WordPress REST API client (auth, uploads)
│   ├── ai-client.js            # Anthropic Claude SDK wrapper
│   ├── gemini-client.js        # Google Gemini/Imagen wrapper
│   └── replicate-client.js     # Replicate API wrapper (Flux Dev + LoRA)
├── tools/
│   ├── wp-tools.js             # WordPress CRUD tool definitions (20 tools)
│   └── ai-tools.js             # AI generation tool definitions (8 tools)
└── prompts/
    ├── system-prompts.js       # AI voice & content prompts
    ├── kaira-presets.js        # Kaira image generation scene presets
    └── destination-presets.js  # Destination scenery presets
```

## License

MIT
