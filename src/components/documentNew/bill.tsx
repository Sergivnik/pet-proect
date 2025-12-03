import React from 'react';
import { useSelector } from 'react-redux';
import { OrderType } from '../tsTypes';

interface BillProps {
  order: OrderType;
  addData: any;
  currentTable: string;
}

const styles = {
  container: {
    pageBreakAfter: 'always',
  } as React.CSSProperties,
  mainContent: {
    width: 'calc(100% - 40px)',
    display: 'block',
    minHeight: '500px',
    padding: '20px',
    marginTop: '19px',
    fontFamily: 'arial',
  } as React.CSSProperties,
  warningText: {
    width: '95%',
    margin: '0 auto',
    textAlign: 'center',
    fontSize: '11px',
    lineHeight: '1',
    fontWeight: 300,
  } as React.CSSProperties,
  paymentSample: {
    width: '95%',
    margin: '20px auto 0 auto',
    textAlign: 'center',
    fontSize: '14px',
  } as React.CSSProperties,
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    fontSize: '14px',
  } as React.CSSProperties,
  tableCell: {
    border: '1px solid black',
  } as React.CSSProperties,
  invoiceNumber: {
    borderBottom: '2px solid black',
    fontSize: '16px',
  } as React.CSSProperties,
  invoiceTitle: {
    fontWeight: 700,
    margin: '17px 0 17px 0',
    fontSize: '18px',
  } as React.CSSProperties,
};

