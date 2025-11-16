import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { editOder } from '../../actions/oderActions.js';
import { ChoiseList } from '../choiseList/choiseList.jsx';
import { dateLocal } from '../myLib/myLib.js';

export const TdDriverPayment = props => {
  const dispatch = useDispatch();
  const [showEdit, setShowEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentElement, setCurrentElement] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const tdRef = useRef(null);
  const choisePortalRef = useRef(null);
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
    dispatch(editOder(currentId, 'driverPayment', data._id, props.orderTable));
    setShowEdit(false);
    setCurrentId(null);
    setCurrentElement(null);
  };

  useEffect(() => {
    if (currentElement) {
      const el = choisePortalRef.current;
      if (el) {
        const input = el.querySelector('input, select, button, [tabindex]');
        if (input) input.focus();
      }
    }
  }, [currentElement, showEdit]);

  useEffect(() => {
    if (props.currentTR != currentId) {
      setShowEdit(false);
      setCurrentId(null);
      setCurrentElement(null);
    }
  }, [props.currentTR]);

  useEffect(() => {
    const onKeypress = e => {
      if (e.code === 'Escape') {
        if (showEdit) {
          setShowEdit(false);
          setCurrentId(null);
          setCurrentElement(null);
        }
      }
    };
    document.addEventListener('keydown', onKeypress);
    return () => document.removeEventListener('keydown', onKeypress);
  }, [showEdit]);

  useEffect(() => {
    const onDocClick = e => {
      if (!showEdit) return;
      if (
        choisePortalRef.current &&
        !choisePortalRef.current.contains(e.target) &&
        tdRef.current &&
        !tdRef.current.contains(e.target)
      ) {
        setShowEdit(false);
        setCurrentId(null);
        setCurrentElement(null);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [showEdit]);

  useEffect(() => {
    if (!showEdit || !currentElement) return;

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
  }, [showEdit, currentElement]);

  useEffect(() => {
    if (isMouseOver) {
      const timer = setTimeout(() => {
        if (props.dateOfPayment) setShowDetails(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isMouseOver, props.dateOfPayment]);

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
              name="driverPayment"
              parent="oders"
              arrlist={[
                { _id: 1, value: 'Ок' },
                { _id: 2, value: 'Нет' },
              ]}
              setValue={setValue}
            />
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
        className="odersTd"
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        onDoubleClick={handleDBLClick}
      >
        {!showEdit ? props.driverPayment : null}

        {showDetails && (
          <div className="oderTdTooltip">
            <p className="userPTooltip">
              {props.dateOfPayment ? dateLocal(props.dateOfPayment) : null}
            </p>
          </div>
        )}
      </td>

      {ChoisePortal}
    </>
  );
};
