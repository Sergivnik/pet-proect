import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { editOder } from '../../actions/oderActions.js';
import { ChoiseList } from '../choiseList/choiseList.jsx';
import { dateLocal, dateTimeLocal } from '../myLib/myLib.js';

export const TdCustomerPayment = props => {
  const dispatch = useDispatch();

  const statusPayment = useSelector(state => state.oderReducer.statusCustomerPay);

  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentElement, setCurrentElement] = useState(null);
  const [getSum, setGetSum] = useState(false);
  const [getDate, setGetDate] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const handleMouseOver = () => {
    setIsMouseOver(true);
  };
  const handleMouseLeave = () => {
    setIsMouseOver(false);
    setShowDetails(false);
  };
  const handleDBLClick = e => {
    let element = e.currentTarget;
    if (props.edit) {
      setShowEdit(true);
      e.currentTarget.parentElement.style.backgroundColor = '#fff';
      setCurrentId(e.currentTarget.parentElement.id);
      setCurrentElement(element);
    }
  };
  const setValue = data => {
    if (data.value == 'Обещал оплату') setGetDate(true);
    if (data.value != 'Частично оплачен') {
      if (data.value != 'Обещал оплату') setCurrentId(null);
      dispatch(editOder(currentId, 'customerPayment', data._id));
    } else {
      setGetSum(true);
    }
    setShowEdit(false);
    setCurrentElement(null);
  };
  const handleGetDate = e => {
    if (e.keyCode == 13) {
      console.log(currentId, e.target.name, e.target.value);
      dispatch(editOder(currentId, e.target.name, e.target.value));
      setGetDate(false);
      setCurrentId(null);
    }
  };
  const handleGetSum = e => {
    if (e.keyCode == 13) {
      console.log(currentId, e.target.name, e.target.value);
      dispatch(editOder(currentId, 'customerPayment', 8));
      dispatch(editOder(currentId, e.target.name, e.target.value));
      setGetSum(false);
      setCurrentId(null);
    }
  };
  const handleChangeDate = e => {
    setCurrentId(e.currentTarget.parentElement.parentElement.id);
    console.log('Change Date:', props.currentTR);
    e.stopPropagation();
    setGetDate(true);
  };

  useEffect(() => {
    if (currentElement) currentElement.firstChild.firstChild.focus();
  }, [currentElement]);
  useEffect(() => {
    if (props.currentTR != currentId) {
      setShowEdit(false);
      setCurrentId(null);
    }
  }, [props.currentTR]);
  useEffect(() => {
    const onKeypress = e => {
      if (e.code == 'Escape') {
        if (showEdit) {
          setShowEdit(false);
          setCurrentId(null);
          setGetDate(false);
        }
      }
    };
    document.addEventListener('keydown', onKeypress);
    return () => {
      document.removeEventListener('keydown', onKeypress);
    };
  }, [showEdit]);
  useEffect(() => {
    if (isMouseOver) {
      const timer = setTimeout(() => {
        if (props.dateOfPromise) setShowDetails(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isMouseOver, props.dateOfPromise]);

  return (
    <td
      style={props.style}
      className="userTd"
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handleDBLClick}
    >
      {showEdit ? (
        <div className="divChoise">
          <ChoiseList
            name="customerPayment"
            parent="oders"
            arrlist={statusPayment}
            setValue={setValue}
          />
        </div>
      ) : (
        props.customerPayment
      )}
      {showDetails && (
        <div className="oderTdTooltip" onDoubleClick={handleChangeDate}>
          <span className="spanTdPaymentToolTip">
            {props.customerPayment == 'Мыло'
              ? dateTimeLocal(props.dateOfPromise)
              : dateLocal(props.dateOfPromise)}
          </span>
          {props.postTrack && (
            <a
              className="aToolTip"
              target="blank"
              href={`https://www.pochta.ru/tracking?barcode=${props.postTrack}`}
            >
              {props.postTrack}
            </a>
          )}
        </div>
      )}
      {getDate && (
        <div className="oderTdTooltip">
          <input name="dateOfPromise" type="date" onKeyDown={handleGetDate} />
        </div>
      )}
      {getSum && (
        <div className="oderTdTooltip">
          <input name="sumPartPay" type="number" onKeyDown={handleGetSum} />
        </div>
      )}
    </td>
  );
};
