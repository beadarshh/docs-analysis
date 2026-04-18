import React, { forwardRef, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ALL_KEYWORDS } from '../../utils/keywordGroups';

export const KeywordBarChart = forwardRef(({ documents, selectedYear, selectedKeywords = [], yAxisInterval = 100 }, ref) => {
  const data = useMemo(() => {
    let filteredDocs = [...documents];
    if (selectedYear !== 'All') {
      filteredDocs = filteredDocs.filter(d => d.year === parseInt(selectedYear));
    }

    const keywordsToUse = selectedKeywords.length > 0 ? selectedKeywords : ALL_KEYWORDS.slice(0, 15);

    return keywordsToUse.map(kw => {
      const unCount = filteredDocs
        .filter(d => d.type === "UN Speech")
        .reduce((sum, d) => sum + (d.keywordFrequencies[kw] || 0), 0);
      
      const g20Count = filteredDocs
        .filter(d => d.type === "G20 Declaration")
        .reduce((sum, d) => sum + (d.keywordFrequencies[kw] || 0), 0);

      return {
        keyword: kw,
        "UN Speeches": unCount,
        "G20 Declarations": g20Count
      };
    });
  }, [documents, selectedYear, selectedKeywords]);

  // Calculate ticks based on interval
  const yAxisTicks = useMemo(() => {
    const maxVal = Math.max(...data.flatMap(d => [d["UN Speeches"], d["G20 Declarations"]]), 10);
    const interval = parseInt(yAxisInterval) || 100;
    const ticks = [];
    for (let i = 0; i <= maxVal + interval; i += interval) {
      ticks.push(i);
    }
    return ticks;
  }, [data, yAxisInterval]);

  return (
    <div ref={ref} className="w-full h-[600px] min-w-[600px] p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="mb-6">
        <h3 className="text-xl font-black text-gray-900 tracking-tight">Keyword Frequency Comparison</h3>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">UN Speeches vs G20 Declarations</p>
      </div>
      
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          <XAxis 
            dataKey="keyword" 
            angle={-45} 
            textAnchor="end" 
            interval={0} 
            fontSize={11}
            fontWeight={600}
            stroke="#9CA3AF"
            height={100}
            tick={{ dy: 10 }}
          />
          <YAxis 
            stroke="#9CA3AF" 
            fontSize={11} 
            fontWeight={600} 
            tick={{ dx: -5 }} 
            ticks={yAxisTicks}
            domain={[0, 'auto']}
          />
          <Tooltip 
            cursor={{ fill: '#F9FAFB' }}
            contentStyle={{ 
              borderRadius: '16px', 
              border: 'none', 
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              fontSize: '12px',
              padding: '12px'
            }}
          />
          <Legend 
            verticalAlign="top" 
            align="right" 
            wrapperStyle={{ paddingBottom: '30px' }}
            iconType="circle"
          />
          <Bar dataKey="UN Speeches" fill="#818CF8" radius={[6, 6, 0, 0]} barSize={20} />
          <Bar dataKey="G20 Declarations" fill="#34D399" radius={[6, 6, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

KeywordBarChart.displayName = 'KeywordBarChart';
