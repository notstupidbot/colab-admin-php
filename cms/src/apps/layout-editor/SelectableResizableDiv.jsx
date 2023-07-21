import React from 'react';
import { Resizable } from 'react-resizable';
import Draggable from 'react-draggable';

const SelectableResizableDiv = () => {
  // Initial position and size of the resizable div
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [size, setSize] = React.useState({ width: 200, height: 100 });

  // Handle draggable events
  const handleDrag = (e, data) => {
    const { x, y } = data;
    setPosition({ x, y });
  };

  // Handle resizing events
  const handleResize = (e, { size }) => {
    setSize(size);
  };
  const handleStyle = {
    width: '10px',
    height: '10px',
    background: 'blue',
    position: 'absolute',
    bottom: '-5px',
    right: '-5px',
    cursor: 'se-resize',
  };
  return (
    <Draggable
      handle=".handle"
      defaultPosition={{ x: 0, y: 0 }}
      position={position}
      onStop={handleDrag}
    >
      <Resizable
        width={size.width}
        height={size.height}
        onResize={handleResize}
        resizeHandles={['se']}
      >
        <div
  className="border border-gray-400 p-4 bg-gray-200 w-[600px]"
  style={{  position: 'relative' }}
>
  Selectable and Resizable Div
  <div className="handle" style={handleStyle} />
</div>
      </Resizable>
    </Draggable>
  );
};

export default SelectableResizableDiv;
