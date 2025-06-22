import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { editData } from '../../actions/editDataAction.js';
import { URL } from '../../middlewares/initialState';

import './editData.sass';

export const CustomerAccountTr = props => {
  const customer = props.customer;

  const dispatch = useDispatch();

  const [customerData, setCustomerData] = useState(customer);
  const [requestTIN, setRequestTIN] = useState([]);
  const [requestRCBIC, setRequestRCBIC] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [editField, setEditField] = useState(null);
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (props.customer.TIN != customerData.TIN || props.customer.RCBIC != customerData.RCBIC) {
      setCustomerData(props.customer);
    }
  }, [props.customer]);

  useEffect(() => {
    const data = { query: customerData.TIN };
    if (
      customerData.TIN != null &&
      (customerData.address == null ||
        customerData.companyName == null ||
        customerData.KPP == null ||
        customerData.OGRN == null ||
        customerData.bossName == null ||
        customerData.address == '' ||
        customerData.companyName == '' ||
        customerData.KPP == '' ||
        customerData.OGRN == '' ||
        customerData.bossName == '')
    ) {
      axios
        .post(URL + '/dadataTIN', data)
        .then(response => {
          console.log(response.data.suggestions);
          setRequestTIN(response.data.suggestions);
          setShowSuggestions(true);
        })
        .catch(error => {
          console.log('error', error);
        });
    }
  }, [customerData.TIN]);

  useEffect(() => {
    const data = {
      query: customerData.RCBIC,
    };
    if (
      customerData.RCBIC != null &&
      (customerData.CorAcc == null ||
        customerData.bankName == null ||
        customerData.bankAddress == null ||
        customerData.CorAcc == '' ||
        customerData.bankName == '' ||
        customerData.bankAddress == '')
    )
      axios
        .post(URL + '/dadataBank', data)
        .then(response => {
          console.log(response.data.suggestions);
          setRequestRCBIC(response.data.suggestions);
        })
        .catch(error => {
          console.log('error', error);
        });
  }, [customerData.RCBIC]);

  useEffect(() => {
    if (requestRCBIC.length) {
      let newData = { ...customerData };
      if (customerData.CorAcc == null || customerData.CorAcc == '') {
        newData.CorAcc = requestRCBIC[0].data.correspondent_account
          ? requestRCBIC[0].data.correspondent_account
          : 'нет данных';
      }
      if (customerData.bankName == null || customerData.bankName == '') {
        newData.bankName = requestRCBIC[0].value ? requestRCBIC[0].value : 'нет данных';
      }
      if (customerData.bankAddress == null || customerData.bankAddress == '') {
        newData.bankAddress = requestRCBIC[0].data.address.value
          ? requestRCBIC[0].data.address.value
          : 'нет данных';
      }
      setCustomerData(newData);
      dispatch(editData(newData, 'oders'));
    }
  }, [requestRCBIC]);

  useEffect(() => {
    const onKeypress = e => {
      if (e.code == 'Escape') {
        setEditField(null);
        setValue(null);
      }
    };
    document.addEventListener('keydown', onKeypress);
    return () => {
      document.removeEventListener('keydown', onKeypress);
    };
  }, []);

  const handleClickSuggestion = index => {
    console.log(index);
    let newData = { ...customerData };
    if (customerData.KPP == null || customerData.KPP == '') {
      newData.KPP = requestTIN[index].data.kpp ? requestTIN[index].data.kpp : 'нет данных';
    }
    if (customerData.companyName == null || customerData.companyName == '') {
      newData.companyName = requestTIN[index].data.name.short_with_opf
        ? requestTIN[index].data.name.short_with_opf
        : 'нет данных';
    }
    if (customerData.OGRN == null || customerData.OGRN == '') {
      newData.OGRN = requestTIN[index].data.ogrn ? requestTIN[index].data.ogrn : 'нет данных';
    }
    if (customerData.bossName == null || customerData.bossName == '') {
      newData.bossName = requestTIN[index].data.management
        ? requestTIN[index].data.management.name
        : 'нет данных';
    }
    if (customerData.address == null || customerData.address == '') {
      newData.address = requestTIN[index].data.address.unrestricted_value
        ? requestTIN[index].data.address.unrestricted_value
        : 'нет данных';
    }
    setCustomerData(newData);
    setShowSuggestions(false);
    dispatch(editData(newData, 'oders'));
  };
  const handleDBLclick = field => {
    console.log(field);
    setEditField(field);
    setValue(customerData[field]);
  };
  const handleEnter = e => {
    if (e.key == 'Enter') {
      let newData = { ...customerData };
      newData[editField] = value;
      if (editField == 'RCBIC') {
        newData.Acc = null;
        newData.CorAcc = null;
        newData.bankName = null;
        newData.bankAddress = null;
      }
      setCustomerData(newData);
      dispatch(editData(newData, 'oders'));
      setEditField(null);
    }
  };
  const handleChange = e => {
    setValue(e.currentTarget.value);
  };

  return (
    <React.Fragment>
      <tr>
        <td
          className="customerTd"
          onDoubleClick={() => {
            handleDBLclick('KPP');
          }}
        >
          {editField == 'KPP' ? (
            <input
              type="text"
              className="customerTrInput"
              onKeyDown={handleEnter}
              onChange={handleChange}
              value={value}
            />
          ) : (
            customerData.KPP
          )}
        </td>
        <td
          className="customerTd"
          onDoubleClick={() => {
            handleDBLclick('OGRN');
          }}
        >
          {editField == 'OGRN' ? (
            <input
              type="text"
              className="customerTrInput"
              onKeyDown={handleEnter}
              onChange={handleChange}
              value={value}
            />
          ) : (
            customerData.OGRN
          )}
        </td>
        <td
          className="customerTd"
          onDoubleClick={() => {
            handleDBLclick('bossName');
          }}
        >
          {editField == 'bossName' ? (
            <input
              type="text"
              className="customerTrInput"
              onKeyDown={handleEnter}
              onChange={handleChange}
              value={value}
            />
          ) : (
            customerData.bossName
          )}
        </td>
        <td
          className="customerTd"
          onDoubleClick={() => {
            handleDBLclick('RCBIC');
          }}
        >
          {editField == 'RCBIC' ? (
            <input
              type="text"
              className="customerTrInput"
              onKeyDown={handleEnter}
              onChange={handleChange}
              value={value}
            />
          ) : (
            customerData.RCBIC
          )}
        </td>
        <td
          className="customerTd"
          onDoubleClick={() => {
            handleDBLclick('Acc');
          }}
        >
          {editField == 'Acc' ? (
            <input
              type="text"
              className="customerTrInput"
              onKeyDown={handleEnter}
              onChange={handleChange}
              value={value}
            />
          ) : (
            customerData.Acc
          )}
        </td>
        <td
          className="customerTd"
          onDoubleClick={() => {
            handleDBLclick('CorAcc');
          }}
        >
          {editField == 'CorAcc' ? (
            <input
              type="text"
              className="customerTrInput"
              onKeyDown={handleEnter}
              onChange={handleChange}
              value={value}
            />
          ) : (
            customerData.CorAcc
          )}
        </td>
        <td
          className="customerTd"
          onDoubleClick={() => {
            handleDBLclick('bankName');
          }}
        >
          {editField == 'bankName' ? (
            <input
              type="text"
              className="customerTrInput"
              onKeyDown={handleEnter}
              onChange={handleChange}
              value={value}
            />
          ) : (
            customerData.bankName
          )}
        </td>
        <td
          className="customerTd"
          onDoubleClick={() => {
            handleDBLclick('bankAddress');
          }}
        >
          {editField == 'bankAddress' ? (
            <input
              type="text"
              className="customerTrInput"
              onKeyDown={handleEnter}
              onChange={handleChange}
              value={value}
            />
          ) : (
            customerData.bankAddress
          )}
        </td>
      </tr>
      {showSuggestions &&
        requestTIN.map((elem, index) => {
          let kpp = elem.data.kpp ? elem.data.kpp : '';
          let address = elem.data.address ? elem.data.address.value : '';
          return (
            <tr key={`suggestion${index}`} onClick={() => handleClickSuggestion(index)}>
              <td className="suggestionTd" colSpan={8}>
                {elem.value + ' КПП ' + kpp + ' ' + address}
              </td>
            </tr>
          );
        })}
    </React.Fragment>
  );
};
