import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Quote, 
  Download, 
  RotateCcw,
  Cloud,
  MessageSquare
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { OverviewTab } from './tabs/OverviewTab';
import { ChartsTab } from './tabs/ChartsTab';
import { KeywordContextTab } from './tabs/KeywordContextTab';
import { DownloadsTab } from './tabs/DownloadsTab';
import { WordCloudPanel } from './WordCloudPanel';
import { AITab } from './tabs/AITab';
import { motion, AnimatePresence } from 'framer-motion';

export const Dashboard = () => {
  const { resetState } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'charts', label: 'Charts & Heatmap', icon: BarChart3 },
    { id: 'context', label: 'Keyword Context', icon: Quote },
    { id: 'wordcloud', label: 'Word Clouds', icon: Cloud },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'ai', label: 'AI Analyst', icon: MessageSquare },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'charts': return <ChartsTab />;
      case 'context': return <KeywordContextTab />;
      case 'wordcloud': return <WordCloudPanel />;
      case 'downloads': return <DownloadsTab />;
      case 'ai': return <AITab />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center text-white shadow-lg shadow-accent/20">
                <BarChart3 size={16} />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 tracking-tight leading-none">DKA Analyzer</h2>
                <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-0.5">Dissertation Tool</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={resetState}
                className="flex items-center gap-2 px-2.5 py-1 text-xs font-bold text-gray-600 hover:text-red-600 transition-colors bg-gray-100 hover:bg-red-50 rounded-lg"
              >
                <RotateCcw size={14} />
                <span className="hidden sm:inline">Start Over</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'bg-accent text-white shadow-md shadow-accent/20' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 md:px-12 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
