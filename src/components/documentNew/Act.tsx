import React from 'react';

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
  titleRow: {
    width: '100%',
    marginBottom: '20px',
    fontWeight: 700,
    fontSize: '18px',
  } as React.CSSProperties,
  headerTable: {
    borderCollapse: 'collapse',
    width: '100%',
    fontSize: '14px',
    marginBottom: '15px',
  } as React.CSSProperties,
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    fontSize: '12px',
    border: '2px solid black',
  } as React.CSSProperties,
  tableCell: {
    border: '1px solid black',
  } as React.CSSProperties,
};

export const Act: React.FC = () => {
  return (
    <div className="invoicePrintForm" style={styles.container}>
      <div style={styles.mainContent}>
        <div style={styles.titleRow}>
          Акт № 1085 от 01.12.2025
        </div>

        <table style={styles.headerTable}>
          <tbody>
            <tr>
              <td style={{ width: '12%', padding: '3px 5px' }}>Исполнитель:</td>
              <td style={{ padding: '3px 5px', fontWeight: 700 }}>
                ИП Иванов Сергей Николаевич, ИНН 615408271552, свидетельство № 308615401700030 от
                17.01.08г. Ростовская область, 347923, Таганрог, Ломакина, д. 108, кв. 2
              </td>
            </tr>
            <tr>
              <td style={{ width: '12%', padding: '3px 5px' }}>Заказчик:</td>
              <td style={{ padding: '3px 5px', fontWeight: 700 }}>
                ООО "ИМПЭКС-СТАЛЬ" ИНН 6166127010, 344096, РОСТОВСКАЯ ОБЛАСТЬ, Г.О. ГОРОД РОСТОВ-НА-ДОНУ,
                Г РОСТОВ-НА-ДОНУ, ПР-КТ КОРОЛЕВА, ЗД. 5/3, ОФИС 202
              </td>
            </tr>
          </tbody>
        </table>

        <table style={styles.table}>
          <thead>
            <tr
              style={{
                lineHeight: 1.8,
                fontWeight: 700,
                textAlign: 'center',
              }}
            >
              <td style={{ ...styles.tableCell, width: '5.7%' }}>№</td>
              <td style={{ ...styles.tableCell, width: '51.3%' }}>
                Наименование работы (услуги)
              </td>
              <td style={{ ...styles.tableCell, width: '9.7%' }}>Кол-во</td>
              <td style={{ ...styles.tableCell, width: '5.6%' }}>Ед.</td>
              <td style={{ ...styles.tableCell, width: '11.4%' }}>Цена</td>
              <td style={{ ...styles.tableCell, width: '14.3%' }}>Сумма</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ ...styles.tableCell, textAlign: 'center' }}>1</td>
              <td style={{ ...styles.tableCell, padding: '4px' }}>
                Перевозка по маршруту Батайск - Ростов-на-Дону - Таганрог водитель Селиверстов Сергей
                Николаевич а/м КамАЗ с 559 АА 61
              </td>
              <td style={{ ...styles.tableCell, textAlign: 'center' }}>1</td>
              <td style={{ ...styles.tableCell, textAlign: 'center' }}>шт</td>
              <td style={{ ...styles.tableCell, textAlign: 'right', paddingRight: '8px' }}>22000</td>
              <td style={{ ...styles.tableCell, textAlign: 'right', paddingRight: '8px' }}>
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
                }}
              >
                Всего наименований 1, на сумму 22000.00 руб без НДС
              </td>
              <td
                style={{
                  width: '14%',
                  margin: '5px',
                  textAlign: 'right',
                  fontWeight: 700,
                }}
              >
                Итого: 22000.00
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{ width: '100%', fontWeight: 700 }}>
                ( двадцать две тысячи рублей 00 коп. )
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ fontSize: '13px', marginTop: '15px' }}>
          <p style={{ margin: '4px 0' }}>
            Всего оказано услуг на сумму: двадцать две тысячи рублей 00 коп. без НДС
          </p>
          <p style={{ margin: '4px 0' }}>
            Вышеуказанные услуги выполнены полностью и в срок. Заказчик претензий по объему, качеству и
            срокам оказания услуг не имеет
          </p>
        </div>

        <div style={{ position: 'relative', height: '100px', marginTop: '40px', fontSize: '14px' }}>
          <p style={{ marginTop: '20px' }}>
            Исполнитель _____________________________ Иванов С.Н.      Заказчик
            ________________________________
          </p>
        </div>
      </div>
    </div>
  );
};


