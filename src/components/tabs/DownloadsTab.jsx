import React from 'react';
import { 
  FileSpreadsheet, 
  FileJson, 
  Archive, 
  FileImage,
  FileText,
  FileCode
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { exportDocumentSummary, exportKeywordContext } from '../../utils/csvExporter';
import { bundleAsZip } from '../../utils/zipExporter';
import { generateFullPdfReport } from '../../utils/pdfExporter';

export const DownloadsTab = () => {
  const { documents } = useAppContext();

  const downloadCategories = [
    {
      title: "Executive Reports",
      items: [
        {
          label: "Full Analysis Report (PDF)",
          description: "A comprehensive document containing the project summary, document inventory, and thematic analysis.",
          icon: <FileText className="text-red-600" />,
          action: () => generateFullPdfReport(documents)
        }
      ]
    },
    {
      title: "Data Collections (CSV)",
      items: [
        {
          label: "Document Frequency Matrix",
          description: "Detailed matrix of every keyword frequency mapped across your document collection.",
          icon: <FileSpreadsheet className="text-green-600" />,
          action: () => exportDocumentSummary(documents)
        },
        {
          label: "Keyword Context Ledger",
          description: "Full export of every sentence where keywords appear, includes document metadata.",
          icon: <FileCode className="text-blue-600" />,
          action: () => exportKeywordContext(documents)
        }
      ]
    },
    {
      title: "Raw Data Archives",
      items: [
        {
          label: "Clean Text Bundle (ZIP)",
          description: "All extracted plain text files from your uploads, formatted for secondary analysis.",
          icon: <Archive className="text-orange-600" />,
          action: () => bundleAsZip(documents)
        }
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-slide-up pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {downloadCategories.map((category, idx) => (
          <div key={idx} className="space-y-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2 border-l-2 border-gray-100">
              {category.title}
            </h3>
            <div className="space-y-4">
              {category.items.map((item, iidx) => (
                <button
                  key={iidx}
                  onClick={item.action}
                  className="w-full glass-card p-6 flex flex-col items-start gap-4 text-left group hover:shadow-2xl hover:border-accent/30 transition-all hover:-translate-y-1"
                >
                  <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-white transition-colors shadow-sm">
                    {item.icon}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-black text-gray-900 group-hover:text-accent transition-colors uppercase tracking-tight text-sm">
                      {item.label}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-10 bg-gradient-to-br from-gray-900 to-slate-800 flex flex-col md:flex-row items-center gap-8 justify-between border-none overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="space-y-3 text-center md:text-left relative">
          <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Visual Assets Export</h3>
          <p className="text-gray-400 text-sm max-w-xl font-medium">
            High-resolution charts and word clouds can be exported individually within their respective tabs to ensure layout integrity and specific keyword focus.
          </p>
        </div>
        <div className="flex -space-x-4 relative">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-14 h-14 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center text-accent shadow-xl transform hover:rotate-12 transition-transform cursor-default">
              <FileImage size={24} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
