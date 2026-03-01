# WordPress MCP Server

An MCP (Model Context Protocol) server that gives Claude Code full WordPress admin capabilities: create/edit posts, manage media, handle recipes, and generate content with AI.

## What You Get

**26 tools** across 3 modules:

| Module | Tools | Requires |
|--------|-------|----------|
| **WordPress** (18) | Posts, pages, categories, tags, media, site info — full CRUD | WP credentials |
| **Recipes** (6) | Recipe metadata, ingredient parsing, nutrition estimation | WP credentials |
| **AI Generation** (6) | Blog posts, descriptions, SEO content, image generation | API keys (optional) |

## Quick Setup

### 1. Install dependencies

```bash
cd wp-mcp-server
npm install
```

### 2. Create a WordPress Application Password

1. Go to your WordPress admin: `https://your-site.com/wp-admin/users.php?page=profile`
2. Scroll to **Application Passwords**
3. Enter a name (e.g., "MCP Server") and click **Add New**
4. Copy the generated password

### 3. Configure Claude Code

Add to your `.mcp.json` (in your project root or `~/.claude/.mcp.json`):

```json
{
  "mcpServers": {
    "my-site-wp": {
      "command": "node",
      "args": ["/path/to/wp-mcp-server/index.js"],
      "env": {
        "WP_SITE_URL": "https://your-site.com",
        "WP_USERNAME": "your_username",
        "WP_APP_PASSWORD": "xxxx xxxx xxxx xxxx xxxx xxxx"
      }
    }
  }
}
```

### 4. (Optional) Enable AI features

Add API keys to the `env` block:

```json
"env": {
  "WP_SITE_URL": "https://your-site.com",
  "WP_USERNAME": "your_username",
  "WP_APP_PASSWORD": "xxxx xxxx xxxx xxxx xxxx xxxx",
  "ANTHROPIC_API_KEY": "sk-ant-...",
  "GEMINI_API_KEY": "your_gemini_key"
}
```

- **ANTHROPIC_API_KEY** — Enables AI content generation (blog posts, descriptions, SEO)
- **GEMINI_API_KEY** — Enables AI image generation via Google Imagen ([get key](https://aistudio.google.com/apikey))

### 5. Restart Claude Code

The MCP server loads on startup. Restart to pick up config changes.

## Available Tools

### WordPress Tools (`wp_*`)
| Tool | Description |
|------|-------------|
| `wp_list_posts` | List posts (filter by status, category, search) |
| `wp_get_post` | Get a single post by ID |
| `wp_create_post` | Create a new post |
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
| `wp_upload_media` | Upload image from local file |
| `wp_set_featured_image` | Set featured image for a post |
| `wp_get_site_info` | Get site information |

### Recipe Tools (`recipe_*`)
| Tool | Description |
|------|-------------|
| `recipe_list` | List recipes with filtering |
| `recipe_get` | Get recipe with full metadata |
| `recipe_create` | Create recipe with structured data |
| `recipe_update` | Update recipe metadata |
| `recipe_parse_ingredients` | Parse plain text ingredients to JSON |
| `recipe_estimate_nutrition` | Estimate nutrition from ingredients |

### AI Tools (`generate_*`)
| Tool | Description | Requires |
|------|-------------|----------|
| `generate_recipe_post` | Generate full blog post | ANTHROPIC_API_KEY |
| `generate_recipe_description` | Generate recipe description | ANTHROPIC_API_KEY |
| `generate_recipe_from_name` | Generate complete recipe from dish name | ANTHROPIC_API_KEY |
| `generate_seo_content` | Generate SEO metadata | ANTHROPIC_API_KEY |
| `generate_image_prompt` | Generate image generation prompt | ANTHROPIC_API_KEY |
| `generate_recipe_image` | Generate food photography | GEMINI_API_KEY |

## Configuration Reference

All configuration via environment variables:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `WP_SITE_URL` | Yes | — | WordPress site URL |
| `WP_USERNAME` | Yes | — | WordPress username |
| `WP_APP_PASSWORD` | Yes | — | WordPress application password |
| `MCP_SERVER_NAME` | No | `wp-mcp-server` | Server name shown in MCP |
| `MCP_SERVER_VERSION` | No | `1.0.0` | Server version |
| `ANTHROPIC_API_KEY` | No | — | Enables AI content generation |
| `AI_MODEL` | No | `claude-sonnet-4-20250514` | Claude model for generation |
| `AI_MAX_TOKENS` | No | `4096` | Max tokens for AI responses |
| `GEMINI_API_KEY` | No | — | Enables AI image generation |
| `IMAGE_MODEL` | No | `imagen-4.0-generate-001` | Imagen model |
| `IMAGE_ASPECT_RATIO` | No | `16:9` | Default image aspect ratio |
| `IMAGE_OUTPUT_DIR` | No | `./output/generated-images` | Where generated images are saved |
| `RECIPE_POST_TYPE` | No | — | Custom post type for recipes |
| `RECIPE_META_PREFIX` | No | `_cjc_recipe_` | Recipe meta field prefix |
| `CUSTOM_PROMPTS_PATH` | No | — | Path to custom AI prompts file |

## Customizing AI Prompts

The AI tools use system prompts to generate content in a specific voice. You can customize these:

**Option 1: Custom prompts file**

Create a JS file exporting any/all of these constants:
- `RECIPE_POST_PROMPT`
- `RECIPE_DESCRIPTION_PROMPT`
- `RECIPE_FROM_NAME_PROMPT`
- `SEO_CONTENT_PROMPT`
- `IMAGE_PROMPT_TEMPLATE`

Set `CUSTOM_PROMPTS_PATH=/path/to/your-prompts.js` in your env.

See `prompts/hawaiian-prompts.example.js` for a complete example.

**Option 2: Edit defaults directly**

Edit `prompts/system-prompts.js` to change the `VOICE_BASE` and individual prompts.

## Recipe System

The recipe tools store structured recipe data (ingredients, instructions, times, nutrition) as WordPress post meta. By default they use standard `post` type with `_cjc_recipe_` meta prefix.

To use a custom post type:
```
RECIPE_POST_TYPE=my_recipe
RECIPE_META_PREFIX=_my_recipe_
```

Your WordPress theme/plugin needs to register the post type and meta fields for this to work.

## Architecture

```
wp-mcp-server/
├── index.js                    # MCP server entry point
├── package.json
├── .env.example                # Environment variable template
├── lib/
│   ├── config.js               # Configuration from env vars
│   ├── wp-client.js            # WordPress REST API client
│   ├── ai-client.js            # Anthropic Claude client
│   └── gemini-client.js        # Google Gemini/Imagen client
├── tools/
│   ├── wp-tools.js             # WordPress CRUD tools (18 tools)
│   ├── recipe-tools.js         # Recipe management tools (6 tools)
│   └── ai-tools.js             # AI generation tools (6 tools)
├── utils/
│   ├── ingredient-parser.js    # Plain text → structured ingredients
│   └── nutrition-estimator.js  # Ingredient-based nutrition estimates
└── prompts/
    ├── system-prompts.js       # Default AI prompts (generic)
    └── hawaiian-prompts.example.js  # Example: Hawaiian food blog prompts
```

## License

MIT
