import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOwnerLogist } from '../../actions/ownerLogistAction';
import './clientForm.sass';

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
    <div className="clientTableContainer">
      <table className="clientTable">
        <thead>
          <tr>
            <th className="clientTableHeader">Название</th>
            <th className="clientTableHeader">Полное название</th>
            <th className="clientTableHeader">ИНН</th>
            <th className="clientTableHeader">Адрес</th>
            <th className="clientTableHeader">Email</th>
            <th className="clientTableHeader">Телефон</th>
            <th className="clientTableHeader">Руководитель</th>
            <th className="clientTableHeader">Доп. информация</th>
          </tr>
        </thead>
        <tbody>
          {ownerLogist.map((client: ClientData, index: number) => (
            <tr
              key={client.id}
              className={`${index % 2 === 1 ? 'clientTableRowEven' : ''} clientTableRowHover`}
            >
              <td className="clientTableDataCell">{client.nameOwner}</td>
              <td className="clientTableDataCell">{client.fullNameOwner || '-'}</td>
              <td className="clientTableDataCell">{client.TIN || '-'}</td>
              <td className="clientTableDataCell">{client.address || '-'}</td>
              <td className="clientTableDataCell">{client.email || '-'}</td>
              <td className="clientTableDataCell">{client.phone || '-'}</td>
              <td className="clientTableDataCell">{client.bossName || '-'}</td>
              <td className="clientTableDataCell">{client.addInfo || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
