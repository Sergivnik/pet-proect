import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { editOder } from '../../actions/oderActions.js';
import { ChoiseList } from '../choiseList/choiseList.jsx';
import './userTd.sass';

export const TdCustomer = props => {
  const dispatch = useDispatch();
  const clientList = useSelector(state => state.oderReducer.clientList);
  const clientmanager = useSelector(state => state.oderReducer.clientmanager);

  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentElement, setCurrentElement] = useState(null);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const getValue = (id, arrObj) => {
    if (id) {
      const value = arrObj.find(elem => elem._id === id);
      return value || null;
    }
    return null;
  };

  const handleMouseOver = () => {
    setIsMouseOver(true); // Устанавливаем состояние наведения мыши
  };

  const handleMouseLeave = () => {
    setIsMouseOver(false); // Сбрасываем состояние наведения мыши
    setShowDetails(false); // Скрываем тултип
  };

  useEffect(() => {
    // Появление тултипа через 500ms после наведения мыши
    if (isMouseOver) {
      const timer = setTimeout(() => {
        if (props.idManager || props.applycation) {
          setShowDetails(true);
        }
      }, 500);
      return () => clearTimeout(timer); // Очистка таймера при уходе мыши
    }
  }, [isMouseOver, props.idManager, props.applycation]);

  const handleDBLClick = e => {
    e.preventDefault();
    if (props.edit) {
      setShowEdit(true);
      setCurrentId(e.currentTarget.parentElement.id);
      setCurrentElement(e.currentTarget);
    }
  };

  const setValue = data => {
    dispatch(editOder(currentId, 'oders', data._id, 'oderslist'));
    setShowEdit(false);
    setCurrentId(null);
    setCurrentElement(null);
  };

  const handleESC = e => {
    if (e.code === 'Escape') {
      setShowEdit(false);
      setCurrentId(null);
      setCurrentElement(null);
    }
  };

  const preventDefaultDBL = e => {
    e.preventDefault();
  };

  const handleClickCtrl = e => {
    if (e.ctrlKey) {
      props.handleClickCtrl(props.idCustomer, 'customer');
    }
  };

  useEffect(() => {
    if (currentElement) {
      const input = currentElement.querySelector('input');
      if (input) input.focus();
    }
  }, [currentElement]);

  useEffect(() => {
    if (props.currentTR !== currentId) {
      setShowEdit(false);
      setCurrentId(null);
    }
  }, [props.currentTR, currentId]);

  return (
    <td
      style={props.style}
      className="userTd"
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handleDBLClick}
      onMouseDown={preventDefaultDBL}
      onKeyDown={handleESC}
      onClick={handleClickCtrl}
    >
      {showEdit ? (
        <div className="divChoise">
          <ChoiseList name="oders" arrlist={clientList} setValue={setValue} />
        </div>
      ) : props.idCustomer ? (
        getValue(props.idCustomer, clientList)?.value
      ) : null}
      {showDetails && (
        <div className="oderTdTooltip">
          <p className="userPTooltip">
            {props.idManager ? getValue(props.idManager, clientmanager)?.value : null}
          </p>
          <p className="userPTooltip">
            {props.idManager ? getValue(props.idManager, clientmanager)?.phone : null}
          </p>
          <p className="userPTooltip">{props.applycation && `Заявка № ${props.applycation}`}</p>
        </div>
      )}
    </td>
  );
};
