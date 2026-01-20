'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export type Sentiment = 'positive' | 'negative' | 'neutral';
export type MarketImpact = 'bullish' | 'bearish' | 'neutral';

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  imageUrl: string;
  summary: string;
  link: string;
  sentiment: Sentiment;
  marketImpact: MarketImpact;
}

const sentimentConfig = {
  positive: {
    label: 'Positive',
    color: 'bg-green-500/10 text-green-500 border-green-500/20',
    icon: <TrendingUp className="h-4 w-4" />,
  },
  negative: {
    label: 'Negative',
    color: 'bg-red-500/10 text-red-500 border-red-500/20',
    icon: <TrendingDown className="h-4 w-4" />,
  },
  neutral: {
    label: 'Neutral',
    color: 'bg-muted/80 text-muted-foreground border-border',
    icon: <Minus className="h-4 w-4" />,
  },
};

const marketImpactConfig = {
    bullish: {
        label: 'Bullish',
        color: 'text-green-500',
    },
    bearish: {
        label: 'Bearish',
        color: 'text-red-500',
    },
    neutral: {
        label: 'Neutral',
        color: 'text-muted-foreground',
    },
};


const NewsCard = ({ article, index }: { article: NewsArticle, index: number }) => {
  const { sentiment, marketImpact } = article;

  return (
    <motion.div 
      className="bg-card border border-border/50 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 items-start">
        <div className="relative w-full h-48 md:h-full rounded-md overflow-hidden md:col-span-1">
          <Image 
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex flex-col h-full md:col-span-2">
          <h3 className="font-bold text-xl mb-2">{article.title}</h3>
          <p className="text-muted-foreground mb-4 text-sm flex-grow">{article.summary}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
              <div className="flex flex-col space-y-2">
                  <p className="font-semibold">Sentiment</p>
                  <Badge variant="outline" className={`w-fit ${sentimentConfig[sentiment].color} flex items-center gap-2`}>
                      {sentimentConfig[sentiment].icon}
                      <span>{sentimentConfig[sentiment].label}</span>
                  </Badge>
              </div>
              <div className="flex flex-col space-y-2">
                  <p className="font-semibold">Market Effect</p>
                   <p className={`flex items-center gap-2 font-semibold ${marketImpactConfig[marketImpact].color}`}>
                      {marketImpactConfig[marketImpact].label}
                  </p>
              </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t border-border/50">
            <span>Source: {article.source}</span>
            <a href={article.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
              Read Full Article
              <ExternalLink className="h-3 w-3"/>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;
