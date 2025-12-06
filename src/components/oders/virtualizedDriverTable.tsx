import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useWindowSize } from '../../hooks/useWindowSize';
import { DriverTr } from './driverTr';
import { OrderType } from '../tsTypes';
import { DriverThead } from './driverThead.tsx';
import { CreateOderNew } from '../createOder/createOderNew.jsx';
import { UserWindow } from '../userWindow/userWindow.jsx';
import { delOder } from '../../actions/oderActions.js';
import './oders.sass';

interface Props {
  rows: OrderType[];
}

export const VirtualizedDriverTable: React.FC<Props> = ({ rows }) => {
  const dispatch = useDispatch();
  const parentRef = useRef<HTMLDivElement>(null);
  const { width, height } = useWindowSize();
  const [colWidths, setColWidths] = useState<number[]>([
    5, // Дата
    10, // Водитель
    10, // Заказчик
    10, // Погрузка
    10, // Выгрузка
    8, // Цена клиента
    8, // Цена водителя
    10, // Выполнен
    5, // Док-ты
    8, // Клиент Оплата
    8, // Водитель Оплата
    8, // Номер счета
  ]);
  const [showCreateOderWindow, setShowCreateOderWindow] = useState(false);
  const [currentId, setCurrentId] = useState<number>(null);
  const [editOrder, setEditOrder] = useState<boolean>(false);
  const [newElem, setNewElem] = useState<OrderType>();

  useEffect(() => {
    if (width < 1450) {
      setColWidths([
        8, // Дата
        10, // Водитель
        10, // Заказчик
        10, // Погрузка
        10, // Выгрузка
        8, // Цена клиента
        8, // Цена водителя
        10, // Выполнен
        5, // Док-ты
        8, // Клиент Оплата
        8, // Водитель Оплата
        8, // Номер счета
      ]);
    }
  }, [width]);
  useEffect(() => {
    const onKeypress = e => {
      if (e.code == 'Escape') {
        setEditOrder(false);
        setCurrentId(null);
      }
      if (e.code == 'Delete') {
        handleClickDelOrder();
      }
    };
    document.addEventListener('keydown', onKeypress);
    return () => {
      document.removeEventListener('keydown', onKeypress);
    };
  }, [editOrder, currentId]);

  // виртуализатор
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 50,
  });

  const items = rowVirtualizer.getVirtualItems();

  const getColStyle = (index: number) => ({
    width: `${colWidths[index]}%`,
    minWidth: 0,
  });
  const getEditBtnStyle = () => {
    if (currentId == null) {
      return 'virtualDriverTableFooterBtn grayFont';
    } else {
      return 'virtualDriverTableFooterBtn';
    }
  };

  const handleCreateOder = () => {
    setShowCreateOderWindow(true);
  };

  const handleCreateOderWindowClose = () => {
    setShowCreateOderWindow(false);
  };

  const addOder = () => {
    setShowCreateOderWindow(false);
  };

  const getCurrentId = (id: number) => {
    setCurrentId(id);
  };
  const handleClickEdit = e => {
    setEditOrder(true);
  };
  const handleCopyOrder = () => {
    setShowCreateOderWindow(true);
    if (currentId != null) {
      let currentElem = rows.find(order => order._id == currentId);
      let newElem = { ...currentElem };
      newElem.document = 'Нет';
      newElem.customerPayment = 'Нет';
      newElem.driverPayment = 'Нет';
      setNewElem(newElem);
    }
  };
  const handleClickDelOrder = () => {
    if (currentId != null) {
      const currentOrder = rows.find(order => order._id == currentId);
      if (currentOrder.completed) {
        alert('Выполненный заказ удалять нельзя!!');
      } else {
        let check = confirm('100% ?');
        if (check) {
          dispatch(delOder(currentId, 'driverorderlist'));
          setCurrentId(null);
        }
      }
    }
  };
  const handleClickSaveEdit = () => {
    setEditOrder(false);
  };

  const didAutoScroll = useRef(false);

  useEffect(() => {
    if (!didAutoScroll.current && parentRef.current && items.length > 0) {
      rowVirtualizer.scrollToIndex(rows.length - 1, { align: 'end' });
      didAutoScroll.current = true; // чтобы больше никогда не скроллило
    }
  }, [items]);

  return (
    <div className="divVrapper">
      {showCreateOderWindow && (
        <UserWindow
          header="Создать заказ"
          width={1400}
          handleClickWindowClose={handleCreateOderWindowClose}
          windowId="createDriverOderWindow"
        >
          <CreateOderNew orderTable="driverorderlist" elem={newElem} addOder={addOder} />
        </UserWindow>
      )}
      <div ref={parentRef} className="virtualTableWrapper">
        <table style={{ borderCollapse: 'collapse' }} className="virtualTable">
          <DriverThead getColStyle={getColStyle} />
          <tbody
            style={{ position: 'relative', height: `${rowVirtualizer.getTotalSize()}px` }}
            className="virtualTbody"
          >
            {items.map(virtualRow => {
              const row = rows[virtualRow.index];
              return (
                <DriverTr
                  key={row._id}
                  ref={rowVirtualizer.measureElement}
                  elem={row}
                  data-index={virtualRow.index}
                  colWidths={colWidths} // прокидываем фиксированные ширины в DriverTr
                  getCurrentId={getCurrentId}
                  currentId={currentId}
                  editOrder={editOrder}
                  handleClickSaveEdit={handleClickSaveEdit}
                  handleClickDoubleClick={handleClickEdit}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transform: `translateY(${virtualRow.start}px)`,
                    display: 'table',
                    tableLayout: 'fixed',
                    width: '100%',
                  }}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="divVrapperFooter">
        <button className="virtualDriverTableFooterBtn" onClick={handleCreateOder}>
          Создать заказ
        </button>
        <button className={getEditBtnStyle()} onClick={handleCopyOrder}>
          Копировать заказ
        </button>
        <button className={getEditBtnStyle()} onClick={handleClickEdit}>
          Редактировать заказ
        </button>
        <button className={getEditBtnStyle()} onClick={handleClickDelOrder}>
          Удалить заказ
        </button>
      </div>
    </div>
  );
};
