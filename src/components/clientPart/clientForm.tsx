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
  //const clientData = useSelector((state: any) => state.ownerLogist.data) as ClientData;

  useEffect(() => {
    dispatch(getOwnerLogist());
  }, [dispatch]);

  return <div></div>;
};
