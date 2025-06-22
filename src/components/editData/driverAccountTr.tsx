import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { editData } from '../../actions/editDataAction.js';
import { TdWithText } from '../myLib/myTd/tdWithText.jsx';
import { URL } from '../../middlewares/initialState';

import './editData.sass';
export interface Driver {
  _id: number;
  value: string;
  phone: string;
  companyName: string;
  TIN: string;
  address: string;
  currentAccount: string;
  contract: string;
  active: boolean;
  addInfo: string;
  KPP: string;
  OGRN: string;
  Acc: string;
  CorAcc: string;
  RCBIC: string;
  bossName: string;
  bankName: string;
  bankAddress: string;
}
interface Props {
  driver: Driver;
}
export const DriverAccountTr = ({ driver }: Props) => {
  const dispatch = useDispatch();

  const [driverData, setDriverData] = useState<Driver>(driver);
  const [requestTIN, setRequestTIN] = useState([]);
  const [requestRCBIC, setRequestRCBIC] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setDriverData(driver);
  }, [driver]);
  useEffect(() => {
    const data = { query: driverData.TIN };
    if (
      driverData.TIN != null &&
      (driverData.address == null ||
        driverData.companyName == null ||
        driverData.KPP == null ||
        driverData.OGRN == null ||
        driverData.bossName == null ||
        driverData.address == '' ||
        driverData.companyName == '' ||
        driverData.KPP == '' ||
        driverData.OGRN == '' ||
        driverData.bossName == '')
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
  }, [driverData.TIN]);

  useEffect(() => {
    const data = {
      query: driverData.RCBIC,
    };
    if (
      driverData.RCBIC != null &&
      (driverData.CorAcc == null ||
        driverData.bankName == null ||
        driverData.bankAddress == null ||
        driverData.CorAcc == '' ||
        driverData.bankName == '' ||
        driverData.bankAddress == '')
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
  }, [driverData.RCBIC]);

  useEffect(() => {
    if (requestRCBIC.length) {
      let newData = { ...driverData };
      if (driverData.CorAcc == null || driverData.CorAcc == '') {
        newData.CorAcc = requestRCBIC[0].data.correspondent_account
          ? requestRCBIC[0].data.correspondent_account
          : 'нет данных';
      }
      if (driverData.bankName == null || driverData.bankName == '') {
        newData.bankName = requestRCBIC[0].value ? requestRCBIC[0].value : 'нет данных';
      }
      if (driverData.bankAddress == null || driverData.bankAddress == '') {
        newData.bankAddress = requestRCBIC[0].data.address.value
          ? requestRCBIC[0].data.address.value
          : 'нет данных';
      }
      setDriverData(newData);
      dispatch(editData(newData, 'drivers'));
    }
  }, [requestRCBIC]);

  const handleClickSuggestion = index => {
    console.log(index);
    let newData: Driver = { ...driverData };
    if (driverData.KPP == null || driverData.KPP == '') {
      newData.KPP = requestTIN[index].data.kpp ? requestTIN[index].data.kpp : 'нет данных';
    }
    if (driverData.companyName == null || driverData.companyName == '') {
      newData.companyName = requestTIN[index].data.name.short_with_opf
        ? requestTIN[index].data.name.short_with_opf
        : 'нет данных';
    }
    if (driverData.OGRN == null || driverData.OGRN == '') {
      newData.OGRN = requestTIN[index].data.ogrn ? requestTIN[index].data.ogrn : 'нет данных';
    }
    if (driverData.bossName == null || driverData.bossName == '') {
      newData.bossName = requestTIN[index].data.name.full
        ? requestTIN[index].data.name.full
        : 'нет данных';
    }
    if (driverData.address == null || driverData.address == '') {
      newData.address = requestTIN[index].data.address.unrestricted_value
        ? requestTIN[index].data.address.unrestricted_value
        : 'нет данных';
    }
    setDriverData(newData);
    setShowSuggestions(false);
    dispatch(editData(newData, 'drivers'));
  };
  const getNewData = (newValue: string, name: string, driver: Driver) => {
    console.log(newValue, name, driver);
    let newData = { ...driver };
    newData[name] = newValue;
    if (name == 'RCBIC') {
      newData.Acc = null;
      newData.CorAcc = null;
      newData.bankName = null;
      newData.bankAddress = null;
    }
    setDriverData(newData);
    dispatch(editData(newData, 'drivers'));
  };

  return (
    <React.Fragment>
      <tr>
        <TdWithText text={driverData.KPP} name="KPP" getData={getNewData} elem={driverData} />
        <TdWithText text={driverData.OGRN} name="OGRN" getData={getNewData} elem={driverData} />
        <TdWithText text={driverData.Acc} name="Acc" getData={getNewData} elem={driverData} />
        <TdWithText text={driverData.CorAcc} name="CorAcc" getData={getNewData} elem={driverData} />
        <TdWithText text={driverData.RCBIC} name="RCBIC" getData={getNewData} elem={driverData} />
        <TdWithText
          text={driverData.bossName}
          name="bossName"
          getData={getNewData}
          elem={driverData}
        />
        <TdWithText
          text={driverData.bankName}
          name="bankName"
          getData={getNewData}
          elem={driverData}
        />
        <TdWithText
          text={driverData.bankAddress}
          name="bankAddress"
          getData={getNewData}
          elem={driverData}
        />
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
