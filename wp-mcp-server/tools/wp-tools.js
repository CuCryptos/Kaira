/**
 * WordPress Tools for MCP Server
 */

import path from "path";
import { wpRequestSimple, uploadMedia, getSiteInfo } from "../lib/wp-client.js";

/**
 * Tool definitions for WordPress operations
 */
export const wpToolDefinitions = [
  {
    name: "wp_list_posts",
    description:
      "List WordPress posts. Can filter by status (publish, draft, pending, private) and limit results.",
    inputSchema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          description: "Post status: publish, draft, pending, private, or any",
          default: "any",
        },
        per_page: {
          type: "number",
          description: "Number of posts to return (max 100)",
          default: 10,
        },
        search: {
          type: "string",
          description: "Search posts by keyword",
        },
        categories: {
          type: "string",
          description: "Filter by category ID(s), comma-separated",
        },
      },
    },
  },
  {
    name: "wp_get_post",
    description: "Get a single WordPress post by ID",
    inputSchema: {
      type: "object",
      properties: {
        post_id: {
          type: "number",
          description: "The post ID",
        },
      },
      required: ["post_id"],
    },
  },
  {
    name: "wp_create_post",
    description: "Create a new WordPress post. Returns the created post with its ID.",
    inputSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Post title",
        },
        content: {
          type: "string",
          description: "Post content (HTML)",
        },
        status: {
          type: "string",
          description: "Post status: draft, publish, pending, private",
          default: "draft",
        },
        slug: {
          type: "string",
          description: "URL slug for the post",
        },
        categories: {
          type: "array",
          items: { type: "number" },
          description: "Array of category IDs",
        },
        tags: {
          type: "array",
          items: { type: "number" },
          description: "Array of tag IDs",
        },
        featured_media: {
          type: "number",
          description: "Featured image attachment ID",
        },
        excerpt: {
          type: "string",
          description: "Post excerpt",
        },
        meta: {
          type: "object",
          description: "Post meta fields",
        },
      },
      required: ["title", "content"],
    },
  },
  {
    name: "wp_update_post",
    description: "Update an existing WordPress post",
    inputSchema: {
      type: "object",
      properties: {
        post_id: {
          type: "number",
          description: "The post ID to update",
        },
        title: {
          type: "string",
          description: "New post title",
        },
        content: {
          type: "string",
          description: "New post content (HTML)",
        },
        status: {
          type: "string",
          description: "Post status: draft, publish, pending, private",
        },
        slug: {
          type: "string",
          description: "URL slug for the post",
        },
        categories: {
          type: "array",
          items: { type: "number" },
          description: "Array of category IDs",
        },
        tags: {
          type: "array",
          items: { type: "number" },
          description: "Array of tag IDs",
        },
        featured_media: {
          type: "number",
          description: "Featured image attachment ID",
        },
        excerpt: {
          type: "string",
          description: "Post excerpt",
        },
      },
      required: ["post_id"],
    },
  },
  {
    name: "wp_delete_post",
    description: "Delete a WordPress post (moves to trash)",
    inputSchema: {
      type: "object",
      properties: {
        post_id: {
          type: "number",
          description: "The post ID to delete",
        },
        force: {
          type: "boolean",
          description: "Permanently delete instead of trashing",
          default: false,
        },
      },
      required: ["post_id"],
    },
  },
  {
    name: "wp_list_categories",
    description: "List all WordPress categories",
    inputSchema: {
      type: "object",
      properties: {
        per_page: {
          type: "number",
          description: "Number of categories to return",
          default: 100,
        },
      },
    },
  },
  {
    name: "wp_create_category",
    description: "Create a new WordPress category",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Category name",
        },
        slug: {
          type: "string",
          description: "Category slug",
        },
        description: {
          type: "string",
          description: "Category description",
        },
        parent: {
          type: "number",
          description: "Parent category ID",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "wp_list_tags",
    description: "List all WordPress tags",
    inputSchema: {
      type: "object",
      properties: {
        per_page: {
          type: "number",
          description: "Number of tags to return",
          default: 100,
        },
        search: {
          type: "string",
          description: "Search tags by name",
        },
      },
    },
  },
  {
    name: "wp_create_tag",
    description: "Create a new WordPress tag",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Tag name",
        },
        slug: {
          type: "string",
          description: "Tag slug",
        },
        description: {
          type: "string",
          description: "Tag description",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "wp_list_media",
    description: "List media library items",
    inputSchema: {
      type: "object",
      properties: {
        per_page: {
          type: "number",
          description: "Number of items to return",
          default: 20,
        },
        search: {
          type: "string",
          description: "Search media by filename",
        },
        media_type: {
          type: "string",
          description: "Filter by type: image, video, audio, application",
        },
      },
    },
  },
  {
    name: "wp_upload_media",
    description: "Upload an image to the WordPress media library from a local file path",
    inputSchema: {
      type: "object",
      properties: {
        file_path: {
          type: "string",
          description: "Local file path to upload",
        },
        title: {
          type: "string",
          description: "Media title",
        },
        alt_text: {
          type: "string",
          description: "Alt text for images",
        },
      },
      required: ["file_path"],
    },
  },
  {
    name: "wp_set_featured_image",
    description: "Set the featured image for a post",
    inputSchema: {
      type: "object",
      properties: {
        post_id: {
          type: "number",
          description: "The post ID",
        },
        media_id: {
          type: "number",
          description: "The media attachment ID to set as featured image",
        },
      },
      required: ["post_id", "media_id"],
    },
  },
  {
    name: "wp_get_site_info",
    description: "Get WordPress site information and settings",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "wp_list_pages",
    description:
      "List WordPress pages. Can filter by status and limit results.",
    inputSchema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          description: "Page status: publish, draft, pending, private, or any",
          default: "any",
        },
        per_page: {
          type: "number",
          description: "Number of pages to return (max 100)",
          default: 10,
        },
        search: {
          type: "string",
          description: "Search pages by keyword",
        },
      },
    },
  },
  {
    name: "wp_get_page",
    description: "Get a single WordPress page by ID",
    inputSchema: {
      type: "object",
      properties: {
        page_id: {
          type: "number",
          description: "The page ID",
        },
      },
      required: ["page_id"],
    },
  },
  {
    name: "wp_create_page",
    description: "Create a new WordPress page. Returns the created page with its ID.",
    inputSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Page title",
        },
        content: {
          type: "string",
          description: "Page content (HTML)",
        },
        status: {
          type: "string",
          description: "Page status: draft, publish, pending, private",
          default: "draft",
        },
        slug: {
          type: "string",
          description: "URL slug for the page",
        },
        parent: {
          type: "number",
          description: "Parent page ID (for hierarchical pages)",
        },
        featured_media: {
          type: "number",
          description: "Featured image attachment ID",
        },
        excerpt: {
          type: "string",
          description: "Page excerpt",
        },
        template: {
          type: "string",
          description: "Page template file (e.g., page-pillar.php). Empty string for default.",
        },
        meta: {
          type: "object",
          description: "Page meta fields",
        },
      },
      required: ["title", "content"],
    },
  },
  {
    name: "wp_update_page",
    description: "Update an existing WordPress page",
    inputSchema: {
      type: "object",
      properties: {
        page_id: {
          type: "number",
          description: "The page ID to update",
        },
        title: {
          type: "string",
          description: "New page title",
        },
        content: {
          type: "string",
          description: "New page content (HTML)",
        },
        status: {
          type: "string",
          description: "Page status: draft, publish, pending, private",
        },
        slug: {
          type: "string",
          description: "URL slug for the page",
        },
        parent: {
          type: "number",
          description: "Parent page ID",
        },
        featured_media: {
          type: "number",
          description: "Featured image attachment ID",
        },
        excerpt: {
          type: "string",
          description: "Page excerpt",
        },
        template: {
          type: "string",
          description: "Page template file. Empty string for default.",
        },
      },
      required: ["page_id"],
    },
  },
  {
    name: "wp_get_block_patterns",
    description:
      "Get registered Gutenberg block patterns and reusable blocks for the Kaira theme",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "wp_get_post_as_template",
    description:
      "Get a published post's raw Gutenberg block markup to use as a formatting reference when creating new posts. Returns raw block content, not rendered HTML.",
    inputSchema: {
      type: "object",
      properties: {
        post_id: {
          type: "number",
          description: "Specific post ID, or omit for most recent published post",
        },
      },
    },
  },
  {
    name: "wp_delete_page",
    description: "Delete a WordPress page (moves to trash)",
    inputSchema: {
      type: "object",
      properties: {
        page_id: {
          type: "number",
          description: "The page ID to delete",
        },
        force: {
          type: "boolean",
          description: "Permanently delete instead of trashing",
          default: false,
        },
      },
      required: ["page_id"],
    },
  },
];

