import React from 'react';
import { X, Calendar, FileText, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const FilePill = ({ file }) => {
  const { updateFileMetadata, removeFile } = useAppContext();
  const isInvalid = !file.year || file.type === "Other";

  return (
    <div className={`flex flex-col p-4 rounded-xl border transition-all ${
      isInvalid ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-white'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={`p-2 rounded-lg ${
            file.type === "UN Speech" ? 'bg-un/10 text-un' : 
            file.type === "G20 Declaration" ? 'bg-g20/10 text-g20' : 
            'bg-gray-100 text-gray-500'
          }`}>
            <FileText size={20} />
          </div>
          <p className="text-sm font-semibold truncate max-w-[200px]" title={file.file.name}>
            {file.file.name}
          </p>
        </div>
        <button 
          onClick={() => removeFile(file.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Year Selector */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
          <Calendar size={14} className="text-gray-400" />
          <input 
            type="number" 
            value={file.year || ''} 
            onChange={(e) => updateFileMetadata(file.id, { year: parseInt(e.target.value) })}
            placeholder="Year"
            className="text-xs font-medium w-12 bg-transparent focus:outline-none"
          />
        </div>

        {/* Type Selector */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-sm transition-colors ${
          file.type === "UN Speech" ? 'bg-un/5 border-un/20 text-un' : 
          file.type === "G20 Declaration" ? 'bg-g20/5 border-g20/20 text-g20' : 
          'bg-white border-gray-200 text-gray-600'
        }`}>
          <select 
            value={file.type} 
            onChange={(e) => updateFileMetadata(file.id, { type: e.target.value })}
            className="text-xs font-medium bg-transparent focus:outline-none appearance-none cursor-pointer"
          >
            <option value="Other">Select Type</option>
            <option value="UN Speech">UN Speech</option>
            <option value="G20 Declaration">G20 Declaration</option>
          </select>
        </div>
      </div>

      {isInvalid && (
        <div className="mt-3 flex items-center gap-2 text-red-600">
          <AlertCircle size={14} />
          <span className="text-[10px] uppercase font-bold tracking-wider">Detection Failed - Please specify manualy</span>
        </div>
      )}
    </div>
  );
};
