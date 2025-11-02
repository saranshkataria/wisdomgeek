import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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
		categories: z.array(z.string()).optional(),
	}),
});

export const collections = { blog };
