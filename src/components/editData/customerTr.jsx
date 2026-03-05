import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { editData, delData } from '../../actions/editDataAction.js';
import { DOMENNAME } from '../../middlewares/initialState.js';

import './editData.sass';

export const CustomerTr = props => {
  const dispatch = useDispatch();

  let elem = props.elem;
  const [colNumber, setColNumber] = useState(null);
  const [currentElement, setCurrentElement] = useState(null);
  const [styleTr, setStyleTr] = useState(null);
  const [styleTd, setStileTd] = useState('customerTd');
  const [value, setValue] = useState(null);
  const [TIN, setTIN] = useState(elem.TIN);
  const [prevTIN, setPrevTIN] = useState(elem.TIN);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [requestTIN, setRequestTIN] = useState([]);

  const handleClickTr = () => {
    props.getCurrentId(elem._id);
    setStyleTr('customerActiveTr');
    setStileTd('customerTd');
  };
  const handleDBLclick = e => {
    let column = e.currentTarget.cellIndex;
    setColNumber(column);
    switch (column) {
      case 0:
        setValue(elem.value);
        break;
      case 1:
        setValue(elem.companyName);
        break;
      case 2:
        setValue(elem.TIN);
        break;
      case 3:
        setValue(elem.address);
        break;
      case 4:
        setValue(elem.postAddress);
        break;
      case 5:
        setValue(elem.email);
        break;
      case 6:
        setValue(elem.phone);
        break;
      case 7:
        setValue(elem.contract);
        break;
      case 9:
        setValue(elem.limit);
        break;
      default:
        break;
    }
    props.getCurrentId(elem._id);
    e.currentTarget.width = e.currentTarget.offsetWidth - 2 + 'px';
    e.currentTarget.height = e.currentTarget.offsetHeight - 2 + 'px';
    setCurrentElement(e.currentTarget);
  };
  const handleChange = e => {
    setValue(e.currentTarget.value);
  };
  const handleEnter = e => {
    if (e.key == 'Enter') {
      let { ...obj } = elem;
      switch (colNumber) {
        case 0:
          obj.value = e.currentTarget.value;
          break;
        case 1:
          obj.companyName = e.currentTarget.value;
          break;
        case 2:
          obj.TIN = e.currentTarget.value;
          setTIN(e.currentTarget.value);
          break;
        case 3:
          obj.address = e.currentTarget.value;
          break;
        case 4:
          obj.postAddress = e.currentTarget.value;
          break;
        case 5:
          obj.email = e.currentTarget.value;
          break;
        case 6:
          obj.phone = e.currentTarget.value;
          let str = e.currentTarget.value.split('');
          let newPhone = '';
          str.forEach(elem => {
            if (elem != ' ' && elem != '-' && elem != '(' && elem != ')')
              newPhone = newPhone + elem;
          });
          obj.phone = newPhone;
          break;
        case 7:
          obj.contract = e.currentTarget.value;
          break;
        case 9:
          obj.limit = e.currentTarget.value;
          break;
        default:
          break;
      }
      console.log(obj);
      dispatch(editData(obj, 'oders'));
      setColNumber(null);
    }
  };
  const handleRadio = e => {
    let { ...obj } = elem;
    obj.active = e.currentTarget.value;
    dispatch(editData(obj, 'oders'));
    setColNumber(null);
  };
  const handleClickDelete = () => {
    let password = prompt('Подтвердите удаление', 'Пароль');
    if (password == 'Пароль') {
      dispatch(delData(elem._id, 'oders'));
    }
  };
  const handleLoadContract = () => {
    axios
      .create({ withCredentials: true })
      .get(`${DOMENNAME}/API/getContractPDF?customer=${elem.value}`, {
        responseType: 'blob',
      })
      .then(response => {
        const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        window.open(url, '_blank');
        URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Ошибка при загрузке PDF:', error);
      });
  };
  const handleSuggestionClick = suggestion => {
    console.log(suggestion);
    let newData = { ...elem };
    newData.companyName = suggestion.data.name.short_with_opf || 'нет данных';
    newData.KPP = suggestion.data.kpp || 'нет данных';
    newData.address = suggestion.data.address.unrestricted_value || 'нет данных';
    newData.OGRN = suggestion.data.ogrn || 'нет данных';
    let fio = suggestion.data.fio;
    if (fio) newData.bossName = fio.surname + ' ' + fio.name + ' ' + fio.patronymic || 'нет данных';
    console.log(newData);
    dispatch(editData(newData, 'oders'));
    setShowSuggestions(false);
  };

  useEffect(() => {
    if (props.currentId != elem._id) {
      setColNumber(null);
      setStyleTr(null);
      setStileTd('customerTd');
    }
  }, [props.currentId]);
  useEffect(() => {
    if (currentElement) currentElement.firstChild.focus();
  }, [currentElement]);
  useEffect(() => {
    const onKeypress = e => {
      if (e.code == 'Escape') {
        setColNumber(null);
      }
    };
    document.addEventListener('keydown', onKeypress);
    return () => {
      document.removeEventListener('keydown', onKeypress);
    };
  }, []);
  useEffect(() => {
    if (TIN != null) {
      if (TIN.length == 10 || TIN.length == 12) {
        if (TIN != prevTIN) {
          setPrevTIN(TIN);
          setShowSuggestions(true);
          const data = {
            query: TIN,
          };
          axios
            .post(DOMENNAME + '/API/dadataTIN', data)
            .then(response => {
              setRequestTIN(response.data.suggestions);
              console.log(response.data.suggestions);
            })
            .catch(error => {
              console.log(error);
            });
        }
      }
    }
  }, [TIN]);

  return (
    <tr onClick={handleClickTr} className={styleTr}>
      <td className={styleTd} onDoubleClick={handleDBLclick}>
        {colNumber == 0 ? (
          <input
            type="text"
            className="customerTrInput"
            onKeyDown={handleEnter}
            onChange={handleChange}
            value={value}
          />
        ) : (
          elem.value
        )}
      </td>
      <td className={styleTd} onDoubleClick={handleDBLclick}>
        {colNumber == 1 ? (
          <input
            type="text"
            className="customerTrInput"
            onKeyDown={handleEnter}
            onChange={handleChange}
            value={value}
          />
        ) : (
          elem.companyName
        )}
      </td>
      <td className={styleTd} onDoubleClick={handleDBLclick}>
        {colNumber == 2 ? (
          <input
            type="text"
            className="customerTrInput"
            onKeyDown={handleEnter}
            onChange={handleChange}
            value={value}
          />
        ) : (
          <>
            {elem.TIN}
            {showSuggestions && (
              <div className="suggestionsTdDiv">
                {requestTIN.map((suggestion, index) => {
                  return (
                    <div
                      key={`suggestion-${index}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <span className="suggestionsTdSpan">{suggestion.value}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </td>
      <td className={styleTd} onDoubleClick={handleDBLclick}>
        {colNumber == 3 ? (
          <input
            type="text"
            className="customerTrInput"
            onKeyDown={handleEnter}
            onChange={handleChange}
            value={value}
          />
        ) : (
          elem.address
        )}
      </td>
      <td className={styleTd} onDoubleClick={handleDBLclick}>
        {colNumber == 4 ? (
          <input
            type="text"
            className="customerTrInput"
            onKeyDown={handleEnter}
            onChange={handleChange}
            value={value}
          />
        ) : (
          elem.postAddress
        )}
      </td>
      <td className={styleTd} onDoubleClick={handleDBLclick}>
        {colNumber == 5 ? (
          <input
            type="text"
            className="customerTrInput"
            onKeyDown={handleEnter}
            onChange={handleChange}
            value={value}
          />
        ) : (
          elem.email
        )}
      </td>
      <td className={styleTd} onDoubleClick={handleDBLclick}>
        {colNumber == 6 ? (
          <input
            type="text"
            className="customerTrInput"
            onKeyDown={handleEnter}
            onChange={handleChange}
            value={value}
          />
        ) : (
          elem.phone
        )}
      </td>
      <td className={styleTd} onDoubleClick={handleDBLclick}>
        {colNumber == 7 ? (
          <input
            type="text"
            className="customerTrInput"
            onKeyDown={handleEnter}
            onChange={handleChange}
            value={value}
          />
        ) : (
          <div className="contractSvgTd">
            <span>{elem.contract}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              onClick={handleLoadContract}
            >
              <path d="M19 9V7a7 7 0 0 0-14 0v2"></path>
              <polyline points="16 13 12 17 8 13"></polyline>
              <line x1="12" y1="17" x2="12" y2="9"></line>{' '}
            </svg>
          </div>
        )}
      </td>
      <td className={styleTd} onDoubleClick={handleDBLclick}>
        {colNumber == 8 ? (
          <div>
            <span>
              <input type="radio" name="active" value={1} onChange={handleRadio} />
              Да
            </span>
            <span>
              <input type="radio" name="active" value={0} onChange={handleRadio} />
              Нет
            </span>
          </div>
        ) : elem.active == 1 ? (
          'да'
        ) : (
          'нет'
        )}
        {styleTr != null && (
          <div className="customerPaymentTrClose" onClick={handleClickDelete}>
            <svg width="20px" height="20px" viewBox="0 0 60 60">
              <g transform="translate(232.000000, 228.000000)">
                <polygon points="-207,-205 -204,-205 -204,-181 -207,-181    " />
                <polygon points="-201,-205 -198,-205 -198,-181 -201,-181    " />
                <polygon points="-195,-205 -192,-205 -192,-181 -195,-181    " />
                <polygon points="-219,-214 -180,-214 -180,-211 -219,-211    " />
                <path d="M-192.6-212.6h-2.8v-3c0-0.9-0.7-1.6-1.6-1.6h-6c-0.9,0-1.6,0.7-1.6,1.6v3h-2.8v-3     c0-2.4,2-4.4,4.4-4.4h6c2.4,0,4.4,2,4.4,4.4V-212.6" />
                <path d="M-191-172.1h-18c-2.4,0-4.5-2-4.7-4.4l-2.8-36l3-0.2l2.8,36c0.1,0.9,0.9,1.6,1.7,1.6h18     c0.9,0,1.7-0.8,1.7-1.6l2.8-36l3,0.2l-2.8,36C-186.5-174-188.6-172.1-191-172.1" />
              </g>
            </svg>
          </div>
        )}
      </td>
      <td className={styleTd} onDoubleClick={handleDBLclick}>
        {colNumber == 9 ? (
          <input
            type="text"
            className="customerTrInput"
            onKeyDown={handleEnter}
            onChange={handleChange}
            value={value}
          />
        ) : (
          elem.limit
        )}
      </td>
    </tr>
  );
};
