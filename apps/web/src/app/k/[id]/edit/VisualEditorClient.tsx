'use client';

import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export default function VisualEditorClient({ componentId, initialPayloadStr }: { componentId: string, initialPayloadStr: string }) {
  const [payloadStr, setPayloadStr] = useState(initialPayloadStr);
  const [isSaving, setIsSaving] = useState(false);
  const [cursors, setCursors] = useState<Record<string, { x: number, y: number }>>({});
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const socket = io({
      path: '/socket.io/',
    });
    socketRef.current = socket;

    socket.on('cursor-move', (data: { id: string; x: number; y: number }) => {
      setCursors((prev) => ({
        ...prev,
        [data.id]: { x: data.x, y: data.y },
      }));
    });

    socket.on('token-update', (data: { payloadStr: string }) => {
      setPayloadStr(data.payloadStr);
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (socket.id) {
        socket.emit('cursor-move', { id: socket.id, x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      socket.disconnect();
    };
  }, []);

  let payloadObj: any = {};
  try {
    payloadObj = JSON.parse(payloadStr);
  } catch (e) {
    // fallback
  }

  // Ensure designTokens exists for editing
  if (!payloadObj.designTokens) {
    payloadObj.designTokens = {
      colors: {},
      typography: {}
    };
  }

  // Support array or object for colors
  const colors = payloadObj.designTokens.colors || {};
  const typography = payloadObj.designTokens.typography || {};

  const handleColorChange = (key: string, newColor: string) => {
    const newPayload = { ...payloadObj };
    if (Array.isArray(newPayload.designTokens.colors)) {
      newPayload.designTokens.colors[parseInt(key)] = newColor;
    } else {
      newPayload.designTokens.colors[key] = newColor;
    }
    const newPayloadStr = JSON.stringify(newPayload, null, 2);
    setPayloadStr(newPayloadStr);
    
    // Broadcast the change to other connected clients
    if (socketRef.current) {
      socketRef.current.emit('token-update', { payloadStr: newPayloadStr });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/keys/${componentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: payloadStr })
      });
      if (!res.ok) throw new Error('Save failed');
      alert('Saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save');
    }
    setIsSaving(false);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row gap-12 relative overflow-hidden">
      {/* Render other clients' cursors */}
      {Object.entries(cursors).map(([id, pos]) => (
        <div
          key={id}
          className="absolute pointer-events-none z-50 flex items-center gap-2"
          style={{
            left: pos.x,
            top: pos.y,
            transform: 'translate(-50%, -50%)',
            transition: 'left 50ms linear, top 50ms linear',
          }}
        >
          <div className="w-4 h-4 bg-red-500 rounded-full opacity-75 shadow-lg border-2 border-white" />
        </div>
      ))}

      {/* Sidebar: Design Tokens */}
      <div className="w-full md:w-1/3 bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-xl space-y-8 relative z-10">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white">Design Tokens</h2>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className={`px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white rounded-lg transition-colors ${isSaving ? 'opacity-50' : ''}`}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Colors</h3>
          <div className="space-y-4">
            {Object.keys(colors).map((key) => {
              const hex = colors[key];
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-400 capitalize">{key}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-500">{hex}</span>
                    <input 
                      type="color" 
                      value={hex}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
                    />
                  </div>
                </div>
              );
            })}
            {Object.keys(colors).length === 0 && (
              <p className="text-xs text-gray-500">No color tokens found.</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Typography</h3>
          <div className="space-y-3 text-sm text-gray-400">
             {/* Read only for now as requested only color picker */}
             {Object.keys(typography).map(key => (
               <div key={key} className="flex justify-between border-b border-white/5 pb-2">
                 <span>{key}</span>
                 <span className="font-mono text-gray-500">
                   {typeof typography[key] === 'string' ? typography[key] : JSON.stringify(typography[key])}
                 </span>
               </div>
             ))}
             {Object.keys(typography).length === 0 && (
              <p className="text-xs text-gray-500">No typography tokens found.</p>
             )}
          </div>
        </div>
      </div>

      {/* Main Content: JSON Preview or Component Preview */}
      <div className="w-full md:w-2/3 space-y-6 relative z-10">
        <h2 className="text-2xl font-bold text-white">Payload Data</h2>
        <div className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-300 h-[600px] overflow-y-auto">
            {payloadStr}
          </pre>
        </div>
      </div>
    </div>
  );
}
