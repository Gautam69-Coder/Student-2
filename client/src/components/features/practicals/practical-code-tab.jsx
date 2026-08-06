import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CodeTabs({ tabs = [] }) {
  const [activeTab, setActiveTab] = useState(0);

  if (tabs.length === 0) return null;

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-zinc-800 bg-[#0d1117]  font-mono shadow-2xl">
      {/* Tab Headers */}
      <div className="flex border-b border-zinc-800 bg-zinc-950 px-2" role="tablist">
        {tabs.map((tab, index) => {
          const isActive = activeTab === index;
          return (
            <button
              key={index}
              role="tab"
              aria-selected={isActive}
              id={`tab-${index}`}
              aria-controls={`panel-${index}`}
              onClick={() => setActiveTab(index)}
              className={`relative px-4 py-3 font-mono text-sm font-medium transition-colors duration-200 focus:outline-none ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
            >
              {tab.label || `Tab ${index + 1}`}

              {/* Sliding Layout Underline Animation */}
              {isActive && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Animated Tab Panels */}
      <div className="relative min-h-[100px]">
        <AnimatePresence mode="wait">
          {tabs.map((tab, index) => {
            if (activeTab !== index) return null;

            return (
              <motion.div
                key={index}
                id={`panel-${index}`}
                role="tabpanel"
                aria-labelledby={`tab-${index}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="overflow-x-auto p-5 text-sm leading-relaxed text-zinc-300"
              >
                <pre className="whitespace-pre-wrap break-all">
                  <code>{tab.code || '// No content'}</code>
                </pre>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
