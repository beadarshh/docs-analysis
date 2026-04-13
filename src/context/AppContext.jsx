import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [files, setFiles] = useState([]); // Selected but not yet analyzed
  const [documents, setDocuments] = useState([]); // Results from analysis
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState({ 
    filename: "", 
    progress: 0,
    current: 0,
    total: 0
  });

  const resetState = () => {
    setFiles([]);
    setDocuments([]);
    setIsProcessing(false);
    setProcessingStatus({ filename: "", progress: 0, current: 0, total: 0 });
  };

  const updateFileMetadata = (id, metadata) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...metadata } : f));
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <AppContext.Provider value={{
      files,
      setFiles,
      documents,
      setDocuments,
      isProcessing,
      setIsProcessing,
      processingStatus,
      setProcessingStatus,
      resetState,
      updateFileMetadata,
      removeFile
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within an AppProvider");
  return context;
};
