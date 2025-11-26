export type documentStatus = "Ок" | "Нет" | "Факс" | "Сдал";

export type customerPaymentStatus =
  | "Ок"
  | "Нет"
  | "Мыло"
  | "Печать"
  | "Почта"
  | "Обещал оплату"
  | "Отдал клиенту"
  | "Частично оплачен";

export type driverPaymentStatus = "Ок" | "Нет";

export interface CustomerShort {
  _id: number;
  value: string;
}

export interface OrderType {
  _id: number;
  date: Date;
  idDriver: number;
  idCustomer: number;
  idLoadingPoint: number[];
  idUnloadingPoint: number[];
  customerPrice: number;
  driverPrice: number;
  proxy: boolean;
  completed: boolean;
  document: documentStatus;
  dateOfSubmission: Date;
  customerPayment: customerPaymentStatus;
  dateOfPromise: Date;
  driverPayment: driverPaymentStatus;
  dateOfPayment: Date;
  accountNumber: number;
  partialPaymentAmount: number;
  idTrackDriver: number;
  idTrack: number;
  idManager: number;
  loadingInfo: string[];
  unloadingInfo: string[];
  applicationNumber: number;
  colorTR: string;
  wasItPrinted: boolean;
  postTracker: string;
}

export interface DriverPayment {
  id: number;
  date: Date;
  idDriver: number;
  sumOfPayment: number;
  listOfOders: number[];
  sumOfDebts: number;
  listOfDebts: DriverDebtInfo[];
}

export interface DriverDebtInfo {
  id: number;
  sum: number;
}

export interface DriverDebt {
  id: number;
  date: Date;
  idDriver: number;
  category: string;
  sumOfDebt: number;
  debtClosed: driverDebtStatus;
  addInfo: string;
  paidPartOfDebt: number;
  card: boolean;
}

export type driverDebtStatus = "Ок" | "частично" | "нет";

export interface TrackDriver {
  _id: number;
  name: string;
  shortName: string;
  passportNumber: string;
  department: string;
  dateOfIssue: string;
  driverLicense: string;
  phoneNumber: string;
  value: string;
  idOwner: number;
  idTrack: number;
  fired: boolean;
}

export interface Point {
  _id: number;
  value: string;
  region: string;
}

export interface ClientData {
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
  dateOfReg: string | null;
  shortFio: string | null;
  fullNameRP: string | null;
  login: string | null;
  password: string | null;
} 

export interface Driver {
  _id: number;
  value: string;
  phone: string;
  companyName: string;
  TIN: string;
  address: string;
  currentAccount: string;
  contract: string;
  active: boolean;
  addInfo: string;
  KPP: string;
  OGRN: string;
  Acc: string;
  CorAcc: string;
  RCBIC: string;
  bossName: string;
  bankName: string;
  bankAddress: string;
}

export interface Customer {
  id: number;
  value: string;
  extraPayments: number;
  companyName: string;
  TIN: string;
  address: string;
  email: string;
  phone: string;
  contract: string;
  active: boolean;
  postAddress: string;
  addInfo: string;
  KPP: string;
  OGRN: string;
  Acc: string;
  CorAcc: string;
  RCBIC: string;
  bossName: string;
  bankName: string;
  bankAddress: string;
}

export interface Contractor {
  _id: number;
  value: string;
  fullName: string;
  TIN: string;
}

export interface Coords {
  top: number;
  left: number;
}