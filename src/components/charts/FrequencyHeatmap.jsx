import React, { forwardRef, useMemo } from 'react';
import { ALL_KEYWORDS } from '../../utils/keywordGroups';

export const FrequencyHeatmap = forwardRef(({ documents }, ref) => {
  const years = useMemo(() => [...new Set(documents.map(d => d.year))].sort(), [documents]);

  const heatmapData = useMemo(() => {
    const data = {};
    ALL_KEYWORDS.forEach(kw => {
      data[kw] = {};
      years.forEach(year => {
        data[kw][year] = documents
          .filter(d => d.year === year)
          .reduce((sum, d) => sum + (d.keywordFrequencies[kw] || 0), 0);
      });
    });
    return data;
  }, [documents, years]);

  const maxFreq = useMemo(() => {
    let max = 0;
    Object.values(heatmapData).forEach(yearData => {
      Object.values(yearData).forEach(val => {
        if (val > max) max = val;
      });
    });
    return max || 1;
  }, [heatmapData]);

  // Color intensity logic: white (#FFFFFF) to dark blue (#1E3A8A)
  const getBackgroundColor = (value) => {
    if (value === 0) return '#FFFFFF';
    const intensity = value / maxFreq;
    // Simple interpolation for blue scale
    // From white (255, 255, 255) to dark blue (30, 58, 138)
    const r = Math.round(255 - (255 - 30) * intensity);
    const g = Math.round(255 - (255 - 58) * intensity);
    const b = Math.round(255 - (255 - 138) * intensity);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const getTextColor = (value) => {
    return (value / maxFreq) > 0.5 ? '#FFFFFF' : '#1F2937';
  };

  return (
    <div ref={ref} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <h3 className="text-lg font-bold mb-6 text-gray-800">Frequency Intensity Heatmap</h3>
      
      <div className="overflow-x-auto scrollbar-hide pb-4">
        <div 
          className="grid gap-1"
          style={{ 
            gridTemplateColumns: `minmax(250px, 1fr) repeat(${years.length}, 50px)`,
            minWidth: `${250 + years.length * 50}px`
          }}
        >
          {/* Header Row */}
          <div className="h-10 bg-gray-50 flex items-center px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-100 rounded-tl-lg">
            Keyword
          </div>
          {years.map(year => (
            <div key={year} className="h-10 bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400 border border-gray-100 first:rounded-none last:rounded-tr-lg">
              {year}
            </div>
          ))}

          {/* Data Rows */}
          {ALL_KEYWORDS.map(kw => (
            <React.Fragment key={kw}>
              <div className="h-10 px-4 flex items-center text-[11px] font-semibold text-gray-700 bg-white border border-gray-100 truncate" title={kw}>
                {kw}
              </div>
              {years.map(year => {
                const value = heatmapData[kw][year];
                return (
                  <div 
                    key={`${kw}-${year}`}
                    className="h-10 flex items-center justify-center text-[10px] font-bold border border-gray-50 transition-all hover:scale-110 hover:z-10"
                    style={{ 
                      backgroundColor: getBackgroundColor(value),
                      color: getTextColor(value)
                    }}
                    title={`${kw} in ${year}: ${value}`}
                  >
                    {value > 0 ? value : '-'}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
        <span>Intensity Scale:</span>
        <div className="flex items-center gap-1">
          <span>Min (0)</span>
          <div className="flex h-3 w-32 rounded-full overflow-hidden border border-gray-100">
             <div className="w-full h-full bg-gradient-to-r from-white to-[#1E3A8A]"></div>
          </div>
          <span>Max ({maxFreq})</span>
        </div>
      </div>
    </div>
  );
});

FrequencyHeatmap.displayName = 'FrequencyHeatmap';
