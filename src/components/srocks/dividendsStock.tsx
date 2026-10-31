import React, { useEffect, useState } from 'react';
import { stock, dividend } from './stockType';
import { addData, editData } from '../../actions/editDataAction';
import { useDispatch } from 'react-redux';
import './stocks.sass';

interface DividendsStockProps {
  stockList: stock[];
  dividends: dividend[];
}

const toInputDateTime = (value: string | null | undefined) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
};

const formatDividendDate = (value: string) => {
  if (!value) return value;
  const withSeconds = value.length === 16 ? `${value}:00` : value;
  return withSeconds.replace('T', ' ');
};

const formatAmount = (value: number | string | null | undefined) => {
  const amount = Number(value);
  if (Number.isNaN(amount)) return '';
  return amount.toFixed(2);
};

export const DividendsStock = ({ stockList = [], dividends = [] }: DividendsStockProps) => {
  const [newDividend, setNewDividend] = useState<Partial<dividend> | null>(null);
  const [addNewDividend, setAddNewDividend] = useState<boolean>(false);
  const [stockId, setStockId] = useState<number | null>(null);
  const [sumDividend, setSumDividend] = useState<string>('');
  const [sumTax, setSumTax] = useState<string>('');
  const [dividendDate, setDividendDate] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null | undefined>(null);
  const [editStockId, setEditStockId] = useState<number | null>(null);
  const [editSumDividend, setEditSumDividend] = useState<string>('');
  const [editSumTax, setEditSumTax] = useState<string>('');
  const [editDividendDate, setEditDividendDate] = useState<string>('');

  const dispatch: any = useDispatch();

  const getTicker = (id: number | null | undefined) =>
    stockList.find(item => item.id == id)?.ticker ?? '';

  const handleAddDividend = () => setAddNewDividend(true);

  const handleKeyDownStock = (e: any) => {
    if ((e.key === 'Enter' || e.key === 'Tab') && stockId) {
      setNewDividend({
        ...newDividend,
        stockId,
      });
    }
  };

  const handleKeyDownSumDividend = (e: any) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      setNewDividend({
        ...newDividend,
        sumDividend: Number(sumDividend),
      });
    }
  };

  const handleKeyDownSumTax = (e: any) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      setNewDividend({
        ...newDividend,
        sumTax: sumTax === '' ? 0 : Number(sumTax),
      });
    }
  };

  const handleKeyDownDividendDate = (e: any) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      setNewDividend({
        ...newDividend,
        dividendDate,
      });
    }
  };

  useEffect(() => {
    if (
      newDividend?.stockId &&
      newDividend?.sumDividend != null &&
      newDividend?.sumTax != null &&
      newDividend?.dividendDate
    ) {
      setAddNewDividend(false);
      dispatch(
        addData(
          {
            stockId: newDividend.stockId,
            sumDividend: newDividend.sumDividend,
            sumTax: newDividend.sumTax,
            dividendDate: formatDividendDate(String(newDividend.dividendDate)),
          },
          'stock_dividends'
        )
      );
      setNewDividend(null);
      setStockId(null);
      setSumDividend('');
      setSumTax('');
      setDividendDate('');
    }
  }, [newDividend, dispatch]);

  const handleStartEdit = (item: dividend) => {
    setEditingId(item.id);
    setEditStockId(item.stockId ?? null);
    setEditSumDividend(String(item.sumDividend ?? ''));
    setEditSumTax(String(item.sumTax ?? ''));
    setEditDividendDate(toInputDateTime(item.dividendDate));
  };

  const handleKeyDownEdit = (e: React.KeyboardEvent, dividendId: number | null | undefined) => {
    if (e.key === 'Enter') {
      dispatch(
        editData(
          {
            id: dividendId,
            stockId: editStockId,
            sumDividend: Number(editSumDividend),
            sumTax: editSumTax === '' ? 0 : Number(editSumTax),
            dividendDate: formatDividendDate(editDividendDate),
          },
          'stock_dividends'
        )
      );
      setEditingId(null);
    }
    if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const renderCell = (config: {
    isEditMode: boolean;
    savedValue: string | null;
    currentValue: string;
    onChange: (val: string) => void;
    onKeyDown: (e: any) => void;
    placeholder: string;
    isRowVisible?: boolean;
    inputType?: string;
  }) => {
    const {
      isEditMode,
      savedValue,
      currentValue,
      onChange,
      onKeyDown,
      placeholder,
      isRowVisible = true,
      inputType = 'text',
    } = config;

    if (!isRowVisible) return <div className="dividendStockTableDiv" />;

    return (
      <div className="dividendStockTableDiv">
        {isEditMode && !savedValue ? (
          <input
            className="addStockInput"
            type={inputType}
            placeholder={placeholder}
            value={currentValue}
            onChange={e => onChange(e.target.value)}
            onKeyDown={onKeyDown}
          />
        ) : (
          <span className="addStockTableSpan">{savedValue || currentValue}</span>
        )}
      </div>
    );
  };

  const renderStockSelect = (config: {
    isEditMode: boolean;
    savedValue: string | null;
    currentValue: number | null;
    onChange: (val: number | null) => void;
    onKeyDown: (e: any) => void;
    isRowVisible?: boolean;
  }) => {
    const {
      isEditMode,
      savedValue,
      currentValue,
      onChange,
      onKeyDown,
      isRowVisible = true,
    } = config;

    if (!isRowVisible) return <div className="dividendStockTableDiv" />;

    return (
      <div className="dividendStockTableDiv">
        {isEditMode && !savedValue ? (
          <select
            className="addStockInput"
            value={currentValue ?? ''}
            onChange={e => onChange(e.target.value ? Number(e.target.value) : null)}
            onKeyDown={onKeyDown}
          >
            <option value="">Тикер</option>
            {stockList.map((item: stock) => (
              <option key={`dividendStockOption${item.id}`} value={item.id ?? ''}>
                {item.ticker}
              </option>
            ))}
          </select>
        ) : (
          <span className="addStockTableSpan">{savedValue || getTicker(currentValue)}</span>
        )}
      </div>
    );
  };

  return (
    <div className="addStockContainer">
      <div className="addStockTableHeader">
        <div className="dividendStockTableHeaderDiv">Тикер</div>
        <div className="dividendStockTableHeaderDiv">Сумма дивиденда</div>
        <div className="dividendStockTableHeaderDiv">Сумма налога</div>
        <div className="dividendStockTableHeaderDiv">Дата</div>
      </div>
      {dividends.map((item: dividend) => {
        const isCurrentEditing = editingId === item.id;
        const displayDate = item.dividendDate ? new Date(item.dividendDate).toLocaleString() : '';

        return (
          <div
            key={`dividendStockKey${item.id}`}
            className="addStockTableString"
            onDoubleClick={() => handleStartEdit(item)}
          >
            {renderStockSelect({
              isEditMode: isCurrentEditing,
              savedValue: null,
              currentValue: isCurrentEditing ? editStockId : (item.stockId ?? null),
              onChange: setEditStockId,
              onKeyDown: e => handleKeyDownEdit(e, item.id),
            })}

            {renderCell({
              isEditMode: isCurrentEditing,
              savedValue: null,
              currentValue: isCurrentEditing ? editSumDividend : formatAmount(item.sumDividend),
              onChange: setEditSumDividend,
              onKeyDown: e => handleKeyDownEdit(e, item.id),
              placeholder: 'Сумма дивиденда',
              inputType: 'number',
            })}

            {renderCell({
              isEditMode: isCurrentEditing,
              savedValue: null,
              currentValue: isCurrentEditing ? editSumTax : formatAmount(item.sumTax),
              onChange: setEditSumTax,
              onKeyDown: e => handleKeyDownEdit(e, item.id),
              placeholder: 'Сумма налога',
              inputType: 'number',
            })}

            {renderCell({
              isEditMode: isCurrentEditing,
              savedValue: null,
              currentValue: isCurrentEditing ? editDividendDate : displayDate,
              onChange: setEditDividendDate,
              onKeyDown: e => handleKeyDownEdit(e, item.id),
              placeholder: 'Дата',
              inputType: 'datetime-local',
            })}
          </div>
        );
      })}

      <div className="addStockTableString" onDoubleClick={handleAddDividend}>
        {renderStockSelect({
          isEditMode: addNewDividend,
          savedValue: newDividend?.stockId ? getTicker(newDividend.stockId) : null,
          currentValue: stockId,
          onChange: val => {
            setStockId(val);
            if (val) setNewDividend({ ...newDividend, stockId: val });
          },
          onKeyDown: handleKeyDownStock,
          isRowVisible: addNewDividend,
        })}

        {renderCell({
          isEditMode: addNewDividend,
          savedValue: newDividend?.sumDividend != null ? String(newDividend.sumDividend) : null,
          currentValue: sumDividend,
          onChange: setSumDividend,
          onKeyDown: handleKeyDownSumDividend,
          placeholder: 'Сумма дивиденда',
          isRowVisible: addNewDividend,
          inputType: 'number',
        })}

        {renderCell({
          isEditMode: addNewDividend,
          savedValue: newDividend?.sumTax != null ? String(newDividend.sumTax) : null,
          currentValue: sumTax,
          onChange: setSumTax,
          onKeyDown: handleKeyDownSumTax,
          placeholder: 'Сумма налога',
          isRowVisible: addNewDividend,
          inputType: 'number',
        })}

        {renderCell({
          isEditMode: addNewDividend,
          savedValue: newDividend?.dividendDate ? String(newDividend.dividendDate) : null,
          currentValue: dividendDate,
          onChange: setDividendDate,
          onKeyDown: handleKeyDownDividendDate,
          placeholder: 'Дата',
          isRowVisible: addNewDividend,
          inputType: 'datetime-local',
        })}
      </div>
    </div>
  );
};
