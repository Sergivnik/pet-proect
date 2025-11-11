import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { editOder } from '../../actions/oderActions.js';
import './userTd.sass';

export const TdCustomerPrice = props => {
  const dispatch = useDispatch();

  const [showTooltip, setShowTooltip] = useState(false);
  const [sum, setSum] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentElement, setCurrentElement] = useState(null);

  const handleMouseOver = e => {
    setShowTooltip(true);
  };
  const handleMouseLeave = e => {
    setShowTooltip(false);
  };
  const handleDBLClick = e => {
    let element = e.currentTarget;
    if (props.edit && props.customerPayment != 'Ок') {
      setShowEdit(true);
      e.currentTarget.parentElement.style.backgroundColor = '#fff';
      setCurrentId(e.currentTarget.parentElement.id);
      setCurrentElement(element);
    }
  };
  const handleEnter = e => {
    if (e.key == 'Enter') {
      dispatch(editOder(currentId, 'oderPrice', e.currentTarget.value, 'oderslist'));
      setShowEdit(false);
      setCurrentId(null);
      setCurrentElement(null);
    }
    if (e.key == 'Escape') {
      setShowEdit(false);
      setCurrentId(null);
    }
  };

  useEffect(() => {
    if (props.currentTR != currentId) {
      setShowEdit(false);
      setCurrentId(null);
    }
  }, [props.currentTR]);
  useEffect(() => {
    if (props.edit) {
      setSum(Number(props.customerPrice));
    } else {
      if (props.customerPayment != 'Частично оплачен') {
        setSum(Number(props.customerPrice));
      } else {
        setSum(Math.floor((props.customerPrice - props.partialPaymentAmount) * 100) / 100);
      }
    }
  }, [props]);
  useEffect(() => {
    if (currentElement) currentElement.firstChild.focus();
  }, [currentElement]);

  return (
    <td
      style={props.style}
      className="userTd tdWidth150"
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handleDBLClick}
    >
      {showEdit ? (
        <input name="oderPrice" type="number" onKeyDown={handleEnter} />
      ) : sum ? (
        sum.toLocaleString()
      ) : null}
      {showTooltip && props.customerPayment == 'Частично оплачен' && (
        <div className="userTdTooltip">
          <p className="userTdP">Счет на сумму {props.customerPrice} руб </p>
          <p className="userTdP">оплачено {props.partialPaymentAmount} руб</p>
          <p className="userTdP">
            долг {Math.floor((props.customerPrice - props.partialPaymentAmount) * 100) / 100}
            руб
          </p>
        </div>
      )}
      {showTooltip && props.customerPayment == 'Выбран для част.оплаты' && (
        <div className="userTdTooltip">
          <p className="userTdP">Счет на сумму {props.partialPaymentAmount} руб </p>
          <p className="userTdP">выбрано для оплаты {props.customerPrice} руб</p>
          <p className="userTdP">
            останется неоплаченными{' '}
            {Math.floor((props.partialPaymentAmount - props.customerPrice) * 100) / 100}
            руб
          </p>
        </div>
      )}
    </td>
  );
};
