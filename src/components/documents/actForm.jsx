import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { dateLocal, findValueBy_Id, sumInWords } from '../myLib/myLib.js';
import { TrEditable } from './trEditable.jsx';
import { DOMENNAME } from '../../middlewares/initialState.js';
import { AddTr } from './addTr.jsx';
import { SpanWithText } from '../myLib/mySpan/spanWithText.jsx';

import './billsForm.sass';

// Вынесем стили в константы
const styles = {
  container: {
    pageBreakAfter: 'always',
  },
  mainContent: {
    width: '88%',
    display: 'block',
    minHeight: '500px',
    padding: '4% 4% 0% 8%',
    marginTop: '19px',
    fontFamily: 'arial',
  },
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    fontSize: '14px',
  },
  tableCell: {
    border: '1px solid black',
  },
  invoiceNumber: {
    borderBottom: '2px solid black',
  },
  infoBlock: {
    fontSize: '14px',
  },
  infoRow: {
    height: '60px',
  },
  infoLabel: {
    padding: '5px',
    verticalAlign: 'top',
    float: 'left',
    display: 'inline-block',
    width: '12%',
  },
  infoValue: {
    padding: '5px',
    fontWeight: '700',
    float: 'right',
    display: 'inline-block',
    width: '85%',
  },
  reasonLabel: {
    padding: '5px',
    verticalAlign: 'top',
    float: 'left',
    display: 'inline-block',
    width: '10%',
    marginTop: '30px',
  },
  reasonValue: {
    padding: '5px',
    fontWeight: '700',
    float: 'right',
    display: 'inline-block',
    width: '86%',
  },
  mainTable: {
    borderCollapse: 'collapse',
    width: '100%',
    fontSize: '12px',
    border: '2px solid black',
  },
  tableHeader: {
    lineHeight: 1.8,
    fontWeight: '700',
    textAlign: 'center',
  },
  totalRow: {
    width: '84%',
    margin: '5px',
    textAlign: 'right',
    fontWeight: '700',
  },
  totalValue: {
    width: '14%',
    margin: '5px',
    paddingRight: '10px',
    textAlign: 'right',
    fontWeight: '700',
  },
  signature: {
    marginTop: '50px',
    fontSize: '12px',
  },
  stamp: {
    position: 'absolute',
    left: '60px',
    top: '-70px',
    opacity: '0.7',
    zIndex: '-2',
  },
  sign: {
    position: 'absolute',
    left: '90px',
    top: '-75px',
    zIndex: '-1',
    transform: 'rotate(15deg)',
  },
  addressBlock: {
    height: '500px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#d7d7d7',
  },
};

