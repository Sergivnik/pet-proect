import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DOMENNAME } from '../../../../middlewares/initialState';
import { Forecast } from '../../../forecast/forecast.jsx';
import './menuAccount.sass';
import { useSelector, useDispatch } from 'react-redux';
import { editYearConst } from '../../../../actions/reportActions.js';

export const MenuAccount = props => {
  const dispatch = useDispatch();
  let yearconst = useSelector(state => state.oderReducer.yearconst);
  const [deposit, setDeposit] = useState(0);
  const [editDeposit, setEditDeposit] = useState(false);

  useEffect(() => {
    if (yearconst) {
      if (yearconst.deposit) {
        setDeposit(yearconst.deposit);
      }
    }
  }, [yearconst]);

  const handleEditDeposit = () => {
    setEditDeposit(true);
  };
  const handleGetDeposit = e => {
    if (e.currentTarget.name == 'deposit') {
      setDeposit(e.currentTarget.value);
    }
  };
  const handleEnterDeposit = e => {
    if (e.code == 'Enter' || e.code == 'NumpadEnter') {
      if (e.currentTarget.name == 'deposit') {
        dispatch(editYearConst('deposit', deposit));
        setEditDeposit(false);
      }
    }
  };

  return (
    <div className="wrapperForAccount">
      <div className="orderLogo">
        <Link to="/">
          <img className="orderLogoImg" src={`${DOMENNAME}/img/track.jpg`} height="25" width="40" />
        </Link>
      </div>
      <div className="orderDivInfoSpan">
        <span>Рас.сч. </span>
        <span className="spanNoSpace">
          {typeof props.sumAccount === 'number'
            ? (props.sumAccount - Number(deposit)).toLocaleString()
            : '0'}{' '}
          руб.
        </span>
      </div>
      <div className="orderDivInfoSpan">
        <Forecast />
      </div>
      <div className="orderDivInfoSpan" onDoubleClick={handleEditDeposit}>
        <span>Депозит </span>
        {!editDeposit ? (
          <span className="spanNoSpace">{deposit ? Number(deposit).toLocaleString() : 0} руб.</span>
        ) : (
          <input
            className="inputDeposit"
            type="number"
            value={deposit ? deposit : 0}
            onChange={handleGetDeposit}
            onKeyDown={handleEnterDeposit}
            name="deposit"
          />
        )}
      </div>
    </div>
  );
};
