import type { Page } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { SITE_TITLE } from '../consts';

type Post = CollectionEntry<'blog'>;

// Posts per archive page, as on the live site
export const POSTS_PER_PAGE = 8;

// Helper function to decode HTML entities
export function decodeHtmlEntities(text: string): string {
	const entities: Record<string, string> = {
		'&#46;': '.',
		'&amp;': '&',
		'&lt;': '<',
		'&gt;': '>',
		'&quot;': '"',
		'&#39;': "'",
		'&nbsp;': ' ',
		'&#8217;': "'",
		'&#8220;': '"',
		'&#8221;': '"',
		'&#8230;': '...',
		'&#8211;': '–',
		'&#8212;': '—',
	};
	
	return text.replace(/&[#\w]+;/g, (entity) => entities[entity] || entity);
}

// Helper function to convert category name to slug
export function categoryToSlug(category: string): string {
	return category.toLowerCase().replace(/\s+/g, '-');
}

// Helper function to convert slug to title case
export function slugToTitle(slug: string): string {
	return slug
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

// Helper function to build category path from hierarchy
export function buildCategoryPath(hierarchy: string[]): string {
	return hierarchy.map(categoryToSlug).join('/');
}

// Archive path of the post's categoryHierarchy, i.e. its deepest category in
// categoryPaths, e.g. "development/web-development/javascript". Paths come from
// WordPress, so archive URLs don't depend on category names.
export function getHierarchyPath(post: Post): string | undefined {
	const { categoryHierarchy = [], categoryPaths = [] } = post.data;
	return categoryPaths.find((path) => path.split('/').length === categoryHierarchy.length);
}

// Real name of every category archive path, e.g. "development/vs-code" -> "VS Code"
export function getCategoryNames(posts: Post[]): Map<string, string> {
	const names = new Map<string, string>();
	posts.forEach((post) => {
		const { categories = [], categoryPaths = [], categoryHierarchy = [] } = post.data;
		// categoryPaths[i] is the archive path of categories[i]
		categoryPaths.forEach((path, i) => {
			if (categories[i]) names.set(path, categories[i]);
		});
		// categoryHierarchy also names the ancestors of the hierarchy path
		const segments = getHierarchyPath(post)?.split('/') ?? [];
		segments.forEach((_, i) => {
			names.set(segments.slice(0, i + 1).join('/'), categoryHierarchy[i]);
		});
	});
	return names;
}

// Archive paths a post is listed under: its categories and their ancestors, as
// WordPress category archives include the posts of subcategories
export function getArchivePaths(post: Post): Set<string> {
	const paths = new Set<string>();
	for (const path of post.data.categoryPaths ?? []) {
		const segments = path.split('/');
		segments.forEach((_, i) => paths.add(segments.slice(0, i + 1).join('/')));
	}
	return paths;
}

// Posts of every category archive by archive path, in the order of `posts`
export function getCategoryArchives(posts: Post[]): Map<string, Post[]> {
	const archives = new Map<string, Post[]>();
	for (const post of posts) {
		for (const path of getArchivePaths(post)) {
			const archive = archives.get(path) ?? [];
			archive.push(post);
			archives.set(path, archive);
		}
	}
	return archives;
}

// Flat category URLs that cards link to (categoryToSlug of a category name, e.g.
// "javascript"), mapped to the archive path of that category. Top-level
// categories such as "featured" are archives themselves and are left out.
export function getFlatCategoryPaths(posts: Post[]): Map<string, string> {
	const archives = getCategoryArchives(posts);
	const flatPaths = new Map<string, string>();
	for (const post of posts) {
		const { categories = [], categoryPaths = [] } = post.data;
		categories.forEach((name, i) => {
			const slug = categoryToSlug(name);
			if (categoryPaths[i] && !archives.has(slug)) flatPaths.set(slug, categoryPaths[i]);
		});
	}
	return flatPaths;
}

// Posts of every tag archive by tag slug, in the order of `posts`
export function getTagArchives(posts: Post[]): Map<string, { name: string; posts: Post[] }> {
	const archives = new Map<string, { name: string; posts: Post[] }>();
	for (const post of posts) {
		for (const { name, slug } of post.data.tags ?? []) {
			const archive = archives.get(slug) ?? { name, posts: [] };
			archive.posts.push(post);
			archives.set(slug, archive);
		}
	}
	return archives;
}

// URL of page `pageNumber` of the archive at `base` (e.g. "/development/"). Like
// WordPress, page 1 is the base URL itself and there is no /page/1/.
export function getPageUrl(base: string, pageNumber: number): string {
	return pageNumber === 1 ? base : `${base}page/${pageNumber}/`;
}

// Splits `items` into archive pages of POSTS_PER_PAGE, at the URLs of getPageUrl
export function paginate<T>(items: T[], base: string): Page<T>[] {
	const lastPage = Math.max(1, Math.ceil(items.length / POSTS_PER_PAGE));
	return Array.from({ length: lastPage }, (_, i) => {
		const currentPage = i + 1;
		const start = i * POSTS_PER_PAGE;
		const data = items.slice(start, start + POSTS_PER_PAGE);
		return {
			data,
			start,
			end: start + data.length - 1,
			size: POSTS_PER_PAGE,
			total: items.length,
			currentPage,
			lastPage,
			url: {
				current: getPageUrl(base, currentPage),
				prev: currentPage > 1 ? getPageUrl(base, currentPage - 1) : undefined,
				next: currentPage < lastPage ? getPageUrl(base, currentPage + 1) : undefined,
				first: currentPage > 1 ? getPageUrl(base, 1) : undefined,
				last: currentPage < lastPage ? getPageUrl(base, lastPage) : undefined,
			},
		};
	});
}

// <title> of an archive page, as on the live site, e.g. "JavaScript - Wisdom Geek"
// and "JavaScript - Page 2 - Wisdom Geek"
export function getArchiveTitle(name: string, pageNumber: number): string {
	return [name, ...(pageNumber > 1 ? [`Page ${pageNumber}`] : []), SITE_TITLE].join(' - ');
}

// Interface for category tree nodes
export interface CategoryNode {
	name: string;
	slug: string;
	path: string; // Full path like "development/web-development"
	count: number;
	children: Map<string, CategoryNode>;
}

// Category tree with real names and, like the live sidebar, the number of posts
// in each category or its subcategories (each post counted once)
export function buildCategoryTree(posts: Post[]): Map<string, CategoryNode> {
	const names = getCategoryNames(posts);
	const categoryTree = new Map<string, CategoryNode>();
	
	for (const [path, archivePosts] of getCategoryArchives(posts)) {
		const segments = path.split('/');
		let currentLevel = categoryTree;
		
		segments.forEach((slug, i) => {
			const nodePath = segments.slice(0, i + 1).join('/');
			if (!currentLevel.has(slug)) {
				currentLevel.set(slug, {
					name: names.get(nodePath) ?? slugToTitle(slug),
					slug: slug,
					path: nodePath,
					count: 0,
					children: new Map()
				});
			}
			
			const node = currentLevel.get(slug)!;
			if (nodePath === path) node.count = archivePosts.length;
			currentLevel = node.children;
		});
	}
	
	return categoryTree;
}

// Helper function to sort category tree by count and name
export function sortCategoryTree(tree: Map<string, CategoryNode>): CategoryNode[] {
	return Array.from(tree.values())
		.sort((a, b) => {
			// Sort alphabetically
			return a.name.localeCompare(b.name);
		})
		.map(node => ({
			...node,
			// Recursively sort children at every level
			children: node.children.size > 0 
				? new Map(sortCategoryTree(node.children).map(child => [child.slug, child]))
				: new Map()
		}));
}
