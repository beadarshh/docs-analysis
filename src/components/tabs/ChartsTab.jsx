import React, { useRef, useState, useMemo } from 'react';
import { Download, Filter, FileBarChart, FileText, LayoutDashboard, Settings2 } from 'lucide-react';
import { KeywordBarChart } from '../charts/KeywordBarChart';
import { TimelineLineChart } from '../charts/TimelineLineChart';
import { FrequencyHeatmap } from '../charts/FrequencyHeatmap';
import { KeywordSelector } from '../charts/KeywordSelector';
import { KeywordDropdown } from '../charts/KeywordDropdown';
import { useAppContext } from '../../context/AppContext';
import { downloadChartAsPng, downloadChartAsPdf, downloadDataAsCsv } from '../../utils/chartExporter';
import { ALL_KEYWORDS } from '../../utils/keywordGroups';

export const ChartsTab = () => {
  const { documents } = useAppContext();
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [yAxisInterval, setYAxisInterval] = useState(100);
  
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const heatmapRef = useRef(null);

  const years = [...new Set(documents.map(d => d.year))].sort();

  // Data helpers for CSV export
  const prepareBarChartData = useMemo(() => {
    let filteredDocs = [...documents];
    if (selectedYear !== 'All') {
      filteredDocs = filteredDocs.filter(d => d.year === parseInt(selectedYear));
    }
    const keywordsToUse = selectedKeywords.length > 0 ? selectedKeywords : ALL_KEYWORDS.slice(0, 15);
    return keywordsToUse.map(kw => ({
      keyword: kw,
      UN_Speeches: filteredDocs.filter(d => d.type === "UN Speech").reduce((s, d) => s + (d.keywordFrequencies[kw] || 0), 0),
      G20_Declarations: filteredDocs.filter(d => d.type === "G20 Declaration").reduce((s, d) => s + (d.keywordFrequencies[kw] || 0), 0)
    }));
  }, [documents, selectedYear, selectedKeywords]);

  const prepareTimelineData = useMemo(() => {
    const yearsList = [...new Set(documents.map(d => d.year))].sort();
    return yearsList.map(year => {
      const getCount = (type) => documents
        .filter(d => d.year === year && d.type === type)
        .reduce((sum, d) => {
          const freqs = d.keywordFrequencies;
          if (selectedKeywords.length > 0) {
            return sum + selectedKeywords.reduce((a, kw) => a + (freqs[kw] || 0), 0);
          }
          return sum + Object.values(freqs).reduce((a, b) => a + b, 0);
        }, 0);
      return { year, UN_Speeches: getCount("UN Speech"), G20_Declarations: getCount("G20 Declaration") };
    });
  }, [documents, selectedKeywords]);

  const exportActions = (ref, filename, data) => [
    { label: 'PNG', icon: <LayoutDashboard size={14} />, action: () => downloadChartAsPng(ref, filename) },
    { label: 'PDF', icon: <FileText size={14} />, action: () => downloadChartAsPdf(ref, filename) },
    { label: 'CSV', icon: <FileBarChart size={14} />, action: () => downloadDataAsCsv(data, filename) },
  ];

  const intervals = [50, 100, 150, 200, 500];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 animate-slide-up pb-20">
      {/* Sidebar Filters */}
      <div className="xl:col-span-1 space-y-6">
        <div className="glass-card p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-accent" />
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Time Scope</h3>
            </div>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all cursor-pointer"
            >
              <option value="All">All Horizons (2000-2024)</option>
              {years.map(y => <option key={y} value={y}>{y} Session</option>)}
            </select>
          </div>

          <div className="space-y-4 border-t border-gray-50 pt-6">
            <div className="flex items-center gap-2">
              <Settings2 size={16} className="text-accent" />
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Scale Config</h3>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Y-Axis Step Gap</label>
              <div className="grid grid-cols-3 gap-2">
                {intervals.map(val => (
                  <button
                    key={val}
                    onClick={() => setYAxisInterval(val)}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-black transition-all border ${
                      yAxisInterval === val 
                        ? 'bg-accent border-accent text-white shadow-md' 
                        : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <KeywordSelector 
          selectedKeywords={selectedKeywords} 
          setSelectedKeywords={setSelectedKeywords} 
        />
      </div>

      {/* Main Charts Area */}
      <div className="xl:col-span-3 space-y-12">
        {/* Global Toolbar */}
        <div className="glass-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <KeywordDropdown selectedKeywords={selectedKeywords} setSelectedKeywords={setSelectedKeywords} />
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hidden md:block">
             Select keywords above to isolate specific trends
          </p>
        </div>

        {/* Chart Section 1: Bar Chart */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Frequency Breakdown</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Cross-Forum Keyword Saturation</p>
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-gray-100 shadow-sm">
              {exportActions(barChartRef, 'keyword_distribution', prepareBarChartData).map(btn => (
                <button 
                  key={btn.label}
                  onClick={btn.action}
                  className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-accent hover:bg-accent/5 rounded-lg transition-all"
                >
                  {btn.icon}
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <KeywordBarChart 
              ref={barChartRef} 
              documents={documents} 
              selectedYear={selectedYear} 
              selectedKeywords={selectedKeywords} 
              yAxisInterval={yAxisInterval}
            />
          </div>
        </section>

        {/* Chart Section 2: Timeline */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Theme Trajectory</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Evolution of Discourse over Decades</p>
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-gray-100 shadow-sm">
              {exportActions(lineChartRef, 'keyword_timeline', prepareTimelineData).map(btn => (
                <button 
                  key={btn.label}
                  onClick={btn.action}
                  className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-accent hover:bg-accent/5 rounded-lg transition-all"
                >
                  {btn.icon}
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <TimelineLineChart 
              ref={lineChartRef} 
              documents={documents} 
              selectedKeywords={selectedKeywords} 
              yAxisInterval={yAxisInterval}
            />
          </div>
        </section>

        {/* Chart Section 3: Heatmap */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Intensity Map</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Heat zones of diplomatic focus</p>
            </div>
          </div>
          <FrequencyHeatmap ref={heatmapRef} documents={documents} />
        </section>
      </div>
    </div>
  );
};
