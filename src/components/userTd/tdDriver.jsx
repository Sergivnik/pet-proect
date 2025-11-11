import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { editOder } from '../../actions/oderActions.js';
import { ChoiseList } from '../choiseList/choiseList.jsx';

export const TdDriver = props => {
  const dispatch = useDispatch();
  const driversList = useSelector(state => state.oderReducer.driverlist);
  const trackDriverList = useSelector(state => state.oderReducer.trackdrivers);

  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentElement, setCurrentElement] = useState(null);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const getValue = (id, arrObj) => {
    if (id) {
      const value = arrObj.find(elem => elem._id === id);
      return value ? value.value : null;
    }
    return null;
  };

  const handleMouseOver = () => {
    setIsMouseOver(true); // Установить состояние "мышь наведена"
  };

  const handleMouseLeave = () => {
    setIsMouseOver(false); // Убрать состояние "мышь наведена"
    setShowDetails(false); // Скрыть тултип
  };

  useEffect(() => {
    // Отображение тултипа через 500ms после наведения мыши
    if (isMouseOver) {
      const timer = setTimeout(() => {
        if (props.idTrackDriver) setShowDetails(true);
      }, 500);
      return () => clearTimeout(timer); // Очистка таймера при уходе мыши
    }
  }, [isMouseOver, props.idTrackDriver]);

  const handleDBLClick = e => {
    if (props.edit) {
      setShowEdit(true);
      setCurrentId(e.currentTarget.parentElement.id);
      setCurrentElement(e.currentTarget);
    }
  };

  const setValue = data => {
    dispatch(editOder(currentId, 'driver', data._id, 'oderslist'));
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

  const handleClickCtrl = e => {
    if (e.ctrlKey) {
      props.handleClickCtrl(props.idDriver, 'driver');
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
      onKeyDown={handleESC}
      onClick={handleClickCtrl}
    >
      {showEdit ? (
        <div className="divChoise">
          <ChoiseList name="driver" arrlist={driversList} setValue={setValue} />
        </div>
      ) : (
        getValue(props.idDriver, driversList)
      )}
      {showDetails && (
        <div className="oderTdTooltip">{getValue(props.idTrackDriver, trackDriverList)}</div>
      )}
    </td>
  );
};
