import React, { useEffect, useState } from 'react';
import { stock } from './stockType';
import { addData, editData } from '../../actions/editDataAction';
import { useDispatch } from 'react-redux';
import './stocks.sass';

interface AddStockProps {
  stockList: stock[];
}

export const AddStock = ({ stockList = [] }: AddStockProps) => {
  const [newStak, setNewStock] = useState<stock | null>(null);
  const [addNewStock, setAddNewStock] = useState<boolean>(false);
  const [fullNameStock, setFullNameStock] = useState<string | null>(null);
  const [ticker, setTicker] = useState<string | null>(null);
  const [editingStockId, setEditingStockId] = useState<number | null>(null);
  const [editFullName, setEditFullName] = useState<string>('');
  const [editTicker, setEditTicker] = useState<string>('');

  const dispatch: any = useDispatch();

  const handleAddStock = () => setAddNewStock(true);

  const handleKeyDownFullNameStock = (e: any) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      setNewStock({
        id: newStak?.id ?? null,
        ticker: newStak?.ticker ?? null,
        fullNameStock,
      });
    }
  };

  const handleKeyDownTicker = (e: any) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      setNewStock({
        id: newStak?.id ?? null,
        ticker,
        fullNameStock: newStak?.fullNameStock ?? null,
      });
    }
  };

  useEffect(() => {
    if (newStak?.fullNameStock && newStak?.ticker) {
      setAddNewStock(false);
      dispatch(addData(newStak, 'stocks'));
      setNewStock(null);
      setFullNameStock(null);
      setTicker(null);
    }
  }, [newStak, dispatch]);

  const handleStartEdit = (stock: stock) => {
    setEditingStockId(stock.id);
    setEditFullName(stock.fullNameStock ?? '');
    setEditTicker(stock.ticker ?? '');
  };

  const handleKeyDownEdit = (e: React.KeyboardEvent, stockId: number) => {
    if (e.key === 'Enter') {
      dispatch(
        editData({ id: stockId, fullNameStock: editFullName, ticker: editTicker }, 'stocks')
      );
      console.log('Сохраняем измененную акцию:', stockId, editFullName, editTicker);
      setEditingStockId(null);
    }
    if (e.key === 'Escape') {
      setEditingStockId(null);
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
  }) => {
    const {
      isEditMode,
      savedValue,
      currentValue,
      onChange,
      onKeyDown,
      placeholder,
      isRowVisible = true,
    } = config;

    if (!isRowVisible) return <div className="addStockTableDiv" />;

    return (
      <div className="addStockTableDiv">
        {isEditMode && !savedValue ? (
          <input
            className="addStockInput"
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

  return (
    <div className="addStockContainer">
      {stockList.map((stock: stock) => {
        const isCurrentEditing = editingStockId === stock.id;

        return (
          <div
            key={`stockKey${stock.id}`}
            className="addStockTableString"
            onDoubleClick={() => handleStartEdit(stock)}
          >
            {renderCell({
              isEditMode: isCurrentEditing,
              savedValue: null,
              currentValue: isCurrentEditing ? editFullName : (stock.fullNameStock ?? ''),
              onChange: setEditFullName,
              onKeyDown: e => handleKeyDownEdit(e, stock.id),
              placeholder: 'Полное название',
            })}

            {renderCell({
              isEditMode: isCurrentEditing,
              savedValue: null,
              currentValue: isCurrentEditing ? editTicker : (stock.ticker ?? ''),
              onChange: setEditTicker,
              onKeyDown: e => handleKeyDownEdit(e, stock.id),
              placeholder: 'Тикер',
            })}

            <div className="addStockTableDiv">
              <span className="addStockTableSpan">Тут будет цена</span>
            </div>
          </div>
        );
      })}

      <div className="addStockTableString" onDoubleClick={handleAddStock}>
        {renderCell({
          isEditMode: addNewStock,
          savedValue: newStak?.fullNameStock ?? null,
          currentValue: fullNameStock ?? '',
          onChange: setFullNameStock,
          onKeyDown: handleKeyDownFullNameStock,
          placeholder: 'Полное название',
          isRowVisible: addNewStock,
        })}

        {renderCell({
          isEditMode: addNewStock,
          savedValue: newStak?.ticker ?? null,
          currentValue: ticker ?? '',
          onChange: setTicker,
          onKeyDown: handleKeyDownTicker,
          placeholder: 'Тикер',
          isRowVisible: addNewStock,
        })}

        <div className="addStockTableDiv"></div>
      </div>
    </div>
  );
};
