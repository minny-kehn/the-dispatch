import { Category } from './types';

export interface RSSSource {
  name: string;
  url: string;
  category: Category;
  reliability: 'high' | 'medium';
}

/**
 * RSS Source Registry
 * Primary backbone for news discovery — unlimited, free, reliable.
 * Google News RSS by category + direct publication feeds.
 */
export const RSS_SOURCES: RSSSource[] = [
  // ============== TECHNOLOGY ==============
  {
    name: 'Google News — Technology',
    url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB',
    category: 'TECHNOLOGY',
    reliability: 'high',
  },
  {
    name: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    category: 'TECHNOLOGY',
    reliability: 'high',
  },
  {
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    category: 'TECHNOLOGY',
    reliability: 'high',
  },
  {
    name: 'Wired',
    url: 'https://www.wired.com/feed/rss',
    category: 'TECHNOLOGY',
    reliability: 'high',
  },
  {
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/feed/',
    category: 'TECHNOLOGY',
    reliability: 'high',
  },
  {
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    category: 'TECHNOLOGY',
    reliability: 'high',
  },
  {
    name: 'Hacker News (Best)',
    url: 'https://hnrss.org/best',
    category: 'TECHNOLOGY',
    reliability: 'medium',
  },

  // ============== GEOPOLITICS ==============
  {
    name: 'Google News — World',
    url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtVnVHZ0pWVXlnQVAB',
    category: 'GEOPOLITICS',
    reliability: 'high',
  },
  {
    name: 'The Guardian — World',
    url: 'https://www.theguardian.com/world/rss',
    category: 'GEOPOLITICS',
    reliability: 'high',
  },
  {
    name: 'Al Jazeera',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    category: 'GEOPOLITICS',
    reliability: 'high',
  },
  {
    name: 'Foreign Policy',
    url: 'https://foreignpolicy.com/feed/',
    category: 'GEOPOLITICS',
    reliability: 'high',
  },
  {
    name: 'The Diplomat',
    url: 'https://thediplomat.com/feed/',
    category: 'GEOPOLITICS',
    reliability: 'high',
  },
  {
    name: 'BBC News — World',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    category: 'GEOPOLITICS',
    reliability: 'high',
  },

  // ============== CLIMATE ==============
  {
    name: 'Google News — Environment',
    url: 'https://news.google.com/rss/search?q=climate+change+environment&hl=en-US&gl=US&ceid=US:en',
    category: 'CLIMATE',
    reliability: 'high',
  },
  {
    name: 'Carbon Brief',
    url: 'https://www.carbonbrief.org/feed/',
    category: 'CLIMATE',
    reliability: 'high',
  },
  {
    name: 'Inside Climate News',
    url: 'https://insideclimatenews.org/feed/',
    category: 'CLIMATE',
    reliability: 'high',
  },
  {
    name: 'The Guardian — Environment',
    url: 'https://www.theguardian.com/environment/rss',
    category: 'CLIMATE',
    reliability: 'high',
  },
  {
    name: 'EcoWatch',
    url: 'https://www.ecowatch.com/feed/',
    category: 'CLIMATE',
    reliability: 'medium',
  },
  {
    name: 'Yale Climate Connections',
    url: 'https://yaleclimateconnections.org/feed/',
    category: 'CLIMATE',
    reliability: 'high',
  },

  // ============== FINANCE ==============
  {
    name: 'Google News — Business',
    url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB',
    category: 'FINANCE',
    reliability: 'high',
  },
  {
    name: 'Yahoo Finance',
    url: 'https://finance.yahoo.com/news/rssindex',
    category: 'FINANCE',
    reliability: 'high',
  },
  {
    name: 'MarketWatch',
    url: 'https://feeds.marketwatch.com/marketwatch/topstories/',
    category: 'FINANCE',
    reliability: 'high',
  },
  {
    name: 'Wall Street Journal — World News',
    url: 'https://feeds.a.dj.com/rss/RSSWorldNews.xml',
    category: 'FINANCE',
    reliability: 'high',
  },
  {
    name: 'CoinDesk',
    url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
    category: 'FINANCE',
    reliability: 'medium',
  },
  {
    name: 'CNBC',
    url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114',
    category: 'FINANCE',
    reliability: 'high',
  },

  // ============== HEALTH ==============
  {
    name: 'Google News — Health',
    url: 'https://news.google.com/rss/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRFU0FtVnVLQUFQAQ',
    category: 'HEALTH',
    reliability: 'high',
  },
  {
    name: 'STAT News',
    url: 'https://www.statnews.com/feed/',
    category: 'HEALTH',
    reliability: 'high',
  },
  {
    name: 'WHO News',
    url: 'https://www.who.int/rss-feeds/news-english.xml',
    category: 'HEALTH',
    reliability: 'high',
  },


  // ============== CULTURE ==============
  {
    name: 'Google News — Entertainment',
    url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtVnVHZ0pWVXlnQVAB',
    category: 'CULTURE',
    reliability: 'high',
  },
  {
    name: 'The Guardian — Culture',
    url: 'https://www.theguardian.com/culture/rss',
    category: 'CULTURE',
    reliability: 'high',
  },
  {
    name: 'Variety',
    url: 'https://variety.com/feed/',
    category: 'CULTURE',
    reliability: 'high',
  },
  {
    name: 'Rolling Stone',
    url: 'https://www.rollingstone.com/feed/',
    category: 'CULTURE',
    reliability: 'high',
  },
  {
    name: 'Pitchfork',
    url: 'https://pitchfork.com/feed/feed-news/rss',
    category: 'CULTURE',
    reliability: 'medium',
  },
  {
    name: 'NPR — Arts & Life',
    url: 'https://feeds.npr.org/1008/rss.xml',
    category: 'CULTURE',
    reliability: 'medium',
  },
];

export function getSourcesByCategory(category: Category): RSSSource[] {
  return RSS_SOURCES.filter((s) => s.category === category);
}

export function getAllCategories(): Category[] {
  return ['TECHNOLOGY', 'GEOPOLITICS', 'CLIMATE', 'FINANCE', 'HEALTH', 'CULTURE'];
}
