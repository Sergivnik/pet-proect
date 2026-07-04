import React from 'react';
import { useSelector } from 'react-redux';

export const CustomerPaymentsTr = React.forwardRef((props, ref) => {
  const clientList = useSelector(state => state.oderReducer.clientList);
  const odersList = useSelector(state => state.oderReducer.originOdersList);
  const driversList = useSelector(state => state.oderReducer.driverlist);
  const citieslist = useSelector(state => state.oderReducer.citieslist);

  const showDetails = props.isOpen || false;
  const fontWeight = showDetails ? 'customerPaymentBoldFont' : '';
  const DateStr = date => {
    date = new Date(date);
    return date.toLocaleDateString();
  };

  const handleClickTr = e => {
    if (e.target.tagName == 'TD') {
      props.onToggle && props.onToggle();
    }
  };
  let elem = props.paymentData;
  let sumOfOders = elem.listOfOders.reduce((sum, current) => sum + current.customerPrice, 0);
  let customer = clientList.find(item => item._id == elem.idCustomer);
  let nameOfCustomer = customer?.value || '';

  const handleClickDelete = () => {
    let password = prompt('Подтвердите удаление', 'Пароль');
    if (password == 'Пароль') {
      props.handleClickDelete(props.paymentData.id);
    }
  };
  const getTdStyle = index => ({
    width: `${props.colWidths[index]}%`,
  });
  return (
    <>
      <tr
        ref={ref}
        onClick={handleClickTr}
        className={fontWeight}
        style={props.style}
        {...(props['data-index'] !== undefined ? { 'data-index': props['data-index'] } : {})}
      >
        <td className="customerPaymentMainTd" style={getTdStyle(0)}>{DateStr(elem.date)}</td>
        <td className="customerPaymentMainTd" style={getTdStyle(1)}>{nameOfCustomer}</td>
        <td className="customerPaymentMainTd" style={getTdStyle(2)}>{elem.sumOfPayment}</td>
        <td className="customerPaymentMainTd" style={getTdStyle(3)}>{sumOfOders}</td>
        <td className="customerPaymentMainTd" style={getTdStyle(4)}>
          <span>{elem.sumExtraPayment}</span>
          {showDetails && (
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
      </tr>
      {showDetails && (
        <tr
          className="customerPaymentBoldFont"
          style={
            props.style
              ? {
                  ...props.style,
                  position: 'absolute',
                  top: props.style.transform
                    ? `${parseInt(props.style.transform.match(/\d+/)?.[0] || 0) + 20}px`
                    : '0',
                  left: 0,
                  transform: 'none',
                  display: 'table',
                  tableLayout: 'fixed',
                  width: '100%',
                  zIndex: 10,
                }
              : { zIndex: 10 }
          }
        >
          <td colSpan="5" className="customerPaymentMainTd" style={{ padding: '5px 5px 0 10px' }}>
            <table
              className="customerPaymentInsideTable"
              style={{ zIndex: 10, position: 'relative' }}
            >
              <thead className="customerPaymentInsideHeader">
                <tr style={{ backgroundColor: 'while' }} onClick={handleClickTr}>
                  <td className="customerPaymentInsideTd">Дата рейса</td>
                  <td className="customerPaymentInsideTd">Водитель</td>
                  <td className="customerPaymentInsideTd">Заказчик</td>
                  <td className="customerPaymentInsideTd">Погрузка</td>
                  <td className="customerPaymentInsideTd">Выгрузка</td>
                  <td className="customerPaymentInsideTd">Списано в платеже</td>
                  <td className="customerPaymentInsideTd">Полная стоимость рейса</td>
                  <td className="customerPaymentInsideTd">Номер счета</td>
                </tr>
              </thead>
              <tbody>
                {elem.listOfOders.map(item => {
                  let oder = odersList.find(element => element._id == item.id);
                  if (!oder) return null;

                  let driver = driversList.find(element => element._id == oder.idDriver);
                  let loadingPoints = '';
                  if (oder.idLoadingPoint && Array.isArray(oder.idLoadingPoint)) {
                    oder.idLoadingPoint.forEach(element => {
                      let point = citieslist.find(city => city._id == element)?.value;
                      if (point) loadingPoints = loadingPoints + point + '\n';
                    });
                  }
                  let unloadingPoints = '';
                  if (oder.idUnloadingPoint && Array.isArray(oder.idUnloadingPoint)) {
                    oder.idUnloadingPoint.forEach(element => {
                      let point = citieslist.find(city => city._id == element)?.value;
                      if (point) unloadingPoints = unloadingPoints + point + '\n';
                    });
                  }
                  return (
                    <tr key={`trOder${item.id}`} onClick={handleClickTr}>
                      <td className="customerPaymentInsideTd">
                        {oder.date ? DateStr(oder.date) : ''}
                      </td>
                      <td className="customerPaymentInsideTd">{driver?.value || ''}</td>
                      <td className="customerPaymentInsideTd">{nameOfCustomer}</td>
                      <td className="customerPaymentInsideTd">{loadingPoints}</td>
                      <td className="customerPaymentInsideTd">{unloadingPoints}</td>
                      <td className="customerPaymentInsideTd">{item.customerPrice || ''}</td>
                      <td className="customerPaymentInsideTd">{oder.customerPrice || ''}</td>
                      <td className="customerPaymentInsideTd">{oder.accountNumber || ''}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  );
});
