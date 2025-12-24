import React from 'react';
import { Rnd } from 'react-rnd';
import { useState } from 'react';
import './window.css';

type Props = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export const Window = ({ title, onClose, children }: Props) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Rnd
      default={{
        x: 120,
        y: 80,
        width: 800,
        height: 600,
      }}
      bounds="window"
      dragHandleClassName="window-header"
      enableResizing={!collapsed}
      minWidth={300}
      minHeight={collapsed ? 40 : 200}
      style={{ zIndex: 100 }}
    >
      <div className="window">
        {/* HEADER */}
        <div className="window-header">
          <span>{title}</span>
          <div className="window-controls">
            <button onClick={() => setCollapsed(!collapsed)}>▢</button>
            <button onClick={onClose}>✕</button>
          </div>
        </div>

        {/* BODY */}
        {!collapsed && <div className="window-body">{children}</div>}
      </div>
    </Rnd>
  );
};
