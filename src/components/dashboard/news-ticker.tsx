'use client';

import { Triangle } from 'lucide-react';
import { motion } from 'framer-motion';

const tickerItems = [
  { text: 'Tech Sector Rally Continues...', sentiment: 'positive' },
  { text: 'Inflation Concerns Persist...', sentiment: 'negative' },
  { text: 'Global Markets Show Mixed Signals...', sentiment: 'neutral' },
  { text: 'New IPOs Flood the Market...', sentiment: 'positive' },
  { text: 'Regulatory Scrutiny on Crypto Intensifies...', sentiment: 'negative' },
  { text: 'Energy Prices Stabilize After Volatile Week...', sentiment: 'neutral' },
];

const NewsTicker = () => {
  // Duplicate the items for a seamless loop
  const extendedItems = [...tickerItems, ...tickerItems];

  return (
    <div className="w-full bg-card border-b border-t border-border/80 overflow-hidden whitespace-nowrap relative h-12">
      <motion.div
        className="flex absolute top-0 left-0 h-full items-center"
        animate={{
          x: ['0%', '-50%'], // Correctly animate to half the container width
        }}
        transition={{
          ease: 'linear',
          duration: 40, // Adjusted for smoother animation
          repeat: Infinity,
        }}
      >
        {extendedItems.map((item, index) => (
          <div key={index} className="flex items-center mx-6 text-sm font-semibold shrink-0">
            <Triangle
              className={`mr-3 h-4 w-4 ${
                item.sentiment === 'positive' ? 'text-green-500 fill-green-500' : ''
              } ${
                item.sentiment === 'negative' ? 'text-red-500 fill-red-500 rotate-180' : ''
              } ${
                item.sentiment === 'neutral' ? 'text-muted-foreground/80' : ''
              }`}
            />
            <span className={`${item.sentiment === 'positive' ? 'text-green-500' : ''} ${item.sentiment === 'negative' ? 'text-red-500' : ''} ${item.sentiment === 'neutral' ? 'text-muted-foreground' : ''}`}>
              {item.text.toUpperCase()}
            </span>
          </div>
        ))}
      </motion.div>
      <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-background to-transparent z-10" />
      <div className="absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-background to-transparent z-10" />
    </div>
  );
};

export default NewsTicker;
