import React from 'react';
import '../../srocks/stocks.sass';

interface SelectOption {
  id?: number | string | null;
  [key: string]: any;
}

interface RenderSelectProps<T extends SelectOption> {
  isEditMode: boolean;
  options: T[];
  valueKey: keyof T;
  labelKey: keyof T;
  currentValue: number | string | null;
  onChange: (value: number | string | null) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  isRowVisible?: boolean;
  cellClassName?: string;
}

export const RenderSelect = <T extends SelectOption>({
  isEditMode,
  options = [],
  valueKey,
  labelKey,
  currentValue,
  onChange,
  onKeyDown,
  onBlur,
  placeholder = 'Выберите значение',
  isRowVisible = true,
  cellClassName = 'buyStockTableDiv',
}: RenderSelectProps<T>) => {
  if (!isRowVisible) {
    return <div className={cellClassName} />;
  }

  const selectedOption = options.find(
    item => item[valueKey] != null && String(item[valueKey]) === String(currentValue)
  );

  return (
    <div className={cellClassName}>
      {isEditMode ? (
        <select
          className="addStockInput"
          value={currentValue ?? ''}
          onChange={e => {
            const selected = options.find(
              item => item[valueKey] != null && String(item[valueKey]) === e.target.value
            );

            onChange(selected ? (selected[valueKey] as number | string) : null);
          }}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
        >
          <option value="">{placeholder}</option>

          {options.map(item => {
            const value = item[valueKey];

            if (value == null) return null;

            return (
              <option key={String(value)} value={String(value)}>
                {String(item[labelKey] ?? '')}
              </option>
            );
          })}
        </select>
      ) : (
        <span className="addStockTableSpan">
          {selectedOption ? String(selectedOption[labelKey] ?? '') : ''}
        </span>
      )}
    </div>
  );
};
