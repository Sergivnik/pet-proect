import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { editOder } from '../../actions/oderActions.js';

export const TdDate = props => {
  const DateStr = date => {
    date = new Date(date);
    return date.toLocaleDateString();
  };
  const dispatch = useDispatch();
  const [showEdit, setShowEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const handleDBLClick = e => {
    if (props.edit) {
      setShowEdit(true);
      e.currentTarget.parentElement.style.backgroundColor = '#fff';
      setCurrentId(e.currentTarget.parentElement.id);
    }
  };
  const handleEnter = e => {
    if (e.key == 'Enter') {
      dispatch(editOder(currentId, 'date', e.currentTarget.value));
      setShowEdit(false);
      setCurrentId(null);
    }
    if (e.key == 'Escape') {
      setShowEdit(false);
      setCurrentId(null);
    }
  };
  const handleBlur = e => {
    dispatch(editOder(currentId, 'date', e.currentTarget.value));
    setShowEdit(false);
    setCurrentId(null);
  };
  const preventDefaultDBL = e => {
    e.preventDefault();
  };

  useEffect(() => {
    if (props.currentTR != currentId) {
      setShowEdit(false);
      setCurrentId(null);
    }
  }, [props.currentTR]);
  return (
    <td
      style={props.style}
      className="odersTd"
      onDoubleClick={handleDBLClick}
      onMouseDown={preventDefaultDBL}
    >
      {showEdit ? (
        <input
          className="tdDateInput"
          name="date"
          type="date"
          onKeyDown={handleEnter}
          onBlur={handleBlur}
        />
      ) : (
        DateStr(props.date)
      )}
    </td>
  );
};
