import React from 'react';

const MainArea = ({ children }) => {
  return (
    <div className="flex-1 h-full relative flex items-center justify-center bg-gray-50">
      {children}
    </div>
  );
};

export default MainArea; 