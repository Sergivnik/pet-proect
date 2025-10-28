import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { DriverTr } from './driverTr';
import { OrderType } from '../tsTypes';

interface Props {
  rows: OrderType[];
}

export const VirtualizedDriverTable: React.FC<Props> = ({ rows }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  // виртуализатор
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 10,
  });

  const items = rowVirtualizer.getVirtualItems();

  // задаём долю ширины для каждой колонки (сумма = 100)
  const colWidths = [
    8, // Дата
    10, // Водитель
    12, // Заказчик
    12, // Погрузка
    12, // Выгрузка
    8, // Цена клиента
    8, // Цена водителя
    5, // Выполнен
    5, // Док-ты
    10, // Клиент Оплата
    10, // Водитель Оплата
    10, // Номер счета
  ];

  const getColStyle = (index: number) => ({
    width: `${colWidths[index]}%`,
    minWidth: 0, // можно оставить auto, если хочешь
  });

  return (
    <div ref={parentRef} style={{ height: '100vh', overflowY: 'auto' }}>
      <table style={{ borderCollapse: 'collapse' }}>
        <thead style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 2 }}>
          <tr>
            <th style={getColStyle(0)}>Дата</th>
            <th style={getColStyle(1)}>Водитель</th>
            <th style={getColStyle(2)}>Заказчик</th>
            <th style={getColStyle(3)}>Погрузка</th>
            <th style={getColStyle(4)}>Выгрузка</th>
            <th style={getColStyle(5)}>Цена клиента</th>
            <th style={getColStyle(6)}>Цена водителя</th>
            <th style={getColStyle(7)}>Выполнен</th>
            <th style={getColStyle(8)}>Док-ты</th>
            <th style={getColStyle(9)}>Клиент Оплата</th>
            <th style={getColStyle(10)}>Водитель Оплата</th>
            <th style={getColStyle(11)}>Номер счета</th>
          </tr>
        </thead>
        <tbody style={{ position: 'relative', height: `${rowVirtualizer.getTotalSize()}px` }}>
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
  );
};
