import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { OrderType, Driver } from '../tsTypes';
import { sumInWords, shortName } from '../myLib/myLib';
import { DOMENNAME, VAT } from '../../middlewares/initialState.js';

interface UPDProps {
  order: OrderType;
  strings: DocString[];
  currentTable: string;
  reason: boolean;
  actNumberString: string;
  getStringData: (strings: DocString[]) => void;
  getTextReason: (textReason: string) => void;
  textReason: string;
  invoiceSeal: boolean;
}

interface ClientData {
  name: string;
  address: string;
  inn: string;
  kpp: string;
  account: string;
  corAccount: string;
  bic: string;
  bankName: string;
  bankAddress: string;
  bossName: string;
  ogrn: string;
  dateOfReg: string;
}

interface DocString {
  mainPart: string;
  numberOfShipments: number;
  customerPrice: number;
}

const styles = {
  page: {
    pageBreakAfter: 'always',
    backgroundColor: 'white',
    fontFamily: 'arial',
    color: 'black',
  } as React.CSSProperties,
  sheet: {
    width: 'calc(100% - 40px)',
    margin: '0 auto',
    padding: '20px',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  topRight: {
    fontSize: '11px',
    textAlign: 'right',
    marginBottom: '6px',
  } as React.CSSProperties,
  topRow: {
    display: 'grid',
    gridTemplateColumns: '170px 1fr',
    columnGap: '10px',
    alignItems: 'stretch',
  } as React.CSSProperties,
  leftTitle: {
    borderRight: 'none',
    padding: '10px 10px',
    fontSize: '18px',
    fontWeight: 700,
    lineHeight: 1.1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  } as React.CSSProperties,
  leftStatusWrap: {
    marginTop: '20px',
    fontSize: '12px',
    fontWeight: 400,
  } as React.CSSProperties,
  statusBox: {
    display: 'inline-block',
    width: '40px',
    height: '22px',
    border: '2px solid black',
    verticalAlign: 'middle',
    marginLeft: '8px',
    textAlign: 'center',
    lineHeight: '20px',
    fontWeight: 700,
  } as React.CSSProperties,
  leftStatusDesc: {
    marginTop: '8px',
    fontSize: '10px',
    lineHeight: 1.3,
  } as React.CSSProperties,
  rightHead: {
    border: '2px solid black',
    borderBottom: 'none',
    padding: '10px 10px 8px 10px',
  } as React.CSSProperties,
  rightHeadGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 30px',
    columnGap: '6px',
    fontSize: '12px',
    alignItems: 'end',
  } as React.CSSProperties,
  rowLabel: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    columnGap: '10px',
    alignItems: 'end',
  } as React.CSSProperties,
  rowLabel4col: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr 10px 300px',
    columnGap: '10px',
    alignItems: 'end',
  } as React.CSSProperties,
  underline: {
    borderBottom: '2px solid black',
    height: '16px',
  } as React.CSSProperties,
  rightIndex: {
    fontSize: '10px',
    textAlign: 'right',
  } as React.CSSProperties,
  smallTopNoteRight: {
    fontSize: '11px',
    textAlign: 'right',
    marginTop: '-2px',
    marginBottom: '6px',
  } as React.CSSProperties,
  goodsTable: {
    borderCollapse: 'collapse',
    tableLayout: 'fixed',
    fontSize: '11px',
    marginTop: '0',
    border: '2px solid black',
  } as React.CSSProperties,
  td: {
    border: '1px solid black',
    padding: '2px 3px',
    verticalAlign: 'middle',
  } as React.CSSProperties,
  tdCenter: {
    textAlign: 'center',
  } as React.CSSProperties,
  tdRight: {
    textAlign: 'right',
  } as React.CSSProperties,
  tdTop: {
    verticalAlign: 'top',
  } as React.CSSProperties,
  tableHeader: {
    fontSize: '11px',
    fontWeight: 400,
  } as React.CSSProperties,
  colLetters: {
    fontSize: '11px',
    fontWeight: 700,
  } as React.CSSProperties,
  signatureRow: {
    border: '2px solid black',
    borderTop: 'none',
    padding: '8px 10px',
    display: 'grid',
    gridTemplateColumns: '170px 1fr',
    columnGap: '10px',
    alignItems: 'start',
  } as React.CSSProperties,
  docOnSheets: {
    fontSize: '11px',
    lineHeight: 1.2,
  } as React.CSSProperties,
  signGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    columnGap: '18px',
    fontSize: '11px',
  } as React.CSSProperties,
  signBlock: {
    display: 'grid',
    gridTemplateColumns: '260px 1fr 1fr',
    columnGap: '10px',
    alignItems: 'end',
  } as React.CSSProperties,
  signLine: {
    borderBottom: '1px solid black',
    height: '14px',
    textAlign: 'center',
  } as React.CSSProperties,
  signHint: {
    fontSize: '10px',
    textAlign: 'center',
    marginTop: '2px',
  } as React.CSSProperties,
  bottomBlocks: {
    border: '2px solid black',
    borderTop: 'none',
    padding: '10px 10px 12px 10px',
    fontSize: '10px',
  } as React.CSSProperties,
  bottomRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 40px',
    columnGap: '8px',
    marginBottom: '6px',
    alignItems: 'end',
  } as React.CSSProperties,
  bottomLabel: {
    display: 'grid',
    gridTemplateColumns: '350px 1fr',
    columnGap: '10px',
    alignItems: 'end',
  } as React.CSSProperties,
  bottomUnderline: {
    borderBottom: '1px solid black',
    height: '12px',
  } as React.CSSProperties,
  bottomHelp: {
    fontSize: '9px',
    marginTop: '2px',
    color: 'black',
  } as React.CSSProperties,
  bottom2Col: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    columnGap: '24px',
    marginTop: '5px',
  } as React.CSSProperties,
  bottomSmallLine: {
    borderBottom: '1px solid black',
    height: '12px',
  } as React.CSSProperties,
  stampWrap: {
    position: 'relative',
    height: '0px',
  } as React.CSSProperties,
  signImg: {
    position: 'absolute',
    left: '0px',
    top: '-50px',
    opacity: 0.7,
    width: '100px',
    height: '80px',
    zIndex: 1,
  } as React.CSSProperties,
} as const;