export const ActForm = props => {
  const odersList = useSelector(state => state.oderReducer.originOdersList);
  const clientList = useSelector(state => state.oderReducer.clientList);
  const odersList1 = useSelector(state => state.oderReducer.odersList);
  const currentOwner = useSelector(state => state.oderReducer.currentOwner);

  // Оптимизируем получение заказов
  const oders = useMemo(() => {
    let result = props.dataDoc.odersListId.map(id => odersList.find(elem => elem._id === id));

    if (result[0] === undefined) {
      result = props.dataDoc.odersListId.map(id => odersList1.find(elem => elem._id === id));
    }
    return result;
  }, [props.dataDoc.odersListId, odersList, odersList1]);

  // Оптимизируем вычисление даты
  const dateOfAct = useMemo(() => {
    return oders.reduce((maxDate, elem) => {
      const currentDate = new Date(elem.date);
      return maxDate < currentDate ? currentDate : maxDate;
    }, new Date(oders[0].date));
  }, [oders]);

  const [strInvoiceNumber, setStrInvoiceNumber] = useState(
    `Акт № ${props.dataDoc.number} от ${dateLocal(dateOfAct)}`
  );
  const [showInput, setShowInput] = useState(false);
  const [sumOrders, setSumOrder] = useState(null);

  const customer = useMemo(
    () => findValueBy_Id(oders[0].idCustomer, clientList),
    [oders, clientList]
  );

  // Оптимизируем обработчики событий
  const handleDblClick = useCallback(() => {
    setShowInput(true);
  }, []);

  const handleChange = useCallback(e => {
    setStrInvoiceNumber(e.currentTarget.value);
  }, []);

  const handleEnter = useCallback(e => {
    if (e.keyCode === 13) {
      setShowInput(false);
    }
  }, []);

  const getEditText = useCallback(
    (text, name) => {
      props.editDataReason(text, name);
    },
    [props.editDataReason]
  );

  // Оптимизируем вычисление суммы
  useEffect(() => {
    const sumOders = oders.reduce((sum, elem, index) => {
      const price = props.strObj[index]
        ? Number(props.strObj[index].sum)
        : Number(elem.customerPrice);
      return sum + price;
    }, 0);

    const formattedSum =
      sumOders - Math.floor(sumOders) === 0 ? `${sumOders}.00` : Math.floor(sumOders * 100) / 100;

    setSumOrder(formattedSum);
  }, [oders, props.strObj]);

  useEffect(() => {
    if (props.addStrObj) {
      setSumOrder(Number(sumOrders) + props.addStrObj.numberServices * props.addStrObj.unitPrice);
    }
  }, [props.addStrObj, sumOrders]);

  return (
    <div className="actPrintForm" style={styles.container}>
      <div style={styles.mainContent}>
        <table style={styles.table}>
          <tbody>
            <tr>
              <td onDoubleClick={handleDblClick} style={styles.invoiceNumber}>
                {showInput ? (
                  <input
                    type="text"
                    className="billsFormNumberInput"
                    value={strInvoiceNumber}
                    onChange={handleChange}
                    onKeyDown={handleEnter}
                  />
                ) : (
                  <h2>{strInvoiceNumber}</h2>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <div style={styles.infoBlock}>
          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>Исполнитель:</div>
            <div style={styles.infoValue}>
              {currentOwner && currentOwner.fullNameOwner
                ? `${currentOwner.fullNameOwner}, ИНН ${currentOwner.TIN || ''}, свидетельство № ${currentOwner.OGRN || ''} от 17.01.08г. ${currentOwner.address || ''}`
                : '—'}
            </div>
          </div>
          <div>
            <div style={styles.infoLabel}>Заказчик:</div>
            <div style={styles.infoValue}>
              {customer.companyName + ' ИНН ' + customer.TIN + ', '}
              <br /> {customer.address}
            </div>
          </div>
          {props.addData.reason && (
            <div>
              <div style={styles.reasonLabel}>Основание:</div>
              <div style={styles.reasonValue}>
                <SpanWithText
                  name="reasonValue"
                  text={props.addData.reasonValue}
                  getText={getEditText}
                />
              </div>
            </div>
          )}
        </div>

        <table style={styles.mainTable}>
          <thead>
            <tr style={styles.tableHeader}>
              <td style={{ ...styles.tableCell, width: '5.7%' }}>№</td>
              <td style={{ ...styles.tableCell, width: '51.3%' }}>Наименование работы (услуги)</td>
              <td style={{ ...styles.tableCell, width: '9.7%' }}>Кол-во</td>
              <td style={{ ...styles.tableCell, width: '5.6%' }}>Ед.</td>
              <td style={{ ...styles.tableCell, width: '11.4%' }}>Цена</td>
              <td style={{ ...styles.tableCell, width: '14.3%' }}>Сумма</td>
            </tr>
          </thead>
          <tbody>
            {oders.map((elem, index) => (
              <TrEditable
                key={`strAct${elem._id}${index}`}
                elem={elem}
                index={index}
                getStrText={props.getStrText}
                strObj={props.strObj[index]}
                addData={props.addData}
              />
            ))}
            {props.showAddStr && (
              <AddTr
                numberStr={oders.length + 1}
                getAddStr={props.getAddStr}
                addStrObj={props.addStrObj}
              />
            )}
          </tbody>
        </table>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px',
            marginTop: '10px',
          }}
        >
          <tbody>
            <tr>
              <td style={styles.totalRow}>Итого:</td>
              <td style={styles.totalValue}>{sumOrders}</td>
            </tr>
            <tr>
              <td style={{ width: '80%' }}>
                Всего наименований {oders.length}, на сумму {sumOrders} руб без НДС
              </td>
            </tr>
            <tr>
              <td style={{ width: '80%', fontWeight: '700' }}>
                {'(' + sumInWords(sumOrders) + ' )'}
              </td>
            </tr>
            <tr>
              <td style={{ width: '80%', fontStyle: 'italic', padding: '10px 0' }}>
                {'Всего оказано услуг на сумму: ' + sumInWords(sumOrders) + ' без НДС'}
              </td>
            </tr>
            <tr>
              <td style={{ width: '100%' }} colSpan="2">
                Вышеперечисленные услуги выполнены полностью и в срок. Заказчик претензий по объему,
                качеству и срокам оказания услуг не имеет
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ position: 'relative', height: '100px' }}>
          <p style={styles.signature}>
            Исполнитель{' '}
            <span style={{ textDecoration: 'underline' }}>
              &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
              {currentOwner && currentOwner.shortFio
                ? currentOwner.shortFio
                : currentOwner && currentOwner.bossName
                  ? currentOwner.bossName
                  : '—'}{' '}
              &emsp;&emsp;
            </span>
            &emsp;&emsp;Заказчик{' '}
            <span style={{ textDecoration: 'underline' }}>
              &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; &emsp;&emsp;&emsp;&emsp;
              &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; &emsp;&emsp;
            </span>{' '}
          </p>
          {props.stamp && (
            <img style={styles.stamp} height="170" width="170" src={`${DOMENNAME}/img/stamp.png`} />
          )}
          {props.stamp && (
            <img style={styles.sign} height="120" width="120" src={`${DOMENNAME}/img/sign.png`} />
          )}
        </div>
        {props.address && (
          <div style={styles.addressBlock}>
            Просьба отправить этот экземпляр акта с подписью и печатью по адресу: <br />
            347924, г.Таганрог, ул. Москатова 31/2 офис 34
          </div>
        )}
      </div>
    </div>
  );
};
