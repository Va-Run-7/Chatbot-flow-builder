import React, { useEffect, useState } from 'react';

const SettingsPanel = ({ node, onChange, onClose, onDelete }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (node) setVisible(true);
    else setTimeout(() => setVisible(false), 400); // match transition duration
  }, [node]);

  if (!node && !visible) return null;

  return (
    <div
      className={`w-80 bg-white border-l h-full p-8 absolute right-0 top-0 shadow-2xl z-10 flex flex-col gap-4 transition-all duration-400 ease-in-out transform
        ${node ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-bold text-blue-700 text-lg">Message</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-blue-600 text-2xl font-bold">&larr;</button>
      </div>
      <label className="block text-sm font-medium mb-1 text-gray-700">Text</label>
      <textarea
        className="w-full border-2 border-blue-300 rounded-lg p-3 min-h-[80px] focus:outline-none focus:border-blue-500 text-gray-800 bg-blue-50"
        value={node?.data.label || ''}
        onChange={e => onChange({ label: e.target.value })}
        placeholder="Send Message"
      />
      <button
        className="mt-8 border px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-700 transition text-base shadow"
        onClick={() => onDelete(node.id)}
      >
        Delete Node
      </button>
    </div>
  );
};

export default SettingsPanel; 