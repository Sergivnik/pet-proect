import React, { useEffect, useState } from 'react';
import './userTd.sass';

export const TdWithText = props => {
  const text = props.text;
  const name = props.name;
  const elem = props.elem;

  const [showInput, setShowInput] = useState(false);
  const [fieldValue, setFieldValue] = useState(text);

  const setValue = e => {
    setFieldValue(e.currentTarget.value);
  };
  const handleDblClick = () => {
    setShowInput(true);
  };

  const handleCellClick = e => {
    if (props.onCellClick && props.paymentId) {
      props.onCellClick(props.paymentId, e);
    }
  };
  const handleEnter = e => {
    console.log('hi');
    if (e.key == 'Enter') {
      props.getData(fieldValue, name, elem);
      setShowInput(false);
    }
  };
  const formatBigNumber = number => {
    // Проверяем, что значение не null и является строкой
    if (number === null || typeof number !== 'string') {
      return null;
    }

    // Проверяем, содержит ли число 20 или более знаков (включая точку и дробную часть)
    if (number.length >= 16) {
      return number;
    } else {
      // Преобразуем строку в число и используем toLocaleString для форматирования
      let numberValue = Number(number);
      return numberValue.toLocaleString();
    }
  };
  useEffect(() => {
    if (showInput) {
      let div = document.querySelector('.myTdDivChoise');
      let parent = div.parentNode;
      div.style.width = parent.clientWidth + 'px';
    }
  }, [showInput]);
  useEffect(() => {
    if (text == null) {
      setFieldValue(undefined);
    } else {
      setFieldValue(text);
    }
  }, [props.text]);
  const cellClassName = props.isSelected ? 'myTd selected-cell' : 'myTd';

  return (
    <td
      className={cellClassName}
      onDoubleClick={handleDblClick}
      onClick={handleCellClick}
      style={props.isSelected ? { backgroundColor: '#d3d3d3' } : {}}
    >
      {showInput ? (
        <div className="myTdDivChoise">
          <input
            className="inputText"
            name={name}
            onChange={setValue}
            value={fieldValue}
            onKeyDown={handleEnter}
          />
        </div>
      ) : isNaN(Number(fieldValue)) ? (
        fieldValue
      ) : (
        formatBigNumber(fieldValue)
      )}
    </td>
  );
};