/**
 * Handle WordPress tool calls
 * @param {string} name - Tool name
 * @param {object} args - Tool arguments
 * @returns {Promise<object>} Tool result
 */
export async function handleWPTool(name, args) {
  switch (name) {
    case "wp_list_posts": {
      const params = new URLSearchParams();
      if (args.status && args.status !== "any") params.append("status", args.status);
      if (args.status === "any") params.append("status", "publish,draft,pending,private");
      params.append("per_page", args.per_page || 10);
      if (args.search) params.append("search", args.search);
      if (args.categories) params.append("categories", args.categories);

      const posts = await wpRequestSimple(`/posts?${params}`);
      const summary = posts.map((p) => ({
        id: p.id,
        title: p.title.rendered,
        status: p.status,
        slug: p.slug,
        date: p.date,
        link: p.link,
        categories: p.categories,
        featured_media: p.featured_media,
      }));

      return {
        content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      };
    }

    case "wp_get_post": {
      const post = await wpRequestSimple(`/posts/${args.post_id}`);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                id: post.id,
                title: post.title.rendered,
                content: post.content.rendered,
                excerpt: post.excerpt.rendered,
                status: post.status,
                slug: post.slug,
                date: post.date,
                link: post.link,
                categories: post.categories,
                tags: post.tags,
                featured_media: post.featured_media,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case "wp_create_post": {
      const postData = {
        title: args.title,
        content: args.content,
        status: args.status || "draft",
      };
      if (args.slug) postData.slug = args.slug;
      if (args.categories) postData.categories = args.categories;
      if (args.tags) postData.tags = args.tags;
      if (args.featured_media) postData.featured_media = args.featured_media;
      if (args.excerpt) postData.excerpt = args.excerpt;
      if (args.meta) postData.meta = args.meta;

      const post = await wpRequestSimple("/posts", {
        method: "POST",
        body: JSON.stringify(postData),
      });

      return {
        content: [
          {
            type: "text",
            text: `Post created successfully!\nID: ${post.id}\nTitle: ${post.title.rendered}\nStatus: ${post.status}\nURL: ${post.link}`,
          },
        ],
      };
    }

    case "wp_update_post": {
      const updateData = {};
      if (args.title) updateData.title = args.title;
      if (args.content) updateData.content = args.content;
      if (args.status) updateData.status = args.status;
      if (args.slug) updateData.slug = args.slug;
      if (args.categories) updateData.categories = args.categories;
      if (args.tags) updateData.tags = args.tags;
      if (args.featured_media) updateData.featured_media = args.featured_media;
      if (args.excerpt) updateData.excerpt = args.excerpt;

      const post = await wpRequestSimple(`/posts/${args.post_id}`, {
        method: "POST",
        body: JSON.stringify(updateData),
      });

      return {
        content: [
          {
            type: "text",
            text: `Post updated successfully!\nID: ${post.id}\nTitle: ${post.title.rendered}\nStatus: ${post.status}\nURL: ${post.link}`,
          },
        ],
      };
    }

    case "wp_delete_post": {
      const params = args.force ? "?force=true" : "";
      await wpRequestSimple(`/posts/${args.post_id}${params}`, {
        method: "DELETE",
      });

      return {
        content: [
          {
            type: "text",
            text: `Post ${args.post_id} ${args.force ? "permanently deleted" : "moved to trash"}`,
          },
        ],
      };
    }

    case "wp_list_categories": {
      const categories = await wpRequestSimple(`/categories?per_page=${args.per_page || 100}`);
      const summary = categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        count: c.count,
        parent: c.parent,
      }));

      return {
        content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      };
    }

    case "wp_create_category": {
      const catData = { name: args.name };
      if (args.slug) catData.slug = args.slug;
      if (args.description) catData.description = args.description;
      if (args.parent) catData.parent = args.parent;

      const category = await wpRequestSimple("/categories", {
        method: "POST",
        body: JSON.stringify(catData),
      });

      return {
        content: [
          {
            type: "text",
            text: `Category created!\nID: ${category.id}\nName: ${category.name}\nSlug: ${category.slug}`,
          },
        ],
      };
    }

    case "wp_list_tags": {
      const params = new URLSearchParams();
      params.append("per_page", args.per_page || 100);
      if (args.search) params.append("search", args.search);

      const tags = await wpRequestSimple(`/tags?${params}`);
      const summary = tags.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        count: t.count,
      }));

      return {
        content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      };
    }

    case "wp_create_tag": {
      const tagData = { name: args.name };
      if (args.slug) tagData.slug = args.slug;
      if (args.description) tagData.description = args.description;

      const tag = await wpRequestSimple("/tags", {
        method: "POST",
        body: JSON.stringify(tagData),
      });

      return {
        content: [
          {
            type: "text",
            text: `Tag created!\nID: ${tag.id}\nName: ${tag.name}\nSlug: ${tag.slug}`,
          },
        ],
      };
    }

    case "wp_list_media": {
      const params = new URLSearchParams();
      params.append("per_page", args.per_page || 20);
      if (args.search) params.append("search", args.search);
      if (args.media_type) params.append("media_type", args.media_type);

      const media = await wpRequestSimple(`/media?${params}`);
      const summary = media.map((m) => ({
        id: m.id,
        title: m.title.rendered,
        filename: m.source_url.split("/").pop(),
        url: m.source_url,
        mime_type: m.mime_type,
        date: m.date,
      }));

      return {
        content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      };
    }

    case "wp_upload_media": {
      const filePath = args.file_path;

      const media = await uploadMedia(filePath, path.basename(filePath));

      // Update title and alt text if provided
      if (args.title || args.alt_text) {
        const updateData = {};
        if (args.title) updateData.title = args.title;
        if (args.alt_text) updateData.alt_text = args.alt_text;

        await wpRequestSimple(`/media/${media.id}`, {
          method: "POST",
          body: JSON.stringify(updateData),
        });
      }

      return {
        content: [
          {
            type: "text",
            text: `Media uploaded successfully!\nID: ${media.id}\nFilename: ${path.basename(filePath)}\nURL: ${media.source_url}`,
          },
        ],
      };
    }

    case "wp_set_featured_image": {
      const post = await wpRequestSimple(`/posts/${args.post_id}`, {
        method: "POST",
        body: JSON.stringify({ featured_media: args.media_id }),
      });

      return {
        content: [
          {
            type: "text",
            text: `Featured image set!\nPost ID: ${post.id}\nMedia ID: ${args.media_id}`,
          },
        ],
      };
    }

    case "wp_get_site_info": {
      const info = await getSiteInfo();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                name: info.name,
                description: info.description,
                url: info.url,
                home: info.home,
                timezone: info.timezone_string,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case "wp_list_pages": {
      const params = new URLSearchParams();
      if (args.status && args.status !== "any") params.append("status", args.status);
      if (args.status === "any") params.append("status", "publish,draft,pending,private");
      params.append("per_page", args.per_page || 10);
      if (args.search) params.append("search", args.search);

      const pages = await wpRequestSimple(`/pages?${params}`);
      const summary = pages.map((p) => ({
        id: p.id,
        title: p.title.rendered,
        status: p.status,
        slug: p.slug,
        date: p.date,
        link: p.link,
        parent: p.parent,
        template: p.template,
        featured_media: p.featured_media,
      }));

      return {
        content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      };
    }

    case "wp_get_page": {
      const page = await wpRequestSimple(`/pages/${args.page_id}`);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                id: page.id,
                title: page.title.rendered,
                content: page.content.rendered,
                excerpt: page.excerpt.rendered,
                status: page.status,
                slug: page.slug,
                date: page.date,
                link: page.link,
                parent: page.parent,
                template: page.template,
                featured_media: page.featured_media,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case "wp_create_page": {
      const pageData = {
        title: args.title,
        content: args.content,
        status: args.status || "draft",
      };
      if (args.slug) pageData.slug = args.slug;
      if (args.parent) pageData.parent = args.parent;
      if (args.featured_media) pageData.featured_media = args.featured_media;
      if (args.excerpt) pageData.excerpt = args.excerpt;
      if (args.template !== undefined) pageData.template = args.template;
      if (args.meta) pageData.meta = args.meta;

      const page = await wpRequestSimple("/pages", {
        method: "POST",
        body: JSON.stringify(pageData),
      });

      return {
        content: [
          {
            type: "text",
            text: `Page created successfully!\nID: ${page.id}\nTitle: ${page.title.rendered}\nStatus: ${page.status}\nURL: ${page.link}`,
          },
        ],
      };
    }

    case "wp_update_page": {
      const updateData = {};
      if (args.title) updateData.title = args.title;
      if (args.content) updateData.content = args.content;
      if (args.status) updateData.status = args.status;
      if (args.slug) updateData.slug = args.slug;
      if (args.parent !== undefined) updateData.parent = args.parent;
      if (args.featured_media) updateData.featured_media = args.featured_media;
      if (args.excerpt) updateData.excerpt = args.excerpt;
      if (args.template !== undefined) updateData.template = args.template;

      const page = await wpRequestSimple(`/pages/${args.page_id}`, {
        method: "POST",
        body: JSON.stringify(updateData),
      });

      return {
        content: [
          {
            type: "text",
            text: `Page updated successfully!\nID: ${page.id}\nTitle: ${page.title.rendered}\nStatus: ${page.status}\nURL: ${page.link}`,
          },
        ],
      };
    }

    case "wp_get_block_patterns": {
      const patterns = await wpRequestSimple("/block-patterns/patterns");
      const reusable = await wpRequestSimple("/blocks");

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                patterns: patterns.map((p) => ({
                  name: p.name,
                  title: p.title,
                  content: p.content,
                  categories: p.categories,
                })),
                reusable_blocks: reusable.map((b) => ({
                  id: b.id,
                  title: b.title.rendered,
                  content: b.content.rendered,
                })),
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case "wp_get_post_as_template": {
      const endpoint = args.post_id
        ? `/posts/${args.post_id}?context=edit`
        : `/posts?per_page=1&status=publish&context=edit`;

      const result = await wpRequestSimple(endpoint);
      const p = Array.isArray(result) ? result[0] : result;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                title: p.title.raw,
                content_blocks: p.content.raw,
                excerpt: p.excerpt.raw,
                categories: p.categories,
                tags: p.tags,
                featured_media: p.featured_media,
                meta: p.meta,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case "wp_delete_page": {
      const params = args.force ? "?force=true" : "";
      await wpRequestSimple(`/pages/${args.page_id}${params}`, {
        method: "DELETE",
      });

      return {
        content: [
          {
            type: "text",
            text: `Page ${args.page_id} ${args.force ? "permanently deleted" : "moved to trash"}`,
          },
        ],
      };
    }

    default:
      return null;
  }
}
