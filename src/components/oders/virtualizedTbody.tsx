import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { DriverTr } from './driverTr';
import { OrderType } from '../tsTypes';

interface Props {
  rows: OrderType[];
}

export const VirtualizedTbody: React.FC<Props> = ({ rows }) => {
  const parentRef = useRef<HTMLTableSectionElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current?.parentElement || null,
    estimateSize: () => 40,
    overscan: 5,
  });

  return (
    <tbody
      ref={parentRef}
      style={{
        position: 'relative',
        height: `${rowVirtualizer.getTotalSize()}px`,
        width: '100%', // 👈 вот это ключ
        display: 'block', // 👈 делаем tbody блочным, иначе ширина не применится
      }}
    >
      {rowVirtualizer.getVirtualItems().map(virtualRow => {
        const row = rows[virtualRow.index];
        return (
          <DriverTr
            key={row._id}
            ref={rowVirtualizer.measureElement}
            elem={row}
            data-index={virtualRow.index} // 👈 вот он!
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          />
        );
      })}
    </tbody>
  );
};
