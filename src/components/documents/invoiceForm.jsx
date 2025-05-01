import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { dateLocal, findValueBy_Id, sumInWords } from "../myLib/myLib.js";
import { TrEditable } from "./trEditable.jsx";
import { DOMENNAME } from "../../middlewares/initialState.js";
import { AddTr } from "./addTr.jsx";
import { SpanWithText } from "../myLib/mySpan/spanWithText.jsx";

import "./billsForm.sass";

// Вынесем стили в константы
const styles = {
  container: {
    pageBreakAfter: "always",
  },
  mainContent: {
    width: "88%",
    display: "block",
    minHeight: "500px",
    padding: "4% 4% 0% 8%",
    marginTop: "19px",
    fontFamily: "arial",
  },
  warningText: {
    width: "95%",
    margin: "0 auto",
    textAlign: "center",
    fontSize: "11px",
    lineHeight: "1",
    fontWeight: 300,
  },
  paymentSample: {
    width: "95%",
    margin: "20px auto 0 auto",
    textAlign: "center",
    fontSize: "14px",
  },
  table: {
    borderCollapse: "collapse",
    width: "100%",
    fontSize: "14px",
  },
  tableCell: {
    border: "1px solid black",
  },
  invoiceNumber: {
    borderBottom: "2px solid black",
    fontSize: "16px",
  },
  invoiceTitle: {
    fontWeight: 700,
    margin: "17px 0 17px 0",
    fontSize: "18px",
  },
};

