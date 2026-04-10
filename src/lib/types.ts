export type TransactionType = 'Receita' | 'Despesa';

export type Category =
  | 'Moradia' | 'Contas' | 'Alimentação' | 'Transporte'
  | 'Lazer' | 'Assinaturas' | 'Dívidas' | 'Investimentos'
  | 'Saúde' | 'Educação' | 'Salário' | 'Extra';

export type PaymentMethod = 'Débito' | 'Crédito' | 'Dinheiro' | 'Transferência' | 'Pix';

export type TransactionStatus = 'Pago' | 'Pendente' | 'Recebido' | 'Realizado' | 'Cancelado';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: Category;
  description: string;
  value: number;
  paymentMethod: PaymentMethod;
  installment: string;
  status: TransactionStatus;
}

export const EXPENSE_CATEGORIES: Category[] = [
  'Moradia', 'Contas', 'Alimentação', 'Transporte',
  'Lazer', 'Assinaturas', 'Dívidas', 'Investimentos',
  'Saúde', 'Educação',
];

export const INCOME_CATEGORIES: Category[] = ['Salário', 'Extra', 'Investimentos'];

export const ALL_CATEGORIES: Category[] = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES.filter(c => !EXPENSE_CATEGORIES.includes(c))];

export const PAYMENT_METHODS: PaymentMethod[] = ['Débito', 'Crédito', 'Dinheiro', 'Transferência', 'Pix'];

export const STATUSES: TransactionStatus[] = ['Pago', 'Pendente', 'Recebido', 'Realizado', 'Cancelado'];

export const CATEGORY_ICONS: Record<Category, string> = {
  Moradia: '🏠',
  Contas: '📄',
  Alimentação: '🍔',
  Transporte: '🚗',
  Lazer: '🎮',
  Assinaturas: '📺',
  Dívidas: '💳',
  Investimentos: '📈',
  Saúde: '🏥',
  Educação: '📚',
  Salário: '💰',
  Extra: '✨',
};
