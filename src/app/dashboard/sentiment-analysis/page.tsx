'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
// Ensure this import matches your export type (Default vs Named)
import NewsTicker from '@/components/dashboard/news-ticker'; // ✅ CORRECT
import NewsCard, { NewsArticle } from '@/components/dashboard/news-card';
import { Input } from '@/components/ui/input';

// =========================================
// 1. STATIC ARTICLES (Kept as requested)
// =========================================
const dummyNewsData: NewsArticle[] = [
  {
    id: '1',
    title: 'Analysts Upgrade AAPL (Bullish)',
    source: 'Reuters',
    imageUrl: 'https://placehold.co/800x400?text=Apple',
    summary: 'Apple Inc. (AAPL) received a significant upgrade from top analysts, citing strong iPhone sales and growth in its services division.',
    link: '#',
    sentiment: 'positive',
    marketImpact: 'bullish',
  },
  {
    id: '2',
    title: 'Oil Prices Volatile Amid Geopolitical Tensions',
    source: 'Bloomberg',
    imageUrl: 'https://placehold.co/800x400?text=Oil',
    summary: 'The global oil markets are experiencing significant volatility. This creates uncertainty for energy giants like ONGC and Reliance.',
    link: '#',
    sentiment: 'neutral',
    marketImpact: 'neutral',
  },
  {
    id: '3',
    title: 'Crypto Markets Face Regulatory Hurdles',
    source: 'CoinDesk',
    imageUrl: 'https://placehold.co/800x400?text=Crypto',
    summary: 'New regulatory proposals are creating headwinds for the cryptocurrency market. Bitcoin and other major digital assets have seen a downturn.',
    link: '#',
    sentiment: 'negative',
    marketImpact: 'bearish',
  },
  {
    id: '4',
    title: 'Federal Reserve Signals Rate Hikes',
    source: 'WSJ',
    imageUrl: 'https://placehold.co/800x400?text=Fed',
    summary: 'In a recent address, the Federal Reserve chair hinted at upcoming interest rate hikes to combat inflation.',
    link: '#',
    sentiment: 'negative',
    marketImpact: 'bearish',
  },
  {
    id: '5',
    title: 'Green Energy Stocks Surge',
    source: 'CleanTechnica',
    imageUrl: 'https://placehold.co/800x400?text=Energy',
    summary: 'The renewable energy sector saw a significant boost after the government announced a new round of subsidies.',
    link: '#',
    sentiment: 'positive',
    marketImpact: 'bullish',
  }
];

export default function SentimentAnalysisPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for the AI-powered Ticker
  const [tickerNews, setTickerNews] = useState<any[]>([]);

  // =========================================
  // 2. FETCH GEMINI TICKER DATA
  // =========================================
  useEffect(() => {
    async function fetchTicker() {
      try {
        const res = await fetch('http://127.0.0.1:8000/news/ticker');
        const data = await res.json();
        
        if (Array.isArray(data)) {
            // Transform Gemini JSON to match NewsTicker component props
            const formattedTicker = data.map((item: any) => ({
                title: item.title,
                sentiment: item.sentiment.toUpperCase(),
                // Assign color based on sentiment text
                signal_color: item.sentiment.toLowerCase() === 'positive' ? 'green' 
                            : item.sentiment.toLowerCase() === 'negative' ? 'red' 
                            : 'gray',
                link: '#' // AI headlines don't have real links
            }));
            setTickerNews(formattedTicker);
        }
      } catch (e) {
        console.error("Ticker fetch failed, using fallback", e);
      }
    }
    fetchTicker();
  }, []);

  // Filter logic for the static cards
  const filteredNews = dummyNewsData.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      
      {/* 3. DYNAMIC TICKER (Connected to Backend) */}
      <NewsTicker news={tickerNews} />

      <main className="flex-grow p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Financial News Feed</h1>
            <p className="text-muted-foreground">Real-time analysis of market-moving news.</p>
          </header>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="text"
              placeholder="Search articles by title, description, or summary..."
              className="w-full pl-10 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-6">
            {filteredNews.map((article, index) => (
              <NewsCard key={article.id} article={article} index={index} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}