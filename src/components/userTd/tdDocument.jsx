import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { editOder, delPrintedMark } from '../../actions/oderActions.js';
import { ChoiseList } from '../choiseList/choiseList.jsx';
import { dateLocal } from '../myLib/myLib.js';
import './userTd.sass';

export const TdDocument = props => {
  const user = useSelector(state => state.oderReducer.currentUser);
  const dispatch = useDispatch();

  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentElement, setCurrentElement] = useState(null);
  const [docList, setDocList] = useState([
    { _id: 2, value: 'Нет' },
    { _id: 3, value: 'Факс' },
    { _id: 4, value: 'Сдал' },
  ]);
  const [classTd, setClassTd] = useState('userTd');
  const [isMouseOver, setIsMouseOver] = useState(false);

  const tdRef = useRef(null);
  const portalRef = useRef(null);
  const [portalPos, setPortalPos] = useState({ top: 0, left: 0 });

  // фокус / список ролей
  useEffect(() => {
    if (user.role == 'admin') {
      setDocList([
        { _id: 1, value: 'Ок' },
        { _id: 2, value: 'Нет' },
        { _id: 3, value: 'Факс' },
        { _id: 4, value: 'Сдал' },
      ]);
    } else {
      setDocList([
        { _id: 2, value: 'Нет' },
        { _id: 3, value: 'Факс' },
        { _id: 4, value: 'Сдал' },
      ]);
    }
  }, [user.role]);

  useEffect(() => {
    if (currentElement) {
      // если портал открылся — сфокусируем первый элемент внутри (если нужно)
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
      setCurrentId(null);
      setCurrentElement(null);
    }
  }, [props.currentTR]);

  // Escape закрытие
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

  // клик вне — закрыть портал
  useEffect(() => {
    const onDocClick = e => {
      if (!showEdit) return;
      if (
        portalRef.current &&
        !portalRef.current.contains(e.target) &&
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

    // подписка на любые скроллы (true — чтобы слушать и вложенные контейнеры)
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    // сразу обновим позицию
    updatePosition();

    // отписка при закрытии
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [showEdit, currentElement]);

  const handleMouseOver = e => {
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
      // позиционируем портал относительно ячейки
      const rect = element.getBoundingClientRect();
      setPortalPos({
        top: rect.top + window.scrollY, // чуть ниже ячейки
        left: rect.left + window.scrollX,
        width: rect.width - 2,
      });
      setShowEdit(true);
      setCurrentId(element.parentElement ? element.parentElement.id : null);
      setCurrentElement(element);
    }
  };

  const setValue = data => {
    let check = true;
    if (props.document == 'Ок') {
      check = confirm('100%?');
    }
    if (check) {
      dispatch(editOder(currentId, 'document', data._id, props.orderTable));
    }
    setShowEdit(false);
    setCurrentId(null);
    setCurrentElement(null);
  };

  const handleRightClick = e => {
    e.preventDefault();
    if (props.elem) dispatch(delPrintedMark(props.elem._id));
  };

  useEffect(() => {
    if (props.elem) {
      if (props.elem.wasItPrinted) {
        setClassTd('userTd wasPrinted mobileViewOff');
      } else {
        setClassTd('userTd mobileViewOff');
      }
    }
  }, [props.elem]);

  // таймер показа деталей (оставил как у тебя)
  useEffect(() => {
    if (isMouseOver) {
      const timer = setTimeout(() => {
        if (props.dateOfSubmission) setShowDetails(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isMouseOver, props.dateOfSubmission]);

  // портал-рендер выпадашки
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
          onMouseDown={e => e.stopPropagation()} // чтобы клик по выпадашке не закрывал её раньше времени
        >
          <div className="divChoise">
            <ChoiseList name="document" parent="oders" arrlist={docList} setValue={setValue} />
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
        className={classTd}
        onMouseOver={handleMouseOver}
        onContextMenu={handleRightClick}
        onMouseLeave={handleMouseLeave}
        onDoubleClick={handleDBLClick}
      >
        {/* если showEdit — внутри td ничего не рендерим (всё — портал). Это важно, чтобы не ломать табличный layout */}
        {!showEdit ? props.document : null}

        {showDetails && <div className="oderTdTooltip">{dateLocal(props.dateOfSubmission)}</div>}
      </td>

      {ChoisePortal}
    </>
  );
};
