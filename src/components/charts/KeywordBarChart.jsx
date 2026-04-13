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
import { KEYWORDS } from '../../utils/keywordAnalyzer';

export const KeywordBarChart = forwardRef(({ documents, selectedYear }, ref) => {
  const data = useMemo(() => {
    let filteredDocs = [...documents];
    if (selectedYear !== 'All') {
      filteredDocs = filteredDocs.filter(d => d.year === parseInt(selectedYear));
    }

    return KEYWORDS.map(kw => {
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
  }, [documents, selectedYear]);

  return (
    <div ref={ref} className="w-full h-[600px] min-w-[600px] p-4 bg-white">
      <h3 className="text-lg font-bold mb-6 text-gray-800">Keyword Frequency by Document Type</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 40, bottom: 120 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="keyword" 
            angle={-45} 
            textAnchor="end" 
            interval={0} 
            fontSize={10}
            stroke="#6B7280"
            height={100}
            tick={{ dy: 10 }}
          />
          <YAxis stroke="#6B7280" fontSize={11} tick={{ dx: -5 }} />
          <Tooltip 
            cursor={{ fill: '#F3F4F6' }}
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              fontSize: '12px'
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="UN Speeches" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="G20 Declarations" fill="#22C55E" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

KeywordBarChart.displayName = 'KeywordBarChart';
