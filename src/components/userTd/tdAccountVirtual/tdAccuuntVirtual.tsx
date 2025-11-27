import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { OrderType, Coords } from '../../tsTypes';
import { ContextMenu } from './contextMenu.tsx';
import './tdAccountVirtual.sass';

interface TdAccountVirtualProps {
  style: React.CSSProperties;
  elem: OrderType;
  currentId: Number;
  getCurrentId: (id: number) => boolean;
}

export const TdAccountVirtual = ({
  style,
  elem,
  currentId,
  getCurrentId,
}: TdAccountVirtualProps) => {
  const tdRef = useRef(null);
  const portalRoot = document.querySelector('.virtualTableWrapper');

  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [coords, setCoords] = useState<Coords>({ top: 0, left: 0 });

  useEffect(() => {
    if (currentId != elem._id) setShowContextMenu(false);
  }, [currentId]);

  const handleContextMenu = (e: React.MouseEvent<HTMLTableCellElement>) => {
    getCurrentId(elem._id);
    e.preventDefault();
    if (!portalRoot || !tdRef.current) {
      return;
    }
    const rect = tdRef.current.getBoundingClientRect();
    const containerRect = portalRoot.getBoundingClientRect();
    const distanceRight = window.innerWidth - rect.right; // до правого краюхи
    const distanceBottom = window.innerHeight - rect.bottom; // до нижнего
    const width = rect.width;
    const height = rect.height;
    console.log(distanceRight, distanceBottom, width, height);

    if (distanceBottom < 200 && distanceRight + width > 145) {
      const diff = 200 - distanceBottom;
      setCoords({
        top: rect.top - containerRect.top + portalRoot.scrollTop - diff,
        left: rect.left - containerRect.left + portalRoot.scrollLeft,
      });
    }
    if (distanceBottom > 200 && distanceRight + width < 145) {
      const diff = 145 - distanceRight - width;
      setCoords({
        top: rect.top - containerRect.top + portalRoot.scrollTop,
        left: rect.left - containerRect.left + portalRoot.scrollLeft - diff - 35,
      });
    }
    if (distanceBottom < 200 && distanceRight + width < 145) {
      const diffB = 200 - distanceBottom;
      const diffR = 145 - distanceRight - width;
      setCoords({
        top: rect.top - containerRect.top + portalRoot.scrollTop - diffB,
        left: rect.left - containerRect.left + portalRoot.scrollLeft - diffR - 35,
      });
    }
    if (distanceBottom > 200 && distanceRight + width > 145) {
      setCoords({
        top: rect.top - containerRect.top + portalRoot.scrollTop,
        left: rect.left - containerRect.left + portalRoot.scrollLeft,
      });
    }
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
