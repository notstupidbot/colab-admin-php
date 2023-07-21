import React, { useRef, useEffect } from 'react';

const SelectableDiv = () => {
  const handleRef = useRef(null);
  const divRef = useRef(null);

  useEffect(() => {
    const handle = handleRef.current;
    const div = divRef.current;

    let isDragging = false;
    let initialX = 0;
    let initialY = 0;
    let offsetX = 0;
    let offsetY = 0;

    const handleMouseDown = (e) => {
      isDragging = true;
      initialX = e.clientX;
      initialY = e.clientY;
      offsetX = div.offsetLeft;
      offsetY = div.offsetTop;

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - initialX;
      const dy = e.clientY - initialY;
      div.style.left = offsetX + dx + 'px';
      div.style.top = offsetY + dy + 'px';
    };

    const handleMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    handle.addEventListener('mousedown', handleMouseDown);

    return () => {
      handle.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <div ref={divRef} className="selectable-div" style={{ left: '100px', top: '100px' }}>
      Select and drag this div
      <div ref={handleRef} className="handle"></div>
    </div>
  );
};

export default SelectableDiv;
