import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOwnerLogist } from '../../actions/ownerLogistAction';

interface ClientData {
  id: number;
  nameOwner: string;
  Acc: string | null;
  CorAcc: string | null;
  KPP: string | null;
  OGRN: string | null;
  RCBIC: string | null;
  TIN: string | null;
  addInfo: string | null;
  address: string | null;
  bankAddress: string | null;
  bankName: string | null;
  bossName: string | null;
  email: string | null;
  email_copy1: string | null;
  fullNameOwner: string | null;
  phone: string | null;
  phone_copy1: string | null;
  postAddress: string | null;
}

export const ClientForm = () => {
  const dispatch = useDispatch();
  const { ownerLogist, status } = useSelector((state: any) => state.clientReducer);

  useEffect(() => {
    dispatch(getOwnerLogist());
  }, [dispatch]);

  if (status === 'REQUEST') {
    return <div>Загрузка...</div>;
  }

  if (!ownerLogist || ownerLogist.length === 0) {
    return <div>Нет данных</div>;
  }

  return (
    <div className="client-table-container">
      <table className="client-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>ИНН</th>
            <th>КПП</th>
            <th>ОГРН</th>
            <th>Адрес</th>
            <th>Телефон</th>
            <th>Email</th>
            <th>Руководитель</th>
            <th>Банк</th>
            <th>Расчетный счет</th>
            <th>Корр. счет</th>
            <th>БИК</th>
          </tr>
        </thead>
        <tbody>
          {ownerLogist.map((client: ClientData) => (
            <tr key={client.id}>
              <td>{client.nameOwner}</td>
              <td>{client.TIN || '-'}</td>
              <td>{client.KPP || '-'}</td>
              <td>{client.OGRN || '-'}</td>
              <td>{client.address || '-'}</td>
              <td>{client.phone || '-'}</td>
              <td>{client.email || '-'}</td>
              <td>{client.bossName || '-'}</td>
              <td>{client.bankName || '-'}</td>
              <td>{client.Acc || '-'}</td>
              <td>{client.CorAcc || '-'}</td>
              <td>{client.RCBIC || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
