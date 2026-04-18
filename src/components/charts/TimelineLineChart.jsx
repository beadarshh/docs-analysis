import React, { forwardRef, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';

export const TimelineLineChart = forwardRef(({ documents, selectedKeywords = [], yAxisInterval = 100 }, ref) => {
  const data = useMemo(() => {
    const years = [...new Set(documents.map(d => d.year))].sort();
    
    return years.map(year => {
      const getAggregatedCount = (type) => {
        return documents
          .filter(d => d.year === year && d.type === type)
          .reduce((sum, d) => {
            const freqs = d.keywordFrequencies;
            if (selectedKeywords.length > 0) {
              return sum + selectedKeywords.reduce((a, kw) => a + (freqs[kw] || 0), 0);
            }
            return sum + Object.values(freqs).reduce((a, b) => a + b, 0);
          }, 0);
      };

      return {
        year,
        "UN Speeches": getAggregatedCount("UN Speech"),
        "G20 Declarations": getAggregatedCount("G20 Declaration")
      };
    });
  }, [documents, selectedKeywords]);

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
    <div ref={ref} className="w-full h-[500px] min-w-[600px] p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="mb-6">
        <h3 className="text-xl font-black text-gray-900 tracking-tight">Keyword Trajectory Analysis</h3>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Temporal Trends across Forums</p>
      </div>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          <XAxis 
            dataKey="year" 
            stroke="#9CA3AF"
            fontSize={12}
            fontWeight={600}
            angle={-45}
            textAnchor="end"
            height={60}
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
          <Line 
            type="monotone" 
            dataKey="UN Speeches" 
            stroke="#818CF8" 
            strokeWidth={4} 
            dot={{ r: 4, fill: '#818CF8', strokeWidth: 0 }}
            activeDot={{ r: 8, strokeWidth: 0 }}
          />
          <Line 
            type="monotone" 
            dataKey="G20 Declarations" 
            stroke="#34D399" 
            strokeWidth={4}
            dot={{ r: 4, fill: '#34D399', strokeWidth: 0 }}
            activeDot={{ r: 8, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

TimelineLineChart.displayName = 'TimelineLineChart';
