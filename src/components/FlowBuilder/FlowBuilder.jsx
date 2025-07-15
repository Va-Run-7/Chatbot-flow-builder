import React, { useCallback, useRef, useState } from 'react';
import { ReactFlow, Background, Controls, MiniMap, applyNodeChanges, addEdge, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useDrop } from 'react-dnd';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import NodePalette, { NODE_TYPE } from './NodePalette';
import MainArea from './MainArea';
import SettingsPanel from './SettingsPanel';
import Node from './Node';

const initialNodes = [];

const initialEdges = [];

const nodeTypes = {
  message: Node,
};

const toolbarStyle = {
  position: 'absolute',
  top: 24,
  left: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
  padding: 12,
  zIndex: 100,
};

const btnStyle = {
  width: 44,
  height: 44,
  borderRadius: '50%',
  border: 'none',
  background: '#f3f4f6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'background 0.2s',
  outline: 'none',
  position: 'relative',
};

const btnHoverStyle = {
  background: '#2563eb',
};

const iconStyle = {
  display: 'block',
  width: 36,
  height: 36,
};

const tooltipStyle = {
  position: 'absolute',
  left: 56,
  top: '50%',
  transform: 'translateY(-50%)',
  background: '#222',
  color: '#fff',
  padding: '4px 10px',
  borderRadius: 6,
  fontSize: 13,
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  opacity: 0.95,
  zIndex: 200,
};

const CustomToolbar = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const [hovered, setHovered] = useState('');

  return (
    <div style={toolbarStyle}>
      <button
        style={{ ...btnStyle, ...(hovered === 'in' ? btnHoverStyle : {}) }}
        onMouseEnter={() => setHovered('in')}
        onMouseLeave={() => setHovered('')}
        onClick={zoomIn}
        aria-label="Zoom In"
      >
        <svg style={iconStyle} viewBox="0 0 24 24">
          <line x1="12" y1="6" x2="12" y2="18" stroke={hovered === 'in' ? '#fff' : '#2563eb'} strokeWidth="3.5" strokeLinecap="round"/>
          <line x1="6" y1="12" x2="18" y2="12" stroke={hovered === 'in' ? '#fff' : '#2563eb'} strokeWidth="3.5" strokeLinecap="round"/>
        </svg>
        {hovered === 'in' && <span style={tooltipStyle}>Zoom In</span>}
      </button>
      <button
        style={{ ...btnStyle, ...(hovered === 'out' ? btnHoverStyle : {}) }}
        onMouseEnter={() => setHovered('out')}
        onMouseLeave={() => setHovered('')}
        onClick={zoomOut}
        aria-label="Zoom Out"
      >
        <svg style={iconStyle} viewBox="0 0 24 24">
          <line x1="6" y1="12" x2="18" y2="12" stroke={hovered === 'out' ? '#fff' : '#2563eb'} strokeWidth="3.5" strokeLinecap="round"/>
        </svg>
        {hovered === 'out' && <span style={tooltipStyle}>Zoom Out</span>}
      </button>
      <button
        style={{ ...btnStyle, ...(hovered === 'fit' ? btnHoverStyle : {}) }}
        onMouseEnter={() => setHovered('fit')}
        onMouseLeave={() => setHovered('')}
        onClick={fitView}
        aria-label="Fit View"
      >
        <svg style={iconStyle} viewBox="0 0 24 24">
          <rect x="5" y="5" width="14" height="14" rx="3" fill="none" stroke={hovered === 'fit' ? '#fff' : '#2563eb'} strokeWidth="3.5"/>
          <polyline points="8,8 5,5" fill="none" stroke={hovered === 'fit' ? '#fff' : '#2563eb'} strokeWidth="2.5" strokeLinecap="round"/>
          <polyline points="16,8 19,5" fill="none" stroke={hovered === 'fit' ? '#fff' : '#2563eb'} strokeWidth="2.5" strokeLinecap="round"/>
          <polyline points="8,16 5,19" fill="none" stroke={hovered === 'fit' ? '#fff' : '#2563eb'} strokeWidth="2.5" strokeLinecap="round"/>
          <polyline points="16,16 19,19" fill="none" stroke={hovered === 'fit' ? '#fff' : '#2563eb'} strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
        {hovered === 'fit' && <span style={tooltipStyle}>Fit View</span>}
      </button>
    </div>
  );
};

