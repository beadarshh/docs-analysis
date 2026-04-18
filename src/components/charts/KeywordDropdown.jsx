import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Hash, X } from 'lucide-react';
import { ALL_KEYWORDS, KEYWORD_GROUPS } from '../../utils/keywordGroups';

export const KeywordDropdown = ({ selectedKeywords, setSelectedKeywords }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleKeyword = (kw) => {
    setSelectedKeywords(prev => 
      prev.includes(kw) 
        ? prev.filter(k => k !== kw) 
        : [...prev, kw]
    );
  };

  const selectGroup = (groupName) => {
    const groupKeywords = KEYWORD_GROUPS[groupName];
    const allSelected = groupKeywords.every(kw => selectedKeywords.includes(kw));
    
    if (allSelected) {
      setSelectedKeywords(prev => prev.filter(kw => !groupKeywords.includes(kw)));
    } else {
      setSelectedKeywords(prev => [...new Set([...prev, ...groupKeywords])]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm hover:border-accent transition-all min-w-[240px]"
      >
        <span className="flex items-center gap-2 text-gray-700">
          <Hash size={14} className="text-accent" />
          {selectedKeywords.length === 0 
            ? "Select Keywords (All by default)" 
            : `${selectedKeywords.length} Keywords Selected`}
        </span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full min-w-[300px] bg-white border border-gray-100 rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-50">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Keyword Selection</span>
            <button 
              onClick={() => setSelectedKeywords([])}
              className="text-[10px] font-black text-accent hover:text-accent/80 uppercase tracking-widest"
            >
              Clear All
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-hide space-y-6">
            {Object.entries(KEYWORD_GROUPS).map(([group, keywords]) => (
              <div key={group} className="space-y-2">
                <button 
                  onClick={() => selectGroup(group)}
                  className="flex items-center gap-2 text-[10px] font-black text-gray-500 hover:text-accent uppercase tracking-wider transition-colors"
                >
                  <Check size={10} className={keywords.every(kw => selectedKeywords.includes(kw)) ? "text-accent" : "text-transparent"} />
                  {group}
                </button>
                <div className="grid grid-cols-1 gap-1">
                  {keywords.map(kw => (
                    <label 
                      key={kw}
                      className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox"
                          checked={selectedKeywords.includes(kw)}
                          onChange={() => toggleKeyword(kw)}
                          className="peer appearance-none w-4 h-4 border-2 border-gray-200 rounded-md checked:bg-accent checked:border-accent transition-all cursor-pointer"
                        />
                        <Check size={10} className="absolute left-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                      <span className={`text-[11px] font-bold ${selectedKeywords.includes(kw) ? 'text-gray-900' : 'text-gray-500'}`}>
                        {kw}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
