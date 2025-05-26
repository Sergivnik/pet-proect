import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOwnerLogist } from '../../actions/ownerLogistAction';
import { ClientDetails } from './clientDetails.tsx';
import { ClientData } from './types.ts';
import { AddClientForm } from './addClientForm.tsx';
import { delData } from '../../actions/editDataAction';
import './clientForm.sass';

export const ClientForm = () => {
  const dispatch = useDispatch();
  const { ownerLogist, status } = useSelector((state: any) => state.clientReducer);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(getOwnerLogist());
    console.log('ClientForm');
  }, [dispatch]);

  const handleDelete = () => {
    if (selectedClientId) {
      const confirm = window.confirm('Вы уверены, что хотите удалить этого клиента?');
      if (confirm) {
        dispatch(delData(selectedClientId, 'ownerlogist'));
        setSelectedClientId(null);
      }
    }
  };

  if (status === 'REQUEST') {
    return <div>Загрузка...</div>;
  }

  if (!ownerLogist || ownerLogist.length === 0) {
    return <div>Нет данных</div>;
  }

  if (selectedClient) {
    return <ClientDetails client={selectedClient} onBack={() => setSelectedClient(null)} />;
  }

  if (showAddForm) {
    return <AddClientForm onBack={() => setShowAddForm(false)} />;
  }

  return (
    <div className="clientTableContainer">
      <div className="clientTableHeader">
        <button className="addButton" onClick={() => setShowAddForm(true)}>
          Добавить клиента
        </button>
        <button
          className={`deleteButton ${!selectedClientId ? 'deleteButtonDisabled' : ''}`}
          onClick={handleDelete}
          disabled={!selectedClientId}
        >
          Удалить клиента
        </button>
      </div>
      <div className="clientTableWrapper">
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
                className={`${index % 2 === 1 ? 'clientTableRowEven' : ''} clientTableRowHover ${
                  selectedClientId === client.id ? 'clientTableRowSelected' : ''
                }`}
                onClick={() => setSelectedClientId(client.id)}
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
    </div>
  );
};
