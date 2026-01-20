'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import NewsTicker from '@/components/dashboard/news-ticker';
import NewsCard, { NewsArticle } from '@/components/dashboard/news-card';
import { Input } from '@/components/ui/input';

// Dummy data for news articles - easily replaceable with a real-time API
const dummyNewsData: NewsArticle[] = [
  {
    id: '1',
    title: 'Analysts Upgrade AAPL (Bullish)',
    source: 'Reuters',
    imageUrl: 'https://placehold.co/800x400',
    summary: 'Apple Inc. (AAPL) received a significant upgrade from top analysts at Fungible\'s, citing strong iPhone sales and growth in its services division. This has bolstered investor confidence.',
    link: '#',
    sentiment: 'positive',
    marketImpact: 'bullish',
  },
  {
    id: '2',
    title: 'Oil Prices Volatile Amid Geopolitical Tensions',
    source: 'Bloomberg',
    imageUrl: 'https://placehold.co/800x400',
    summary: 'The global oil markets are experiencing significant volatility as geopolitical tensions in key regions escalate. The uncertainty is making investors cautious about the short-term outlook.',
    link: '#',
    sentiment: 'neutral',
    marketImpact: 'neutral',
  },
  {
    id: '3',
    title: 'Crypto Markets Face Regulatory Hurdles (Bearish)',
    source: 'CoinDesk',
    imageUrl: 'https://placehold.co/800x400',
    summary: 'New regulatory proposals are creating headwinds for the cryptocurrency market. Bitcoin and other major digital assets have seen a downturn as investors weigh the impact of increased oversight.',
    link: '#',
    sentiment: 'negative',
    marketImpact: 'bearish',
  },
  {
    id: '4',
    title: 'Federal Reserve Signals Potential Interest Rate Hikes',
    source: 'The Wall Street Journal',
    imageUrl: 'https://placehold.co/800x400',
    summary: 'In a recent address, the Federal Reserve chair hinted at upcoming interest rate hikes to combat inflation, causing a ripple effect across all major stock indices.',
    link: '#',
    sentiment: 'negative',
    marketImpact: 'bearish',
  },
  {
    id: '5',
    title: 'Green Energy Stocks Surge on New Government Subsidies',
    source: 'CleanTechnica',
    imageUrl: 'https://placehold.co/800x400',
    summary: 'The renewable energy sector saw a significant boost after the government announced a new round of subsidies aimed at promoting clean energy production and adoption.',
    link: '#',
    sentiment: 'positive',
    marketImpact: 'bullish',
  }
];


export default function SentimentAnalysisPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNews = dummyNewsData.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full">
      <NewsTicker />
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
