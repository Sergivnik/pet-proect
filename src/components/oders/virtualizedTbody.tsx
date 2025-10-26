import React, { forwardRef } from 'react';
import { FixedSizeList as List } from 'react-window';

interface Props {
  items: any[];
  RowComponent: React.ComponentType<{ elem: any }>;
  height?: number;
  rowHeight?: number;
}

const TBodyWrapper = forwardRef<HTMLTableSectionElement, any>((props, ref) => (
  <tbody {...props} ref={ref} />
));

export const VirtualizedTbody: React.FC<Props> = ({
  items,
  RowComponent,
  height = 700,
  rowHeight = 44,
}) => {
  return (
    <List
      height={height}
      itemCount={items.length}
      itemSize={rowHeight}
      width="100px"
      innerElementType={TBodyWrapper}
    >
      {({ index, style }) => {
        const elem = items[index];
        return (
          <tr
            style={{
              ...style,
              display: 'table',
              width: '100%',
              tableLayout: 'fixed',
            }}
            key={elem._id}
          >
            <RowComponent elem={elem} />
          </tr>
        );
      }}
    </List>
  );
};
