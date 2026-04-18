import React from 'react';
import { KEYWORD_GROUPS } from '../../utils/keywordGroups';
import { Check, Hash, Bookmark } from 'lucide-react';

export const KeywordSelector = ({ selectedKeywords, setSelectedKeywords }) => {
  const toggleKeyword = (kw) => {
    setSelectedKeywords(prev => 
      prev.includes(kw) 
        ? prev.filter(k => k !== kw) 
        : [...prev, kw]
    );
  };

  const selectGroup = (groupName) => {
    const groupKeywords = KEYWORD_GROUPS[groupName];
    // If all group keywords are already selected, deselect them
    const allSelected = groupKeywords.every(kw => selectedKeywords.includes(kw));
    
    if (allSelected) {
      setSelectedKeywords(prev => prev.filter(kw => !groupKeywords.includes(kw)));
    } else {
      setSelectedKeywords(prev => [...new Set([...prev, ...groupKeywords])]);
    }
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Global Analysis Filter</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">Focus your charts on specific themes</p>
        </div>
        <button 
          onClick={() => setSelectedKeywords([])}
          className="text-[10px] font-black text-accent hover:text-accent/80 uppercase tracking-widest"
        >
          Clear Selection
        </button>
      </div>

      <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
        {Object.entries(KEYWORD_GROUPS).map(([group, keywords]) => (
          <div key={group} className="space-y-3">
            <button 
              onClick={() => selectGroup(group)}
              className="flex items-center gap-2 text-[11px] font-black text-gray-500 hover:text-accent uppercase tracking-wider transition-colors"
            >
              <Bookmark size={12} className={Object.values(keywords).every(kw => selectedKeywords.includes(kw)) ? "text-accent fill-accent" : ""} />
              {group}
            </button>
            <div className="flex flex-wrap gap-2">
              {keywords.map(kw => {
                const isSelected = selectedKeywords.includes(kw);
                return (
                  <button
                    key={kw}
                    onClick={() => toggleKeyword(kw)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      isSelected 
                        ? 'bg-accent border-accent text-white shadow-lg shadow-accent/30 scale-105' 
                        : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Hash size={10} className={isSelected ? 'text-white/70' : 'text-gray-300'} />
                    {kw}
                    {isSelected && <Check size={10} />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {selectedKeywords.length > 0 && (
        <div className="pt-4 border-t border-gray-100 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {selectedKeywords.length} Keywords Active
          </span>
        </div>
      )}
    </div>
  );
};
