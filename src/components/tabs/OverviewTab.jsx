import React, { useState, useMemo } from 'react';
import { 
  Files, 
  Hash, 
  TrendingUp, 
  Target, 
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { KEYWORDS } from '../../utils/keywordAnalyzer';

export const OverviewTab = () => {
  const { documents } = useAppContext();
  const [filterType, setFilterType] = useState('All');
  const [sortKey, setSortKey] = useState('year');
  const [sortOrder, setSortOrder] = useState('desc');

  const stats = useMemo(() => {
    let totalMentions = 0;
    const kwTotals = {};
    KEYWORDS.forEach(kw => kwTotals[kw] = 0);

    documents.forEach(doc => {
      KEYWORDS.forEach(kw => {
        const count = doc.keywordFrequencies[kw] || 0;
        totalMentions += count;
        kwTotals[kw] += count;
      });
    });

    const years = documents.map(d => d.year).filter(y => y);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    
    const mostFreqKw = Object.entries(kwTotals).sort((a, b) => b[1] - a[1])[0];

    return {
      totalDocs: documents.length,
      yearRange: documents.length > 0 ? `${minYear} - ${maxYear}` : 'N/A',
      totalMentions,
      topKeyword: mostFreqKw ? mostFreqKw[0] : 'N/A'
    };
  }, [documents]);

  const filteredDocs = useMemo(() => {
    let docs = [...documents];
    if (filterType !== 'All') {
      docs = docs.filter(d => d.type === filterType);
    }
    
    docs.sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    return docs;
  }, [documents, filterType, sortKey, sortOrder]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Files className="text-blue-500" />} 
          label="Total Documents" 
          value={stats.totalDocs} 
          sub="Analyzed PDFs" 
        />
        <StatCard 
          icon={<Hash className="text-green-500" />} 
          label="Year Range" 
          value={stats.yearRange} 
          sub="Temporal Scope" 
        />
        <StatCard 
          icon={<TrendingUp className="text-purple-500" />} 
          label="Total Mentions" 
          value={stats.totalMentions} 
          sub="Across all keywords" 
        />
        <StatCard 
          icon={<Target className="text-red-500" />} 
          label="Top Keyword" 
          value={stats.topKeyword} 
          sub="Most frequent topic" 
        />
      </div>

      {/* Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-gray-900">Document Summary</h3>
          
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent/20"
            >
              <option value="All">All Types</option>
              <option value="UN Speech">UN Speeches</option>
              <option value="G20 Declaration">G20 Declarations</option>
            </select>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <Th label="Year" sortKey="year" current={sortKey} onClick={handleSort} />
                  <Th label="Document Name" sortKey="name" current={sortKey} onClick={handleSort} />
                  <Th label="Type" sortKey="type" current={sortKey} onClick={handleSort} />
                  <Th label="Word Count" sortKey="wordCount" current={sortKey} onClick={handleSort} />
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Top Keywords</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredDocs.map((doc, idx) => {
                  const sortedKws = Object.entries(doc.keywordFrequencies)
                    .sort((a, b) => b[1] - a[1])
                    .filter(kw => kw[1] > 0)
                    .slice(0, 3);

                  return (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">{doc.year}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-700 max-w-[250px] truncate" title={doc.name}>
                          {doc.name}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          doc.type === "UN Speech" ? 'bg-un/10 text-un' : 'bg-g20/10 text-g20'
                        }`}>
                          {doc.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{doc.wordCount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {sortedKws.length > 0 ? sortedKws.map(([kw, count], kidx) => (
                            <span key={kidx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-[10px] font-bold">
                              {kw} ({count})
                            </span>
                          )) : <span className="text-gray-400 text-[10px]">No mentions</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub }) => (
  <div className="glass-card p-6 flex items-start justify-between">
    <div className="space-y-2">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <h4 className="text-2xl font-black text-gray-900">{value}</h4>
      <p className="text-[10px] text-gray-500">{sub}</p>
    </div>
    <div className="p-3 bg-gray-50 rounded-xl">
      {icon}
    </div>
  </div>
);

const Th = ({ label, sortKey, current, onClick }) => (
  <th 
    className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-accent transition-colors"
    onClick={() => onClick(sortKey)}
  >
    <div className="flex items-center gap-2">
      {label}
      <ArrowUpDown size={12} className={current === sortKey ? 'text-accent' : 'text-gray-300'} />
    </div>
  </th>
);
