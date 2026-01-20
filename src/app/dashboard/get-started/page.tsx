'use client';

import { ArrowRight, TrendingUp, TrendingDown, DollarSign, Briefcase, BrainCircuit, ShieldCheck, Zap, BookOpen, Scale, Search, LineChart, Gauge, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ScrollAssist } from '@/components/dashboard/scroll-assist';
import StockFlowAnimation from '@/components/dashboard/stock-flow-animation';
import HeaderCandlestickChart from '@/components/dashboard/header-candlestick-chart'; // Import the new chart

const sections = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-the-market', label: 'What is the Market?' },
  { id: 'key-terms', label: 'Key Market Terms' },
  { id: 'analysis-types', label: 'Types of Analysis' },
  { id: 'market-indicators', label: 'Common Indicators' },
  { id: 'why-invest', label: 'Why Invest?' },
  { id: 'visualizing-growth', label: 'Visualizing Growth' },
  { id: 'get-started', label: 'How to Get Started' },
  { id: 'risks', label: 'Managing Risks' },
];

const Section = ({ id, children }: { id: string, children: React.ReactNode }) => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  return (
    <motion.div
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
      transition={{ duration: 0.6 }}
      className="mb-20 scroll-mt-24"
    >
      {children}
    </motion.div>
  );
};

const IconCard = ({ icon: Icon, title, text }: { icon: React.ElementType, title: string, text: string }) => (
  <div className="bg-card p-6 rounded-lg shadow-md flex flex-col items-center text-center h-full">
    <div className="bg-primary/10 p-4 rounded-full mb-4">
      <Icon className="h-8 w-8 text-primary" />
    </div>
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm">{text}</p>
  </div>
);

