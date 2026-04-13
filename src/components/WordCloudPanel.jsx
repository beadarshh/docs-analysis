import React, { useMemo, useRef } from 'react';
import ReactWordcloud from 'react-wordcloud';
import { Download, Cloud } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getFilteredWordCount } from '../utils/keywordAnalyzer';
import { downloadChartAsPng } from '../utils/chartExporter';

export const WordCloudPanel = () => {
  const { documents } = useAppContext();
  const unCloudRef = useRef(null);
  const g20CloudRef = useRef(null);

  const unWords = useMemo(() => {
    const allUnText = documents
      .filter(d => d.type === "UN Speech")
      .map(d => d.plainText)
      .join(" ");
    return getFilteredWordCount(allUnText);
  }, [documents]);

  const g20Words = useMemo(() => {
    const allG20Text = documents
      .filter(d => d.type === "G20 Declaration")
      .map(d => d.plainText)
      .join(" ");
    return getFilteredWordCount(allG20Text);
  }, [documents]);

  const options = {
    colors: ["#3B82F6", "#2563EB", "#1D4ED8", "#1E40AF", "#1E3A8A", "#6366F1"],
    enableTooltip: true,
    fontFamily: "Inter, sans-serif",
    fontSizes: [12, 60],
    fontStyle: "normal",
    fontWeight: "bold",
    padding: 1,
    rotations: 3,
    rotationAngles: [0, 90],
    scale: "sqrt",
    spiral: "archimedean",
    transitionDuration: 1000
  };

  const g20Options = {
    ...options,
    colors: ["#22C55E", "#16A34A", "#15803D", "#166534", "#14532D", "#6366F1"]
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* UN Word Cloud */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-un/10 text-un rounded-lg">
                <Cloud size={20} />
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">UN Speeches Vocabulary</h2>
            </div>
            <button 
              onClick={() => downloadChartAsPng(unCloudRef, 'un_wordcloud')}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-un hover:bg-un/10 rounded-lg transition-colors border border-un/20"
            >
              <Download size={14} />
              Download PNG
            </button>
          </div>
          <div ref={unCloudRef} className="glass-card p-6 h-[500px] w-full bg-white">
            <ReactWordcloud words={unWords} options={options} />
          </div>
        </section>

        {/* G20 Word Cloud */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-g20/10 text-g20 rounded-lg">
                <Cloud size={20} />
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">G20 Declarations Vocabulary</h2>
            </div>
            <button 
              onClick={() => downloadChartAsPng(g20CloudRef, 'g20_wordcloud')}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-g20 hover:bg-g20/10 rounded-lg transition-colors border border-g20/20"
            >
              <Download size={14} />
              Download PNG
            </button>
          </div>
          <div ref={g20CloudRef} className="glass-card p-6 h-[500px] w-full bg-white">
            <ReactWordcloud words={g20Words} options={g20Options} />
          </div>
        </section>
      </div>
    </div>
  );
};

