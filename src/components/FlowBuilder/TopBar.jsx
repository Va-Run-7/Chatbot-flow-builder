import React, { useRef } from 'react';

const SaveIcon = () => (
  <svg className="inline mr-2" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4"/><rect x="7" y="3" width="10" height="6" rx="2"/><path d="M7 3v6h10V3"/></svg>
);
const ImportIcon = () => (
  <svg className="inline mr-2" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 19V5M5 12l7 7 7-7"/></svg>
);
const UndoIcon = () => (
  <svg className="inline mr-2" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 14l-5-5 5-5"/><path d="M20 19v-7a4 4 0 0 0-4-4H4"/></svg>
);
const RedoIcon = () => (
  <svg className="inline mr-2" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 10l5 5-5 5"/><path d="M4 5v7a4 4 0 0 0 4 4h12"/></svg>
);

const TopBar = ({ onSave, onImport, onUndo, onRedo, canUndo, canRedo, error, success }) => {
  const fileInputRef = useRef();

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full flex flex-col items-center p-6 bg-white border-b relative">
      <div className="h-10 flex flex-col items-center justify-center w-full max-w-md">
        <div
          className={`transition-all duration-500 ease-in-out ${error ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'} mb-2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow z-20 w-full text-center absolute`}
          style={{ top: 0 }}
        >
          {error}
        </div>
        <div
          className={`transition-all duration-500 ease-in-out ${success ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'} mb-2 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded shadow z-20 w-full text-center absolute`}
          style={{ top: 0 }}
        >
          {success}
        </div>
      </div>
      <div className="flex gap-4">
        <button
          className="border px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-lg shadow flex items-center"
          onClick={onSave}
        >
          <SaveIcon />Save Changes
        </button>
        <button
          className="border px-6 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition text-lg shadow flex items-center"
          onClick={handleImportClick}
        >
          <ImportIcon />Import
        </button>
        <button
          className={`border px-4 py-2 rounded bg-blue-600 text-white font-semibold transition text-lg shadow flex items-center ${canUndo ? 'hover:bg-blue-700' : 'opacity-50 cursor-not-allowed'}`}
          onClick={onUndo}
          disabled={!canUndo}
        >
          <UndoIcon />Undo
        </button>
        <button
          className={`border px-4 py-2 rounded bg-blue-600 text-white font-semibold transition text-lg shadow flex items-center ${canRedo ? 'hover:bg-blue-700' : 'opacity-50 cursor-not-allowed'}`}
          onClick={onRedo}
          disabled={!canRedo}
        >
          <RedoIcon />Redo
        </button>
        <input
          type="file"
          accept="application/json"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={onImport}
        />
      </div>
    </div>
  );
};

export default TopBar; 