import { getLatestArticles } from '@/lib/articles';

// ─── Types ──────────────────────────────────────
interface TickerItem {
  text: string;
  type: 'news' | 'trend';
}

// ─── Virlo Trending Topics ──────────────────────
async function fetchVirloTrends(): Promise<string[]> {
  const apiKey = process.env.VIRLO_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch('https://api.virlo.ai/v1/trends?limit=5', {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) return [];

    const data = await response.json();
    // Extract trend names from Virlo response
    const trends: string[] = [];
    if (data?.data) {
      for (const digest of data.data) {
        if (digest.trends) {
          for (const trend of digest.trends.slice(0, 5)) {
            if (trend.name) trends.push(trend.name);
          }
        }
      }
    }
    return trends.slice(0, 5);
  } catch {
    return [];
  }
}

// ─── Component ──────────────────────────────────
export default async function Ticker() {
  // News items from latest articles
  const latest = getLatestArticles(8);
  const newsItems: TickerItem[] = latest.map((article) => ({
    text: article.headline.length > 65 ? article.headline.substring(0, 62) + '…' : article.headline,
    type: 'news' as const,
  }));

  // Fetch Virlo trending topics
  const trends = await fetchVirloTrends();
  const trendItems: TickerItem[] = trends.map((t) => ({
    text: `🔥 ${t}`,
    type: 'trend' as const,
  }));

  // Build combined ticker: interleave news and trends
  const combined: TickerItem[] = [];

  if (newsItems.length === 0 && trendItems.length === 0) {
    combined.push({ text: 'SYSTEM ONLINE: Autonomous newsroom initialized.', type: 'news' });
    combined.push({ text: 'Awaiting first editorial pipeline cycle...', type: 'news' });
    combined.push({ text: 'Fetching real-time feeds from 34+ global sources...', type: 'news' });
  } else {
    // Interleave: 2-3 news items, then 1 trend, repeat
    let newsIdx = 0;
    let trendIdx = 0;
    while (newsIdx < newsItems.length || trendIdx < trendItems.length) {
      // Add 2 news items
      for (let n = 0; n < 2 && newsIdx < newsItems.length; n++) {
        combined.push(newsItems[newsIdx++]);
      }
      // Add 1 trend item
      if (trendIdx < trendItems.length) {
        combined.push(trendItems[trendIdx++]);
      }
    }
  }

  // Add timestamp
  const now = new Date();
  const formatted = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  combined.push({ text: `Updated: ${formatted}`, type: 'news' });

  // Determine if we have trends (controls whether to show dual badges)
  const hasTrends = trendItems.length > 0;

  return (
    <div className="ticker" id="ticker">
      {hasTrends ? (
        <span className="ticker-badge-wrapper">
          <span className="ticker-live">LIVE</span>
          <span className="ticker-trending">TRENDING</span>
        </span>
      ) : (
        <span className="ticker-live" style={{ position: 'relative', animation: 'none' }}>LIVE</span>
      )}
      <div className="ticker-wrapper">
        <div className="ticker-content">
          {[...combined, ...combined].map((item, i) => (
            <span className={`ticker-item ${item.type === 'trend' ? 'ticker-item-trend' : ''}`} key={i}>
              <span className="ticker-item-dot"></span>
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
