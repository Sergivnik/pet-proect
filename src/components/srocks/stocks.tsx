import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DOMENNAME } from '../../middlewares/initialState.js';
import { authSignOut } from '../../actions/auth.js';
import { AddStock } from './addStock.tsx';
import { Window } from '../userWindow/window.tsx';
import { getStockTransactions } from '../../actions/stockAction.js';
import './stocks.sass';

export const Stocks = () => {
  const stockList = useSelector((state: any) => state.stockReducer.stocks);
  const stockTransactions = useSelector((state: any) => state.stockReducer.stock_transactions);

  const [showWindow, setShowWindow] = useState<boolean>(false);
  const [children, setChildren] = useState<React.ReactNode | null>(null);
  const [widthScreen, setWidthScreen] = useState<number>(window.innerWidth);
  const [widthWindow, setWidthWindow] = useState<number>(800);

  const dispatch = useDispatch();
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
    setShowWindow(true);
    setChildren(<AddStock />);
    if (widthScreen < 800) {
      setWidthWindow(widthScreen - 100);
    } else {
      setWidthWindow(800);
    }
  };
  const handleClickBuyStock = () => {
    console.log('Buy Stock');
  };
  const handleClickGetDividendsStock = () => {
    console.log('Get Dividends Stock');
  };
  const handleClickDeposit = () => {
    console.log('Deposit');
  };

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
      {showWindow && (
        <Window
          title="Add Stock"
          width={widthWindow}
          startX={(widthScreen - widthWindow) / 2}
          startY={200}
          onClose={() => setShowWindow(false)}
        >
          {children}
        </Window>
      )}
    </div>
  );
};
