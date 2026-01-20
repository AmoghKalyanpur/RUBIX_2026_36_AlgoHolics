'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Define the structure of a section
interface Section {
  id: string;
  label: string;
}

// Props for the ScrollAssist component
interface ScrollAssistProps {
  sections: Section[];
}

export function ScrollAssist({ sections }: ScrollAssistProps) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (currentPosition >= offsetTop && currentPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Set initial active section

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sections]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="fixed left-4 top-1/2 -translate-y-1/2 hidden lg:block"
    >
      <ul className="space-y-2">
        {sections.map(section => (
          <li key={section.id}>
            <button 
              onClick={() => scrollTo(section.id)}
              className={`flex items-center space-x-2 text-sm transition-all duration-200 ${activeSection === section.id ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'}`}>
                <span className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${activeSection === section.id ? 'bg-primary scale-125' : 'bg-muted-foreground'}`}></span>
                <span>{section.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
