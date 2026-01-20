'use client';

import { motion } from 'framer-motion';
import { Landmark, Apple, ArrowRight, User } from 'lucide-react';

const StockFlowAnimation = () => {
  return (
    <div className="relative w-full h-48 flex items-center justify-center bg-card rounded-lg overflow-hidden">
      {/* Static Icons */}
      <div className="flex items-center justify-between w-full px-8 md:px-16">
        <div className="flex flex-col items-center gap-2">
          <User className="h-10 w-10 text-primary" />
          <p className="font-semibold text-sm">You</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Landmark className="h-10 w-10 text-primary" />
          <p className="font-semibold text-sm">The Market</p>
        </div>
      </div>

      {/* Animated Icons */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ x: [-100, 100], opacity: [0, 1, 1, 0] }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <Apple className="h-8 w-8 text-green-500" />
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ x: [100, -100], opacity: [0, 1, 1, 0] }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut",
          delay: 2.5, // Start after the first animation
        }}
      >
        <ArrowRight className="h-8 w-8 text-blue-500" />
      </motion.div>
    </div>
  );
};

export default StockFlowAnimation;
