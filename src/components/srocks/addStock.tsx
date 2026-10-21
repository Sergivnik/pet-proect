import React, { useEffect, useState } from 'react';
import { stock } from './stockType';
import { addData } from '../../actions/editDataAction';
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

  const dispatch: any = useDispatch();

  const handleAddStock = () => {
    setAddNewStock(true);
  };
  const handleKeyDownFullNameStock = (e: any) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      let updatedStock: stock = {
        idStock: newStak?.idStock ?? null,
        ticker: newStak?.ticker ?? null,
        fullNameStock,
      };
      setNewStock(updatedStock);
    }
  };
  const handleKeyDownTicker = (e: any) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      let updatedStock: stock = {
        idStock: newStak?.idStock ?? null,
        ticker,
        fullNameStock: newStak?.fullNameStock ?? null,
      };
      setNewStock(updatedStock);
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
  }, [newStak]);

  return (
    <div className="addStockContainer">
      {stockList.map((stock: stock) => {
        return (
          <div key={`stockKey${stock.idStock}`} className="addStockTableString">
            <div className="addStockTableDiv">
              <span className="addStockTableSpan">{stock.fullNameStock}</span>
            </div>
            <div className="addStockTableDiv">
              <span className="addStockTableSpan">{stock.ticker}</span>
            </div>
            <div className="addStockTableDiv">
              <span className="addStockTableSpan">Тут будет цена</span>
            </div>
          </div>
        );
      })}
      <div className="addStockTableString" onDoubleClick={handleAddStock}>
        <div className="addStockTableDiv">
          {addNewStock ? (
            newStak?.fullNameStock ? (
              <span className="addStockTableSpan"> {newStak.fullNameStock} </span>
            ) : (
              <input
                className="addStockInput"
                value={fullNameStock ? fullNameStock : ''}
                onChange={e => setFullNameStock(e.target.value)}
                onKeyDown={handleKeyDownFullNameStock}
              />
            )
          ) : null}
        </div>
        <div className="addStockTableDiv">
          {addNewStock ? (
            newStak?.ticker ? (
              <span className="addStockTableSpan"> {newStak.ticker} </span>
            ) : (
              <input
                className="addStockInput"
                value={ticker ? ticker : ''}
                onChange={e => setTicker(e.target.value)}
                onKeyDown={handleKeyDownTicker}
              />
            )
          ) : null}
        </div>
        <div className="addStockTableDiv"></div>
      </div>
    </div>
  );
};
