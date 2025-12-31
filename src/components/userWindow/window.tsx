import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import './window.css';

type Props = {
  title: string;
  startX: number;
  startY: number;
  width: number;
  onClose: () => void;
  children: React.ReactNode;
};

export const Window = ({ title, startX, startY, width, onClose, children }: Props) => {
  const [collapsed, setCollapsed] = useState(false);

  const [state, setState] = useState({
    x: startX,
    y: startY,
    width: width,
    height: 600,
  });

  const handleBlockDblClick = e => {
    e.stopPropagation();
  };

  useEffect(() => {
    console.log(width);

    setState(prev => ({
      ...prev,
      width: width,
    }));
  }, [width]);

  return (
    <Rnd
      bounds="window"
      dragHandleClassName="window-header"
      enableResizing={!collapsed}
      minWidth={300}
      minHeight={collapsed ? 40 : 200}
      position={{ x: state.x, y: state.y }}
      size={{
        width: state.width,
        height: collapsed ? 40 : state.height,
      }}
      style={{ zIndex: 100 }}
      onDragStop={(e, d) => {
        setState(prev => ({
          ...prev,
          x: d.x,
          y: d.y,
        }));
      }}
      onResizeStop={(e, dir, ref, delta, pos) => {
        setState({
          x: pos.x,
          y: pos.y,
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        });
      }}
    >
      <div className="window" onDoubleClick={handleBlockDblClick}>
        {/* HEADER */}
        <div className="window-header">
          <span className="window-header-span">{title}</span>
          <div className="window-controls">
            <button onClick={() => setCollapsed(c => !c)}>▢</button>
            <button onClick={onClose}>✕</button>
          </div>
        </div>

        {/* BODY */}
        {!collapsed && <div className="window-body">{children}</div>}
      </div>
    </Rnd>
  );
};
