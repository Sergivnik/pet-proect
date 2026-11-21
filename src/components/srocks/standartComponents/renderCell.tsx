import React from 'react';
import '../../srocks/stocks.sass';

interface RenderCellProps {
  isEditMode: boolean;
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  inputType?: string;
  isRowVisible?: boolean;
}

export const RenderCell = ({
  isEditMode,
  value,
  onChange,
  onKeyDown,
  placeholder,
  inputType = 'text',
  isRowVisible = true,
}: RenderCellProps) => {
  if (!isRowVisible) return <div className="buyStockTableDiv" />;

  return (
    <div className="buyStockTableDiv">
      {isEditMode ? (
        <input
          className="addStockInput"
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={onKeyDown}
        />
      ) : (
        <span className="addStockTableSpan">{value}</span>
      )}
    </div>
  );
};
