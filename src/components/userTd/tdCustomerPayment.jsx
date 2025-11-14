import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
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

  const tdRef = useRef(null);
  const portalRef = useRef(null);
  const [portalPos, setPortalPos] = useState({ top: 0, left: 0 });

  const handleMouseOver = () => {
    setIsMouseOver(true);
  };
  const handleMouseLeave = () => {
    setIsMouseOver(false);
    setShowDetails(false);
  };
  const handleDBLClick = e => {
    e.stopPropagation();
    const element = e.currentTarget;
    if (props.edit) {
      const rect = element.getBoundingClientRect();
      setPortalPos({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width - 2,
      });
      setShowEdit(true);
      setCurrentId(element.parentElement ? element.parentElement.id : null);
      setCurrentElement(element);
    }
  };
  const setValue = data => {
    if (data.value == 'Обещал оплату') {
      setShowEdit(false);
      if (currentElement) {
        const rect = currentElement.getBoundingClientRect();
        setPortalPos({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width - 2,
        });
      }
      setGetDate(true);
    } else if (data.value != 'Частично оплачен') {
      dispatch(editOder(currentId, 'customerPayment', data._id, 'oderslist'));
      setShowEdit(false);
      setCurrentId(null);
      setCurrentElement(null);
    } else {
      setShowEdit(false);
      if (currentElement) {
        const rect = currentElement.getBoundingClientRect();
        setPortalPos({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width - 1,
        });
      }
      setGetSum(true);
    }
  };
  const handleGetDate = e => {
    if (e.keyCode == 13) {
      console.log(currentId, e.target.name, e.target.value);
      dispatch(editOder(currentId, e.target.name, e.target.value, 'oderslist'));
      setGetDate(false);
      setCurrentId(null);
      setCurrentElement(null);
    }
  };
  const handleGetSum = e => {
    if (e.keyCode == 13) {
      console.log(currentId, e.target.name, e.target.value);
      dispatch(editOder(currentId, 'customerPayment', 8, 'oderslist'));
      dispatch(editOder(currentId, e.target.name, e.target.value, 'oderslist'));
      setGetSum(false);
      setCurrentId(null);
      setCurrentElement(null);
    }
  };
  const handleChangeDate = e => {
    e.stopPropagation();
    const element = tdRef.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      setPortalPos({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width - 1,
      });
      setCurrentId(element.id);
      setCurrentElement(element);
      setGetDate(true);
    }
  };

  useEffect(() => {
    if (currentElement) {
      const el = portalRef.current;
      if (el) {
        const input = el.querySelector('input, select, button, [tabindex]');
        if (input) input.focus();
      }
    }
  }, [currentElement]);

  useEffect(() => {
    if (props.currentTR != currentId) {
      setShowEdit(false);
      setGetDate(false);
      setGetSum(false);
      setCurrentId(null);
      setCurrentElement(null);
    }
  }, [props.currentTR]);

  useEffect(() => {
    const onKeypress = e => {
      if (e.code === 'Escape') {
        if (showEdit || getDate || getSum) {
          setShowEdit(false);
          setGetDate(false);
          setGetSum(false);
          setCurrentId(null);
          setCurrentElement(null);
        }
      }
    };
    document.addEventListener('keydown', onKeypress);
    return () => document.removeEventListener('keydown', onKeypress);
  }, [showEdit, getDate, getSum]);

  useEffect(() => {
    const onDocClick = e => {
      if (!showEdit && !getDate && !getSum) return;
      if (
        portalRef.current &&
        !portalRef.current.contains(e.target) &&
        tdRef.current &&
        !tdRef.current.contains(e.target)
      ) {
        setShowEdit(false);
        setGetDate(false);
        setGetSum(false);
        setCurrentId(null);
        setCurrentElement(null);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [showEdit, getDate, getSum]);

  useEffect(() => {
    if ((!showEdit && !getDate && !getSum) || !currentElement) return;

    const updatePosition = () => {
      const rect = currentElement.getBoundingClientRect();
      setPortalPos({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width - 1,
      });
    };

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    updatePosition();

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [showEdit, getDate, getSum, currentElement]);

  useEffect(() => {
    if (isMouseOver) {
      const timer = setTimeout(() => {
        if (props.dateOfPromise) setShowDetails(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isMouseOver, props.dateOfPromise]);

  const ChoisePortal = showEdit
    ? createPortal(
        <div
          ref={portalRef}
          className="divChoisePortal"
          style={{
            position: 'absolute',
            top: portalPos.top + 1,
            left: portalPos.left + 1,
            width: portalPos.width,
            zIndex: 10,
            boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
            background: '#fff',
            borderRadius: 6,
          }}
          onMouseDown={e => e.stopPropagation()}
        >
          <div className="divChoise">
            <ChoiseList
              name="customerPayment"
              parent="oders"
              arrlist={statusPayment}
              setValue={setValue}
            />
          </div>
        </div>,
        document.body
      )
    : null;

  const DatePortal = getDate
    ? createPortal(
        <div
          ref={portalRef}
          className="divChoisePortal"
          style={{
            position: 'absolute',
            top: portalPos.top + 1,
            left: portalPos.left + 1,
            width: portalPos.width,
            zIndex: 10,
            boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
            background: '#fff',
            borderRadius: 6,
          }}
          onMouseDown={e => e.stopPropagation()}
        >
          <div className="oderTdTooltip">
            <input name="dateOfPromise" type="date" onKeyDown={handleGetDate} />
          </div>
        </div>,
        document.body
      )
    : null;

  const SumPortal = getSum
    ? createPortal(
        <div
          ref={portalRef}
          className="divChoisePortal"
          style={{
            position: 'absolute',
            top: portalPos.top + 1,
            left: portalPos.left + 1,
            width: portalPos.width,
            zIndex: 10,
            boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
            background: '#fff',
            borderRadius: 6,
          }}
          onMouseDown={e => e.stopPropagation()}
        >
          <div className="oderTdTooltip">
            <input name="sumPartPay" type="number" onKeyDown={handleGetSum} />
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <td
        ref={tdRef}
        style={props.style}
        className="userTd"
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        onDoubleClick={handleDBLClick}
      >
        {!showEdit && !getDate && !getSum ? props.customerPayment : null}

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
      </td>

      {ChoisePortal}
      {DatePortal}
      {SumPortal}
    </>
  );
};
