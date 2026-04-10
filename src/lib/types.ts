export type TransactionType = 'Receita' | 'Despesa';

export type PaymentMethod = 'Débito' | 'Crédito' | 'Dinheiro' | 'Transferência' | 'Pix';

export type TransactionStatus = 'Pago' | 'Pendente' | 'Recebido' | 'Realizado' | 'Cancelado';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: string;
  subcategory?: string;
  detail?: string;
  description: string;
  value: number;
  paymentMethod: PaymentMethod;
  installment: string;
  status: TransactionStatus;
}

export const PAYMENT_METHODS: PaymentMethod[] = ['Débito', 'Crédito', 'Dinheiro', 'Transferência', 'Pix'];

export const STATUSES: TransactionStatus[] = ['Pago', 'Pendente', 'Recebido', 'Realizado', 'Cancelado'];
