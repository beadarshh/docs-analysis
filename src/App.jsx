import React from 'react';
import { useAppContext } from './context/AppContext';
import { UploadZone } from './components/UploadZone';
import { Dashboard } from './components/Dashboard';

function App() {
  const { documents } = useAppContext();

  return (
    <div className="min-h-screen">
      {documents.length === 0 ? (
        <UploadZone />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

export default App;
