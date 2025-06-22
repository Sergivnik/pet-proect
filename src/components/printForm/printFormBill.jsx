import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addPdfDoc } from '../../actions/documentAction.js';
import { dateLocal, findValueBy_Id, sumInWords } from '../myLib/myLib.js';
import './printFormBill.sass';

export const PrintFormBill = props => {
  const dispatch = useDispatch();
  const clientList = useSelector(state => state.oderReducer.clientList);
  const citiesList = useSelector(state => state.oderReducer.citieslist);
  const driver = useSelector(state => state.oderReducer.trackdrivers);
  const track = useSelector(state => state.oderReducer.tracklist);
  const ownerLogist = useSelector(state => state.oderReducer.currentOwner);
  const elem = props.elem;
  const customer = findValueBy_Id(elem.idCustomer, clientList);
  const route = elem.idLoadingPoint.concat(elem.idUnloadingPoint);
  let routeText = '';
  route.forEach(element => {
    let city = findValueBy_Id(element, citiesList).value;
    routeText = routeText + ' - ' + city;
  });
  routeText = routeText.slice(2);
  const driverText = findValueBy_Id(elem.idTrackDriver, driver).name;
  const trackObj = findValueBy_Id(elem.idTrack, track);
  const styleContainer = {
    padding: '20px',
  };
  const styleH5 = {
    width: '95%',
    margin: '20px auto 0 auto',
    textAlign: 'center',
  };
  const styleTable = {
    borderCollapse: 'collapse',
    width: '100%',
    margin: '20px auto 0 auto',
  };
  const styleTd = {
    border: '1px solid black',
    verticalAlign: 'top',
  };
  const styleTd1 = {
    border: '1px solid black',
    verticalAlign: 'top',
    width: '34%',
  };
  const styleTd2 = {
    border: '1px solid black',
    verticalAlign: 'top',
    width: '34%',
  };
  const styleTd3 = {
    border: '1px solid black',
    verticalAlign: 'top',
    width: '7.5%',
  };
  const styleTd4 = {
    border: '1px solid black',
    verticalAlign: 'top',
    width: '25%',
  };
  const styleSpan = {
    fontSize: '12px',
    paddingTop: '10px',
    display: 'inline-block',
  };
  const borerTopNone = {
    border: '1px solid black',
    verticalAlign: 'top',
    borderTop: 'none',
  };
  const borderBottomNone = {
    border: '1px solid black',
    verticalAlign: 'top',
    borderBottom: 'none',
  };

  if (!ownerLogist) {
    return <div>Нет данных об экспедиторе</div>;
  }
  const exp = ownerLogist;

  const handleClickSave = () => {
    let printDoc = document.querySelector('.printForm');
    dispatch(addPdfDoc(printDoc.innerHTML, props.elem._id));
    console.log(printDoc);
    props.closePrintForm();
  };
  return (
    <div className="mainDiv">
      <button onClick={handleClickSave}>Сохранить</button>
      <div className="printForm">
        <div style={styleContainer}>
          <h5
            style={{
              width: '95%',
              margin: '20px auto 0 auto',
              textAlign: 'center',
            }}
          >
            Внимание! Оплата данного счета означает согласие с условиями поставки товара.
            Уведомление об оплате обязательно, в противном случае не гарантируется наличие товара на
            складе. Товар отпускается по факту прихода денег на р/с Поставщика, самовывозом, при
            наличии доверенности и паспорта.
          </h5>
          <h4
            style={{
              width: '95%',
              margin: '20px auto 0 auto',
              textAlign: 'center',
            }}
          >
            Образец заполнения платежного поручения
          </h4>
          <table
            style={{
              borderCollapse: 'collapse',
              width: '100%',
            }}
          >
            <tbody>
              <tr>
                <td style={{ border: '1px solid black' }} colSpan="3">
                  ИНН {exp.TIN || ''}
                </td>
                <td style={{ border: '1px solid black' }} colSpan="2">
                  КПП {exp.KPP || ''}
                </td>
                <td style={{ border: '1px solid black', borderBottom: 'none' }} colSpan="2">
                  Сч.№
                </td>
                <td style={{ border: '1px solid black' }} colSpan="2">
                  {exp.Acc || ''}
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid black' }} colSpan="5">
                  {exp.fullNameOwner || exp.nameOwner || ''}
                  <br />
                  <span
                    style={{
                      fontSize: '12px',
                      paddingTop: '10px',
                      display: 'inline-block',
                    }}
                  >
                    Получатель
                  </span>
                </td>
                <td style={{ border: '1px solid black', borderTop: 'none' }} colSpan="2"></td>
                <td style={{ border: '1px solid black', borderTop: 'none' }} colSpan="2"></td>
              </tr>
              <tr>
                <td style={{ border: '1px solid black' }} colSpan="5" rowSpan="2">
                  {`${exp.bankName || ''} ${exp.bankAddress || ''}`}
                  <br />
                  <span
                    style={{
                      fontSize: '12px',
                      paddingTop: '10px',
                      display: 'inline-block',
                    }}
                  >
                    Банк получателя
                  </span>
                </td>
                <td style={{ border: '1px solid black' }} colSpan="2">
                  БИК
                </td>
                <td style={{ border: '1px solid black', borderBottom: 'none' }} colSpan="2">
                  {exp.RCBIC || ''}
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid black' }} colSpan="2">
                  Сч.№
                </td>
                <td style={{ border: '1px solid black', borderTop: 'none' }} colSpan="2">
                  {exp.CorAcc || ''}
                </td>
              </tr>
              <tr>
                <td colSpan="4" style={{ borderBottom: '2px solid black' }}>
                  <h2 style={{ margin: '20px' }}>
                    Счет № {elem.accountNumber} от {dateLocal(elem.date)}
                  </h2>
                </td>
              </tr>
            </tbody>
          </table>
          <table>
            <tbody>
              <tr>
                <td style={{ margin: '5px', verticalAlign: 'top' }}>Поставщик</td>
                <td colSpan="3" style={{ margin: '5px', fontWeight: '700' }}>
                  {exp.fullNameOwner || exp.nameOwner || ''}, свидетельство № {exp.OGRN || ''}
                  {exp.dateOfReg ? ` от ${exp.dateOfReg}` : ''}. {exp.address || ''}
                </td>
              </tr>
              <tr>
                <td style={{ margin: '5px', verticalAlign: 'top' }}>Покупатель</td>
                <td colSpan="3" style={{ margin: '5px', fontWeight: '700' }}>
                  {customer.companyName + ', ИНН ' + customer.TIN + ', '}
                  <br /> {customer.address}
                </td>
              </tr>
            </tbody>
          </table>
          <table
            style={{
              width: '100%',
              border: '2px solid black',
              borderCollapse: 'collapse',
            }}
          >
            <thead>
              <tr>
                <td
                  style={{
                    border: '1px solid black',
                    textAlign: 'center',
                    fontWeight: '700',
                  }}
                >
                  №
                </td>
                <td
                  style={{
                    border: '1px solid black',
                    textAlign: 'center',
                    fontWeight: '700',
                  }}
                >
                  Наименование работы (услуги)
                </td>
                <td
                  style={{
                    border: '1px solid black',
                    textAlign: 'center',
                    fontWeight: '700',
                  }}
                >
                  Кол-во
                </td>
                <td
                  style={{
                    border: '1px solid black',
                    textAlign: 'center',
                    fontWeight: '700',
                  }}
                >
                  Ед.
                </td>
                <td
                  style={{
                    border: '1px solid black',
                    textAlign: 'center',
                    fontWeight: '700',
                  }}
                >
                  Цена
                </td>
                <td
                  style={{
                    border: '1px solid black',
                    textAlign: 'center',
                    fontWeight: '700',
                  }}
                >
                  Сумма
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    border: '1px solid black',
                    textAlign: 'center',
                    padding: '5px',
                  }}
                >
                  1
                </td>
                <td
                  style={{
                    border: '1px solid black',
                    textAlign: 'left',
                    padding: '5px',
                  }}
                >
                  Перевозка по маршруту {routeText} водитель {driverText} а/м {trackObj.model}{' '}
                  {trackObj.value}
                </td>
                <td
                  style={{
                    border: '1px solid black',
                    textAlign: 'center',
                    padding: '5px',
                  }}
                >
                  1
                </td>
                <td
                  style={{
                    border: '1px solid black',
                    textAlign: 'center',
                    padding: '5px',
                  }}
                >
                  рейс
                </td>
                <td
                  style={{
                    border: '1px solid black',
                    textAlign: 'center',
                    padding: '5px',
                  }}
                >
                  {elem.customerPrice}
                </td>
                <td
                  style={{
                    border: '1px solid black',
                    textAlign: 'center',
                    padding: '5px',
                  }}
                >
                  {elem.customerPrice}
                </td>
              </tr>
            </tbody>
          </table>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td
                  style={{
                    width: '90%',
                    margin: '5px',
                    textAlign: 'right',
                    fontWeight: '700',
                  }}
                >
                  Итого:
                </td>
                <td
                  style={{
                    width: '10%',
                    margin: '5px',
                    textAlign: 'right',
                    fontWeight: '700',
                  }}
                >
                  {elem.customerPrice}
                </td>
              </tr>
              <tr>
                <td style={{ width: '80%' }}>
                  Всего наименований 1, на сумму {elem.customerPrice} руб без НДС
                </td>
              </tr>
              <tr style={{ borderBottom: '2px solid black' }}>
                <td style={{ width: '80%', fontWeight: '700' }}>
                  {'(' + sumInWords(elem.customerPrice) + ' )'}
                </td>
              </tr>
            </tbody>
          </table>
          <div style={{ position: 'relative', height: '100px' }}>
            <p style={{ marginTop: '50px' }}>
              Индивидуальный предприниматель _____________________________
              {exp.shortFio || exp.bossName || exp.nameOwner || ''}
            </p>
            <img
              style={{
                position: 'absolute',
                left: '300px',
                top: '-30px',
                opacity: '0.7',
                zIndex: '-2',
              }}
              height="150"
              width="150"
              src="http://localhost:3000/img/stamp.png"
            />
            <img
              style={{
                position: 'absolute',
                left: '320px',
                top: '-45px',
                zIndex: '-1',
              }}
              height="120"
              width="120"
              src="http://localhost:3000/img/sign.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
