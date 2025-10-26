// VirtualizedTbody.tsx
import React, { forwardRef } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

interface VirtualizedTbodyProps {
  items: any[];
  RowComponent: React.ComponentType<{ elem: any }>;
  height?: number;
  rowHeight?: number;
}

// Для корректного рендера <tbody> вместо <div>
const TBodyWrapper = forwardRef<HTMLTableSectionElement, any>((props, ref) => (
  <tbody {...props} ref={ref} />
));

export const VirtualizedTbody: React.FC<VirtualizedTbodyProps> = ({
  items,
  RowComponent,
  height = 700,
  rowHeight = 44,
}) => {
  // Функция для рендера строки
  const Row = ({ index, style }: ListChildComponentProps) => {
    const elem = items[index];
    return (
      <tr
        key={elem._id || index}
        style={{
          ...style,
          display: 'table',
          width: '100%',
          tableLayout: 'fixed',
        }}
      >
        <RowComponent elem={elem} />
      </tr>
    );
  };

  return (
    <FixedSizeList
      height={height}
      itemCount={items.length}
      itemSize={rowHeight}
      width="100%"
      innerElementType={TBodyWrapper}
      // ⚠️ передаём Row через функцию, иначе TS ругается
      children={(props: ListChildComponentProps) => <Row {...props} />}
    />
  );
};
