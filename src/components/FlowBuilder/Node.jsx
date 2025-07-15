import React from 'react';
import { Handle, Position } from '@xyflow/react';

const Node = ({ data, selected }) => {
  return (
    <div className={`bg-white border border-blue-400 rounded-lg shadow-md p-2 min-w-[120px] max-w-[180px] flex flex-col items-center justify-center relative transition-transform duration-200 ${selected ? 'border-blue-500' : ''}`}
      style={{ fontSize: 13, boxShadow: selected ? '0 0 0 1px #2563eb, 0 2px 8px rgba(0,0,0,0.08)' : undefined }}
    >
      {/* Target Handle (left) */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-400 border-2 border-white rounded-full absolute -left-2 top-1/2 -translate-y-1/2 z-10 shadow"
        style={{ borderColor: '#fff', background: '#2563eb' }}
      />
      {/* Source Handle (right) */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-400 border-2 border-white rounded-full absolute -right-2 top-1/2 -translate-y-1/2 z-10 shadow"
        style={{ borderColor: '#fff', background: '#22c55e' }}
      />
      <div className="text-gray-800 text-center whitespace-pre-line min-h-[20px] px-1">
        {data?.label ? data.label : <span className="text-gray-400 italic">Send Message</span>}
      </div>
    </div>
  );
};

export default Node; 