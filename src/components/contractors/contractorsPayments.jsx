import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ContractorPaymentTr } from './contractorPaymentTr.jsx';
import { ContractorAddForm } from './contractorPaymentAddForm.jsx';
import { FormAddDoc } from '../userTrNew/formAddDoc.jsx';
import { ContractorPaymentsThead } from './contractorPaymentsThead.tsx';
import { getDataContractors, addDataContractorPayment } from '../../actions/contractorActions.js';
import './contractorForm.sass';

export const ContractorsPayments = () => {
  const dispatch = useDispatch();
  const contractorsList = useSelector(state => state.oderReducer.contractorsList);
  const contractorsPaymentsFull = useSelector(state => state.oderReducer.contractorsPayments);
  const [contractorsPayments, setContractorsPayments] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [currentTD, setCurrentTD] = useState(null);
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [selectedSum, setSelectedSum] = useState(0);

  useEffect(() => {
    dispatch(getDataContractors());
  }, [dispatch]);
  useEffect(() => {
    console.log(contractorsPaymentsFull);
    let length = contractorsPaymentsFull.length;
    if (length > 500) {
      setContractorsPayments(contractorsPaymentsFull.slice(length - 500, length));
    } else {
      setContractorsPayments(contractorsPaymentsFull);
    }
  }, [contractorsPaymentsFull]);
  useEffect(() => {
    let div = document.getElementsByClassName('contrPayTableDiv')[0];
    div.scrollTop = div.scrollHeight;
  }, [contractorsPayments]);

  const handleClickFilter = () => {};

  const handleClickAdd = () => {
    setShowAddForm(true);
    // Сбрасываем выбор при добавлении новой записи
    setSelectedCells(new Set());
    setSelectedSum(0);
  };
  const handleClickCross = () => {
    setShowAddForm(false);
  };
  const handleClickAddPayment = paymentsData => {
    setShowAddForm(false);
    dispatch(addDataContractorPayment(paymentsData));
  };
  const handleAddDoc = () => {
    let currentElement = document.querySelector('.contrPayMainDiv');
    setCurrentTD(currentElement);
    setShowAddDoc(true);
  };
  const handleClickClose = () => {
    setShowAddDoc(false);
  };
  const getFiltredList = list => {
    setContractorsPayments(list);
  };

  const calculateSelectedSum = selectedCellsSet => {
    const selectedPayments = contractorsPayments.filter(payment =>
      selectedCellsSet.has(payment.id)
    );
    const totalSum = selectedPayments.reduce((sum, payment) => {
      const paymentSum = parseFloat(payment.sum) || 0;
      return sum + paymentSum;
    }, 0);
    return totalSum;
  };

  const formatNumber = number => {
    return number.toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleCellClick = (paymentId, event) => {
    if (paymentId === null) {
      // Сброс выбора
      setSelectedCells(new Set());
      setSelectedSum(0);
      return;
    }

    event.stopPropagation(); // Предотвращаем всплытие события

    if (event.ctrlKey) {
      // Если нажат CTRL, добавляем/убираем ячейку из выбранных
      const newSelectedCells = new Set(selectedCells);
      if (newSelectedCells.has(paymentId)) {
        newSelectedCells.delete(paymentId);
      } else {
        newSelectedCells.add(paymentId);
      }
      setSelectedCells(newSelectedCells);

      // Вычисляем и обновляем сумму выбранных ячеек
      const totalSum = calculateSelectedSum(newSelectedCells);
      setSelectedSum(totalSum);
      console.log('Сумма выбранных ячеек:', totalSum);
    } else {
      // Если CTRL не нажат, сбрасываем выбор
      setSelectedCells(new Set());
      setSelectedSum(0);
    }
  };

  const handleTableClick = e => {
    // Сбрасываем выбор при клике на таблицу (но не на ячейки)
    if (e.target === e.currentTarget) {
      setSelectedCells(new Set());
      setSelectedSum(0);
    }
  };

  return (
    <div className="contrPayMainDiv">
      <div className="contrPayTableDiv" onClick={handleTableClick}>
        <table className="contrPayMainTable">
          <ContractorPaymentsThead getFiltredList={getFiltredList} />
          <tbody>
            {contractorsPayments.map(elem => {
              return (
                <ContractorPaymentTr
                  key={elem.id}
                  paymentData={elem}
                  currentId={currentId}
                  getCurrentId={id => {
                    setCurrentId(id);
                  }}
                  handleAddDoc={handleAddDoc}
                  onCellClick={handleCellClick}
                  isSelected={selectedCells.has(elem.id)}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      {selectedCells.size > 0 && (
        <div className="selected-sum-display">
          <div className="selected-sum-info">
            <span>Выбрано ячеек: {selectedCells.size}</span>
            <span>Сумма: {formatNumber(selectedSum)} ₽</span>
          </div>
        </div>
      )}
      <button onClick={handleClickAdd}>Добавить</button>
      {showAddForm && (
        <ContractorAddForm
          clickCross={handleClickCross}
          contractorsList={contractorsList}
          handleClickAdd={handleClickAddPayment}
        />
      )}
      {showAddDoc && (
        <FormAddDoc
          TD={currentTD}
          currentId={currentId}
          typeDoc="contractor"
          handleClickClose={handleClickClose}
        />
      )}
    </div>
  );
};