export const Bill = ({ order, addData, currentTable }: BillProps) => {
  console.log(order, addData, currentTable);
  const customerList = useSelector((state: any) => state.oderReducer.clientList);

  return (
    <div className="invoicePrintForm" style={styles.container}>
      <div style={styles.mainContent}>
        <h5 style={styles.warningText}>
          Внимание! Оплата данного счета означает согласие с условиями поставки товара. Уведомление
          об оплате
          <br />
          обязательно, в противном случае не гарантируется наличие товара на складе. Товар
          отпускается по факту
          <br />
          прихода денег на р/с Поставщика, самовывозом, при наличии доверенности и паспорта.
        </h5>
        <h4 style={styles.paymentSample}>Образец заполнения платежного поручения</h4>
        <table style={styles.table}>
          <tbody>
            <tr style={{ lineHeight: '1' }}>
              <td style={{ ...styles.tableCell, width: '34.3%' }}>ИНН 615408271552</td>
              <td style={{ ...styles.tableCell, width: '31.3%' }}>КПП</td>
              <td
                style={{
                  ...styles.tableCell,
                  borderBottom: 'none',
                  width: '6.7%',
                }}
              >
                Сч.№
              </td>
              <td style={{ ...styles.tableCell, width: '25.7%' }}>40802810400000367485</td>
            </tr>
            <tr style={{ lineHeight: '1' }}>
              <td style={styles.tableCell} colSpan={2}>
                ИП Иванов Сергей Николаевич
                <br />
                <span
                  style={{
                    fontSize: '12px',
                    paddingTop: '6px',
                    display: 'inline-block',
                  }}
                >
                  Получатель
                </span>
              </td>
              <td style={{ ...styles.tableCell, borderTop: 'none' }}></td>
              <td style={{ ...styles.tableCell, borderTop: 'none' }}></td>
            </tr>
            <tr style={{ lineHeight: '1' }}>
              <td style={styles.tableCell} rowSpan={2} colSpan={2}>
                АО «ТБанк» г Москва, ул Хуторская 2-я, д 38А стр 26
                <br />
                <span
                  style={{
                    fontSize: '12px',
                    paddingTop: '6px',
                    display: 'inline-block',
                  }}
                >
                  Банк получателя
                </span>
              </td>
              <td style={styles.tableCell}>БИК</td>
              <td style={{ ...styles.tableCell, borderBottom: 'none' }}>044525974</td>
            </tr>
            <tr>
              <td style={styles.tableCell}>Сч.№</td>
              <td style={{ ...styles.tableCell, borderTop: 'none' }}>30101810145250000974</td>
            </tr>
          </tbody>
        </table>
        <div>
          <div style={styles.invoiceNumber}>
            <h4 style={styles.invoiceTitle}>Счет № 1085 от 01.12.2025</h4>
          </div>
        </div>
        <div style={{ fontSize: '14px' }}>
          <div style={{ height: '60px' }}>
            <div
              style={{
                padding: '5px',
                verticalAlign: 'top',
                float: 'left',
                display: 'inline-block',
                width: '10%',
              }}
            >
              Поставщик:
            </div>
            <div
              style={{
                padding: '5px',
                fontWeight: 700,
                float: 'right',
                display: 'inline-block',
                width: '86%',
              }}
            >
              ИП Иванов Сергей Николаевич, ИНН 615408271552, свидетельство № 308615401700030 от
              17.01.08г. Ростовская область, 347923, Таганрог, Ломакина, д. 108, кв. 2
            </div>
          </div>
          <div>
            <div
              style={{
                padding: '5px',
                verticalAlign: 'top',
                float: 'left',
                display: 'inline-block',
                width: '10%',
              }}
            >
              Покупатель:
            </div>
            <div
              style={{
                padding: '5px',
                fontWeight: 700,
                float: 'right',
                display: 'inline-block',
                width: '86%',
              }}
            >
              ООО "ИМПЭКС-СТАЛЬ" ИНН 6166127010, 344096, РОСТОВСКАЯ ОБЛАСТЬ, Г.О. ГОРОД
              РОСТОВ-НА-ДОНУ, Г РОСТОВ-НА-ДОНУ, ПР-КТ КОРОЛЕВА, ЗД. 5/3, ОФИС 202
            </div>
          </div>
        </div>

        <table
          style={{
            borderCollapse: 'collapse',
            width: '100%',
            fontSize: '12px',
            border: '2px solid black',
          }}
        >
          <thead>
            <tr
              style={{
                lineHeight: 1.8,
                fontWeight: 700,
                textAlign: 'center',
              }}
            >
              <td style={{ border: '1px solid black', width: '5.7%' }}>№</td>
              <td style={{ border: '1px solid black', width: '51.3%' }}>
                Наименование работы (услуги)
              </td>
              <td style={{ border: '1px solid black', width: '9.7%' }}>Кол-во</td>
              <td style={{ border: '1px solid black', width: '5.6%' }}>Ед.</td>
              <td style={{ border: '1px solid black', width: '11.4%' }}>Цена</td>
              <td style={{ border: '1px solid black', width: '14.3%' }}>Сумма</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid black', textAlign: 'center' }}>1</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>
                Перевозка по маршруту Батайск - Ростов-на-Дону - Таганрог водитель Селиверстов
                Сергей Николаевич а/м КамАЗ с 559 АА 61
              </td>
              <td style={{ border: '1px solid black', textAlign: 'center' }}>1</td>
              <td style={{ border: '1px solid black', textAlign: 'center' }}>шт</td>
              <td style={{ border: '1px solid black', textAlign: 'right', paddingRight: '8px' }}>
                22000
              </td>
              <td style={{ border: '1px solid black', textAlign: 'right', paddingRight: '8px' }}>
                22000.00
              </td>
            </tr>
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
              <td
                style={{
                  width: '84%',
                  margin: '5px',
                  textAlign: 'right',
                  fontWeight: 700,
                }}
              >
                Итого:
              </td>
              <td
                style={{
                  width: '14%',
                  margin: '5px',
                  paddingRight: '10px',
                  textAlign: 'right',
                  fontWeight: 700,
                }}
              >
                22000.00
              </td>
            </tr>
            <tr>
              <td style={{ width: '80%' }}>Всего наименований 1, на сумму 22000.00 руб без НДС</td>
            </tr>
            <tr style={{ borderBottom: '2px solid black' }}>
              <td style={{ width: '80%', fontWeight: 700 }}>
                ( двадцать две тысячи рублей 00 коп. )
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ position: 'relative', height: '100px' }}>
          <p style={{ marginTop: '50px' }}>
            Индивидуальный предприниматель _____________________________ Иванов С.Н.
          </p>
        </div>
      </div>
    </div>
  );
};
