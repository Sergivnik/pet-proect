import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { ClientData } from './types';
import { addNewOwnerLogist } from '../../actions/ownerLogistAction';
import { formatDateToRu, toInputDateValue } from '../myLib/myLib.js';
import { URL } from '../../middlewares/initialState';
import './clientForm.sass';

interface AddClientFormProps {
  onBack: () => void;
}

export const AddClientForm: React.FC<AddClientFormProps> = ({ onBack }) => {
  const dispatch = useDispatch();
  const [newClient, setNewClient] = useState<Partial<ClientData>>({
    nameOwner: '',
    fullNameOwner: '',
    TIN: '',
    address: '',
    email: '',
    phone: '',
    login: '',
    password: '',
    bossName: '',
    addInfo: '',
    KPP: '',
    OGRN: '',
    bankName: '',
    bankAddress: '',
    Acc: '',
    CorAcc: '',
    RCBIC: '',
    postAddress: '',
    email_copy1: '',
    phone_copy1: '',
  });
  const [editingField, setEditingField] = useState<keyof ClientData | null>(null);
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [filledFields, setFilledFields] = useState<Array<keyof ClientData>>([]);
  const [requestTIN, setRequestTIN] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [prevTIN, setPrevTIN] = useState<string | undefined>(undefined);

  useEffect(() => {
    const data = {
      query: newClient.TIN,
    };
    if (newClient.TIN && (newClient.TIN.length === 10 || newClient.TIN.length === 12)) {
      const hasEmptyFields =
        !newClient.KPP ||
        !newClient.fullNameOwner ||
        !newClient.OGRN ||
        !newClient.bossName ||
        !newClient.address;

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
  }, [newClient.TIN]);

  useEffect(() => {
    if (
      newClient.TIN &&
      newClient.TIN !== prevTIN &&
      (/^\d{10}$/.test(newClient.TIN) || /^\d{12}$/.test(newClient.TIN))
    ) {
      setNewClient(prev => ({
        ...prev,
        KPP: '',
        fullNameOwner: '',
        OGRN: '',
        bossName: '',
        address: '',
      }));
      setPrevTIN(newClient.TIN);
    }
  }, [newClient.TIN]);

  useEffect(() => {
    const data = {
      query: newClient.RCBIC,
    };
    if (
      newClient.RCBIC &&
      newClient.RCBIC.length === 9 &&
      (newClient.CorAcc == null ||
        newClient.bankName == null ||
        newClient.bankAddress == null ||
        newClient.CorAcc === '' ||
        newClient.bankName === '' ||
        newClient.bankAddress === '')
    ) {
      axios
        .post(URL + '/dadataBank', data)
        .then(response => {
          if (response.data.suggestions && response.data.suggestions.length > 0) {
            const bankData = response.data.suggestions[0];
            setNewClient(prev => ({
              ...prev,
              CorAcc: bankData.data.correspondent_account || 'нет данных',
              bankName: bankData.value || 'нет данных',
              bankAddress: bankData.data.address.value || 'нет данных',
            }));
          }
        })
        .catch(error => {
          console.log('error', error);
        });
    }
  }, [newClient.RCBIC]);

  const handleClickSuggestion = (index: number) => {
    const suggestion = requestTIN[index];
    setNewClient(prev => ({
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
  };

  const handleInputChange = (field: keyof ClientData, value: string) => {
    setNewClient(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDoubleClick = (field: keyof ClientData) => {
    setEditingField(field);
    setPreviousValue(newClient[field]?.toString() || null);
  };

  const clearFieldsOnTIN = (value: string) => {
    if (value && value !== prevTIN && (/^\d{10}$/.test(value) || /^\d{12}$/.test(value))) {
      setNewClient(prev => ({
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

  const handleBlur = (field: keyof ClientData) => {
    if (field === 'TIN') {
      clearFieldsOnTIN(newClient.TIN || '');
    }
    if (newClient[field] && !filledFields.includes(field)) {
      setFilledFields(prev => [...prev, field]);
    }
    setEditingField(null);
    setPreviousValue(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: keyof ClientData) => {
    if (e.key === 'Enter') {
      if (field === 'TIN') {
        clearFieldsOnTIN(newClient.TIN || '');
      }
      if (newClient[field] && !filledFields.includes(field)) {
        setFilledFields(prev => [...prev, field]);
      }
      setEditingField(null);
      setPreviousValue(null);
    } else if (e.key === 'Escape' && editingField) {
      setNewClient(prev => ({
        ...prev,
        [editingField]: previousValue,
      }));
      setEditingField(null);
      setPreviousValue(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClient.login && newClient.password && newClient.bossName) {
      dispatch(addNewOwnerLogist(newClient));
      onBack();
    } else {
      alert('Логин, пароль и руководитель обязательны для заполнения');
    }
  };

  const renderInput = (field: keyof ClientData, value: string | null) => {
    if (editingField === field || !filledFields.includes(field)) {
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
            autoFocus={editingField === field}
            placeholder="Введите значение"
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
        <button className="backButton" onClick={onBack}>
          Назад к списку
        </button>
        <button className="saveButton" onClick={handleSubmit}>
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
              <td className="detailCell">{renderInput('nameOwner', newClient.nameOwner)}</td>
              <td className="detailCell">
                {renderInput('fullNameOwner', newClient.fullNameOwner)}
              </td>
              <td className="detailCell">{renderInput('TIN', newClient.TIN)}</td>
              <td className="detailCell">{renderInput('address', newClient.address)}</td>
              <td className="detailCell">{renderInput('email', newClient.email)}</td>
              <td className="detailCell">{renderInput('phone', newClient.phone)}</td>
              <td className="detailCell">{renderInput('bossName', newClient.bossName)}</td>
              <td className="detailCell">{renderInput('addInfo', newClient.addInfo)}</td>
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
              <td className="detailCell">{renderInput('KPP', newClient.KPP)}</td>
              <td className="detailCell">{renderInput('OGRN', newClient.OGRN)}</td>
              <td className="detailCell">{renderInput('dateOfReg', newClient.dateOfReg)}</td>
              <td className="detailCell">{renderInput('shortFio', newClient.shortFio)}</td>
              <td className="detailCell">{renderInput('fullNameRP', newClient.fullNameRP)}</td>
              <td className="detailCell">{renderInput('bankName', newClient.bankName)}</td>
              <td className="detailCell">{renderInput('bankAddress', newClient.bankAddress)}</td>
              <td className="detailCell">{renderInput('Acc', newClient.Acc)}</td>
              <td className="detailCell">{renderInput('CorAcc', newClient.CorAcc)}</td>
              <td className="detailCell">{renderInput('RCBIC', newClient.RCBIC)}</td>
              <td className="detailCell">{renderInput('postAddress', newClient.postAddress)}</td>
              <td className="detailCell">{renderInput('email_copy1', newClient.email_copy1)}</td>
              <td className="detailCell">{renderInput('phone_copy1', newClient.phone_copy1)}</td>
            </tr>
          </tbody>
        </table>
        {/* Блок для логина и пароля */}
        <div style={{ display: 'flex', gap: '20px', margin: '16px 0' }}>
          <div>
            <label className="detailLabel">Логин</label>
            {renderInput('login', newClient.login)}
          </div>
          <div>
            <label className="detailLabel">Пароль</label>
            {renderInput('password', newClient.password)}
          </div>
        </div>
      </div>
    </div>
  );
};
