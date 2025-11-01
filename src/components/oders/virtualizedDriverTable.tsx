import React, { useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useWindowSize } from '../../hooks/useWindowSize';
import { DriverTr } from './driverTr';
import { OrderType } from '../tsTypes';
import { DriverThead } from './driverThead.tsx';
import { CreateOderNew } from '../createOder/createOderNew.jsx';
import { UserWindow } from '../userWindow/userWindow.jsx';
import './oders.sass';

interface Props {
  rows: OrderType[];
}

export const VirtualizedDriverTable: React.FC<Props> = ({ rows }) => {
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

  // виртуализатор
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 10,
  });

  const items = rowVirtualizer.getVirtualItems();

  const getColStyle = (index: number) => ({
    width: `${colWidths[index]}%`,
    minWidth: 0, // можно оставить auto, если хочешь
  });

  const handleCreateOder = () => {
    setShowCreateOderWindow(true);
  };

  const handleCreateOderWindowClose = () => {
    setShowCreateOderWindow(false);
  };

  const addOder = () => {
    setShowCreateOderWindow(false);
  };

  useEffect(() => {
    if (parentRef.current) {
      parentRef.current.scrollTop = parentRef.current.scrollHeight;
    }
  }, [rows.length]); // обновляем при изменении количества строк

  return (
    <div className="divVrapper">
      {showCreateOderWindow && (
        <UserWindow
          header="Создать заказ"
          width={1400}
          handleClickWindowClose={handleCreateOderWindowClose}
          windowId="createDriverOderWindow"
        >
          <CreateOderNew orderTable="driverorderlist" addOder={addOder} />
        </UserWindow>
      )}
      <div ref={parentRef} className="virtualTableVrapper">
        <table style={{ borderCollapse: 'collapse' }} className="virtualTable">
          <DriverThead getColStyle={getColStyle}/>
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
        <button className="divVrapperFooterBtn" onClick={handleCreateOder}>
          Создать заказ
        </button>
        <button className="divVrapperFooterBtn">Копировать заказ</button>
        <button className="divVrapperFooterBtn">Редактировать заказ</button>
        <button className="divVrapperFooterBtn">Удалить заказ</button>
      </div>
    </div>
  );
};
