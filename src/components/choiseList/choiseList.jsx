import React, { useEffect, useState } from 'react';
import './choiseList.sass';

export const ChoiseList = props => {
  const [text, setText] = useState('');
  const [list, setList] = useState(props.arrlist);
  const [showSelect, setShowSelect] = useState(false);
  let elSelect = null;

  const getText = e => {
    setShowSelect(true);
    let test = e.currentTarget.value;
    setText(e.currentTarget.value);
    let regtext = new RegExp(test, 'i');
    let arr = props.arrlist.filter(elem => regtext.test(elem.value));
    setList(arr);
  };
  const handleKeyDown = e => {
    if (e.key == 'Enter') {
      e.preventDefault();
      e.stopPropagation();
    }
    if (e.key == 'ArrowDown') {
      elSelect.focus();
      elSelect.firstChild.selected = true;
    }
  };
  const handleClick = e => {
    e.stopPropagation();
    let id = elSelect.value;
    list.forEach(elem => {
      if (elem._id == id) {
        setText(elem.value);
        props.setValue(
          {
            _id: elem._id,
            field: props.name,
            value: elem.value,
            index: props.index,
            extraPayments: elem.extraPayments,
          },
          e
        );
      }
    });
    setShowSelect(false);
  };
  const handleChoiseEnter = e => {
    if (e.key == 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      let id = elSelect.value;
      list.forEach(elem => {
        if (elem._id == id) {
          setText(elem.value);
          props.setValue(
            {
              _id: elem._id,
              field: props.name,
              value: elem.value,
              index: props.index,
              extraPayments: elem.extraPayments,
            },
            e
          );
        }
      });
      setShowSelect(false);
    }
  };
  const handleClickInput = e => {
    //console.log(e);
  };
  const handleLostFocus = e => {
    console.log(e.target);
  };

  useEffect(() => {
    if (props.parent === 'oders') {
      setShowSelect(true);
      setList(props.arrlist);
    }
    if (props.reset) setText('');
  }, [props]);
  useEffect(() => {
    let optionEl = document.querySelector('.optionClass');
    if (optionEl) optionEl.selected = true;
  }, [list]);

  return (
    <React.Fragment>
      <input
        type="text"
        id={props.name}
        onClick={handleClickInput}
        onChange={getText}
        onKeyDown={handleKeyDown}
        value={text}
        className="inputList"
        autoComplete="off"
      />
      {showSelect && (
        <select
          ref={select => {
            elSelect = select;
          }}
          size="5"
          onKeyUp={handleChoiseEnter}
          onClick={handleClick}
          className="selectList"
          name="select"
        >
          {list != undefined
            ? list.map((elem, index) => {
                return (
                  <option
                    key={elem._id}
                    value={elem._id}
                    className="optionClass"
                    //selected={index == 0 ? true : false}
                  >
                    {elem.value}
                  </option>
                );
              })
            : ''}
        </select>
      )}
    </React.Fragment>
  );
};
