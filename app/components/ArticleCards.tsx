import Link from 'next/link';
import { Article } from '@/lib/types';
import { Zap, Globe, Leaf, LineChart, Activity, Sparkles, Clock } from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  TECHNOLOGY: <Zap size={14} />,
  GEOPOLITICS: <Globe size={14} />,
  CLIMATE: <Leaf size={14} />,
  FINANCE: <LineChart size={14} />,
  HEALTH: <Activity size={14} />,
  CULTURE: <Sparkles size={14} />,
};

function getCategoryBadgeClass(category: string): string {
  return `badge badge-${category.toLowerCase()}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.slug}`} className="article-card" id={`article-${article.slug}`}>
      <div className="article-card-body">
        <div className="article-card-meta">
          <span className={getCategoryBadgeClass(article.category)} style={{ padding: '2px 8px', fontSize: '10px' }}>
            {article.category}
          </span>
          <span>{article.readTime} min read</span>
        </div>
        <h3 className="article-card-headline">{article.headline}</h3>
        <p className="article-card-deck">{article.deck}</p>
        <div className="article-card-footer">
          <span>{formatDate(article.publishedAt)}</span>
          <span className="article-card-read">Read</span>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedArticle({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.slug}`} className="featured-article" id="featured-article">
      <div className="featured-image">
        <div style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #333 50%, #1a1a1a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '64px',
            fontWeight: 900,
            color: 'var(--color-accent)',
            textAlign: 'center',
            lineHeight: 1,
            letterSpacing: '-2px',
          }}>
            TD
          </div>
        </div>
      </div>
      <div className="featured-content">
        <div className="featured-meta">
          <span className={getCategoryBadgeClass(article.category)} style={{ padding: '2px 8px', fontSize: '10px' }}>
            {article.category}
          </span>
          <span>FEATURED</span>
          <span>{formatDate(article.publishedAt)}</span>
          <span>{article.readTime} min read</span>
        </div>
        <h2 className="featured-headline">{article.headline}</h2>
        <p className="featured-deck">{article.deck}</p>
        <div className="featured-read-more">
          Read Full Story
        </div>
      </div>
    </Link>
  );
}

export function ArticleListItem({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.slug}`} className="article-list-item" id={`list-${article.slug}`}>
      <div className="article-list-avatar" style={{
        background: `var(--color-${article.category === 'TECHNOLOGY' ? 'tech' : article.category === 'GEOPOLITICS' ? 'geo' : article.category === 'CLIMATE' ? 'climate' : article.category === 'FINANCE' ? 'finance' : article.category === 'HEALTH' ? 'health' : 'culture'})`,
      }}>
        {CATEGORY_ICONS[article.category]}
      </div>
      <div className="article-list-content">
        <div className="article-list-badges">
          <span className={getCategoryBadgeClass(article.category)} style={{ padding: '1px 6px', fontSize: '9px' }}>
            {article.category}
          </span>
        </div>
        <h4 className="article-list-headline">{article.headline}</h4>
        <p className="article-list-deck">{article.deck}</p>
        <div className="article-list-meta">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {formatDate(article.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}
