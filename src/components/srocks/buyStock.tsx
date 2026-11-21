import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { stock, stockTransaction, holder } from './stockType';
import { addData, editData } from '../../actions/editDataAction';
import { RenderSelect } from './standartComponents/renderSelect';
import { RenderCell } from './standartComponents/renderCell';

import './stocks.sass';

interface BuyStockProps {
  stockList: stock[];
  stockTransactions: stockTransaction[];
}

interface BuyDraft {
  stockId: number | null;
  holderId: number | null;
  quantity: string;
  price: string;
  commission: string;
  trade_date: string;
}

interface EditDraft extends BuyDraft {}

const emptyDraft = (): BuyDraft => ({
  stockId: null,
  holderId: null,
  quantity: '',
  price: '',
  commission: '',
  trade_date: '',
});

const toInputDateTime = (value: string | null | undefined) => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const pad = (n: number) => String(n).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatTradeDate = (value: string) => {
  if (!value) return value;

  return (value.length === 16 ? `${value}:00` : value).replace('T', ' ');
};

const formatAmount = (value: number | string | null | undefined) => {
  if (value == null || value === '') return '';

  const amount = Number(value);

  return Number.isFinite(amount) ? amount.toFixed(2) : '';
};

export const BuyStock = ({ stockList = [], stockTransactions = [] }: BuyStockProps) => {
  const dispatch: any = useDispatch();

  const holders = useSelector((state: any) => state.stockReducer.holders ?? []) as holder[];

  // Добавление
  const [addNewBuy, setAddNewBuy] = useState(false);
  const [newBuy, setNewBuy] = useState<BuyDraft>(emptyDraft());

  // Редактирование
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<EditDraft>(emptyDraft());

  // Обновление полей
  const updateNewBuy = (field: keyof BuyDraft, value: any) => {
    setNewBuy(prev => ({ ...prev, [field]: value }));
  };

  const updateEditDraft = (field: keyof EditDraft, value: any) => {
    setEditDraft(prev => ({ ...prev, [field]: value }));
  };

  // Начало редактирования
  const handleStartEdit = (transaction: stockTransaction) => {
    setEditingId(transaction.id ?? null);

    setEditDraft({
      stockId: transaction.stockId ?? null,
      holderId: transaction.holderId ?? null,
      quantity: String(transaction.quantity ?? ''),
      price: String(transaction.price ?? ''),
      commission: String(transaction.commission ?? ''),
      trade_date: toInputDateTime(transaction.trade_date),
    });
  };

  // Формирование данных для сохранения
  const prepareData = (draft: BuyDraft | EditDraft) => ({
    stockId: draft.stockId,
    holderId: draft.holderId,
    action_type: 'BUY',
    quantity: Number(draft.quantity),
    price: Number(draft.price),
    commission: draft.commission === '' ? 0 : Number(draft.commission),
    trade_date: formatTradeDate(draft.trade_date),
  });

  // Проверка заполнения
  const isDraftValid = (draft: BuyDraft | EditDraft) =>
    draft.stockId !== null &&
    draft.holderId !== null &&
    draft.quantity !== '' &&
    draft.price !== '' &&
    draft.trade_date !== '' &&
    Number.isFinite(Number(draft.quantity)) &&
    Number.isFinite(Number(draft.price)) &&
    Number.isFinite(Number(draft.commission || 0));

  // Сохранение новой покупки
  const handleSaveNewBuy = () => {
    if (!isDraftValid(newBuy)) return;

    dispatch(addData(prepareData(newBuy), 'stock_transactions'));

    setNewBuy(emptyDraft());
    setAddNewBuy(false);
  };

  // Сохранение изменений
  const handleSaveEdit = (id: number | null) => {
    if (id == null || !isDraftValid(editDraft)) return;

    dispatch(
      editData(
        {
          id,
          ...prepareData(editDraft),
        },
        'stock_transactions'
      )
    );

    setEditingId(null);
  };

  // Enter / Escape для редактирования
  const handleEditKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
    id: number | null
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit(id);
    }

    if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  // Enter / Escape для добавления
  const handleAddKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveNewBuy();
    }

    if (e.key === 'Escape') {
      setAddNewBuy(false);
      setNewBuy(emptyDraft());
    }
  };

  return (
    <div className="addStockContainer">
      {/* Заголовок */}
      <div className="addStockTableHeader">
        <div className="buyStockTableHeaderDiv">Тикер</div>
        <div className="buyStockTableHeaderDiv">Кол-во</div>
        <div className="buyStockTableHeaderDiv">Цена</div>
        <div className="buyStockTableHeaderDiv">Комиссия</div>
        <div className="buyStockTableHeaderDiv">Сумма</div>
        <div className="buyStockTableHeaderDiv">Дата</div>
        <div className="buyStockTableHeaderDiv">Держатель</div>
      </div>

      {/* Существующие покупки */}
      {stockTransactions.map(transaction => {
        const isEditing = editingId === transaction.id;

        const currentDate = transaction.trade_date
          ? new Date(transaction.trade_date).toLocaleString()
          : '';

        return (
          <div
            key={`buyStockKey${transaction.id}`}
            className="addStockTableString"
            onDoubleClick={() => handleStartEdit(transaction)}
          >
            {/* Тикер */}
            <RenderSelect
              isEditMode={isEditing}
              options={stockList}
              valueKey="id"
              labelKey="ticker"
              currentValue={isEditing ? editDraft.stockId : (transaction.stockId ?? null)}
              onChange={val => updateEditDraft('stockId', val !== null ? Number(val) : null)}
              onKeyDown={e => handleEditKeyDown(e, transaction.id ?? null)}
              placeholder="Тикер"
            />

            {/* Количество */}
            <RenderCell
              isEditMode={isEditing}
              value={isEditing ? editDraft.quantity : String(transaction.quantity ?? '')}
              onChange={val => updateEditDraft('quantity', val)}
              onKeyDown={e => handleEditKeyDown(e, transaction.id ?? null)}
              placeholder="Количество"
              inputType="number"
            />

            {/* Цена */}
            <RenderCell
              isEditMode={isEditing}
              value={isEditing ? editDraft.price : formatAmount(transaction.price)}
              onChange={val => updateEditDraft('price', val)}
              onKeyDown={e => handleEditKeyDown(e, transaction.id ?? null)}
              placeholder="Цена"
              inputType="number"
            />

            {/* Комиссия */}
            <RenderCell
              isEditMode={isEditing}
              value={isEditing ? editDraft.commission : formatAmount(transaction.commission)}
              onChange={val => updateEditDraft('commission', val)}
              onKeyDown={e => handleEditKeyDown(e, transaction.id ?? null)}
              placeholder="Комиссия"
              inputType="number"
            />

            {/* Сумма */}
            <div className="buyStockTableDiv">
              <span className="addStockTableSpan">{formatAmount(transaction.total_amount)}</span>
            </div>

            {/* Дата */}
            <RenderCell
              isEditMode={isEditing}
              value={isEditing ? editDraft.trade_date : currentDate}
              onChange={val => updateEditDraft('trade_date', val)}
              onKeyDown={e => handleEditKeyDown(e, transaction.id ?? null)}
              placeholder="Дата"
              inputType="datetime-local"
            />

            {/* Держатель */}
            <RenderSelect
              isEditMode={isEditing}
              options={holders}
              valueKey="id"
              labelKey="holderName"
              currentValue={isEditing ? editDraft.holderId : (transaction.holderId ?? null)}
              onChange={val => updateEditDraft('holderId', val !== null ? Number(val) : null)}
              onKeyDown={e => handleEditKeyDown(e, transaction.id ?? null)}
              placeholder="Держатель"
            />
          </div>
        );
      })}

      {/* Добавление новой покупки */}
      <div className="addStockTableString" onDoubleClick={() => setAddNewBuy(true)}>
        {/* Тикер */}
        <RenderSelect
          isEditMode={addNewBuy}
          options={stockList}
          valueKey="id"
          labelKey="ticker"
          currentValue={newBuy.stockId}
          onChange={val => updateNewBuy('stockId', val !== null ? Number(val) : null)}
          onKeyDown={handleAddKeyDown}
          isRowVisible={addNewBuy}
          placeholder="Тикер"
        />

        {/* Количество */}
        <RenderCell
          isEditMode={addNewBuy}
          value={newBuy.quantity}
          onChange={val => updateNewBuy('quantity', val)}
          onKeyDown={handleAddKeyDown}
          placeholder="Количество"
          inputType="number"
          isRowVisible={addNewBuy}
        />

        {/* Цена */}
        <RenderCell
          isEditMode={addNewBuy}
          value={newBuy.price}
          onChange={val => updateNewBuy('price', val)}
          onKeyDown={handleAddKeyDown}
          placeholder="Цена"
          inputType="number"
          isRowVisible={addNewBuy}
        />

        {/* Комиссия */}
        <RenderCell
          isEditMode={addNewBuy}
          value={newBuy.commission}
          onChange={val => updateNewBuy('commission', val)}
          onKeyDown={handleAddKeyDown}
          placeholder="Комиссия"
          inputType="number"
          isRowVisible={addNewBuy}
        />

        {/* Сумма */}
        <div className="buyStockTableDiv">
          {addNewBuy && (newBuy.quantity || newBuy.price) && (
            <span className="addStockTableSpan">
              {formatAmount(
                Number(newBuy.quantity || 0) * Number(newBuy.price || 0) +
                  Number(newBuy.commission || 0)
              )}
            </span>
          )}
        </div>

        {/* Дата */}
        <RenderCell
          isEditMode={addNewBuy}
          value={newBuy.trade_date}
          onChange={val => updateNewBuy('trade_date', val)}
          onKeyDown={handleAddKeyDown}
          placeholder="Дата"
          inputType="datetime-local"
          isRowVisible={addNewBuy}
        />

        {/* Держатель */}
        <RenderSelect
          isEditMode={addNewBuy}
          options={holders}
          valueKey="id"
          labelKey="holderName"
          currentValue={newBuy.holderId}
          onChange={val => updateNewBuy('holderId', val !== null ? Number(val) : null)}
          onKeyDown={handleAddKeyDown}
          isRowVisible={addNewBuy}
          placeholder="Держатель"
        />
      </div>
    </div>
  );
};
