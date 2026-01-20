'use client';

import { motion } from 'framer-motion';

// Helper function to generate some random financial data for the chart
const generateCandlestickData = (count = 25) => {
  const data = [];
  let lastClose = Math.random() * 100 + 50;

  for (let i = 0; i < count; i++) {
    const open = lastClose;
    const close = open + (Math.random() - 0.5) * 15;
    const high = Math.max(open, close) + Math.random() * 8;
    const low = Math.min(open, close) - Math.random() * 8;
    data.push({ o: open, h: high, l: low, c: close });
    lastClose = close;
  }
  return data;
};

// Component for a single candlestick
const Candlestick = ({ o, h, l, c, min, max, index }) => {
  const range = max - min;
  const isGreen = c >= o;

  const bodyTop = ((max - Math.max(o, c)) / range) * 100;
  const bodyHeight = Math.max((Math.abs(o - c) / range) * 100, 1); // Ensure body is at least 1px
  const wickTop = ((max - h) / range) * 100;
  const wickHeight = ((h - l) / range) * 100;

  return (
    <motion.div
      className="relative h-full w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
    >
      {/* Wick (the thin line) */}
      <div
        className="absolute w-0.5 bg-muted-foreground/70 left-1/2 -translate-x-1/2"
        style={{
          top: `${wickTop}%`,
          height: `${wickHeight}%`,
        }}
      />
      {/* Body (the thick part) */}
      <div
        className="absolute w-full"
        style={{
          top: `${bodyTop}%`,
          height: `${bodyHeight}%`,
          backgroundColor: isGreen ? '#22c55e' : '#ef4444', // green-500 and red-500
        }}
      />
    </motion.div>
  );
};

// The main chart component
const HeaderCandlestickChart = () => {
  const data = generateCandlestickData();
  const allValues = data.flatMap(d => [d.h, d.l]);
  const max = Math.max(...allValues);
  const min = Math.min(...allValues);

  return (
    <div className="w-full h-64 bg-card/50 p-4 rounded-lg shadow-xl flex items-center justify-around gap-1 border border-border/50">
      {data.map((d, i) => (
        <div key={i} className="h-full flex-1">
          <Candlestick {...d} min={min} max={max} index={i} />
        </div>
      ))}
    </div>
  );
};

export default HeaderCandlestickChart;
