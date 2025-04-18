import React, { useRef, useEffect, useState } from 'react';

const Loader = () => {
  const canvasRef = useRef(null);
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(150);
  let time = 0;

  // Create rope texture pattern
  const createRopePattern = (ctx) => {
    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext('2d');
    
    patternCanvas.width = 20;
    patternCanvas.height = 20;
    
    // Draw diagonal lines for rope texture
    patternCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    patternCtx.lineWidth = 1;
    
    // First set of diagonals
    patternCtx.beginPath();
    for (let i = -20; i < 40; i += 6) {
      patternCtx.moveTo(i, 0);
      patternCtx.lineTo(i + 20, 20);
    }
    patternCtx.stroke();
    
    // Second set of diagonals (perpendicular)
    patternCtx.beginPath();
    for (let i = -20; i < 40; i += 6) {
      patternCtx.moveTo(i, 20);
      patternCtx.lineTo(i + 20, 0);
    }
    patternCtx.stroke();
    
    return ctx.createPattern(patternCanvas, 'repeat');
  };

  // Draw rope segment
  const drawRopeSegment = (ctx, x1, y1, x2, y2, thickness, ropePattern) => {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    
    ctx.save();
    ctx.translate(x1, y1);
    ctx.rotate(angle);
    
    // Draw rope base with gradient
    const gradient = ctx.createLinearGradient(0, -thickness / 2, 0, thickness / 2);
    gradient.addColorStop(0, '#80dfff');
    gradient.addColorStop(0.5, '#00bfff');
    gradient.addColorStop(1, '#0099cc');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(0, -thickness / 2, length, thickness, thickness / 2);
    ctx.fill();
    
    // Draw rope texture
    ctx.fillStyle = ropePattern;
    ctx.beginPath();
    ctx.roundRect(0, -thickness / 2, length, thickness, thickness / 2);
    ctx.fill();
    
    // Draw highlight on top of the rope
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -thickness / 2 + 1.5);
    ctx.lineTo(length, -thickness / 2 + 1.5);
    ctx.stroke();
    
    ctx.restore();
  };

  // Draw the rope wave animation
  const drawRopeWave = (ctx, ropePattern) => {
    ctx.clearRect(0, 0, width, height);
    
    const amplitude = 30;
    const frequency = 0.02;
    const ropeLength = width;
    const segmentLength = 10;
    const ropeThickness = 8;
    
    let prevX = 0;
    let prevY = height / 2 + Math.sin(prevX * frequency + time) * amplitude;
    
    for (let x = segmentLength; x <= ropeLength; x += segmentLength) {
      const y = height / 2 + Math.sin(x * frequency + time) * amplitude;
      drawRopeSegment(ctx, prevX, prevY, x, y, ropeThickness, ropePattern);
      prevX = x;
      prevY = y;
    }
    
    time += 0.05;
    requestAnimationFrame(() => drawRopeWave(ctx, ropePattern));
  };

  // Set up canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const ropePattern = createRopePattern(ctx);

    const setupHiDPI = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
      setWidth(rect.width);
      setHeight(rect.height);
    };
    
    setupHiDPI();
    drawRopeWave(ctx, ropePattern);

    window.addEventListener('resize', setupHiDPI);

    return () => {
      window.removeEventListener('resize', setupHiDPI);
    };
  }, [width, height]);

  return (
    <div className="loader-wrapper" style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} width={width} height={height} style={{ display: 'block', margin: '0 auto', backgroundColor: 'transparent' }} />
      <p className="loading-text" style={{ color: '#ccc', marginTop: '10px', fontSize: '1.1rem', letterSpacing: '1px' }}>Connecting through ROPE...</p>
    </div>
  );
};

export default Loader;
