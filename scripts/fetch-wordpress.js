// Script to fetch WordPress posts and save them as markdown files
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SITE_URL = 'https://www.wisdomgeek.com';
const PER_PAGE = 100;
const CONTENT_DIR = path.join(__dirname, '../src/content');

async function downloadImage(url, outputPath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));
}

function convertHtmlToMarkdown(html) {
  let content = html;
  
  // Remove WordPress code block plugin wrappers first (Code Block Pro, etc.)
  // This removes the entire wrapper div and extracts just the code content
  content = content.replace(/<div[^>]*class="[^"]*code-block-pro[^"]*"[^>]*>([\s\S]*?)<\/div>/gi, (match, innerContent) => {
    // Extract the actual code from pre/code tags
    const codeMatch = innerContent.match(/<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/i);
    if (codeMatch) {
      return '<pre><code>' + codeMatch[1] + '</code></pre>';
    }
    return match;
  });
  
  // Convert images to markdown - do this before removing other HTML tags
  content = content.replace(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi, '![$2]($1)');
  content = content.replace(/<img[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']*)["'][^>]*>/gi, '![$1]($2)');
  // Handle images without alt text
  content = content.replace(/<img[^>]*src=["']([^"']*)["'][^>]*>/gi, '![]($1)');
  
  // Convert code blocks (pre + code tags) to markdown code blocks
  content = content.replace(/<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi, (match, code) => {
    // Decode HTML entities in code
    const decodedCode = code
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');
    return '\n```\n' + decodedCode.trim() + '\n```\n';
  });
  
  // Convert inline code tags to markdown
  content = content.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
  
  // Convert strong/b tags to bold
  content = content.replace(/<(strong|b)>(.*?)<\/(strong|b)>/gi, '**$2**');
  
  // Convert em/i tags to italic
  content = content.replace(/<(em|i)>(.*?)<\/(em|i)>/gi, '*$2*');
  
  // Convert links
  content = content.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
  
  // Convert headings
  content = content.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n');
  content = content.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n');
  content = content.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n');
  content = content.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n#### $1\n');
  content = content.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '\n##### $1\n');
  content = content.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '\n###### $1\n');
  
  // Convert lists
  content = content.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, items) => {
    return items.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
  });
  content = content.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, items) => {
    let counter = 1;
    return items.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${counter++}. $1\n`);
  });
  
  // Convert paragraphs to double line breaks
  content = content.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
  
  // Convert line breaks
  content = content.replace(/<br\s*\/?>/gi, '\n');
  
  // Remove remaining HTML tags
  content = content.replace(/<[^>]*>/g, '');
  
  // Decode common HTML entities
  content = content
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, '...')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—');
  
  // Clean up excessive whitespace
  content = content.replace(/\n{3,}/g, '\n\n').trim();
  
  return content;
}

async function fetchWordPressPosts() {
  console.log(`Fetching posts from ${SITE_URL}`);

  try {
    let page = 1;
    let allPosts = [];
    let hasMorePosts = true;

    // Fetch all pages of posts
    while (hasMorePosts) {
      console.log(`Fetching page ${page}...`);
      const response = await fetch(
        `${SITE_URL}/wp-json/wp/v2/posts?per_page=${PER_PAGE}&page=${page}&_embed`
      );

      if (!response.ok) {
        if (response.status === 400) {
          // No more posts available
          hasMorePosts = false;
          break;
        }
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }

      const posts = await response.json();
      
      if (posts.length === 0) {
        hasMorePosts = false;
        break;
      }

      allPosts = allPosts.concat(posts);
      console.log(`Fetched ${posts.length} posts from page ${page} (total: ${allPosts.length})`);

      // Check if there are more pages
      const totalPages = response.headers.get('X-WP-TotalPages');
      if (totalPages && page >= parseInt(totalPages)) {
        hasMorePosts = false;
      } else {
        page++;
      }
    }

    console.log(`\nTotal posts fetched: ${allPosts.length}`);

    // Process each post
    for (const post of allPosts) {
      const cleanContent = convertHtmlToMarkdown(post.content.rendered);
      const cleanExcerpt = convertHtmlToMarkdown(post.excerpt.rendered);

      // Get categories - WordPress stores them hierarchically
      const categories = post._embedded?.['wp:term']?.[0] || [];
      const categoryNames = categories.map(cat => cat.name);
      const primaryCategory = categoryNames[0] || 'general';
      
      // Build nested category path from most specific to least specific
      // WordPress returns categories with parent-child relationships
      const categorySlugs = categories.map(cat => cat.slug);
      
      // Get the full category path by checking the WordPress API link structure
      // The most specific category is typically first, but we need to build the hierarchy
      let categoryPath = 'general';
      if (categories.length > 0) {
        // WordPress link contains the full path, extract it
        const categoryLink = categories[0].link || '';
        const linkMatch = categoryLink.match(/https?:\/\/[^\/]+\/(.+?)\/$/);
        if (linkMatch) {
          categoryPath = linkMatch[1].toLowerCase();
        } else {
          // Fallback: just use the slug
          categoryPath = (categorySlugs[0] || 'general').toLowerCase();
        }
      }

      // Create post directory with nested category structure (lowercase slug)
      const postSlug = post.slug.toLowerCase();
      const postDir = path.join(CONTENT_DIR, categoryPath, postSlug);
      if (!fs.existsSync(postDir)) {
        fs.mkdirSync(postDir, { recursive: true });
      }

      // Get featured image if available and download it
      const remoteImageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
      let heroImage = '';
      
      if (remoteImageUrl) {
        try {
          const imageExtension = path.extname(new URL(remoteImageUrl).pathname) || '.jpg';
          const localImageFilename = `hero${imageExtension}`;
          const localImagePath = path.join(postDir, localImageFilename);
          
          // Download the image
          await downloadImage(remoteImageUrl, localImagePath);
          
          // Set the hero image path relative to the index.md file
          heroImage = `./${localImageFilename}`;
          console.log(`Downloaded image for ${categoryPath}/${postSlug}`);
        } catch (error) {
          console.warn(`Failed to download image for ${categoryPath}/${postSlug}: ${error}`);
          heroImage = ''; // Skip image if download fails
        }
      }

      // Download inline images and update content
      let processedContent = cleanContent;
      const imageMatches = [...processedContent.matchAll(/!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g)];
      const downloadedImages = new Map(); // Track downloaded images to avoid duplicates
      
      for (const match of imageMatches) {
        const [fullMatch, altText, imageUrl] = match;
        
        // Skip if already downloaded
        if (downloadedImages.has(imageUrl)) {
          processedContent = processedContent.replace(fullMatch, `![${altText}](./${downloadedImages.get(imageUrl)})`);
          continue;
        }
        
        try {
          // Extract original filename from URL
          const urlPath = new URL(imageUrl).pathname;
          const originalFilename = path.basename(urlPath);
          const imageExtension = path.extname(originalFilename) || '.jpg';
          
          // Use original filename, sanitize it for filesystem
          let localImageFilename = originalFilename.replace(/[^a-z0-9.-]/gi, '-').toLowerCase();
          
          // Ensure unique filename if it already exists
          let counter = 1;
          let finalFilename = localImageFilename;
          while (fs.existsSync(path.join(postDir, finalFilename))) {
            const nameWithoutExt = path.basename(localImageFilename, imageExtension);
            finalFilename = `${nameWithoutExt}-${counter}${imageExtension}`;
            counter++;
          }
          
          const localImagePath = path.join(postDir, finalFilename);
          
          // Download the inline image
          await downloadImage(imageUrl, localImagePath);
          
          // Track downloaded image
          downloadedImages.set(imageUrl, finalFilename);
          
          // Replace the URL with local path
          processedContent = processedContent.replace(fullMatch, `![${altText}](./${finalFilename})`);
        } catch (error) {
          console.warn(`Failed to download inline image for ${categoryPath}/${postSlug}: ${error.message}`);
          // Keep the original URL if download fails
        }
      }

      // Format date for frontmatter
      const pubDate = new Date(post.date);
      const formattedDate = pubDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      });

      // Create markdown content
      const markdown = `---
title: '${post.title.rendered.replace(/'/g, "''")}'
description: '${cleanExcerpt.replace(/'/g, "''")}'
pubDate: '${formattedDate}'
heroImage: '${heroImage}'
categories: ${JSON.stringify(categoryNames)}
---

${processedContent}
`;

      // Write markdown file as index.md in the post directory
      const filePath = path.join(postDir, 'index.md');
      fs.writeFileSync(filePath, markdown, 'utf-8');
      console.log(`Saved ${categoryPath}/${postSlug}/index.md`);
    }

    console.log(`WordPress posts saved to ${CONTENT_DIR}`);
  } catch (error) {
    console.error(`Error loading WordPress posts: ${error}`);
    throw error;
  }
}

fetchWordPressPosts();
