import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { editOder } from '../../actions/oderActions.js';
import './userTd.sass';

export const TdDriverPrice = props => {
  const dispatch = useDispatch();

  const [showEdit, setShowEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentElement, setCurrentElement] = useState(null);
  const [classTd, setClassTd] = useState('userTd tdWidth150');

  const handleDBLClick = e => {
    let element = e.currentTarget;
    if (props.edit && props.driverPayment != 'Ок') {
      setShowEdit(true);
      e.currentTarget.parentElement.style.backgroundColor = '#fff';
      setCurrentId(e.currentTarget.parentElement.id);
      setCurrentElement(element);
    }
  };
  const handleEnter = e => {
    if (e.key == 'Enter') {
      dispatch(editOder(currentId, 'driverPrice', e.currentTarget.value, 'oderslist'));
      setShowEdit(false);
      setCurrentId(null);
      setCurrentElement(null);
    }
    if (e.key == 'Escape') {
      setShowEdit(false);
      setCurrentId(null);
    }
  };
  const handleClickCtrl = e => {
    if (props.getSum != undefined) {
      let sum = Number(props.driverPrice);
      if (e.ctrlKey) {
        e.stopPropagation();
        if (classTd == 'userTd tdWidth150') {
          props.getSum(sum, true);
          setClassTd('userTd tdWidth150 grey');
        } else {
          props.getSum(-sum, true);
          setClassTd('userTd tdWidth150');
        }
      } else {
        props.getSum(0, false);
        setClassTd('userTd tdWidth150');
      }
    }
  };

  useEffect(() => {
    if (props.currentTR != currentId) {
      setShowEdit(false);
      setCurrentId(null);
    }
  }, [props.currentTR]);
  useEffect(() => {
    if (currentElement) currentElement.firstChild.focus();
  }, [currentElement]);
  useEffect(() => {
    if (!props.isCtrl) {
      setClassTd('userTd tdWidth150');
    }
  }, [props.isCtrl]);
  return (
    <td
      style={props.style}
      className={classTd}
      onClick={handleClickCtrl}
      onDoubleClick={handleDBLClick}
    >
      {showEdit ? (
        <input name="oderPrice" type="number" onKeyDown={handleEnter} />
      ) : (
        Number(props.driverPrice).toLocaleString()
      )}
    </td>
  );
};
