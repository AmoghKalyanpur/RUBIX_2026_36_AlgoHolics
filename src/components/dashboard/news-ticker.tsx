import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import Link from "next/link";

// 1. Define what a single news item looks like
export interface NewsItem {
  title: string;
  sentiment: string;
  link: string;
  signal_color: string;
}

// 2. Define the Component to accept the 'news' prop
export default function NewsTicker({ news }: { news: NewsItem[] }) {
  // Guard clause: If no news, don't render anything
  if (!news || news.length === 0) return null;

  return (
    <div className="w-full bg-slate-900 text-white py-2.5 overflow-hidden whitespace-nowrap border-b border-slate-800 relative z-10 select-none">
      <div className="inline-block animate-marquee hover:[animation-play-state:paused]">
        {/* We duplicate the array to make the loop seamless */}
        {[...news, ...news].map((item, index) => (
          <span key={index} className="mx-6 text-sm font-medium inline-flex items-center gap-2">
            
            {/* Sentiment Icon & Color */}
            <span className={`
              ${item.signal_color === 'green' ? 'text-green-400' : ''}
              ${item.signal_color === 'red' ? 'text-red-400' : ''}
              ${item.signal_color === 'gray' ? 'text-gray-400' : ''}
            `}>
              {item.signal_color === 'green' ? '▲' : item.signal_color === 'red' ? '▼' : '•'}
            </span>

            {/* Headline Text */}
            <Link href={item.link} className="text-slate-200 hover:text-white hover:underline transition-colors">
                {item.title}
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
}