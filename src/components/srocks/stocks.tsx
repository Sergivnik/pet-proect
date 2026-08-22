import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { DOMENNAME } from '../../middlewares/initialState.js';
import './stocks.sass';
import { authSignOut } from '../../actions/auth.js';

export const Stocks = () => {
  const dispatch = useDispatch();
  const handleClickExit = () => {
    dispatch(authSignOut());
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
          <div className="stocksMenuButton">Add Stock</div>
          <div className="stocksMenuButton">Buy Stock</div>
          <div className="stocksMenuButton">Get Dividends Stock</div>
          <div className="stocksMenuButton">Deposit</div>
        </div>
        <div className="stocksExit" onClick={handleClickExit}>
          Exit
        </div>
      </header>
      <div className="stocksBody"></div>
    </div>
  );
};
