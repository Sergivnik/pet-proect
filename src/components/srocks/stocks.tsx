import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DOMENNAME } from '../../middlewares/initialState.js';
import { authSignOut } from '../../actions/auth.js';
import { AddStock } from './addStock.tsx';
import { BuyStock } from './buyStock.tsx';
import { DividendsStock } from './dividendsStock.tsx';
import { Window } from '../userWindow/window.tsx';
import { getStockTransactions } from '../../actions/stockAction.js';
import { stock, stockTransaction, dividend } from './stockType.tsx';
import './stocks.sass';

export const Stocks = () => {
  const stockList: stock[] = useSelector((state: any) => state.stockReducer.stocks);
  const stockTransactions: stockTransaction[] = useSelector(
    (state: any) => state.stockReducer.stock_transactions
  );
  const dividends: dividend[] = useSelector((state: any) => state.stockReducer.stock_dividends);

  const [showWindowAddStock, setShowWindowAddStock] = useState<boolean>(false);
  const [showWindowBuyStock, setShowWindowBuyStock] = useState<boolean>(false);
  const [showWindowDividends, setShowWindowDividends] = useState<boolean>(false);

  const [widthScreen, setWidthScreen] = useState<number>(window.innerWidth);
  const [widthWindow, setWidthWindow] = useState<number>(800);

  const dispatch: any = useDispatch();
  const handleClickExit = () => {
    dispatch(authSignOut());
  };

  useEffect(() => {
    const handleResize = () => setWidthScreen(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    dispatch(getStockTransactions());
  }, [dispatch]);

  useEffect(() => {
    console.log(stockList, stockTransactions);
  }, [stockList]);

  const handleClickAddStock = () => {
    setShowWindowAddStock(true);
    if (widthScreen < 800) {
      setWidthWindow(widthScreen - 100);
    } else {
      setWidthWindow(800);
    }
  };

  const handleClickBuyStock = () => {
    setShowWindowBuyStock(true);
    if (widthScreen < 800) {
      setWidthWindow(widthScreen - 100);
    } else {
      setWidthWindow(800);
    }
  };
  const handleClickGetDividendsStock = () => {
    setShowWindowDividends(true);
    if (widthScreen < 800) {
      setWidthWindow(widthScreen - 100);
    } else {
      setWidthWindow(800);
    }
  };
  const handleClickDeposit = () => console.log('Deposit');

  return (
    <div className="stocksContainer">
      <header className="stocksHeader">
        <div className="stocksLogo">
          <Link to="/">
            <img
              className="stocksLogoImg"
              src={`${DOMENNAME}/img/track.png`}
              height="50"
              width="80"
            />
          </Link>
        </div>
        <div className="stocksMenu">
          <div className="stocksMenuButton" onClick={handleClickAddStock}>
            Add Stock
          </div>
          <div className="stocksMenuButton" onClick={handleClickBuyStock}>
            Buy Stock
          </div>
          <div className="stocksMenuButton" onClick={handleClickGetDividendsStock}>
            Get Dividends Stock
          </div>
          <div className="stocksMenuButton" onClick={handleClickDeposit}>
            Deposit
          </div>
        </div>
        <div className="stocksExit" onClick={handleClickExit}>
          Exit
        </div>
      </header>
      <div className="stocksBody"></div>

      {showWindowAddStock && (
        <Window
          title="Add Stock"
          width={widthWindow}
          startX={(widthScreen - widthWindow) / 2}
          startY={200}
          onClose={() => setShowWindowAddStock(false)}
        >
          <AddStock stockList={stockList} />
        </Window>
      )}

      {showWindowBuyStock && (
        <Window
          title="Buy Stock"
          width={widthWindow}
          startX={(widthScreen - widthWindow) / 2}
          startY={200}
          onClose={() => setShowWindowBuyStock(false)}
        >
          <BuyStock stockList={stockList} stockTransactions={stockTransactions} />
        </Window>
      )}

      {showWindowDividends && (
        <Window
          title="Get Dividends Stock"
          width={widthWindow}
          startX={(widthScreen - widthWindow) / 2}
          startY={200}
          onClose={() => setShowWindowDividends(false)}
        >
          <DividendsStock stockList={stockList} dividends={dividends} />
        </Window>
      )}
    </div>
  );
};
