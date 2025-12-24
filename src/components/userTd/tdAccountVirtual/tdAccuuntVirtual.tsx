import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { OrderType, Coords } from '../../tsTypes';
import { ContextMenu } from './contextMenu.tsx';
import { UserWindow } from '../../userWindow/userWindow.jsx';
import { Window } from '../../userWindow/window.tsx';
import { DocFormNew } from '../../documentNew/docFormNew.tsx';
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
  const [showUserWindow, setShowUserWindow] = useState<boolean>(false);
  const [windowHeader, setWindowHeader] = useState<string>('');
  const [windowChild, setWindowChild] = useState<React.ReactNode>(null);
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
  const handleClickContextMenu = (pointOfContextMenu: string) => {
    console.log(pointOfContextMenu);
    switch (pointOfContextMenu) {
      case 'createBill': {
        setWindowHeader('Создать счет');
        setWindowChild(<DocFormNew order={elem} currentTable="driverorderlist" />);
        break;
      }
      case 'editBill':
        setWindowHeader('Редактировать счет');
        setWindowChild(<DocFormNew order={elem} currentTable="driverorderlist" />);
        break;
      case 'printBill':
        setWindowHeader('Печать счета');
        break;
      case 'printBillwhithoutStamp':
        setWindowHeader('Печать счета без печати');
        break;
      case 'deleteBill':
        setWindowHeader('Удалить счет');
        break;
      case 'createApp':
        setWindowHeader('Создать заявку');
        break;
      case 'editApp':
        setWindowHeader('Редактировать заявку');
        break;
      case 'printApp':
        setWindowHeader('Печать заявки');
        break;
      case 'addAppPdf':
        setWindowHeader('Добавить заявку pdf');
        break;
      case 'addTtn':
        setWindowHeader('Добавить ТТН pdf');
        break;
      case 'printTtn':
        setWindowHeader('Печать ТТН');
        break;
      case 'sendEmail':
        setWindowHeader('Отправить email');
        break;
      default:
        break;
    }
    setShowUserWindow(true);
    setShowContextMenu(false);
  };
  const handleClickUserWindowClose = () => {
    setShowUserWindow(false);
  };
  const contextMenuPortal = showContextMenu
    ? createPortal(
        <ContextMenu
          order={elem}
          coords={coords}
          handleClickContextMenu={handleClickContextMenu}
        />,
        portalRoot
      )
    : null;

  const userWindow = showUserWindow
    ? createPortal(
        <Window
          title="Документы для печати"
          startX={400}
          startY={200}
          onClose={() => setShowUserWindow(false)}
        >
          {windowChild}
        </Window>,
        document.body
      )
    : null;

  return (
    <React.Fragment>
      <td ref={tdRef} style={style} className="userTd" onContextMenu={handleContextMenu}>
        {elem.accountNumber}
      </td>
      {contextMenuPortal}
      {userWindow}
    </React.Fragment>
  );
};
