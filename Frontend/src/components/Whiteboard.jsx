import React, { useRef, useEffect, useState } from 'react';
import { FiEdit2, FiTrash2, FiSquare, FiCircle, FiRotateCcw } from 'react-icons/fi';

const Whiteboard = ({ socket, invitationId }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#6366f1'); // indigo-500
  const [lineWidth, setLineWidth] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    canvas.style.width = `${canvas.offsetWidth}px`;
    canvas.style.height = `${canvas.offsetHeight}px`;

    const context = canvas.getContext('2d');
    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    contextRef.current = context;

    const handleResize = () => {
      // Handle resize if needed
    };

    window.addEventListener('resize', handleResize);

    // Socket listeners for remote drawing
    socket.on('session_draw_stroke', (data) => {
      const { x, y, prevX, prevY, strokeColor, strokeWidth, type } = data;
      const ctx = contextRef.current;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      
      if (type === 'start') {
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else if (type === 'draw') {
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (type === 'end') {
        ctx.closePath();
      }
      
      // Reset to local color/width
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    });

    socket.on('session_clear_whiteboard', () => {
      const canvas = canvasRef.current;
      const context = contextRef.current;
      context.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      socket.off('session_draw_stroke');
      socket.off('session_clear_whiteboard');
    };
  }, [socket, color, lineWidth]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);

    socket.emit('session_draw_stroke', {
      sessionId: invitationId,
      x: offsetX,
      y: offsetY,
      strokeColor: color,
      strokeWidth: lineWidth,
      type: 'start'
    });
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    socket.emit('session_draw_stroke', {
      sessionId: invitationId,
      x: offsetX,
      y: offsetY,
      strokeColor: color,
      strokeWidth: lineWidth,
      type: 'draw'
    });
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);

    socket.emit('session_draw_stroke', {
      sessionId: invitationId,
      type: 'end'
    });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('session_clear_whiteboard', invitationId);
  };

  return (
    <div className="flex flex-col h-full bg-white/[0.02] rounded-3xl overflow-hidden border border-white/5">
      <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex gap-1 bg-black/20 p-1 rounded-lg">
            {['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#ffffff'].map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-md transition-all ${color === c ? 'scale-110 ring-2 ring-white/20' : 'opacity-50 hover:opacity-100'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="h-4 w-px bg-white/10" />
          <input
            type="range"
            min="1"
            max="10"
            value={lineWidth}
            onChange={(e) => setLineWidth(e.target.value)}
            className="w-24 accent-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={clearCanvas} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all">
            <FiTrash2 />
          </button>
        </div>
      </div>
      <div className="flex-1 relative cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default Whiteboard;
