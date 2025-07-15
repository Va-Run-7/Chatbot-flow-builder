import React from 'react';

const Sidebar = ({ children }) => {
  return (
    <div className="w-64 bg-white border-l h-full p-6 flex flex-col items-center justify-start">
      <h2 className="font-bold mb-6 text-lg text-blue-700">Nodes Panel</h2>
      <div className="flex flex-col gap-4 w-full items-center">
        {children}
      </div>
    </div>
  );
};

export default Sidebar; 