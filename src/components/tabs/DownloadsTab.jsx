import React from 'react';
import { 
  FileSpreadsheet, 
  FileJson, 
  Archive, 
  FileImage
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { exportDocumentSummary, exportKeywordContext } from '../../utils/csvExporter';
import { bundleAsZip } from '../../utils/zipExporter';

export const DownloadsTab = () => {
  const { documents } = useAppContext();

  const downloadCategories = [
    {
      title: "Data Reports (CSV)",
      items: [
        {
          label: "Document Summary",
          description: "Matrix of documents, word counts, and keyword frequencies.",
          icon: <FileSpreadsheet className="text-green-600" />,
          action: () => exportDocumentSummary(documents)
        },
        {
          label: "Keyword in Context",
          description: "List of every sentence containing a keyword found in the documents.",
          icon: <FileJson className="text-blue-600" />,
          action: () => exportKeywordContext(documents)
        }
      ]
    },
    {
      title: "Document Exports",
      items: [
        {
          label: "TXT Archive (ZIP)",
          description: "All extracted plain text files bundled into a single ZIP archive.",
          icon: <Archive className="text-orange-600" />,
          action: () => bundleAsZip(documents)
        }
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {downloadCategories.map((category, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">
              {category.title}
            </h3>
            <div className="space-y-4">
              {category.items.map((item, iidx) => (
                <button
                  key={iidx}
                  onClick={item.action}
                  className="w-full glass-card p-6 flex items-start gap-4 text-left group hover:scale-[1.02] active:scale-[0.98] transition-all hover:shadow-2xl hover:border-accent/20"
                >
                  <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-white transition-colors">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-gray-900 group-hover:text-accent transition-colors">
                      {item.label}
                    </h4>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-8 bg-gradient-to-br from-indigo-50/50 to-white flex flex-col md:flex-row items-center gap-8 justify-between border-dashed border-2 border-indigo-100">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl font-black text-indigo-900">Visual Assets Export</h3>
          <p className="text-gray-600 text-sm max-w-lg">
            To export charts and word clouds as PNG images, please use the specific download buttons located directly within the <span className="font-bold text-indigo-700">Charts & Heatmap</span> and <span className="font-bold text-indigo-700">Word Clouds</span> tabs.
          </p>
        </div>
        <div className="flex -space-x-4">
          {[1,2,3].map(i => (
            <div key={i} className="w-12 h-12 bg-white rounded-full border-4 border-indigo-50 flex items-center justify-center text-indigo-300 shadow-sm">
              <FileImage size={24} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