const FlowBuilder = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [history, setHistory] = useState([{ nodes: initialNodes, edges: initialEdges }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Helper to push to history
  const pushHistory = useCallback((newNodes, newEdges) => {
    setHistory((h) => {
      const next = h.slice(0, historyIndex + 1).concat([{ nodes: newNodes, edges: newEdges }]);
      return next.length > 50 ? next.slice(-50) : next;
    });
    setHistoryIndex((i) => Math.min(i + 1, 49));
  }, [historyIndex]);

  // Undo/redo handlers
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  const handleUndo = useCallback(() => {
    if (canUndo) {
      const prev = history[historyIndex - 1];
      setNodes(prev.nodes);
      setEdges(prev.edges);
      setHistoryIndex((i) => i - 1);
    }
  }, [canUndo, history, historyIndex]);
  const handleRedo = useCallback(() => {
    if (canRedo) {
      const next = history[historyIndex + 1];
      setNodes(next.nodes);
      setEdges(next.edges);
      setHistoryIndex((i) => i + 1);
    }
  }, [canRedo, history, historyIndex]);

  // Track changes for undo/redo
  React.useEffect(() => {
    if (history[historyIndex]?.nodes !== nodes || history[historyIndex]?.edges !== edges) {
      pushHistory(nodes, edges);
    }
    // eslint-disable-next-line
  }, [nodes, edges]);

  // Drop target for the canvas
  const [{ isOver }, drop] = useDrop({
    accept: NODE_TYPE,
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!offset || !reactFlowBounds) return; // Defensive check
      let position = { x: offset.x - reactFlowBounds.left, y: offset.y - reactFlowBounds.top };
      // Use project if available for accurate placement
      if (reactFlowInstance && reactFlowInstance.project) {
        position = reactFlowInstance.project(position);
      }
      const newNode = {
        id: `${+new Date()}`,
        type: 'message',
        position,
        data: { label: '' },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
  }, []);

  // Update node data
  const updateNodeData = (id, newData) => {
    setNodes((nds) => nds.map((node) => node.id === id ? { ...node, data: { ...node.data, ...newData } } : node));
  };

  // Use applyNodeChanges for robust node updates
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // Handle edge creation
  const onConnect = useCallback(
    (connection) => {
      // Prevent more than one outgoing edge from the same source
      const outgoing = edges.filter(e => e.source === connection.source);
      if (outgoing.length > 0) {
        setError('A node can only have one outgoing edge.');
        setSuccess('');
        setTimeout(() => setError(''), 2000);
        return;
      }
      setEdges((eds) => addEdge(connection, eds));
    },
    [edges]
  );

  // Edge selection handler
  const onEdgeClick = useCallback((event, edge) => {
    event.stopPropagation();
    setSelectedEdgeId(edge.id);
  }, []);

  // Edge deletion handler (keyboard)
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedEdgeId) {
        setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdgeId));
        setSelectedEdgeId(null);
        setSuccess('Edge deleted successfully!');
        setTimeout(() => setSuccess(''), 2000);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEdgeId]);

  // Save validation logic
  const handleSave = useCallback(() => {
    setSuccess('');
    // Find nodes with no incoming edge (empty target handle)
    const nodeIdsWithIncoming = new Set(edges.map(e => e.target));
    const nodesWithNoIncoming = nodes.filter(n => !nodeIdsWithIncoming.has(n.id));
    if (nodes.length > 1 && nodesWithNoIncoming.length > 1) {
      setError('Cannot save Flow: More than one node has no incoming connection.');
      setSuccess('');
      return;
    }
    setError('');
    setSuccess('Flow saved and exported successfully!');
    // Export logic: download as JSON
    const flowData = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([flowData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chatbot-flow.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    // Hide success after 2 seconds
    setTimeout(() => setSuccess(''), 2000);
  }, [nodes, edges]);

  // Import logic
  const handleImport = useCallback((e) => {
    setError('');
    setSuccess('');
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
          setError('Invalid file format.');
          return;
        }
        setNodes(data.nodes);
        setEdges(data.edges);
        setSuccess('Flow imported successfully!');
        setTimeout(() => setSuccess(''), 2000);
      } catch {
        setError('Failed to parse file.');
      }
    };
    reader.readAsText(file);
    // Reset file input value so the same file can be imported again if needed
    e.target.value = '';
  }, []);

  // Node deletion logic
  const handleDeleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    setSelectedNodeId(null);
    setSuccess('Node deleted successfully!');
    setTimeout(() => setSuccess(''), 2000);
  }, []);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="w-screen h-screen flex flex-col">
      <TopBar
        onSave={handleSave}
        onImport={handleImport}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        error={error}
        success={success}
      />
      <div className="flex flex-1 h-full">
        <Sidebar>
          <NodePalette />
        </Sidebar>
        <MainArea>
          <div
            ref={node => {
              reactFlowWrapper.current = node;
              drop(node);
            }}
            className="flex-1 h-full relative"
            style={{ background: isOver ? '#000' : undefined }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={setEdges}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              selectionKeyCode={null}
              multiSelectionKeyCode={null}
              onInit={setReactFlowInstance}
            >
              <Background />
              <MiniMap
                nodeColor={n => n.selected ? '#2563eb' : '#60a5fa'}
                nodeStrokeColor={n => n.selected ? '#1d4ed8' : '#2563eb'}
                nodeBorderRadius={6}
                maskColor="rgba(59,130,246,0.08)"
                style={{
                  background: '#fff',
                  border: '2px solid #2563eb',
                  borderRadius: '0.75rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  margin: '0.5rem',
                }}
                pannable
                zoomable
              />
              <CustomToolbar />
            </ReactFlow>
            {selectedNode && (
              <SettingsPanel
                node={selectedNode}
                onChange={(data) => updateNodeData(selectedNode.id, data)}
                onClose={() => setSelectedNodeId(null)}
                onDelete={handleDeleteNode}
              />
            )}
          </div>
        </MainArea>
      </div>
    </div>
  );
};

export default FlowBuilder; 