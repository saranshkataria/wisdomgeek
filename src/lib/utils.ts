import type { CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'blog'>;

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

// Helper function to match category path against post hierarchy
export function matchesCategoryPath(post: Post, categoryPath: string): boolean {
	const path = getHierarchyPath(post);
	return path === categoryPath || Boolean(path?.startsWith(`${categoryPath}/`));
}

// Name of a category archive, e.g. "development/vs-code" -> "Development > VS Code".
// Flat paths such as "vs-code" are named after the category with that slug.
export function getCategoryNameFromPath(categoryPath: string, names: Map<string, string>): string {
	const nestedPath = names.has(categoryPath)
		? categoryPath
		: [...names.keys()].find((path) => path.split('/').pop() === categoryPath);
	if (!nestedPath) return slugToTitle(categoryPath);
	if (nestedPath !== categoryPath) return names.get(nestedPath)!;
	const segments = categoryPath.split('/');
	return segments
		.map((segment, i) => names.get(segments.slice(0, i + 1).join('/')) ?? slugToTitle(segment))
		.join(' > ');
}

// Interface for category tree nodes
export interface CategoryNode {
	name: string;
	slug: string;
	path: string; // Full path like "development/web-development"
	count: number;
	children: Map<string, CategoryNode>;
}

// Helper function to build all category paths from posts
export function getAllCategoryPaths(posts: Post[]): Set<string> {
	const categoryPaths = new Set<string>();
	
	posts.forEach(post => {
		// Create paths for each level in the hierarchy
		const segments = getHierarchyPath(post)?.split('/') ?? [];
		segments.forEach((_, i) => {
			categoryPaths.add(segments.slice(0, i + 1).join('/'));
		});
		
		// Also add simple category paths for backwards compatibility
		if (post.data.categories) {
			post.data.categories.forEach((category: string) => {
				const slug = categoryToSlug(category);
				categoryPaths.add(slug);
			});
		}
	});
	
	return categoryPaths;
}

// Helper function to build hierarchical category tree from posts
export function buildCategoryTree(posts: Post[]): Map<string, CategoryNode> {
	const categoryTree = new Map<string, CategoryNode>();
	
	posts.forEach(post => {
		const hierarchy = post.data.categoryHierarchy ?? [];
		const segments = getHierarchyPath(post)?.split('/') ?? [];
		let currentLevel = categoryTree;
		
		segments.forEach((slug, i) => {
			if (!currentLevel.has(slug)) {
				currentLevel.set(slug, {
					name: hierarchy[i],
					slug: slug,
					path: segments.slice(0, i + 1).join('/'),
					count: 0,
					children: new Map()
				});
			}
			
			const node = currentLevel.get(slug)!;
			node.count++; // Count posts at this level and all children
			currentLevel = node.children;
		});
	});
	
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
