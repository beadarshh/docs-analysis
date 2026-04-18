import React, { useState, useMemo } from 'react';
import { Quote, Search, Filter, Calendar, FileText, Bookmark, Check, Hash, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { ALL_KEYWORDS, KEYWORD_GROUPS } from '../../utils/keywordGroups';
import { motion, AnimatePresence } from 'framer-motion';

export const KeywordContextTab = () => {
  const { documents } = useAppContext();
  const [selectedKeywords, setSelectedKeywords] = useState([ALL_KEYWORDS[0]]);
  const [filterType, setFilterType] = useState('All');
  const [filterYear, setFilterYear] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const years = useMemo(() => [...new Set(documents.map(d => d.year))].sort(), [documents]);

  const toggleKeyword = (kw) => {
    setSelectedKeywords(prev => 
      prev.includes(kw) 
        ? (prev.length > 1 ? prev.filter(k => k !== kw) : prev) 
        : [...prev, kw]
    );
  };

  const selectGroup = (groupName) => {
    const groupKeywords = KEYWORD_GROUPS[groupName];
    setSelectedKeywords(groupKeywords);
  };

  const filteredKeywords = useMemo(() => {
    return ALL_KEYWORDS.filter(kw => 
      kw.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const results = useMemo(() => {
    const list = [];
    documents.forEach(doc => {
      if (filterType !== 'All' && doc.type !== filterType) return;
      if (filterYear !== 'All' && doc.year !== parseInt(filterYear)) return;

      selectedKeywords.forEach(kw => {
        const sentences = doc.keywordSentences[kw] || [];
        sentences.forEach(sentence => {
          list.push({
            sentence,
            keyword: kw,
            docName: doc.name,
            year: doc.year,
            type: doc.type
          });
        });
      });
    });
    // Sort by year descending
    return list.sort((a, b) => b.year - a.year);
  }, [documents, selectedKeywords, filterType, filterYear]);

  // Highlighting logic with multiple keywords
  const highlightKeywords = (text, activeKeywords) => {
    if (!activeKeywords || activeKeywords.length === 0) return text;
    
    // Sort keywords by length descending to match longest phrases first
    const sortedKws = [...activeKeywords].sort((a, b) => b.length - a.length);
    const pattern = sortedKws.map(kw => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${pattern})`, 'gi');
    
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <span key={i} className="bg-accent/20 text-accent font-black px-1.5 py-0.5 rounded-md border border-accent/10">{part}</span> : part
    );
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 animate-slide-up pb-20">
      {/* Search Sidebar */}
      <div className="w-full xl:w-96 space-y-6">
        <div className="glass-card p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <Search size={16} className="text-accent" />
              Keyword Explorer
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
              <Search className="absolute left-3.5 top-3 text-gray-400" size={16} />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Theme Groups</h4>
            <div className="flex flex-wrap gap-2">
              {Object.keys(KEYWORD_GROUPS).map(group => (
                <button
                  key={group}
                  onClick={() => selectGroup(group)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors border border-indigo-100/50"
                >
                  <Bookmark size={10} />
                  {group}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex justify-between items-center">
              Available Terms
              <span className="text-accent/50">{filteredKeywords.length}</span>
            </h4>
            <div className="grid grid-cols-1 gap-1 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide border-t border-gray-50 pt-2">
              {filteredKeywords.map(kw => {
                const isSelected = selectedKeywords.includes(kw);
                return (
                  <button
                    key={kw}
                    onClick={() => toggleKeyword(kw)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-accent text-white shadow-lg shadow-accent/20'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Hash size={12} className={isSelected ? "text-white/50" : "text-gray-300"} />
                      {kw}
                    </div>
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Tags Display */}
        {selectedKeywords.length > 0 && (
          <div className="glass-card p-4 space-y-3 border-t-4 border-accent">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Active Cluster</h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedKeywords.map(kw => (
                <span 
                  key={kw} 
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-accent/10 text-accent text-[10px] font-black uppercase border border-accent/20"
                >
                  {kw}
                  <button onClick={() => toggleKeyword(kw)} className="hover:text-red-500">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-5">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-accent" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-transparent text-xs font-black uppercase tracking-widest focus:outline-none cursor-pointer py-1"
              >
                <option value="All">All Horizons</option>
                <option value="UN Speech">UN Speeches Only</option>
                <option value="G20 Declaration">G20 Declarations Only</option>
              </select>
            </div>
            <div className="flex items-center gap-2 border-l border-gray-100 pl-6">
              <Calendar size={14} className="text-accent" />
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="bg-transparent text-xs font-black uppercase tracking-widest focus:outline-none cursor-pointer py-1"
              >
                <option value="All">All Years</option>
                {years.map(y => <option key={y} value={y}>{y} Session</option>)}
              </select>
            </div>
          </div>
          <div className="px-4 py-1.5 bg-gray-900 rounded-full">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
              {results.length} EVIDENCE ITEMS
            </span>
          </div>
        </div>

        <div className="space-y-6 max-h-[1000px] overflow-y-auto pr-4 scrollbar-hide pb-10">
          <AnimatePresence mode="popLayout">
            {results.length > 0 ? results.map((item, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={`${item.docName}-${idx}`}
                className="glass-card p-8 space-y-6 group hover:border-accent hover:shadow-2xl transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 group-hover:bg-accent/10 transition-colors" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                      item.type === "UN Speech" ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                    }`}>
                      {item.type}
                    </div>
                    <div className="text-[10px] font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">
                      Session {item.year}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-accent transition-colors">
                    <FileText size={14} className="text-gray-300 group-hover:text-accent/50" />
                    {item.docName}
                  </div>
                </div>

                <div className="flex gap-6 items-start relative">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-accent/5 transition-colors">
                    <Quote size={20} className="text-accent/40 group-hover:text-accent transition-colors" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <p className="text-gray-800 leading-relaxed text-base font-medium">
                      {highlightKeywords(item.sentence, selectedKeywords)}
                    </p>
                    <div className="flex items-center gap-2">
                       <span className="w-8 h-px bg-gray-100" />
                       <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Found via Keyword: {item.keyword}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 bg-gray-50/50 rounded-[40px] border-4 border-dashed border-gray-100"
              >
                <Hash size={64} className="text-gray-100 mx-auto mb-6" />
                <h3 className="text-xl font-black text-gray-300 uppercase tracking-[0.2em]">Zero Evidence Points</h3>
                <p className="text-sm text-gray-400 mt-2 font-bold uppercase tracking-widest">Adjust filters or keyword selection to expand horizon</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
