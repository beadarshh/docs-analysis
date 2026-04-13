import React, { useRef, useState } from 'react';
import { Download, Filter } from 'lucide-react';
import { KeywordBarChart } from '../charts/KeywordBarChart';
import { TimelineLineChart } from '../charts/TimelineLineChart';
import { FrequencyHeatmap } from '../charts/FrequencyHeatmap';
import { useAppContext } from '../../context/AppContext';
import { downloadChartAsPng } from '../../utils/chartExporter';

export const ChartsTab = () => {
  const { documents } = useAppContext();
  const [selectedYear, setSelectedYear] = useState('All');
  
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const heatmapRef = useRef(null);

  const years = [...new Set(documents.map(d => d.year))].sort();

  return (
    <div className="space-y-12 animate-slide-up">
      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Filter by Year:</span>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm font-semibold focus:outline-none"
            >
              <option value="All">All Years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 italic">
          Charts are horizontally scrollable on mobile devices.
        </p>
      </div>

      {/* Chart Section 1: Bar Chart */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Keyword Distribution</h2>
          <button 
            onClick={() => downloadChartAsPng(barChartRef, 'keyword_distribution')}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-accent hover:bg-accent/10 rounded-lg transition-colors border border-accent/20"
          >
            <Download size={14} />
            Download PNG
          </button>
        </div>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <KeywordBarChart ref={barChartRef} documents={documents} selectedYear={selectedYear} />
          </div>
        </div>
      </section>

      {/* Chart Section 2: Timeline */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Timeline Analysis</h2>
          <button 
            onClick={() => downloadChartAsPng(lineChartRef, 'keyword_timeline')}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-accent hover:bg-accent/10 rounded-lg transition-colors border border-accent/20"
          >
            <Download size={14} />
            Download PNG
          </button>
        </div>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <TimelineLineChart ref={lineChartRef} documents={documents} />
          </div>
        </div>
      </section>

      {/* Chart Section 3: Heatmap */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Intensity Heatmap</h2>
          <button 
            onClick={() => downloadChartAsPng(heatmapRef, 'frequency_heatmap')}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-accent hover:bg-accent/10 rounded-lg transition-colors border border-accent/20"
          >
            <Download size={14} />
            Download PNG
          </button>
        </div>
        <FrequencyHeatmap ref={heatmapRef} documents={documents} />
      </section>
    </div>
  );
};
