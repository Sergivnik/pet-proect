import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { ClientData } from '../tsTypes.js';
import { editData } from '../../actions/editDataAction.js';
import { formatDateToRu, toInputDateValue } from '../myLib/myLib.js';
import { URL } from '../../middlewares/initialState';
import './clientForm.sass';

export const ClientDetails = ({ client, onBack }: { client: ClientData; onBack: () => void }) => {
  const dispatch = useDispatch();
  const [editedClient, setEditedClient] = useState<ClientData>(client);
  const [editingField, setEditingField] = useState<keyof ClientData | null>(null);
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(true);
  const [requestTIN, setRequestTIN] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [prevTIN, setPrevTIN] = useState<string | undefined>(client.TIN);

  useEffect(() => {
    const data = {
      query: editedClient.TIN,
    };
    if (editedClient.TIN && (editedClient.TIN.length === 10 || editedClient.TIN.length === 12)) {
      // Проверяем, есть ли пустые поля для заполнения
      const hasEmptyFields =
        !editedClient.KPP ||
        !editedClient.fullNameOwner ||
        !editedClient.OGRN ||
        !editedClient.bossName ||
        !editedClient.address;

      if (hasEmptyFields) {
        axios
          .post(URL + '/dadataTIN', data)
          .then(response => {
            console.log(response.data.suggestions);
            setRequestTIN(response.data.suggestions);
            setShowSuggestions(true);
          })
          .catch(error => {
            console.log('error', error);
          });
      } else {
        setShowSuggestions(false);
      }
    }
  }, [editedClient.TIN]);

  useEffect(() => {
    const data = {
      query: editedClient.RCBIC,
    };
    if (
      editedClient.RCBIC &&
      editedClient.RCBIC.length === 9 &&
      (editedClient.CorAcc == null ||
        editedClient.bankName == null ||
        editedClient.bankAddress == null ||
        editedClient.CorAcc === '' ||
        editedClient.bankName === '' ||
        editedClient.bankAddress === '')
    ) {
      axios
        .post(URL + '/dadataBank', data)
        .then(response => {
          if (response.data.suggestions && response.data.suggestions.length > 0) {
            const bankData = response.data.suggestions[0];
            setEditedClient(prev => ({
              ...prev,
              CorAcc: bankData.data.correspondent_account || 'нет данных',
              bankName: bankData.value || 'нет данных',
              bankAddress: bankData.data.address.value || 'нет данных',
            }));
            setIsSaved(false);
          }
        })
        .catch(error => {
          console.log('error', error);
        });
    }
  }, [editedClient.RCBIC]);

  const clearFieldsOnTIN = (value: string) => {
    if (value && value !== prevTIN && (/^\d{10}$/.test(value) || /^\d{12}$/.test(value))) {
      setEditedClient(prev => ({
        ...prev,
        KPP: '',
        fullNameOwner: '',
        OGRN: '',
        bossName: '',
        address: '',
      }));
      setPrevTIN(value);
    }
  };

  const handleBlur = (field?: keyof ClientData) => {
    if (field === 'TIN') {
      clearFieldsOnTIN(editedClient.TIN || '');
    }
    setEditingField(null);
    setPreviousValue(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field?: keyof ClientData) => {
    if (e.key === 'Enter') {
      if (field === 'TIN') {
        clearFieldsOnTIN(editedClient.TIN || '');
      }
      setEditingField(null);
      setPreviousValue(null);
    } else if (e.key === 'Escape' && editingField) {
      setEditedClient(prev => ({
        ...prev,
        [editingField]: previousValue,
      }));
      setEditingField(null);
      setPreviousValue(null);
    }
  };

  const handleClickSuggestion = (index: number) => {
    const suggestion = requestTIN[index];
    setEditedClient(prev => ({
      ...prev,
      KPP:
        prev.KPP === '' || prev.KPP === null || prev.KPP === undefined || prev.KPP === 'нет данных'
          ? suggestion.data.kpp || 'нет данных'
          : prev.KPP,
      fullNameOwner:
        prev.fullNameOwner === '' ||
        prev.fullNameOwner === null ||
        prev.fullNameOwner === undefined ||
        prev.fullNameOwner === 'нет данных'
          ? suggestion.data.name.short_with_opf || 'нет данных'
          : prev.fullNameOwner,
      OGRN:
        prev.OGRN === '' ||
        prev.OGRN === null ||
        prev.OGRN === undefined ||
        prev.OGRN === 'нет данных'
          ? suggestion.data.ogrn || 'нет данных'
          : prev.OGRN,
      bossName:
        prev.bossName === '' ||
        prev.bossName === null ||
        prev.bossName === undefined ||
        prev.bossName === 'нет данных'
          ? suggestion.data.management?.name || 'нет данных'
          : prev.bossName,
      address:
        prev.address === '' ||
        prev.address === null ||
        prev.address === undefined ||
        prev.address === 'нет данных'
          ? suggestion.data.address.unrestricted_value || 'нет данных'
          : prev.address,
    }));
    setShowSuggestions(false);
    setIsSaved(false);
  };

  const handleInputChange = (field: keyof ClientData, value: string) => {
    setEditedClient(prev => ({
      ...prev,
      [field]: value,
    }));
    setIsSaved(false);
  };

  const handleDoubleClick = (field: keyof ClientData) => {
    setEditingField(field);
    setPreviousValue(editedClient[field]?.toString() || null);
  };

  const handleSave = () => {
    if (!isSaved) {
      dispatch(editData(editedClient, 'ownerlogist'));
      setIsSaved(true);
    }
  };

  const handleBack = () => {
    if (!isSaved) {
      const confirm = window.confirm(
        'Есть несохраненные изменения. Вы уверены, что хотите выйти без сохранения?'
      );
      if (confirm) {
        onBack();
      }
    } else {
      onBack();
    }
  };

  const renderCell = (field: keyof ClientData, value: string | null) => {
    if (editingField === field) {
      return (
        <>
          <input
            type={
              field.includes('email')
                ? 'email'
                : field.includes('phone')
                  ? 'tel'
                  : field.includes('dateOfReg')
                    ? 'date'
                    : 'text'
            }
            value={field === 'dateOfReg' ? toInputDateValue(value) : value || ''}
            onChange={e => handleInputChange(field, e.target.value)}
            onBlur={() => handleBlur(field)}
            onKeyDown={e => handleKeyDown(e, field)}
            className="detailInput"
            autoFocus
          />
        </>
      );
    }
    if (field === 'dateOfReg') {
      return <div onDoubleClick={() => handleDoubleClick(field)}>{formatDateToRu(value)}</div>;
    }
    return <div onDoubleClick={() => handleDoubleClick(field)}>{value || '-'}</div>;
  };

  return (
    <div className="clientDetailsContainer">
      <div className="clientDetailsHeader">
        <button className="backButton" onClick={handleBack}>
          Назад к списку
        </button>
        <button className="saveButton" onClick={handleSave}>
          Сохранить
        </button>
      </div>
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
              <td className="detailCell">{renderCell('nameOwner', editedClient.nameOwner)}</td>
              <td className="detailCell">
                {renderCell('fullNameOwner', editedClient.fullNameOwner)}
              </td>
              <td className="detailCell">{renderCell('TIN', editedClient.TIN)}</td>
              <td className="detailCell">{renderCell('address', editedClient.address)}</td>
              <td className="detailCell">{renderCell('email', editedClient.email)}</td>
              <td className="detailCell">{renderCell('phone', editedClient.phone)}</td>
              <td className="detailCell">{renderCell('bossName', editedClient.bossName)}</td>
              <td className="detailCell">{renderCell('addInfo', editedClient.addInfo)}</td>
            </tr>
          </tbody>
        </table>
        <div className="suggestionsDivContainer">
          {showSuggestions && (
            <div className="suggestionsOwner">
              {requestTIN.map((elem, index) => (
                <p
                  key={`suggestion${index}`}
                  className="suggestionsDivP"
                  onClick={() => handleClickSuggestion(index)}
                >
                  {elem.value + ' КПП ' + elem.data.kpp + ' ' + elem.data.address.value}
                </p>
              ))}
            </div>
          )}
        </div>
        <table className="otherDataTable">
          <thead>
            <tr>
              <th className="detailHeader">КПП</th>
              <th className="detailHeader">ОГРН</th>
              <th className="detailHeader">Дата регистрации</th>
              <th className="detailHeader">Краткое ФИО</th>
              <th className="detailHeader">ФИО в РП</th>
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
              <td className="detailCell">{renderCell('KPP', editedClient.KPP)}</td>
              <td className="detailCell">{renderCell('OGRN', editedClient.OGRN)}</td>
              <td className="detailCell">{renderCell('dateOfReg', editedClient.dateOfReg)}</td>
              <td className="detailCell">{renderCell('shortFio', editedClient.shortFio)}</td>
              <td className="detailCell">{renderCell('fullNameRP', editedClient.fullNameRP)}</td>
              <td className="detailCell">{renderCell('bankName', editedClient.bankName)}</td>
              <td className="detailCell">{renderCell('bankAddress', editedClient.bankAddress)}</td>
              <td className="detailCell">{renderCell('Acc', editedClient.Acc)}</td>
              <td className="detailCell">{renderCell('CorAcc', editedClient.CorAcc)}</td>
              <td className="detailCell">{renderCell('RCBIC', editedClient.RCBIC)}</td>
              <td className="detailCell">{renderCell('postAddress', editedClient.postAddress)}</td>
              <td className="detailCell">{renderCell('email_copy1', editedClient.email_copy1)}</td>
              <td className="detailCell">{renderCell('phone_copy1', editedClient.phone_copy1)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
