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

// Helper function to match category path against post hierarchy
export function matchesCategoryPath(
	postHierarchy: string[] | undefined,
	categoryPath: string
): boolean {
	if (!postHierarchy || postHierarchy.length === 0) return false;
	
	const pathParts = categoryPath.split('/');
	
	// Check if the hierarchy matches the path prefix
	if (postHierarchy.length >= pathParts.length) {
		const postPath = postHierarchy
			.slice(0, pathParts.length)
			.map(categoryToSlug)
			.join('/');
		
		return postPath === categoryPath;
	}
	
	return false;
}

// Helper function to get category name from path
export function getCategoryNameFromPath(categoryPath: string): string {
	return categoryPath
		.split('/')
		.map(slugToTitle)
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
export function getAllCategoryPaths(posts: any[]): Set<string> {
	const categoryPaths = new Set<string>();
	
	posts.forEach(post => {
		if (post.data.categoryHierarchy && post.data.categoryHierarchy.length > 0) {
			const hierarchy = post.data.categoryHierarchy;
			let pathParts: string[] = [];
			
			// Create paths for each level in the hierarchy
			hierarchy.forEach((categoryName: string) => {
				const slug = categoryToSlug(categoryName);
				pathParts.push(slug);
				const path = pathParts.join('/');
				categoryPaths.add(path);
			});
		}
		
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
export function buildCategoryTree(posts: any[]): Map<string, CategoryNode> {
	const categoryTree = new Map<string, CategoryNode>();
	
	posts.forEach(post => {
		if (post.data.categoryHierarchy && post.data.categoryHierarchy.length > 0) {
			const hierarchy = post.data.categoryHierarchy;
			let currentLevel = categoryTree;
			let pathParts: string[] = [];
			
			hierarchy.forEach((categoryName: string) => {
				const slug = categoryToSlug(categoryName);
				pathParts.push(slug);
				const path = pathParts.join('/');
				
				if (!currentLevel.has(slug)) {
					currentLevel.set(slug, {
						name: categoryName,
						slug: slug,
						path: path,
						count: 0,
						children: new Map()
					});
				}
				
				const node = currentLevel.get(slug)!;
				node.count++; // Count posts at this level and all children
				currentLevel = node.children;
			});
		}
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
