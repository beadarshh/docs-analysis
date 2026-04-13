import React, { useState, useMemo } from 'react';
import { Quote, Search, Filter, Calendar, FileText } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { KEYWORDS } from '../../utils/keywordAnalyzer';
import { motion } from 'framer-motion';

export const KeywordContextTab = () => {
  const { documents } = useAppContext();
  const [selectedKeyword, setSelectedKeyword] = useState(KEYWORDS[0]);
  const [filterType, setFilterType] = useState('All');
  const [filterYear, setFilterYear] = useState('All');

  const years = useMemo(() => [...new Set(documents.map(d => d.year))].sort(), [documents]);

  const results = useMemo(() => {
    const list = [];
    documents.forEach(doc => {
      if (filterType !== 'All' && doc.type !== filterType) return;
      if (filterYear !== 'All' && doc.year !== parseInt(filterYear)) return;

      const sentences = doc.keywordSentences[selectedKeyword] || [];
      sentences.forEach(sentence => {
        list.push({
          sentence,
          docName: doc.name,
          year: doc.year,
          type: doc.type
        });
      });
    });
    return list;
  }, [documents, selectedKeyword, filterType, filterYear]);

  // Highlighting logic
  const highlightKeyword = (text, keyword) => {
    const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <span key={i} className="bg-highlight font-bold px-1 rounded">{part}</span> : part
    );
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Selectors */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <Search size={16} className="text-accent" />
              Keyword Selection
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {KEYWORDS.map(kw => (
                <button
                  key={kw}
                  onClick={() => setSelectedKeyword(kw)}
                  className={`text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    selectedKeyword === kw 
                      ? 'bg-accent text-white shadow-md' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-gray-400" />
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-xs font-bold focus:outline-none"
                >
                  <option value="All">All Types</option>
                  <option value="UN Speech">UN Speeches</option>
                  <option value="G20 Declaration">G20 Declarations</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" />
                <select 
                  value={filterYear} 
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-xs font-bold focus:outline-none"
                >
                  <option value="All">All Years</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {results.length} Mentions Found
            </div>
          </div>

          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 scrollbar-hide">
            {results.length > 0 ? results.map((item, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={idx} 
                className="glass-card p-6 space-y-4 hover:shadow-2xl hover:scale-[1.01] transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                      item.type === "UN Speech" ? 'bg-un/10 text-un' : 'bg-g20/10 text-g20'
                    }`}>
                      {item.type}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 border border-gray-100 px-2 py-0.5 rounded italic">
                      {item.year}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 max-w-[200px] truncate">
                    <FileText size={12} />
                    {item.docName}
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Quote size={24} className="text-accent/20 flex-shrink-0" />
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {highlightKeyword(item.sentence, selectedKeyword)}
                  </p>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <Quote size={48} className="text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest">No mentions found for this criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