export const UPD = ({
  order,
  strings,
  currentTable,
  reason,
  actNumberString,
  getStringData,
  getTextReason,
  textReason,
  invoiceSeal,
}: UPDProps) => {
  const customerList = useSelector((state: any) => state.oderReducer.clientList);
  const driverList = useSelector((state: any) => state.oderReducer.driverlist);
  const currentOwner = useSelector((state: any) => state.oderReducer.currentOwner);
  const yearConst = useSelector((state: any) => state.oderReducer.yearconst);

  const customer = customerList.find((item: any) => item._id === order.idCustomer);
  const driver = driverList.find((item: Driver) => item._id === order.idDriver);
  const IGC = yearConst.IGC;

  const [accountOwner, setAccountOwner] = useState<ClientData | null>(null);
  const [routeStrings, setRouteStrings] = useState<DocString[]>(strings);
  const [updDate, setUpdDate] = useState<string>('');
  const [statusDoc, setStatusDoc] = useState<'1' | '2'>('1');
  const [textReasonIGC, setTextReasonIGC] = useState<string>(textReason);
  const [documentSheets, setDocumentSheets] = useState<string>('');

  const formatMoney = (value: number) => {
    return value.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  useEffect(() => {
    if (currentTable === 'oderslist' && currentOwner) {
      setAccountOwner({
        name: currentOwner.fullNameOwner,
        address: currentOwner.address,
        inn: currentOwner.TIN,
        kpp: currentOwner.KPP,
        account: currentOwner.Acc,
        corAccount: currentOwner.CorAcc,
        bic: currentOwner.RCBIC,
        bankName: currentOwner.bankName,
        bankAddress: currentOwner.bankAddress,
        bossName: currentOwner.shortFio,
        ogrn: currentOwner.OGRN,
        dateOfReg: currentOwner.dateOfReg,
      });
    }
    if (currentTable === 'driverorderlist' && driver) {
      setAccountOwner({
        name: driver.companyName,
        address: driver.address,
        inn: driver.TIN,
        kpp: driver.KPP,
        account: driver.Acc,
        corAccount: driver.CorAcc,
        bic: driver.RCBIC,
        bankName: driver.bankName,
        bankAddress: driver.bankAddress,
        bossName: driver.bossName,
        ogrn: driver.OGRN,
        dateOfReg: driver.dateOfReg,
      });
    }
    if (order?.date) {
      const date = new Date(order.date);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      setUpdDate(`${day}.${month}.${year}`);
    } else {
      const today = new Date();
      const day = today.getDate().toString().padStart(2, '0');
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const year = today.getFullYear();
      setUpdDate(`${day}.${month}.${year}`);
    }
  }, [currentTable, currentOwner, driver, order]);

  useEffect(() => {
    setRouteStrings(strings);
  }, [strings]);

  useEffect(() => {
    if (textReason) {
      setTextReasonIGC(textReason);
    } else {
      setTextReasonIGC(`  ИГК ${IGC}`);
    }
  }, [textReason, reason, IGC]);

  const totalSum = useMemo(() => {
    return routeStrings.reduce((sum, item) => sum + item.customerPrice * item.numberOfShipments, 0);
  }, [routeStrings]);

  return (
    <div className="updPrintForm" style={styles.page}>
      <div style={styles.sheet}>
        <div style={styles.topRow}>
          <div style={styles.leftTitle}>
            Универсальный
            <br />
            передаточный
            <br />
            документ
            <div style={styles.leftStatusWrap}>
              Статус:
              <span
                style={styles.statusBox}
                onClick={() => setStatusDoc(statusDoc === '1' ? '2' : '1')}
              >
                {statusDoc}
              </span>
              <div style={styles.leftStatusDesc}>
                1 - счет-фактура и
                <br />
                передаточный документ (акт)
                <br />
                2 - передаточный
                <br />
                документ (акт)
              </div>
            </div>
          </div>

          <div>
            <div style={styles.rightHead}>
              <div style={styles.rightHeadGrid}>
                <div style={styles.rowLabel4col}>
                  <div style={{ fontWeight: 700 }}>Счет-фактура №</div>
                  <div style={styles.underline}>{actNumberString}</div>
                  <div style={styles.rightIndex}>(1)</div>
                  <div style={styles.smallTopNoteRight}>
                    Приложение № 1 к постановлению Правительства
                  </div>
                </div>
                <div style={styles.rightIndex}></div>

                <div style={styles.rowLabel4col}>
                  <div style={{ fontWeight: 700 }}>Исправление №</div>
                  <div style={styles.underline}></div>
                  <div style={styles.rightIndex}>(1а)</div>
                  <div style={styles.smallTopNoteRight}>
                    Российской Федерации от 26 декабря 2011 г. № 1137
                  </div>
                </div>
                <div style={styles.rightIndex}></div>

                <div style={styles.rowLabel}>
                  <div style={{ fontWeight: 700 }}>Продавец</div>
                  <div style={styles.underline}>{accountOwner?.name || ''}</div>
                </div>
                <div style={styles.rightIndex}>(2)</div>

                <div style={styles.rowLabel}>
                  <div>Адрес</div>
                  <div style={styles.underline}>{accountOwner?.address || ''}</div>
                </div>
                <div style={styles.rightIndex}>(2а)</div>

                <div style={styles.rowLabel}>
                  <div>ИНН/КПП продавца</div>
                  <div style={styles.underline}>
                    {accountOwner?.inn ? `${accountOwner?.inn} / ${accountOwner?.kpp}` : ''}
                  </div>
                </div>
                <div style={styles.rightIndex}>(2б)</div>

                <div style={styles.rowLabel}>
                  <div>Грузоотправитель и его адрес</div>
                  <div style={styles.underline}>
                    {accountOwner?.name ? `${accountOwner?.name}, ${accountOwner?.address}` : ''}
                  </div>
                </div>
                <div style={styles.rightIndex}>(3)</div>

                <div style={styles.rowLabel}>
                  <div>Грузополучатель и его адрес</div>
                  <div style={styles.underline}>
                    {customer ? `${customer?.companyName}, ${customer?.address}` : ''}
                  </div>
                </div>
                <div style={styles.rightIndex}>(4)</div>

                <div style={styles.rowLabel}>
                  <div>К платежно-расчетному документу</div>
                  <div style={styles.underline}></div>
                </div>
                <div style={styles.rightIndex}>(5)</div>

                <div style={styles.rowLabel}>
                  <div style={{ fontWeight: 700 }}>Покупатель</div>
                  <div style={styles.underline}>{customer?.companyName || ''}</div>
                </div>
                <div style={styles.rightIndex}>(6)</div>

                <div style={styles.rowLabel}>
                  <div>Адрес</div>
                  <div style={styles.underline}>{customer?.address || ''}</div>
                </div>
                <div style={styles.rightIndex}>(6а)</div>

                <div style={styles.rowLabel}>
                  <div>ИНН/КПП покупателя</div>
                  <div style={styles.underline}>
                    {customer?.TIN ? `${customer?.TIN} / ${customer?.KPP || ''}` : ''}
                  </div>
                </div>
                <div style={styles.rightIndex}>(6б)</div>

                <div style={styles.rowLabel}>
                  <div>Валюта: наименование, код</div>
                  <div style={styles.underline}>Российский рубль, 643</div>
                </div>
                <div style={styles.rightIndex}>(7)</div>

                <div style={styles.rowLabel}>
                  <div>
                    Идентификатор государственного контракта, договора (соглашения) (при наличии)
                  </div>
                  <div style={styles.underline}>{reason ? textReasonIGC : '-'}</div>
                </div>
                <div style={styles.rightIndex}>(8)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Основная таблица товаров/услуг */}
        <table style={styles.goodsTable}>
          <colgroup>
            <col style={{ width: '40px' }} />
            <col style={{ width: '50px' }} />
            <col style={{ width: '750px' }} />
            <col style={{ width: '50px' }} />
            <col style={{ width: '70px' }} />
            <col style={{ width: '80px' }} />
            <col style={{ width: '90px' }} />
            <col style={{ width: '120px' }} />
            <col style={{ width: '60px' }} />
            <col style={{ width: '60px' }} />
            <col style={{ width: '110px' }} />
            <col style={{ width: '120px' }} />
            <col style={{ width: '55px' }} />
            <col style={{ width: '85px' }} />
            <col style={{ width: '70px' }} />
          </colgroup>
          <thead>
            <tr style={styles.tableHeader}>
              <td style={{ ...styles.td, ...styles.tdCenter }} rowSpan={2}>
                №
                <br />
                п/п
              </td>
              <td style={{ ...styles.td, ...styles.tdCenter }} rowSpan={2}>
                Код товара/
                <br />
                работ, услуг
              </td>
              <td style={{ ...styles.td, ...styles.tdCenter }} rowSpan={2}>
                Наименование товара (описание выполненных работ, оказанных услуг), имущественного
                права
              </td>
              <td style={{ ...styles.td, ...styles.tdCenter }} colSpan={2}>
                Единица измерения
              </td>
              <td style={{ ...styles.td, ...styles.tdCenter }} rowSpan={2}>
                Количе-
                <br />
                ство
                <br />
                (объем)
              </td>
              <td style={{ ...styles.td, ...styles.tdCenter }} rowSpan={2}>
                Цена
                <br />
                (тариф)
                <br />
                за единицу
                <br />
                измерения
              </td>
              <td style={{ ...styles.td, ...styles.tdCenter }} rowSpan={2}>
                Стоимость товаров (работ, услуг), имущественных прав без налога - всего
              </td>
              <td style={{ ...styles.td, ...styles.tdCenter }} rowSpan={2}>
                В том
                <br />
                числе
                <br />
                сумма
                <br />
                акциза
              </td>
              <td style={{ ...styles.td, ...styles.tdCenter }} rowSpan={2}>
                Нало-
                <br />
                говая
                <br />
                ставка
              </td>
              <td style={{ ...styles.td, ...styles.tdCenter }} rowSpan={2}>
                Сумма
                <br />
                налога,
                <br />
                предъявля-
                <br />
                емая
                <br />
                покупателю
              </td>
              <td style={{ ...styles.td, ...styles.tdCenter }} rowSpan={2}>
                Стоимость товаров (работ, услуг), имущественных прав с налогом - всего
              </td>
              <td style={{ ...styles.td, ...styles.tdCenter }} colSpan={2}>
                Страна происхождения товара
              </td>
              <td style={{ ...styles.td, ...styles.tdCenter }} rowSpan={2}>
                Номер
                <br />
                таможенной
                <br />
                декларации
              </td>
            </tr>
            <tr style={styles.tableHeader}>
              <td style={{ ...styles.td, ...styles.tdCenter }}>код</td>
              <td style={{ ...styles.td, ...styles.tdCenter }}>
                условное
                <br />
                обозна-
                <br />
                чение
                <br />
                (нацио-
                <br />
                нальное)
              </td>
              <td style={{ ...styles.td, ...styles.tdCenter }}>
                Циф-
                <br />
                ровой
                <br />
                код
              </td>
              <td style={{ ...styles.td, ...styles.tdCenter }}>
                Краткое
                <br />
                наиме-
                <br />
                нование
              </td>
            </tr>
            <tr style={styles.colLetters}>
              <td style={{ ...styles.td, ...styles.tdCenter }}>А</td>
              <td style={{ ...styles.td, ...styles.tdCenter }}>Б</td>
              <td style={{ ...styles.td, ...styles.tdCenter }}>1</td>
              <td style={{ ...styles.td, ...styles.tdCenter }}>2</td>
              <td style={{ ...styles.td, ...styles.tdCenter }}>2а</td>
              <td style={{ ...styles.td, ...styles.tdCenter }}>3</td>
              <td style={{ ...styles.td, ...styles.tdCenter }}>4</td>
              <td style={{ ...styles.td, ...styles.tdCenter }}>5</td>
              <td style={{ ...styles.td, ...styles.tdCenter }}>6</td>
              <td style={{ ...styles.td, ...styles.tdCenter }}>7</td>
              <td style={{ ...styles.td, ...styles.tdCenter }}>8</td>
              <td style={{ ...styles.td, ...styles.tdCenter }}>9</td>
              <td style={{ ...styles.td, ...styles.tdCenter }}>10</td>
              <td style={{ ...styles.td, ...styles.tdCenter }}>10а</td>
              <td style={{ ...styles.td, ...styles.tdCenter }}>11</td>
            </tr>
          </thead>
          <tbody>
            {routeStrings.slice(0, 8).map((string, index) => {
              const sum = string.customerPrice * string.numberOfShipments;
              return (
                <tr key={`updRow${index}`}>
                  <td style={{ ...styles.td, ...styles.tdCenter }}>{index + 1}</td>
                  <td style={styles.td}></td>
                  <td style={{ ...styles.td, ...styles.tdTop }}>{string.mainPart}</td>
                  <td style={{ ...styles.td, ...styles.tdCenter }}></td>
                  <td style={{ ...styles.td, ...styles.tdCenter }}></td>
                  <td style={{ ...styles.td, ...styles.tdCenter }}>{string.numberOfShipments}</td>
                  <td style={{ ...styles.td, ...styles.tdRight }}>
                    {formatMoney((string.customerPrice * 100) / (100 + VAT))}
                  </td>
                  <td style={{ ...styles.td, ...styles.tdRight }}>{formatMoney(sum)}</td>
                  <td style={{ ...styles.td, ...styles.tdCenter }}></td>
                  <td style={{ ...styles.td, ...styles.tdCenter }}>{VAT}</td>
                  <td style={{ ...styles.td, ...styles.tdRight }}></td>
                  <td style={{ ...styles.td, ...styles.tdRight }}>{formatMoney(sum)}</td>
                  <td style={{ ...styles.td, ...styles.tdCenter }}></td>
                  <td style={{ ...styles.td, ...styles.tdCenter }}></td>
                  <td style={{ ...styles.td, ...styles.tdCenter }}></td>
                </tr>
              );
            })}

            <tr style={{ fontWeight: 700 }}>
              <td style={{ ...styles.td, ...styles.tdCenter }} colSpan={9}></td>
              <td style={{ ...styles.td, ...styles.tdCenter }}>X</td>
              <td style={{ ...styles.td, ...styles.tdRight }}></td>
              <td style={{ ...styles.td, ...styles.tdRight }}>{formatMoney(totalSum)}</td>
              <td style={styles.td}></td>
              <td style={styles.td}></td>
              <td style={styles.td}></td>
            </tr>
            <tr style={{ fontWeight: 700 }}>
              <td style={{ ...styles.td, ...styles.tdCenter }} colSpan={2}></td>
              <td style={{ ...styles.td, ...styles.tdTop }} colSpan={13}>
                Всего к оплате
              </td>
            </tr>
          </tbody>
        </table>

        {/* Подписи под таблицей */}
        <div style={styles.signatureRow}>
          <div style={styles.docOnSheets}>
            Документ
            <br />
            составлен на
            <br />
            <span
              style={{
                ...styles.bottomUnderline,
                display: 'inline-block',
                width: '80px',
                textAlign: 'center',
              }}
            >
              1
            </span>{' '}
            листах
          </div>

          <div style={styles.signGrid}>
            <div>
              <div style={styles.signBlock}>
                <div>
                  Руководитель организации
                  <br />
                  или иное уполномоченное лицо
                </div>
                <div style={styles.signLine}></div>
                <div style={styles.signLine}></div>
              </div>
              <div
                style={{ display: 'grid', gridTemplateColumns: '260px 1fr 1fr', columnGap: '10px' }}
              >
                <div></div>
                <div style={styles.signHint}>(подпись)</div>
                <div style={styles.signHint}>(ф.и.о.)</div>
              </div>
            </div>

            <div>
              <div style={styles.signBlock}>
                <div>
                  Главный бухгалтер
                  <br />
                  или иное уполномоченное лицо
                </div>
                <div style={styles.signLine}></div>
                <div style={styles.signLine}></div>
              </div>
              <div
                style={{ display: 'grid', gridTemplateColumns: '260px 1fr 1fr', columnGap: '10px' }}
              >
                <div></div>
                <div style={styles.signHint}>(подпись)</div>
                <div style={styles.signHint}>(ф.и.о.)</div>
              </div>
            </div>

            <div>
              <div style={styles.signBlock}>
                <div>Индивидуальный предприниматель</div>
                <div style={styles.signLine}>
                  <div style={styles.stampWrap}>
                    {invoiceSeal && (
                      <img style={styles.signImg} src={`${DOMENNAME}/img/sign.png`} />
                    )}
                  </div>
                </div>
                <div style={styles.signLine}>{shortName(accountOwner?.bossName)}</div>
              </div>
              <div
                style={{ display: 'grid', gridTemplateColumns: '260px 1fr 1fr', columnGap: '10px' }}
              >
                <div></div>
                <div style={styles.signHint}>(подпись)</div>
                <div style={styles.signHint}>(ф.и.о.)</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '10px', marginTop: '2px' }}>
                (реквизиты свидетельства о государственной регистрации индивидуального
                предпринимателя)
              </div>
              <div style={{ ...styles.signLine, marginTop: '6px' }}>
                {accountOwner?.ogrn} от {new Date(accountOwner?.dateOfReg).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Нижние секции 8-19 */}
        <div style={styles.bottomBlocks}>
          <div style={styles.bottomRow}>
            <div style={styles.bottomLabel}>
              <div>Основание передачи (сдачи)/получения (приемки)</div>
              <div style={styles.bottomUnderline}>{reason ? textReasonIGC : ''}</div>
            </div>
            <div style={styles.rightIndex}>[8]</div>
            <div style={{ gridColumn: '1 / 2', marginLeft: '310px' }}></div>
          </div>
          <div
            style={{
              marginLeft: '380px',
              marginTop: '-8px',
              fontSize: '9px',
            }}
          >
            (договор; доверенность и др.)
          </div>

          <div style={styles.bottomRow}>
            <div style={styles.bottomLabel}>
              <div>Данные о транспортировке и грузе</div>
              <div style={styles.bottomUnderline}></div>
            </div>
            <div style={styles.rightIndex}>[9]</div>
          </div>
          <div
            style={{
              marginLeft: '380px',
              marginTop: '-8px',
              fontSize: '9px',
            }}
          >
            (транспортная накладная, поручение экспедитору, экспедиторская/складская расписка и
            др./масса нетто/брутто груза...)
          </div>

          <div style={styles.bottom2Col}>
            <div>
              <div style={styles.bottomRow}>
                <div style={styles.bottomLabel}>
                  <div>Товар (груз) передал/услуги, результаты работ, права сдал</div>
                  <div style={styles.bottomUnderline}>
                    <div style={styles.stampWrap}>
                      {invoiceSeal && (
                        <img style={styles.signImg} src={`${DOMENNAME}/img/sign.png`} />
                      )}
                    </div>
                  </div>
                </div>
                <div style={styles.rightIndex}>[10]</div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  columnGap: '10px',
                  marginBottom: '4px',
                }}
              >
                <div style={styles.bottomSmallLine}></div>
                <div style={styles.bottomSmallLine}>
                  <div style={styles.stampWrap}>
                    {invoiceSeal && (
                      <img style={styles.signImg} src={`${DOMENNAME}/img/sign.png`} />
                    )}
                  </div>
                </div>
                <div style={styles.bottomSmallLine}>{shortName(accountOwner?.bossName)}</div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  columnGap: '10px',
                  fontSize: '9px',
                }}
              >
                <div style={{ textAlign: 'center' }}>(должность)</div>
                <div style={{ textAlign: 'center' }}>(подпись)</div>
                <div style={{ textAlign: 'center' }}>(ф.и.о.)</div>
              </div>

              <div style={styles.bottomRow}>
                <div style={styles.bottomLabel}>
                  <div>Дата отгрузки, передачи (сдачи)</div>
                  <div style={styles.bottomUnderline}></div>
                </div>
                <div style={styles.rightIndex}>[11]</div>
              </div>

              <div style={styles.bottomRow}>
                <div style={styles.bottomLabel}>
                  <div>Иные сведения об отгрузке, передаче</div>
                  <div style={styles.bottomUnderline}></div>
                </div>
                <div style={styles.rightIndex}>[12]</div>
              </div>

              <div style={styles.bottomRow}>
                <div style={styles.bottomLabel}>
                  <div>Ответственный за правильность оформления факта хозяйственной жизни</div>
                  <div style={styles.bottomUnderline}></div>
                </div>
                <div style={styles.rightIndex}>[13]</div>
              </div>

              <div style={styles.bottomRow}>
                <div style={styles.bottomLabel}>
                  <div>Наименование экономического субъекта - составителя документа</div>
                  <div style={styles.bottomUnderline}></div>
                </div>
                <div style={styles.rightIndex}>[14]</div>
              </div>
              <div style={{ textAlign: 'center' }}>М.П.</div>
              {invoiceSeal && (
                <div style={styles.stampWrap}>
                  <img
                    style={{
                      position: 'absolute',
                      left: '215px',
                      top: '-165px',
                      opacity: '0.7',
                      zIndex: '0',
                    }}
                    height="170"
                    width="170"
                    src={`${DOMENNAME}/img/stamp.png`}
                  />
                </div>
              )}
            </div>

            <div>
              <div style={styles.bottomRow}>
                <div style={styles.bottomLabel}>
                  <div>Товар (груз) получил/услуги, результаты работ, права принял</div>
                  <div style={styles.bottomUnderline}></div>
                </div>
                <div style={styles.rightIndex}>[15]</div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  columnGap: '10px',
                }}
              >
                <div style={styles.bottomSmallLine}></div>
                <div style={styles.bottomSmallLine}></div>
                <div style={styles.bottomSmallLine}></div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  columnGap: '10px',
                  fontSize: '9px',
                }}
              >
                <div style={{ textAlign: 'center' }}>(должность)</div>
                <div style={{ textAlign: 'center' }}>(подпись)</div>
                <div style={{ textAlign: 'center' }}>(ф.и.о.)</div>
              </div>

              <div style={styles.bottomRow}>
                <div style={styles.bottomLabel}>
                  <div>Дата получения (приемки)</div>
                  <div style={styles.bottomUnderline}></div>
                </div>
                <div style={styles.rightIndex}>[16]</div>
              </div>

              <div style={styles.bottomRow}>
                <div style={styles.bottomLabel}>
                  <div>Иные сведения о получении, приемке</div>
                  <div style={styles.bottomUnderline}></div>
                </div>
                <div style={styles.rightIndex}>[17]</div>
              </div>

              <div style={styles.bottomRow}>
                <div style={styles.bottomLabel}>
                  <div>Ответственный за правильность оформления факта хозяйственной жизни</div>
                  <div style={styles.bottomUnderline}></div>
                </div>
                <div style={styles.rightIndex}>[18]</div>
              </div>

              <div style={styles.bottomRow}>
                <div style={styles.bottomLabel}>
                  <div>Наименование экономического субъекта - составителя документа</div>
                  <div style={styles.bottomUnderline}></div>
                </div>
                <div style={styles.rightIndex}>[19]</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
