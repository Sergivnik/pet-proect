import React, { useEffect, useState } from 'react';
import { stock, stockTransaction } from './stockType';
import { addData, editData } from '../../actions/editDataAction';
import { useDispatch } from 'react-redux';
import './stocks.sass';

interface BuyStockProps {
  stockList: stock[];
  stockTransactions: stockTransaction[];
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

const formatTradeDate = (value: string) => {
  if (!value) return value;
  const withSeconds = value.length === 16 ? `${value}:00` : value;
  return withSeconds.replace('T', ' ');
};

const formatAmount = (value: number | string | null | undefined) => {
  const amount = Number(value);
  if (Number.isNaN(amount)) return '';
  return amount.toFixed(2);
};

export const BuyStock = ({ stockList = [], stockTransactions = [] }: BuyStockProps) => {
  const [newBuy, setNewBuy] = useState<Partial<stockTransaction> | null>(null);
  const [addNewBuy, setAddNewBuy] = useState<boolean>(false);
  const [stockId, setStockId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [commission, setCommission] = useState<string>('');
  const [tradeDate, setTradeDate] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null | undefined>(null);
  const [editStockId, setEditStockId] = useState<number | null>(null);
  const [editQuantity, setEditQuantity] = useState<string>('');
  const [editPrice, setEditPrice] = useState<string>('');
  const [editCommission, setEditCommission] = useState<string>('');
  const [editTradeDate, setEditTradeDate] = useState<string>('');

  const dispatch: any = useDispatch();
  const buyList = stockTransactions;

  const getTicker = (id: number | null | undefined) =>
    stockList.find(item => item.id == id)?.ticker ?? '';

  const handleAddBuy = () => setAddNewBuy(true);

  const handleKeyDownStock = (e: any) => {
    if ((e.key === 'Enter' || e.key === 'Tab') && stockId) {
      setNewBuy({
        ...newBuy,
        stockId,
      });
    }
  };

  const handleKeyDownQuantity = (e: any) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      setNewBuy({
        ...newBuy,
        quantity: Number(quantity),
      });
    }
  };

