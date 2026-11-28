export interface stock {
  id: number | null | undefined;
  ticker: string | null | undefined;
  fullNameStock: string | null | undefined;
}

export interface stockTransaction {
  id: number | null | undefined;
  stockId: number | null | undefined;
  action_type: 'BUY' | 'SELL' | null | undefined;
  quantity: number | null | undefined;
  price: number | string | null | undefined;
  commission: number | string | null | undefined;
  total_amount?: number | string | null;
  trade_date: string | null | undefined;
  created_at?: string | null;
  holderId: number | null | undefined;
}

export interface dividend {
  id: number | null | undefined;
  stockId: number | null | undefined;
  sumDividend: number | string | null | undefined;
  sumTax: number | string | null | undefined;
  dividendDate: string | null | undefined;
  holderId: number | null | undefined;
}

export type CurrencySymbol = '$' | '€' | '₽' | '₺';

export interface deposit {
  id: number | null | undefined;
  date: string | null | undefined;
  sumDeposit: number | string | null | undefined;
  sumInterest: number | string | null | undefined;
  currencySymbol: CurrencySymbol;
  txTypeId: number | null | undefined;
  holderId: number | null | undefined;
}

export interface holder {
  id: number | null | undefined;
  holderName: string | null | undefined;
}

export interface transactionType {
  id: number | null | undefined;
  txType: string | null | undefined;
}
