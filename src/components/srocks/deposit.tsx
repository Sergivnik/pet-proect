import React, { useEffect, useState } from 'react';
import { addData, editData } from '../../actions/editDataAction';
import { useDispatch, useSelector } from 'react-redux';
import { deposit, CurrencySymbol, holder, transactionType } from './stockType.tsx';
import { RenderSelect } from './standartComponents/renderSelect';
import './stocks.sass';

interface DepositProps {
  depositList: deposit[];
  transactionType: transactionType[];
  holders: holder[];
}

const toInputDateTime = (value: string | null | undefined) => {
  if (!value) return '';

  return value.replace(' ', 'T').slice(0, 16);
};

const formatDate = (value: string) => {
  if (!value) return '';

  const withSeconds = value.length === 16 ? `${value}:00` : value;
  return withSeconds.replace('T', ' ');
};

const formatAmount = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === '') return '';

  const amount = Number(value);

  if (Number.isNaN(amount)) return '';

  return amount.toFixed(2);
};

const currencies: CurrencySymbol[] = ['$', '€', '₽', '₺'];

export const Deposit = ({ depositList = [], transactionType = [], holders = [] }: DepositProps) => {
  const dispatch: any = useDispatch();
  console.log(transactionType);

  const [addNew, setAddNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Добавление
  const [newDate, setNewDate] = useState('');
  const [newSumDeposit, setNewSumDeposit] = useState('');
  const [newSumInterest, setNewSumInterest] = useState('');
  const [newCurrency, setNewCurrency] = useState<CurrencySymbol>('$');
  const [newHolderId, setNewHolderId] = useState<number | null>(null);

  // Редактирование
  const [editDate, setEditDate] = useState('');
  const [editSumDeposit, setEditSumDeposit] = useState('');
  const [editSumInterest, setEditSumInterest] = useState('');
  const [editCurrency, setEditCurrency] = useState<CurrencySymbol>('$');
  const [editHolderId, setEditHolderId] = useState<number | null>(null);

  const resetAdd = () => {
    setAddNew(false);
    setNewDate('');
    setNewSumDeposit('');
    setNewSumInterest('');
    setNewCurrency('$');
    setNewHolderId(null);
  };

  const handleAdd = () => {
    setAddNew(true);
  };

  const handleStartEdit = (item: deposit) => {
    if (!item.id) return;
    setEditingId(item.id);
    setEditDate(toInputDateTime(item.date));
    setEditSumDeposit(String(item.sumDeposit ?? ''));
    setEditSumInterest(String(item['sumInterest'] ?? ''));
    setEditCurrency(item.currencySymbol);
    setEditHolderId(item.holderId ?? null);
  };

  const handleAddSave = () => {
    if (!newDate || !newCurrency || newHolderId === null) return;

    if (
      (newSumDeposit !== '' && !Number.isFinite(Number(newSumDeposit))) ||
      (newSumInterest !== '' && !Number.isFinite(Number(newSumInterest)))
    ) {
      return;
    }

    dispatch(
      addData(
        {
          date: formatDate(newDate),
          sumDeposit: newSumDeposit === '' ? null : Number(newSumDeposit),
          sumInterest: newSumInterest === '' ? null : Number(newSumInterest),
          currencySymbol: newCurrency,
          holderId: newHolderId,
        },
        'deposit'
      )
    );

    resetAdd();
  };

  const handleEditSave = (id: number) => {
    if (!editDate || !editCurrency || editHolderId === null) return;

    if (
      (editSumDeposit !== '' && !Number.isFinite(Number(editSumDeposit))) ||
      (editSumInterest !== '' && !Number.isFinite(Number(editSumInterest)))
    ) {
      return;
    }

    dispatch(
      editData(
        {
          id,
          date: formatDate(editDate),
          sumDeposit: editSumDeposit === '' ? null : Number(editSumDeposit),
          sumInterest: editSumInterest === '' ? null : Number(editSumInterest),
          currencySymbol: editCurrency,
          holderId: editHolderId,
        },
        'deposit'
      )
    );

    setEditingId(null);
  };

  const handleKeyDownAdd = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSave();
    }

    if (e.key === 'Escape') {
      resetAdd();
    }
  };

  const handleKeyDownEdit = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
    id: number
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEditSave(id);
    }

    if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const renderInput = (
    value: string,
    onChange: (value: string) => void,
    placeholder: string,
    type: string,
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  ) => (
    <div className="depositTableDiv">
      <input
        className="addStockInput"
        type={type}
        step={type === 'number' ? '0.01' : undefined}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  );

  const renderCurrency = (
    value: CurrencySymbol,
    onChange: (value: CurrencySymbol) => void,
    onKeyDown: (e: React.KeyboardEvent<HTMLSelectElement>) => void
  ) => (
    <div className="depositTableDiv">
      <select
        className="addStockInput"
        value={value}
        onChange={e => onChange(e.target.value as CurrencySymbol)}
        onKeyDown={onKeyDown}
      >
        {currencies.map(currency => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="addStockContainer">
      <div className="addStockTableHeader">
        <div className="depositTableHeaderDiv">Дата</div>
        <div className="depositTableHeaderDiv">Сумма вклада</div>
        <div className="depositTableHeaderDiv">Проценты по вкладу</div>
        <div className="depositTableHeaderDiv">Валюта</div>
        <div className="depositTableHeaderDiv">Держатель</div>
      </div>

      {depositList.map(item => {
        const isEditing = editingId === item.id;

        return (
          <div
            key={`depositKey${item.id}`}
            className="addStockTableString"
            onDoubleClick={() => handleStartEdit(item)}
          >
            {isEditing ? (
              <>
                {renderInput(editDate, setEditDate, 'Дата', 'datetime-local', e => {
                  if (!item.id) return;
                  handleKeyDownEdit(e, item.id);
                })}

                {renderInput(editSumDeposit, setEditSumDeposit, 'Сумма вклада', 'number', e => {
                  if (!item.id) return;
                  handleKeyDownEdit(e, item.id);
                })}

                {renderInput(editSumInterest, setEditSumInterest, 'Вторая сумма', 'number', e => {
                  if (!item.id) return;
                  handleKeyDownEdit(e, item.id);
                })}

                {renderCurrency(editCurrency, setEditCurrency, e => {
                  if (!item.id) return;
                  handleKeyDownEdit(e, item.id);
                })}

                <RenderSelect
                  isEditMode
                  options={holders}
                  valueKey="id"
                  labelKey="holderName"
                  currentValue={editHolderId}
                  onChange={val => setEditHolderId(val !== null ? Number(val) : null)}
                  onKeyDown={e => {
                    if (!item.id) return;
                    handleKeyDownEdit(e, item.id);
                  }}
                  placeholder="Держатель"
                  cellClassName="depositTableDiv"
                />
              </>
            ) : (
              <>
                <div className="depositTableDiv">
                  <span className="addStockTableSpan">
                    {new Date(item.date?.replace(' ', 'T') ?? '').toLocaleString()}
                  </span>
                </div>

                <div className="depositTableDiv">
                  <span className="addStockTableSpan">{formatAmount(item.sumDeposit)}</span>
                </div>

                <div className="depositTableDiv">
                  <span className="addStockTableSpan">{formatAmount(item['sumInterest'])}</span>
                </div>

                <div className="depositTableDiv">
                  <span className="addStockTableSpan">{item.currencySymbol}</span>
                </div>

                <RenderSelect
                  isEditMode={false}
                  options={holders}
                  valueKey="id"
                  labelKey="holderName"
                  currentValue={item.holderId ?? null}
                  onChange={() => undefined}
                  placeholder="Держатель"
                  cellClassName="depositTableDiv"
                />
              </>
            )}
          </div>
        );
      })}

      {/* Строка добавления */}
      <div className="addStockTableString" onDoubleClick={handleAdd}>
        {addNew ? (
          <>
            {renderInput(newDate, setNewDate, 'Дата', 'datetime-local', handleKeyDownAdd)}

            {renderInput(
              newSumDeposit,
              setNewSumDeposit,
              'Сумма вклада',
              'number',
              handleKeyDownAdd
            )}

            {renderInput(
              newSumInterest,
              setNewSumInterest,
              'Вторая сумма',
              'number',
              handleKeyDownAdd
            )}

            {renderCurrency(newCurrency, setNewCurrency, handleKeyDownAdd)}

            <RenderSelect
              isEditMode
              options={holders}
              valueKey="id"
              labelKey="holderName"
              currentValue={newHolderId}
              onChange={val => setNewHolderId(val !== null ? Number(val) : null)}
              onKeyDown={handleKeyDownAdd}
              placeholder="Держатель"
              cellClassName="depositTableDiv"
            />
          </>
        ) : (
          <div className="addDepositDiv">
            <span className="addStockTableSpan">+ Добавить вклад (двойной щелчок)</span>
          </div>
        )}
      </div>
    </div>
  );
};