export const InvoiceForm = (props) => {
  const odersList = useSelector((state) => state.oderReducer.originOdersList);
  const clientList = useSelector((state) => state.oderReducer.clientList);
  const odersList1 = useSelector((state) => state.oderReducer.odersList);

  // Оптимизируем получение заказов
  const oders = useMemo(() => {
    let result = props.dataDoc.odersListId.map((id) =>
      odersList.find((elem) => elem._id === id)
    );

    if (result[0] === undefined) {
      result = props.dataDoc.odersListId.map((id) =>
        odersList1.find((elem) => elem._id === id)
      );
    }
    return result;
  }, [props.dataDoc.odersListId, odersList, odersList1]);

  // Оптимизируем вычисление даты
  const dateOfInvoice = useMemo(() => {
    return oders.reduce((maxDate, elem) => {
      const currentDate = new Date(elem.date);
      return maxDate < currentDate ? currentDate : maxDate;
    }, new Date(oders[0].date));
  }, [oders]);

  const [strInvoiceNumber, setStrInvoiceNumber] = useState(
    `Счет № ${props.dataDoc.number} от ${dateLocal(dateOfInvoice)}`
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

  const handleChange = useCallback((e) => {
    setStrInvoiceNumber(e.currentTarget.value);
  }, []);

  const handleEnter = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        setShowInput(false);
        const start = strInvoiceNumber.indexOf("№") + 1;
        const adjustedStart =
          strInvoiceNumber[start] === " " ? start + 1 : start;
        const end = strInvoiceNumber.indexOf(" от ", 7);
        const newNumber = strInvoiceNumber.slice(adjustedStart, end);
        props.getNewNumber(newNumber);
      }
    },
    [strInvoiceNumber, props.getNewNumber]
  );

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
      sumOders - Math.floor(sumOders) === 0
        ? `${sumOders}.00`
        : Math.floor(sumOders * 100) / 100;

    setSumOrder(formattedSum);
  }, [oders, props.strObj]);

  useEffect(() => {
    if (props.addStrObj) {
      setSumOrder(
        Number(sumOrders) +
          props.addStrObj.numberServices * props.addStrObj.unitPrice
      );
    }
  }, [props.addStrObj, sumOrders]);

  return (
    <div className="invoicePrintForm" style={styles.container}>
      <div style={styles.mainContent}>
        <h5 style={styles.warningText}>
          Внимание! Оплата данного счета означает согласие с условиями поставки
          товара. Уведомление об оплате
          <br />
          обязательно, в противном случае не гарантируется наличие товара на
          складе. Товар отпускается по факту
          <br />
          прихода денег на р/с Поставщика, самовывозом, при наличии доверенности
          и паспорта.
        </h5>
        <h4 style={styles.paymentSample}>
          Образец заполнения платежного поручения
        </h4>
        <table style={styles.table}>
          <tbody>
            <tr style={{ lineHeight: "1" }}>
              <td style={{ ...styles.tableCell, width: "34.3%" }}>
                ИНН 615408271552
              </td>
              <td style={{ ...styles.tableCell, width: "31.3%" }}>КПП</td>
              <td
                style={{
                  ...styles.tableCell,
                  borderBottom: "none",
                  width: "6.7%",
                }}
              >
                Сч.№
              </td>
              <td style={{ ...styles.tableCell, width: "25.7%" }}>
                40802810400000367485
              </td>
            </tr>
            <tr style={{ lineHeight: "1" }}>
              <td style={styles.tableCell} colSpan={2}>
                ИП Иванов Сергей Николаевич
                <br />
                <span
                  style={{
                    fontSize: "12px",
                    paddingTop: "6px",
                    display: "inline-block",
                  }}
                >
                  Получатель
                </span>
              </td>
              <td style={{ ...styles.tableCell, borderTop: "none" }}></td>
              <td style={{ ...styles.tableCell, borderTop: "none" }}></td>
            </tr>
            <tr style={{ lineHeight: "1" }}>
              <td style={styles.tableCell} rowSpan="2" colSpan={2}>
                АО "ТИНЬКОФФ БАНК" 123060 Москва 1-й Волоколамский пр-д,д.10
                <br />
                <span
                  style={{
                    fontSize: "12px",
                    paddingTop: "6px",
                    display: "inline-block",
                  }}
                >
                  Банк получателя
                </span>
              </td>
              <td style={styles.tableCell}>БИК</td>
              <td style={{ ...styles.tableCell, borderBottom: "none" }}>
                044525974
              </td>
            </tr>
            <tr>
              <td style={styles.tableCell}>Сч.№</td>
              <td style={{ ...styles.tableCell, borderTop: "none" }}>
                30101810145250000974
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <div onDoubleClick={handleDblClick} style={styles.invoiceNumber}>
            {showInput ? (
              <input
                type="text"
                className="billsFormNumberInput"
                value={strInvoiceNumber}
                onChange={handleChange}
                onKeyDown={handleEnter}
              />
            ) : (
              <h4 style={styles.invoiceTitle}>{strInvoiceNumber}</h4>
            )}
          </div>
        </div>
        <div style={{ fontSize: "14px" }}>
          <div style={{ height: "60px" }}>
            <div
              style={{
                padding: "5px",
                verticalAlign: "top",
                float: "left",
                display: "inline-block",
                width: "10%",
              }}
            >
              Поставщик:
            </div>
            <div
              style={{
                padding: "5px",
                fontWeight: "700",
                float: "right",
                display: "inline-block",
                width: "86%",
              }}
            >
              ИП Иванов Сергей Николаевич, ИНН 615408271552, свидетельство №
              308615401700030 от 17.01.08г. Ростовская область, 347923,
              Таганрог, Ломакина, д. 108, кв. 2{" "}
            </div>
          </div>
          <div>
            <div
              style={{
                padding: "5px",
                verticalAlign: "top",
                float: "left",
                display: "inline-block",
                width: "10%",
              }}
            >
              Покупатель:
            </div>
            <div
              style={{
                padding: "5px",
                fontWeight: "700",
                float: "right",
                display: "inline-block",
                width: "86%",
              }}
            >
              {customer.companyName + " ИНН " + customer.TIN + ", "}
              <br /> {customer.address}
            </div>
          </div>
          {props.addData.reason && (
            <div>
              <div
                style={{
                  padding: "5px",
                  verticalAlign: "top",
                  float: "left",
                  display: "inline-block",
                  width: "10%",
                  marginTop: "30px",
                }}
              >
                Основание:
              </div>
              <div
                style={{
                  padding: "5px",
                  fontWeight: "700",
                  float: "right",
                  display: "inline-block",
                  width: "86%",
                }}
              >
                <SpanWithText
                  name="reasonValue"
                  text={props.addData.reasonValue}
                  getText={getEditText}
                />
              </div>
            </div>
          )}
        </div>

        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            fontSize: "12px",
            border: "2px solid black",
          }}
        >
          <thead>
            <tr
              style={{
                lineHeight: 1.8,
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              <td style={{ border: "1px solid black", width: "5.7%" }}>№</td>
              <td style={{ border: "1px solid black", width: "51.3%" }}>
                Наименование работы (услуги)
              </td>
              <td style={{ border: "1px solid black", width: "9.7%" }}>
                Кол-во
              </td>
              <td style={{ border: "1px solid black", width: "5.6%" }}>Ед.</td>
              <td style={{ border: "1px solid black", width: "11.4%" }}>
                Цена
              </td>
              <td style={{ border: "1px solid black", width: "14.3%" }}>
                Сумма
              </td>
            </tr>
          </thead>
          <tbody>
            {oders.map((elem, index) => {
              return (
                <TrEditable
                  key={`strBill${elem._id}${index}`}
                  elem={elem}
                  index={index}
                  getStrText={props.getStrText}
                  strObj={props.strObj[index]}
                  addData={props.addData}
                />
              );
            })}
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
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
            marginTop: "10px",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  width: "84%",
                  margin: "5px",
                  textAlign: "right",
                  fontWeight: "700",
                }}
              >
                Итого:
              </td>
              <td
                style={{
                  width: "14%",
                  margin: "5px",
                  paddingRight: "10px",
                  textAlign: "right",
                  fontWeight: "700",
                }}
              >
                {sumOrders}
              </td>
            </tr>
            <tr>
              <td style={{ width: "80%" }}>
                Всего наименований {oders.length}, на сумму {sumOrders} руб без
                НДС
              </td>
            </tr>
            <tr style={{ borderBottom: "2px solid black" }}>
              <td style={{ width: "80%", fontWeight: "700" }}>
                {"(" + sumInWords(sumOrders) + " )"}
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ position: "relative", height: "100px" }}>
          <p style={{ marginTop: "50px" }}>
            Индивидуальный предприниматель _____________________________Иванов
            С.Н.
          </p>
          {props.stamp && (
            <img
              style={{
                position: "absolute",
                left: "300px",
                top: "-65px",
                opacity: "0.7",
                zIndex: "-2",
              }}
              height="170"
              width="170"
              src={`${DOMENNAME}/img/stamp.png`}
            />
          )}
          {props.stamp && (
            <img
              style={{
                position: "absolute",
                left: "330px",
                top: "-75px",
                zIndex: "-1",
                transform: "rotate(15deg)",
              }}
              height="120"
              width="120"
              src={`${DOMENNAME}/img/sign.png`}
            />
          )}
        </div>
      </div>
    </div>
  );
};
