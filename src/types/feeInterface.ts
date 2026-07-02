export interface Payment {
  transaction_id: string;
  date: string;
  amount: number;
  paymentpurpose: string;
}

export interface FeeSummary {
  total_fees: number;
  admission_fees: number;
  paid_amount: number;
  pending_amount: number;
  last_paid_date: string;
  records: Payment[];
}