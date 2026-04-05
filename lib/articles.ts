import { Article } from './types';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Content directory for generated articles.
 * Articles are stored as individual JSON files.
 */
const CONTENT_DIR = path.join(process.cwd(), 'content', 'articles');

/**
 * Load all articles from the content directory.
 * Falls back gracefully if the directory doesn't exist yet.
 */
function loadArticlesFromDisk(): Article[] {
  try {
    if (!fs.existsSync(CONTENT_DIR)) {
      console.warn('[articles] Content directory not found, returning empty array');
      return [];
    }

    const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.json'));
    const articles: Article[] = [];

    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
        const article = JSON.parse(raw) as Article;
        articles.push(article);
      } catch {
        console.warn(`[articles] Failed to parse ${file}, skipping`);
      }
    }

    return articles;
  } catch {
    return [];
  }
}

/**
 * All articles, loaded from the /content/articles/ directory at import time.
 * In Next.js server components this runs at build time (SSG) or request time (SSR).
 */
export const articles: Article[] = loadArticlesFromDisk();

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: string): Article[] {
  return articles.filter((a) => a.category === category);
}

export function getFeaturedArticle(): Article | undefined {
  if (articles.length === 0) return undefined;

  const now = new Date().getTime();

  // Score each article based on an editorial-weight algorithm
  const scoredArticles = articles.map(article => {
    let score = 0;
    
    // 1. Recency (Highest importance: fresh news leads)
    // 100 points max, loses ~2 points per hour, hitting 0 after ~48 hours
    const ageInHours = (now - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60);
    score += Math.max(0, 100 - (ageInHours * 2.1)); 

    // 2. Depth & Complexity (Favors highly synthesized reporting)
    score += (article.readTime || 0) * 4; 
    
    // 3. Structural Substance (Favors deeply fleshed out articles)
    if (article.body && article.body.length >= 8) score += 10;
    if (article.body && article.body.length >= 10) score += 5;

    // 4. Category Authority (Editorial precedence for "Front Page" topics)
    if (article.category === 'GEOPOLITICS') score += 8;
    if (article.category === 'FINANCE') score += 6;
    if (article.category === 'TECHNOLOGY') score += 4;

    return { article, score };
  });

  // Sort by highest editorial score
  scoredArticles.sort((a, b) => b.score - a.score);

  return scoredArticles[0].article;
}

export function getLatestArticles(count?: number): Article[] {
  const sorted = [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  return count ? sorted.slice(0, count) : sorted;
}
