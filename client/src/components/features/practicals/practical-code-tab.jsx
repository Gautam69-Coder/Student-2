import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@/lib/theme';
import HighlightComponent from 'react-highlight';
const Highlight = HighlightComponent.default || HighlightComponent;
import Editor from "@monaco-editor/react";
import "highlight.js/styles/atom-one-dark.css";

export default function CodeTabs({ tabs = [], activeTab: controlledActiveTab, onTabChange, layoutId = "activeTabUnderline" }) {
  const [internalActiveTab, setInternalActiveTab] = useState(0);
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
  const setActiveTab = onTabChange !== undefined ? onTabChange : setInternalActiveTab;

  if (tabs.length === 0) return null;

  return (
    <div className="overflow-hidden border border-zinc-800 bg-[#0d1117] font-mono shadow-2xl">
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
              className="relative px-4 py-3 font-mono text-sm font-medium transition-colors duration-200 focus:outline-none hover:text-zinc-200 cursor-pointer"
              style={{
                color: isActive ? theme.colors.lime : 'rgba(255,255,255,0.4)'
              }}
            >
              {tab.label || `Tab ${index + 1}`}

              {/* Sliding Layout Underline Animation */}
              {isActive && (
                <motion.div
                  layoutId={layoutId}
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ backgroundColor: theme.colors.lime }}
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
                className="overflow-x-auto text-sm leading-relaxed text-zinc-300"
              >
                <div className="sm:hidden">
                  <Highlight className="javascript ">
                    {tab.code || '// No content'}
                  </Highlight>
                </div>
                <div style={{ height: "500px" }} className="sm:block hidden">
                  <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    // defaultValue={tab.code || '// No content'}
                    value={tab.code || '// No content'}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      scrollbar: { vertical: 'hidden', horizontal: 'auto' },
                      lineNumbers: 'on',
                      fontSize: 16,
                      fontFamily: 'Fira Code, monospace',
                      wordWrap: 'on',
                      wrappingIndent: 'indent',
                      renderLineHighlight: 'all',
                      renderWhitespace: 'all',
                      automaticLayout: true,
                      formatOnType: true,
                      formatOnPaste: true,
                      automaticLayout: true,
                    }}
                    theme="vs-dark"
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