export default function GetStartedPage() {
  const graphData = [30, 40, 45, 50, 49, 60, 70, 91, 125];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 text-foreground">
      <ScrollAssist sections={sections} />

      <header id="introduction" className="mb-20 scroll-mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
            >
                <Zap className="h-16 w-16 text-primary/80 mb-6" />
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Welcome to the Stock Market!</h1>
                <p className="text-lg text-muted-foreground">Your journey to financial growth starts here. Let's dive in.</p>
            </motion.div>
            <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
            >
                {/* Replace the static image with the new dynamic chart */}
                <HeaderCandlestickChart />
            </motion.div>
        </div>
      </header>

      <Section id="what-is-the-market">
        <h2 className="text-3xl font-bold mb-6">What is the Stock Market?</h2>
        <p className="text-lg mb-4">
          Imagine you're buying a tiny piece of a big company, like Apple or Google. That piece is called a <strong className="text-primary">stock</strong>.
          The stock market is the global marketplace where these pieces are bought and sold. It's a dynamic environment where company values rise and fall based on performance and public perception.
        </p>
        <StockFlowAnimation />
      </Section>

      <Section id="key-terms">
        <h2 className="text-3xl font-bold mb-6">The Lingo: Key Market Terms</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <IconCard icon={BookOpen} title="Ticker Symbol" text="A unique abbreviation for a publicly traded company, like AAPL for Apple." />
          <IconCard icon={Scale} title="Market Cap" text="The total value of a company's shares. It's calculated by multiplying the share price by the number of outstanding shares." />
          <IconCard icon={Activity} title="Volume" text="The total number of shares traded for a particular stock during a given period. High volume often indicates high interest." />
          <IconCard icon={TrendingUp} title="Bull Market" text="A period where stock prices are generally rising, and investor sentiment is optimistic." />
          <IconCard icon={TrendingDown} title="Bear Market" text="A period where stock prices are falling, and investor sentiment is pessimistic." />
          <IconCard icon={DollarSign} title="Dividend" text="A payment made by a company to its shareholders, usually as a distribution of profits." />
        </div>
      </Section>

      <Section id="analysis-types">
        <h2 className="text-3xl font-bold mb-6">How to Analyze Stocks: Three Main Approaches</h2>
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-card/50 rounded-lg">
                <Search className="h-12 w-12 text-primary shrink-0" />
                <div>
                    <h3 className="text-2xl font-semibold mb-2">1. Fundamental Analysis</h3>
                    <p className="text-muted-foreground">This is like being a detective. You investigate a company's financial health by looking at its revenues, earnings, assets, and liabilities. The goal is to determine a stock's <strong className="text-foreground">intrinsic value</strong> to see if it's overpriced or underpriced.</p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-card/50 rounded-lg">
                <LineChart className="h-12 w-12 text-primary shrink-0" />
                <div>
                    <h3 className="text-2xl font-semibold mb-2">2. Technical Analysis</h3>
                    <p className="text-muted-foreground">This approach is like being a chartist. You analyze historical price charts and trading patterns to predict future price movements. Technical analysts believe that all known information is already reflected in the stock's price.</p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-card/50 rounded-lg">
                <BrainCircuit className="h-12 w-12 text-primary shrink-0" />
                <div>
                    <h3 className="text-2xl font-semibold mb-2">3. Sentiment Analysis</h3>
                    <p className="text-muted-foreground">This involves gauging the overall mood or tone of the market. It looks at news, social media, and other data sources to understand if investors are feeling fearful or greedy. FinSight uses AI to help you with this!</p>
                </div>
            </div>
        </div>
      </Section>
      
      <Section id="market-indicators">
          <h2 className="text-3xl font-bold mb-6">Reading the Signs: Common Technical Indicators</h2>
          <div className="grid md:grid-cols-2 gap-6">
              <IconCard icon={TrendingUp} title="Moving Averages (MA)" text="Smooths out price data to create a single flowing line, making it easier to identify the direction of the trend. A 50-day or 200-day MA are common examples." />
              <IconCard icon={Gauge} title="Relative Strength Index (RSI)" text="A momentum oscillator that measures the speed and change of price movements. It ranges from 0 to 100 and is typically used to identify overbought (>70) or oversold (<30) conditions." />
          </div>
      </Section>

      <Section id="why-invest">
        <h2 className="text-3xl font-bold mb-6">Why Should You Care About Investing?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <IconCard icon={DollarSign} title="Grow Your Money" text="Historically, the stock market has provided returns higher than inflation, helping your savings grow over time." />
          <IconCard icon={Briefcase} title="Own a Part of a Business" text="As a shareholder, you're a part-owner of the company, sharing in its successes and growth." />
        </div>
      </Section>
      
      <Section id="visualizing-growth">
        <h2 className="text-3xl font-bold mb-6">Visualizing Growth</h2>
        <p className="text-lg mb-4">Investing is about the long game. Prices fluctuate daily, but the overall trend for strong companies is often upwards. Here's a simple illustration:</p>
        <div className="w-full h-64 bg-card rounded-lg p-4 flex items-end">
            <div className="flex items-end h-full w-full justify-around">
                {graphData.map((height, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ height: 0, opacity: 0}}
                        animate={{ height: `${height / 130 * 100}%`, opacity: 1}}
                        transition={{ duration: 1.5, delay: i * 0.1}}
                        className="w-8 bg-primary rounded-t-md"
                    />
                ))}
            </div>
        </div>
        <p className="text-center mt-2 text-muted-foreground">A simple representation of stock growth over time.</p>
      </Section>

      <Section id="get-started">
        <h2 className="text-3xl font-bold mb-6">Your First Steps</h2>
        <ol className="list-decimal list-inside space-y-4 text-lg">
          <li>
            <span className="font-bold">Educate Yourself:</span> You're already doing it! Understand the basics before you invest.
          </li>
          <li>
            <span className="font-bold">Open a Brokerage Account:</span> This is your gateway to buying and selling stocks. Many platforms are beginner-friendly.
          </li>
          <li>
            <span className="font-bold">Start Small:</span> You don't need a fortune. Start with a small amount you're comfortable with and learn as you go.
          </li>
        </ol>
      </Section>

      <Section id="risks">
        <h2 className="text-3xl font-bold mb-6">A Word of Caution: Managing Risks</h2>
        <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-r-lg">
            <div className="flex items-center">
                <ShieldCheck className="h-8 w-8 text-destructive mr-4" />
                <div>
                    <h3 className="font-bold text-lg">Markets Can Be Volatile</h3>
                    <p className="text-destructive/90">The value of stocks can go down as well as up. Never invest more than you can afford to lose. <strong className="text-destructive">Diversification</strong> (spreading your investments across different assets) is key to managing risk.</p>
                </div>
            </div>
        </div>
      </Section>

      <div className="text-center mt-16">
          <p className="text-lg">Ready to put this knowledge into action? Try our <strong className="text-primary">Real-Time Simulator</strong>!</p>
      </div>

    </div>
  );
}
