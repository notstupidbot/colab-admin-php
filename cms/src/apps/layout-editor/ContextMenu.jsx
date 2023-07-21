import React, { useState } from 'react';

const ContextMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (event) => {
    event.preventDefault();
    setPosition({ x: event.clientX, y: event.clientY });
    setIsOpen(true);
  };

  const handleMenuClose = () => {
    setIsOpen(false);
  };
  const cursorCls = "cursor-pointer"
  return (
    <>
      {isOpen && (
        <div className="context-menu fixed bg-white border p-[4px]" style={{ top: position.y, left: position.x }}>
          <ul className="list-none">
            <li className={cursorCls}>Add Container</li>
            <li className={cursorCls}>Option 2</li>
            <li className={cursorCls}>Option 3</li>
          </ul>
        </div>
      )}

      <div onContextMenu={handleContextMenu} style={{ width: '200px', height: '200px', background: 'lightgray' }}>
        Right-click me to open the context menu
      </div>
    </>
  );
};

export default ContextMenu;
