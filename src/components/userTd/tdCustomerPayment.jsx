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
  const choisePortalRef = useRef(null);
  const datePortalRef = useRef(null);
  const sumPortalRef = useRef(null);
  const [portalPos, setPortalPos] = useState({ top: 0, left: 0 });
  const mouseOverTimerRef = useRef(null);
  const mouseLeaveTimerRef = useRef(null);

  const handleMouseOver = () => {
    // Очищаем таймер покидания мыши, если мышь вернулась над ячейку
    if (mouseLeaveTimerRef.current) {
      clearTimeout(mouseLeaveTimerRef.current);
      mouseLeaveTimerRef.current = null;
    }
    // Очищаем предыдущий таймер наведения, если есть
    if (mouseOverTimerRef.current) {
      clearTimeout(mouseOverTimerRef.current);
    }
    // Устанавливаем таймер на 500мс перед установкой isMouseOver в true
    mouseOverTimerRef.current = setTimeout(() => {
      setIsMouseOver(true);
      mouseOverTimerRef.current = null;
    }, 500);
  };
  const handleMouseLeave = () => {
    // Очищаем таймер наведения, если мышь покинула ячейку
    if (mouseOverTimerRef.current) {
      clearTimeout(mouseOverTimerRef.current);
      mouseOverTimerRef.current = null;
    }
    // Очищаем предыдущий таймер покидания, если есть
    if (mouseLeaveTimerRef.current) {
      clearTimeout(mouseLeaveTimerRef.current);
    }
    // Устанавливаем таймер на 1000мс перед выполнением handleMouseLeave
    mouseLeaveTimerRef.current = setTimeout(() => {
      setIsMouseOver(false);
      setShowDetails(false);
      mouseLeaveTimerRef.current = null;
    }, 1000);
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
      dispatch(editOder(currentId, 'customerPayment', data._id, props.orderTable));
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
      dispatch(editOder(currentId, 'customerPayment', data._id, props.orderTable));
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
          width: rect.width - 2,
        });
      }
      setGetSum(true);
    }
  };
  const handleGetDate = e => {
    if (e.keyCode == 13) {
      if (e.target.value) {
        console.log(currentId, e.target.name, e.target.value);
        dispatch(editOder(currentId, e.target.name, e.target.value, props.orderTable));
        setGetDate(false);
        setCurrentId(null);
        setCurrentElement(null);
      }
    }
  };
  const handleGetSum = e => {
    if (e.keyCode == 13) {
      console.log(currentId, e.target.name, e.target.value);
      dispatch(editOder(currentId, 'customerPayment', 8, props.orderTable));
      dispatch(editOder(currentId, e.target.name, e.target.value, props.orderTable));
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
        width: rect.width - 2,
      });
      setShowDetails(false);
      setCurrentId(element.parentElement ? element.parentElement.id : null);
      setCurrentElement(element);
      setGetDate(true);
    }
  };

  useEffect(() => {
    if (currentElement) {
      const el = choisePortalRef.current || datePortalRef.current || sumPortalRef.current;
      if (el) {
        const input = el.querySelector('input, select, button, [tabindex]');
        if (input) input.focus();
      }
    }
  }, [currentElement, showEdit, getDate, getSum]);

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
      const activePortal = choisePortalRef.current || datePortalRef.current || sumPortalRef.current;
      if (
        activePortal &&
        !activePortal.contains(e.target) &&
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
        width: rect.width - 2,
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

  // Очистка таймеров при размонтировании компонента
  useEffect(() => {
    return () => {
      if (mouseOverTimerRef.current) {
        clearTimeout(mouseOverTimerRef.current);
      }
      if (mouseLeaveTimerRef.current) {
        clearTimeout(mouseLeaveTimerRef.current);
      }
    };
  }, []);

  const ChoisePortal = showEdit
    ? createPortal(
        <div
          ref={choisePortalRef}
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
          ref={datePortalRef}
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
            <input name="dateOfPromise" type="date" onKeyDown={handleGetDate} autoFocus />
          </div>
        </div>,
        document.body
      )
    : null;

  const SumPortal = getSum
    ? createPortal(
        <div
          ref={sumPortalRef}
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
                target="_blank"
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
