import React, { useCallback, useState } from 'react';
import { Upload, FilePlus, ChevronRight, Loader2, Info } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { parseFilename } from '../utils/filenameParser';
import { extractTextFromPDF } from '../utils/pdfExtractor';
import { analyzeDocument } from '../utils/keywordAnalyzer';
import { FilePill } from './FilePill';
import { motion, AnimatePresence } from 'framer-motion';

export const UploadZone = () => {
  const {
    files, setFiles,
    setDocuments,
    isProcessing, setIsProcessing,
    processingStatus, setProcessingStatus
  } = useAppContext();

  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (incomingFiles) => {
    const pdfs = Array.from(incomingFiles).filter(f => f.type === "application/pdf");
    const newFiles = pdfs.map(f => {
      const parsed = parseFilename(f.name);
      return {
        id: Math.random().toString(36).substr(2, 9),
        file: f,
        year: parsed.year,
        type: parsed.type,
      };
    });
    setFiles(prev => [...prev, ...newFiles]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleAnalyze = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    const results = [];

    for (let i = 0; i < files.length; i++) {
      const fileData = files[i];
      setProcessingStatus({
        filename: fileData.file.name,
        progress: 0,
        current: i + 1,
        total: files.length
      });

      try {
        const text = await extractTextFromPDF(fileData.file, (progress) => {
          setProcessingStatus(prev => ({ ...prev, progress }));
        });

        const analysis = analyzeDocument(text, fileData.file.name, {
          year: fileData.year,
          type: fileData.type
        });

        results.push(analysis);
      } catch (error) {
        console.error(`Error processing ${fileData.file.name}:`, error);
      }
    }

    setDocuments(results);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8">
      {/* Header section with branding */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <Info size={14} />
          Multilateral Forum Keyword Tracker
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          Global South <span className="text-accent underline decoration-accent/30 underline-offset-4">Representation</span> Analysis
        </h1>
        <p className="text-lg text-gray-600">
          Upload UN Speeches and G20 Declarations to track frequency trends and analyze representation dynamics in multilateral forums.
        </p>
      </motion.div>

      {/* Main Upload Area */}
      <div className="w-full max-w-4xl space-y-8">
        {!isProcessing ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => document.getElementById('file-input').click()}
              className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer group ${isDragging ? 'border-accent bg-accent/5 scale-[1.01]' : 'border-gray-200 bg-white hover:border-accent/40 hover:bg-gray-50'
                }`}
            >
              <input
                id="file-input"
                type="file"
                multiple
                accept=".pdf"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />

              <div className="flex flex-col items-center gap-4">
                <div className={`p-6 rounded-2xl transition-all ${isDragging ? 'bg-accent text-white scale-110' : 'bg-accent/10 text-accent group-hover:scale-110'
                  }`}>
                  <FilePlus size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Drop PDFs here or tap to browse</h3>
                  <p className="text-gray-500 mt-1">Supports UN General Debate and G20 Declaration files</p>
                </div>
              </div>
            </div>

            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">{files.length} Files Ready</h4>
                  <button
                    onClick={() => setFiles([])}
                    className="text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto scrollbar-hide pr-2">
                  {files.map(file => (
                    <FilePill key={file.id} file={file} />
                  ))}
                </div>

                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleAnalyze}
                    disabled={files.some(f => !f.year || f.type === "Other")}
                    className="btn-primary flex items-center gap-3 w-full md:w-auto justify-center"
                  >
                    <span>Begin Keyword Analysis</span>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div className="glass-card p-12 text-center space-y-8 animate-slide-up">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <Loader2 size={64} className="text-accent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-accent">
                  {processingStatus.progress}%
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Processing Documents...</h3>
                <p className="text-gray-500">Analyzing document {processingStatus.current} of {processingStatus.total}</p>
              </div>
              <div className="w-full max-w-md bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${processingStatus.progress}%` }}
                  className="bg-accent h-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                />
              </div>
              <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-600 font-mono truncate max-w-xs">{processingStatus.filename}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
