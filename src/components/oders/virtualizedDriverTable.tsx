import React, { useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useWindowSize } from '../../hooks/useWindowSize';
import { DriverTr } from './driverTr';
import { OrderType } from '../tsTypes';
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

  useEffect(() => {
    if (parentRef.current) {
      parentRef.current.scrollTop = parentRef.current.scrollHeight;
    }
  }, [rows.length]); // обновляем при изменении количества строк

  return (
    <div
      ref={parentRef}
      style={{ height: 'calc(100vh - 85px)', overflowY: 'auto' }}
      className="virtualTableVrapper"
    >
      <table style={{ borderCollapse: 'collapse' }} className="virtualTable">
        <thead style={{ position: 'sticky', top: 0, zIndex: 2 }} className="virtualTHead">
          <tr>
            <th style={{ ...getColStyle(0), position: 'relative' }}>
              <span style={{ marginRight: '20px', display: 'inline-block' }}>Дата</span>
              <svg
                width="18" // 12 * 1.5
                height="18" // 12 * 1.5
                viewBox="0 0 12 12"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: 'absolute',
                  bottom: '4px', // отступ от низа
                  right: '4px', // отступ от правого края
                }}
              >
                <path
                  d="M2 4 L6 8 L10 4 Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
            </th>

            <th style={getColStyle(1)}>
              <span style={{ marginRight: '20px', display: 'inline-block' }}>Водитель</span>
              <svg
                width="18" // 12 * 1.5
                height="18" // 12 * 1.5
                viewBox="0 0 12 12"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: 'absolute',
                  bottom: '4px', // отступ от низа
                  right: '4px', // отступ от правого края
                }}
              >
                <path
                  d="M2 4 L6 8 L10 4 Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
            </th>
            <th style={getColStyle(2)}>
              <span style={{ marginRight: '20px', display: 'inline-block' }}>Заказчик</span>
              <svg
                width="18" // 12 * 1.5
                height="18" // 12 * 1.5
                viewBox="0 0 12 12"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: 'absolute',
                  bottom: '4px', // отступ от низа
                  right: '4px', // отступ от правого края
                }}
              >
                <path
                  d="M2 4 L6 8 L10 4 Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
            </th>
            <th style={getColStyle(3)}>
              <span style={{ marginRight: '20px', display: 'inline-block' }}>Погрузка</span>
              <svg
                width="18" // 12 * 1.5
                height="18" // 12 * 1.5
                viewBox="0 0 12 12"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: 'absolute',
                  bottom: '4px', // отступ от низа
                  right: '4px', // отступ от правого края
                }}
              >
                <path
                  d="M2 4 L6 8 L10 4 Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
            </th>
            <th style={getColStyle(4)}>
              <span style={{ marginRight: '20px', display: 'inline-block' }}>Выгрузка</span>
              <svg
                width="18" // 12 * 1.5
                height="18" // 12 * 1.5
                viewBox="0 0 12 12"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: 'absolute',
                  bottom: '4px', // отступ от низа
                  right: '4px', // отступ от правого края
                }}
              >
                <path
                  d="M2 4 L6 8 L10 4 Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
            </th>
            <th style={getColStyle(5)}>
              <span style={{ marginRight: '20px', display: 'inline-block' }}>Цена клиента</span>
              <svg
                width="18" // 12 * 1.5
                height="18" // 12 * 1.5
                viewBox="0 0 12 12"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: 'absolute',
                  bottom: '4px', // отступ от низа
                  right: '4px', // отступ от правого края
                }}
              >
                <path
                  d="M2 4 L6 8 L10 4 Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
            </th>
            <th style={getColStyle(6)}>
              <span style={{ marginRight: '20px', display: 'inline-block' }}>Цена водителя</span>
              <svg
                width="18" // 12 * 1.5
                height="18" // 12 * 1.5
                viewBox="0 0 12 12"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: 'absolute',
                  bottom: '4px', // отступ от низа
                  right: '4px', // отступ от правого края
                }}
              >
                <path
                  d="M2 4 L6 8 L10 4 Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
            </th>
            <th style={getColStyle(7)}>
              <span style={{ marginRight: '20px', display: 'inline-block' }}>Выполнен</span>
              <svg
                width="18" // 12 * 1.5
                height="18" // 12 * 1.5
                viewBox="0 0 12 12"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: 'absolute',
                  bottom: '4px', // отступ от низа
                  right: '4px', // отступ от правого края
                }}
              >
                <path
                  d="M2 4 L6 8 L10 4 Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
            </th>
            <th style={getColStyle(8)}>
              <span style={{ marginRight: '20px', display: 'inline-block' }}>Док-ты</span>
              <svg
                width="18" // 12 * 1.5
                height="18" // 12 * 1.5
                viewBox="0 0 12 12"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: 'absolute',
                  bottom: '4px', // отступ от низа
                  right: '4px', // отступ от правого края
                }}
              >
                <path
                  d="M2 4 L6 8 L10 4 Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
            </th>
            <th style={getColStyle(9)}>
              <span style={{ marginRight: '20px', display: 'inline-block' }}>Клиент Оплата</span>
              <svg
                width="18" // 12 * 1.5
                height="18" // 12 * 1.5
                viewBox="0 0 12 12"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: 'absolute',
                  bottom: '4px', // отступ от низа
                  right: '4px', // отступ от правого края
                }}
              >
                <path
                  d="M2 4 L6 8 L10 4 Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
            </th>
            <th style={getColStyle(10)}>
              <span style={{ marginRight: '20px', display: 'inline-block' }}>Водитель Оплата</span>
              <svg
                width="18" // 12 * 1.5
                height="18" // 12 * 1.5
                viewBox="0 0 12 12"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: 'absolute',
                  bottom: '4px', // отступ от низа
                  right: '4px', // отступ от правого края
                }}
              >
                <path
                  d="M2 4 L6 8 L10 4 Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
            </th>
            <th style={getColStyle(11)}>
              <span style={{ marginRight: '20px', display: 'inline-block' }}>Номер счета</span>
              <svg
                width="18" // 12 * 1.5
                height="18" // 12 * 1.5
                viewBox="0 0 12 12"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: 'absolute',
                  bottom: '4px', // отступ от низа
                  right: '4px', // отступ от правого края
                }}
              >
                <path
                  d="M2 4 L6 8 L10 4 Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
            </th>
          </tr>
        </thead>
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
  );
};
