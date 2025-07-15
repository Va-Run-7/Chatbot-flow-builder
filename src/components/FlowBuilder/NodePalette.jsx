import React from 'react';
import { useDrag } from 'react-dnd';

export const NODE_TYPE = 'message-node';

const NodePalette = () => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: NODE_TYPE,
    item: { type: 'message' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`border-2 border-blue-400 bg-blue-50 rounded-lg p-6 flex flex-col items-center cursor-pointer select-none transition-opacity shadow-md hover:bg-blue-100 ${isDragging ? 'opacity-50' : ''}`}
      style={{ minWidth: 120, background: isDragging ? '#e0e7ff' : undefined }}
    >
      <span className="text-3xl mb-2 text-blue-500">💬</span>
      <span className="font-semibold text-blue-700">Message</span>
    </div>
  );
};

export default NodePalette; 