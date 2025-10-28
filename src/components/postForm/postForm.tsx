import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChoiseList } from '../choiseList/choiseList.jsx';
import { TdDriver } from '../userTd/tdDriver.jsx';
import { TdLoadingPoint } from '../userTd/tdLoadingPoint.jsx';
import { TdUnoadingPoint } from '../userTd/tdUnloadingPoint.jsx';
import { addPostTrack } from '../../actions/postAction.js';
import { CustomerShort, OrderType, Customer } from '../tsTypes.ts';

import './postForm.sass';

export const PostForm = () => {
  const dispatch: any = useDispatch();

  let now: Date = new Date();
  let year: number = now.getFullYear();
  let dateString: string = `${year}-01-01`;
  const customerList: Customer[] = useSelector((state: any) => state.oderReducer.clientList);
  const orderList: OrderType[] = useSelector((state: any) => state.oderReducer.originOdersList);
  const status: any = useSelector((state: any) => state.oderReducer.request);

  const [showChoiseList, setShowChoiseList] = useState<boolean>(true);
  const [showChoiseDate, setShowChoiseDate] = useState<boolean>(true);
  const [showOrderList, setShowOrderList] = useState<boolean>(false);
  const [checkBoxNoPay, setCheckBoxNoPay] = useState<boolean>(true);
  const [checkBoxPost, setCheckBoxPost] = useState<boolean>(true);
  const [dateBegin, setDateBegin] = useState<string>(dateString);
  const [custometShort, setCustomerShort] = useState<CustomerShort | null>(null);
  const [postOrderList, setPostOrderList] = useState<OrderType[]>(orderList);
  const [choisenList, setChoisenList] = useState<number[]>([]);
  const [accountList, setAccountList] = useState<number[]>([]);
  const [postTrackNumber, setPostTrackNumber] = useState<string>('');
  const [showInputTrack, setShowInputTrack] = useState<boolean>(true);

  useEffect(() => {
    let date: Date = new Date(dateBegin);
    let arr: OrderType[] = orderList.filter(
      (order: OrderType) => order.customerPayment == 'Почта' && order.date >= date
    );
    setPostOrderList(arr);
  }, []);
  useEffect(() => {
    let date: Date = new Date(dateBegin);
    let arr: OrderType[] = orderList.filter((order: OrderType) => {
      if (custometShort) {
        if (custometShort._id == order.idCustomer) {
          if (new Date(order.date) >= date) {
            if (checkBoxPost) {
              if (order.customerPayment == 'Почта' && order.postTracker == null) return order;
            } else {
              if (checkBoxNoPay) {
                if (order.customerPayment != 'Ок') return order;
              } else {
                return order;
              }
            }
          }
        }
      }
    });
    setPostOrderList(arr);
    console.log(arr);
  }, [custometShort, checkBoxNoPay, checkBoxPost, dateBegin]);

  const setValue = (data: any) => {
    console.log(data);
    setShowChoiseList(false);
    setCustomerShort({ _id: data._id, value: data.value });
    setShowOrderList(true);
    setChoisenList([]);
    setAccountList([]);
  };
  const handleChoiseDblClick = e => {
    e.preventDefault();
    setShowChoiseList(true);
  };
  const handleClickChekBox = () => {
    setCheckBoxNoPay(!checkBoxNoPay);
    setShowOrderList(true);
  };
  const handleDateDblClick = e => {
    e.preventDefault();
    setShowChoiseDate(true);
  };
  const handleDateLostFocus = () => {
    setShowChoiseDate(false);
    setShowOrderList(true);
  };
  const handleChangeDate = (e: any) => {
    setDateBegin(e.target.value);
  };
  const handleClickChekBoxPost = () => {
    setCheckBoxPost(!checkBoxPost);
    setShowOrderList(true);
  };
  const handleClickOrder = (id, accountNumber) => {
    let arrId = [...choisenList];
    let arrAccount = [...accountList];
    if (!arrId.includes(id)) {
      arrId.push(id);
      arrAccount.push(accountNumber);
    } else {
      let index = arrId.findIndex(elem => elem == id);
      arrId.splice(index, 1);
      arrAccount.splice(index, 1);
    }
    setChoisenList(arrId);
    setAccountList(arrAccount);
  };
  const isChoisenStyle = (id): string => {
    if (choisenList.includes(id)) {
      return 'choisenTr';
    } else {
      return '';
    }
  };
  const makeStingFromList = (list: number[]) => {
    let text: string = '';
    list.forEach(elem => {
      text = `${text},  акт № ${elem}`;
    });
    return text.slice(1);
  };
  const handleGetPostTrack = e => {
    setPostTrackNumber(e.target.value);
  };
  const handleTrackInputBlur = () => {
    setShowInputTrack(false);
  };
  const handleDblClickTrackInput = e => {
    e.preventDefault();
    setShowInputTrack(true);
  };
  const handleClickBtnTrackNumber = () => {
    if (choisenList.length > 0 && postTrackNumber != '') {
      dispatch(
        addPostTrack({
          postTrackNumber: postTrackNumber,
          orderList: choisenList,
        })
      );
      setChoisenList([]);
      setAccountList([]);
    }
  };

  return (
    <div className="postFormWrapper">
      <header className="postFormHeader">
        <div className="customerChoiseWrapper">
          <span className="customerChoiseLabel">Заказчик</span>
          <div className="choiseListWrapper" onDoubleClick={handleChoiseDblClick}>
            {showChoiseList ? (
              <ChoiseList name="client" arrlist={customerList} setValue={setValue} />
            ) : (
              <span>{custometShort.value}</span>
            )}
          </div>
        </div>
        <div className="customerCheckWrapper">
          <span className="customerCheckLabel">без оплаты</span>
          <div className="inputCheckWrapper">
            <input type="checkbox" onChange={handleClickChekBox} checked={checkBoxNoPay} />
          </div>
        </div>
        <div className="customerDateWrapper">
          <span className="customerDateLebel">Дата с</span>
          <div className="choiseDateWrapper" onDoubleClick={handleDateDblClick}>
            {showChoiseDate ? (
              <input
                type="date"
                onChange={handleChangeDate}
                value={dateBegin}
                onBlur={handleDateLostFocus}
              />
            ) : (
              <span>{new Date(dateBegin).toLocaleDateString()}</span>
            )}
          </div>
        </div>
        <div className="postCheckWrapper">
          <span className="customerCheckLabel">без трека</span>
          <div className="inputCheckWrapper">
            <input type="checkbox" onChange={handleClickChekBoxPost} checked={checkBoxPost} />
          </div>
        </div>
      </header>
      <main className="postFormMain">
        <div className="postFormInputTrackWrapper">
          <div className="trackNumberWrapper" onDoubleClick={handleDblClickTrackInput}>
            <span className="trackNumberSpan">Номер трека</span>
            {showInputTrack ? (
              <input
                type="text"
                value={postTrackNumber}
                onChange={handleGetPostTrack}
                onBlur={handleTrackInputBlur}
              />
            ) : (
              <span>{postTrackNumber}</span>
            )}
          </div>
          <span className="spanAccountList">Список актов: {makeStingFromList(accountList)}</span>
          <div className="trackBtnWrapper">
            <button onClick={handleClickBtnTrackNumber}>Добавить трек к заказам</button>
          </div>
        </div>
        <div className="postFormTableWrapper">
          {showOrderList && (
            <table className="postFormTable">
              <thead className="postFormThead">
                <tr>
                  <td className="postFormTdHead">Дата</td>
                  <td className="postFormTdHead">Водитель</td>
                  <td className="postFormTdHead">Заказчик</td>
                  <td className="postFormTdHead">Загрузка</td>
                  <td className="postFormTdHead">Разгрузка</td>
                  <td className="postFormTdHead">Стоимость рейса</td>
                  <td className="postFormTdHead">Статус оплаты</td>
                  <td className="postFormTdHead">Номер акта</td>
                  <td className="postFormTdHead">Номер трека</td>
                </tr>
              </thead>
              <tbody className="postFormTbody">
                {postOrderList.map((order: OrderType) => {
                  let id: number = order._id;
                  return (
                    <tr
                      key={`order-${id}`}
                      className={isChoisenStyle(id)}
                      onClick={() => {
                        handleClickOrder(id, order.accountNumber);
                      }}
                    >
                      <td className="postFormTdBody">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <TdDriver idDriver={order.idDriver} idTrackDriver={order.idTrackDriver} />
                      <td className="postFormTdBody">{custometShort.value}</td>
                      <TdLoadingPoint
                        idLoadingPoint={order.idLoadingPoint}
                        loadingInfo={order.loadingInfo}
                      />
                      <TdUnoadingPoint
                        idUnloadingPoint={order.idUnloadingPoint}
                        unLoadingInfo={order.unloadingInfo}
                      />
                      <td className="postFormTdBody">{order.customerPrice}</td>
                      <td className="postFormTdBody">{order.customerPayment}</td>
                      <td className="postFormTdBody">{order.accountNumber}</td>
                      <td className="postFormTdBody">{order.postTracker}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
      {status.status == 'REQUEST' && <div className="requestStatus">REQUEST</div>}
    </div>
  );
};
