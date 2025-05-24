import React, { useEffect, useState } from 'react';
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

const ClientDetails = ({ client, onBack }: { client: ClientData; onBack: () => void }) => {
  return (
    <div className="clientDetailsContainer">
      <button className="backButton" onClick={onBack}>
        Назад к списку
      </button>
      <div className="clientDetailsTables">
        <table className="mainDataTable">
          <thead>
            <tr>
              <th className="detailHeader">Название</th>
              <th className="detailHeader">Полное название</th>
              <th className="detailHeader">ИНН</th>
              <th className="detailHeader">Адрес</th>
              <th className="detailHeader">Email</th>
              <th className="detailHeader">Телефон</th>
              <th className="detailHeader">Руководитель</th>
              <th className="detailHeader">Доп. информация</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="detailCell">{client.nameOwner}</td>
              <td className="detailCell">{client.fullNameOwner || '-'}</td>
              <td className="detailCell">{client.TIN || '-'}</td>
              <td className="detailCell">{client.address || '-'}</td>
              <td className="detailCell">{client.email || '-'}</td>
              <td className="detailCell">{client.phone || '-'}</td>
              <td className="detailCell">{client.bossName || '-'}</td>
              <td className="detailCell">{client.addInfo || '-'}</td>
            </tr>
          </tbody>
        </table>

        <table className="otherDataTable">
          <thead>
            <tr>
              <th className="detailHeader">КПП</th>
              <th className="detailHeader">ОГРН</th>
              <th className="detailHeader">Банк</th>
              <th className="detailHeader">Адрес банка</th>
              <th className="detailHeader">Расчетный счет</th>
              <th className="detailHeader">Корр. счет</th>
              <th className="detailHeader">БИК</th>
              <th className="detailHeader">Почтовый адрес</th>
              <th className="detailHeader">Доп. email</th>
              <th className="detailHeader">Доп. телефон</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="detailCell">{client.KPP || '-'}</td>
              <td className="detailCell">{client.OGRN || '-'}</td>
              <td className="detailCell">{client.bankName || '-'}</td>
              <td className="detailCell">{client.bankAddress || '-'}</td>
              <td className="detailCell">{client.Acc || '-'}</td>
              <td className="detailCell">{client.CorAcc || '-'}</td>
              <td className="detailCell">{client.RCBIC || '-'}</td>
              <td className="detailCell">{client.postAddress || '-'}</td>
              <td className="detailCell">{client.email_copy1 || '-'}</td>
              <td className="detailCell">{client.phone_copy1 || '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ClientForm = () => {
  const dispatch = useDispatch();
  const { ownerLogist, status } = useSelector((state: any) => state.clientReducer);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);

  useEffect(() => {
    dispatch(getOwnerLogist());
  }, [dispatch]);

  if (status === 'REQUEST') {
    return <div>Загрузка...</div>;
  }

  if (!ownerLogist || ownerLogist.length === 0) {
    return <div>Нет данных</div>;
  }

  if (selectedClient) {
    return <ClientDetails client={selectedClient} onBack={() => setSelectedClient(null)} />;
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
              onDoubleClick={() => setSelectedClient(client)}
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
