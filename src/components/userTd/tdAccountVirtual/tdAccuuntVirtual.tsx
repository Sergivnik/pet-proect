import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { OrderType, Coords } from '../../tsTypes';
import { ContextMenu } from './contextMenu.tsx';
import './tdAccountVirtual.sass';

interface TdAccountVirtualProps {
  style: React.CSSProperties;
  elem: OrderType;
  currentId: Number;
}

export const TdAccountVirtual = ({ style, elem, currentId }: TdAccountVirtualProps) => {
  const tdRef = useRef(null);
  const portalRoot = document.querySelector('.virtualTableWrapper');

  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [coords, setCoords] = useState<Coords>({ top: 0, left: 0 });

  useEffect(() => {
    if (currentId != elem._id) setShowContextMenu(false);
  }, [currentId]);

  const handleContextMenu = (e: React.MouseEvent<HTMLTableCellElement>) => {
    e.preventDefault();
    if (!portalRoot || !tdRef.current) {
      return;
    }
    const rect = tdRef.current.getBoundingClientRect();
    const containerRect = portalRoot.getBoundingClientRect();
    setCoords({
      top: rect.top - containerRect.top + portalRoot.scrollTop,
      left: rect.left - containerRect.left + portalRoot.scrollLeft,
    });
    setShowContextMenu(true);
  };
  const contextMenuPortal = showContextMenu
    ? createPortal(<ContextMenu order={elem} coords={coords} />, portalRoot)
    : null;

  return (
    <React.Fragment>
      <td ref={tdRef} style={style} className="userTd" onContextMenu={handleContextMenu}>
        {elem.accountNumber}
      </td>
      {contextMenuPortal}
    </React.Fragment>
  );
};
