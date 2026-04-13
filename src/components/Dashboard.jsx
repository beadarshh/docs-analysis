import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Quote, 
  Download, 
  RotateCcw,
  Cloud
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { OverviewTab } from './tabs/OverviewTab';
import { ChartsTab } from './tabs/ChartsTab';
import { KeywordContextTab } from './tabs/KeywordContextTab';
import { DownloadsTab } from './tabs/DownloadsTab';
import { WordCloudPanel } from './WordCloudPanel';
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
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'charts': return <ChartsTab />;
      case 'context': return <KeywordContextTab />;
      case 'wordcloud': return <WordCloudPanel />;
      case 'downloads': return <DownloadsTab />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Premium Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white shadow-lg shadow-accent/20">
                <BarChart3 size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight leading-none">DKA Analyzer</h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Dissertation Tool</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={resetState}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors bg-gray-100 hover:bg-red-50 rounded-lg"
              >
                <RotateCcw size={16} />
                <span className="hidden sm:inline">Start Over</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
