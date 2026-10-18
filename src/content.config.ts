import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load blog posts from markdown files (each post is in its own directory with index.md)
	// Use `npm run fetch-wordpress` to fetch latest posts from WordPress
	loader: glob({ base: './src/content', pattern: '**/index.{md,mdx}' }),
		// Type-check frontmatter using a schema
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: image().optional(),
		author: z.string().optional(),
		categories: z.array(z.string()).optional(),
		// Names of the post's deepest category (in categoryPaths) and its ancestors, top level first
		categoryHierarchy: z.array(z.string()).optional(),
		// Archive path of each entry in `categories` (same order), taken from the
		// WordPress term links, e.g. "development/web-development/javascript"
		categoryPaths: z.array(z.string()).optional(),
		// Slugs come from WordPress and match the live /tag/<slug>/ URLs
		tags: z.array(z.object({ name: z.string(), slug: z.string() })).optional(),
	}),
});

export const collections = { blog };
