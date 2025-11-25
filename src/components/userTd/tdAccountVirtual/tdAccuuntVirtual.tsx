import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { OrderType } from '../../tsTypes';
import './tdAccountVirtual.sass';

interface TdAccountVirtualProps {
  style: React.CSSProperties;
  elem: OrderType;
}

export const TdAccountVirtual = ({ style, elem }: TdAccountVirtualProps) => {
  const tdRef = useRef(null);
  const portalRoot = document.querySelector('.virtualTableWrapper');

  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const handleContextMenu = (e: React.MouseEvent<HTMLTableCellElement>) => {
    e.preventDefault();
    const rect = tdRef.current.getBoundingClientRect();
    const containerRect = portalRoot.getBoundingClientRect();
    setCoords({
      top: rect.top - containerRect.top + portalRoot.scrollTop,
      left: rect.left - containerRect.left + portalRoot.scrollLeft,
    });
    setShowContextMenu(true);
  };
  const ContextMenu = showContextMenu
    ? createPortal(
        <div
          style={{
            top: coords.top,
            left: coords.left,
          }}
          className="virtualDivContext"
        >
          {'Context Menu'}
        </div>,
        portalRoot
      )
    : null;

  return (
    <React.Fragment>
      <td ref={tdRef} style={style} className="userTd" onContextMenu={handleContextMenu}>
        {elem.accountNumber}
      </td>
      {ContextMenu}
    </React.Fragment>
  );
};
