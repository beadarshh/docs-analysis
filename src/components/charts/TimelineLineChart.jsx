import React, { forwardRef, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Dot
} from 'recharts';

export const TimelineLineChart = forwardRef(({ documents }, ref) => {
  const data = useMemo(() => {
    const years = [...new Set(documents.map(d => d.year))].sort();
    
    return years.map(year => {
      const unCount = documents
        .filter(d => d.year === year && d.type === "UN Speech")
        .reduce((sum, d) => {
          return sum + Object.values(d.keywordFrequencies).reduce((a, b) => a + b, 0);
        }, 0);
      
      const g20Count = documents
        .filter(d => d.year === year && d.type === "G20 Declaration")
        .reduce((sum, d) => {
          return sum + Object.values(d.keywordFrequencies).reduce((a, b) => a + b, 0);
        }, 0);

      return {
        year,
        "UN Speeches": unCount,
        "G20 Declarations": g20Count
      };
    });
  }, [documents]);

  return (
    <div ref={ref} className="w-full h-[400px] min-w-[600px] p-4 bg-white">
      <h3 className="text-lg font-bold mb-6 text-gray-800">Keyword Frequency Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="year" 
            stroke="#6B7280"
            fontSize={12}
          />
          <YAxis stroke="#6B7280" />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              fontSize: '12px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="UN Speeches" 
            stroke="#3B82F6" 
            strokeWidth={3}
            dot={{ r: 6, fill: '#3B82F6', strokeWidth: 2, stroke: '#FFFFFF' }}
            activeDot={{ r: 8 }}
          />
          <Line 
            type="monotone" 
            dataKey="G20 Declarations" 
            stroke="#22C55E" 
            strokeWidth={3}
            dot={{ r: 6, fill: '#22C55E', strokeWidth: 2, stroke: '#FFFFFF' }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

TimelineLineChart.displayName = 'TimelineLineChart';
