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
}