  const handleKeyDownPrice = (e: any) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      setNewBuy({
        ...newBuy,
        price: Number(price),
      });
    }
  };

  const handleKeyDownCommission = (e: any) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      setNewBuy({
        ...newBuy,
        commission: commission === '' ? 0 : Number(commission),
      });
    }
  };

  const handleKeyDownTradeDate = (e: any) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      setNewBuy({
        ...newBuy,
        trade_date: tradeDate,
      });
    }
  };

  useEffect(() => {
    if (newBuy?.stockId && newBuy?.quantity && newBuy?.price && newBuy?.trade_date) {
      setAddNewBuy(false);
      dispatch(
        addData(
          {
            stockId: newBuy.stockId,
            action_type: 'BUY',
            quantity: newBuy.quantity,
            price: newBuy.price,
            commission: newBuy.commission ?? 0,
            trade_date: formatTradeDate(String(newBuy.trade_date)),
          },
          'stock_transactions'
        )
      );
      setNewBuy(null);
      setStockId(null);
      setQuantity('');
      setPrice('');
      setCommission('');
      setTradeDate('');
    }
  }, [newBuy, dispatch]);

  const handleStartEdit = (transaction: stockTransaction) => {
    setEditingId(transaction.id);
    setEditStockId(transaction.stockId ?? null);
    setEditQuantity(String(transaction.quantity ?? ''));
    setEditPrice(String(transaction.price ?? ''));
    setEditCommission(String(transaction.commission ?? ''));
    setEditTradeDate(toInputDateTime(transaction.trade_date));
  };

  const handleKeyDownEdit = (e: React.KeyboardEvent, transactionId: number | null | undefined) => {
    if (e.key === 'Enter') {
      dispatch(
        editData(
          {
            id: transactionId,
            stockId: editStockId,
            action_type: 'BUY',
            quantity: Number(editQuantity),
            price: Number(editPrice),
            commission: editCommission === '' ? 0 : Number(editCommission),
            trade_date: formatTradeDate(editTradeDate),
          },
          'stock_transactions'
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

    if (!isRowVisible) return <div className="buyStockTableDiv" />;

    return (
      <div className="buyStockTableDiv">
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

    if (!isRowVisible) return <div className="buyStockTableDiv" />;

    return (
      <div className="buyStockTableDiv">
        {isEditMode && !savedValue ? (
          <select
            className="addStockInput"
            value={currentValue ?? ''}
            onChange={e => onChange(e.target.value ? Number(e.target.value) : null)}
            onKeyDown={onKeyDown}
          >
            <option value="">Тикер</option>
            {stockList.map((item: stock) => (
              <option key={`buyStockOption${item.id}`} value={item.id ?? ''}>
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
        <div className="buyStockTableHeaderDiv">Тикер</div>
        <div className="buyStockTableHeaderDiv">Количество</div>
        <div className="buyStockTableHeaderDiv">Цена</div>
        <div className="buyStockTableHeaderDiv">Комиссия</div>
        <div className="buyStockTableHeaderDiv">Сумма</div>
        <div className="buyStockTableHeaderDiv">Дата</div>
      </div>
      {buyList.map((transaction: stockTransaction) => {
        const isCurrentEditing = editingId === transaction.id;
        const displayDate = transaction.trade_date
          ? new Date(transaction.trade_date).toLocaleString()
          : '';

        return (
          <div
            key={`buyStockKey${transaction.id}`}
            className="addStockTableString"
            onDoubleClick={() => handleStartEdit(transaction)}
          >
            {renderStockSelect({
              isEditMode: isCurrentEditing,
              savedValue: null,
              currentValue: isCurrentEditing ? editStockId : (transaction.stockId ?? null),
              onChange: setEditStockId,
              onKeyDown: e => handleKeyDownEdit(e, transaction.id),
            })}

            {renderCell({
              isEditMode: isCurrentEditing,
              savedValue: null,
              currentValue: isCurrentEditing ? editQuantity : String(transaction.quantity ?? ''),
              onChange: setEditQuantity,
              onKeyDown: e => handleKeyDownEdit(e, transaction.id),
              placeholder: 'Количество',
              inputType: 'number',
            })}

            {renderCell({
              isEditMode: isCurrentEditing,
              savedValue: null,
              currentValue: isCurrentEditing ? editPrice : formatAmount(transaction.price),
              onChange: setEditPrice,
              onKeyDown: e => handleKeyDownEdit(e, transaction.id),
              placeholder: 'Цена',
              inputType: 'number',
            })}

            {renderCell({
              isEditMode: isCurrentEditing,
              savedValue: null,
              currentValue: isCurrentEditing
                ? editCommission
                : formatAmount(transaction.commission),
              onChange: setEditCommission,
              onKeyDown: e => handleKeyDownEdit(e, transaction.id),
              placeholder: 'Комиссия',
              inputType: 'number',
            })}

            <div className="buyStockTableDiv">
              <span className="addStockTableSpan">{formatAmount(transaction.total_amount)}</span>
            </div>

            {renderCell({
              isEditMode: isCurrentEditing,
              savedValue: null,
              currentValue: isCurrentEditing ? editTradeDate : displayDate,
              onChange: setEditTradeDate,
              onKeyDown: e => handleKeyDownEdit(e, transaction.id),
              placeholder: 'Дата',
              inputType: 'datetime-local',
            })}
          </div>
        );
      })}

      <div className="addStockTableString" onDoubleClick={handleAddBuy}>
        {renderStockSelect({
          isEditMode: addNewBuy,
          savedValue: newBuy?.stockId ? getTicker(newBuy.stockId) : null,
          currentValue: stockId,
          onChange: val => {
            setStockId(val);
            if (val) setNewBuy({ ...newBuy, stockId: val });
          },
          onKeyDown: handleKeyDownStock,
          isRowVisible: addNewBuy,
        })}

        {renderCell({
          isEditMode: addNewBuy,
          savedValue: newBuy?.quantity != null ? String(newBuy.quantity) : null,
          currentValue: quantity,
          onChange: setQuantity,
          onKeyDown: handleKeyDownQuantity,
          placeholder: 'Количество',
          isRowVisible: addNewBuy,
          inputType: 'number',
        })}

        {renderCell({
          isEditMode: addNewBuy,
          savedValue: newBuy?.price != null ? String(newBuy.price) : null,
          currentValue: price,
          onChange: setPrice,
          onKeyDown: handleKeyDownPrice,
          placeholder: 'Цена',
          isRowVisible: addNewBuy,
          inputType: 'number',
        })}

        {renderCell({
          isEditMode: addNewBuy,
          savedValue: newBuy?.commission != null ? String(newBuy.commission) : null,
          currentValue: commission,
          onChange: setCommission,
          onKeyDown: handleKeyDownCommission,
          placeholder: 'Комиссия',
          isRowVisible: addNewBuy,
          inputType: 'number',
        })}

        <div className="buyStockTableDiv">
          {addNewBuy && (quantity || price) ? (
            <span className="addStockTableSpan">
              {formatAmount(
                (Number(quantity) || 0) * (Number(price) || 0) + (Number(commission) || 0)
              )}
            </span>
          ) : null}
        </div>

        {renderCell({
          isEditMode: addNewBuy,
          savedValue: newBuy?.trade_date ? String(newBuy.trade_date) : null,
          currentValue: tradeDate,
          onChange: setTradeDate,
          onKeyDown: handleKeyDownTradeDate,
          placeholder: 'Дата',
          isRowVisible: addNewBuy,
          inputType: 'datetime-local',
        })}
      </div>
    </div>
  );
};
