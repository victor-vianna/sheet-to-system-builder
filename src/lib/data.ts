import { Transaction } from './types';

const STORAGE_KEY = 'finance-transactions';

export const defaultTransactions: Transaction[] = [
  { id: '1', date: '2026-04-01', type: 'Receita', category: 'Salário', description: 'Salário mensal', value: 5000, paymentMethod: 'Transferência', installment: '-', status: 'Recebido' },
  { id: '2', date: '2026-04-05', type: 'Despesa', category: 'Moradia', description: 'Aluguel', value: 1200, paymentMethod: 'Débito', installment: '-', status: 'Pago' },
  { id: '3', date: '2026-04-05', type: 'Despesa', category: 'Contas', description: 'Conta de luz', value: 180, paymentMethod: 'Débito', installment: '-', status: 'Pago' },
  { id: '4', date: '2026-04-06', type: 'Despesa', category: 'Contas', description: 'Internet', value: 99, paymentMethod: 'Débito', installment: '-', status: 'Pago' },
  { id: '5', date: '2026-04-07', type: 'Despesa', category: 'Alimentação', description: 'Supermercado', value: 450, paymentMethod: 'Crédito', installment: '1/1', status: 'Pago' },
  { id: '6', date: '2026-04-08', type: 'Despesa', category: 'Transporte', description: 'Combustível', value: 200, paymentMethod: 'Débito', installment: '-', status: 'Pago' },
  { id: '7', date: '2026-04-10', type: 'Despesa', category: 'Assinaturas', description: 'Netflix', value: 45, paymentMethod: 'Crédito', installment: '1/1', status: 'Pago' },
  { id: '8', date: '2026-04-10', type: 'Despesa', category: 'Assinaturas', description: 'Spotify', value: 22, paymentMethod: 'Crédito', installment: '1/1', status: 'Pago' },
  { id: '9', date: '2026-04-12', type: 'Despesa', category: 'Lazer', description: 'Cinema', value: 60, paymentMethod: 'Crédito', installment: '1/1', status: 'Pago' },
  { id: '10', date: '2026-04-15', type: 'Receita', category: 'Extra', description: 'Freelance', value: 800, paymentMethod: 'Transferência', installment: '-', status: 'Recebido' },
  { id: '11', date: '2026-04-15', type: 'Despesa', category: 'Dívidas', description: 'Parcela empréstimo', value: 350, paymentMethod: 'Débito', installment: '5/24', status: 'Pago' },
  { id: '12', date: '2026-04-18', type: 'Despesa', category: 'Alimentação', description: 'Restaurante', value: 120, paymentMethod: 'Crédito', installment: '1/1', status: 'Pago' },
  { id: '13', date: '2026-04-20', type: 'Despesa', category: 'Saúde', description: 'Plano de saúde', value: 250, paymentMethod: 'Débito', installment: '-', status: 'Pago' },
  { id: '14', date: '2026-04-22', type: 'Despesa', category: 'Investimentos', description: 'Aporte CDB', value: 300, paymentMethod: 'Transferência', installment: '-', status: 'Realizado' },
  { id: '15', date: '2026-04-25', type: 'Despesa', category: 'Transporte', description: 'Uber', value: 45, paymentMethod: 'Crédito', installment: '1/1', status: 'Pendente' },
  { id: '16', date: '2026-04-28', type: 'Despesa', category: 'Lazer', description: 'Academia', value: 80, paymentMethod: 'Débito', installment: '-', status: 'Pendente' },
  { id: '17', date: '2026-04-28', type: 'Despesa', category: 'Contas', description: 'Água/Esgoto', value: 75, paymentMethod: 'Débito', installment: '-', status: 'Pendente' },
  { id: '18', date: '2026-04-30', type: 'Despesa', category: 'Alimentação', description: 'iFood', value: 85, paymentMethod: 'Crédito', installment: '1/1', status: 'Pendente' },
  { id: '19', date: '2026-04-30', type: 'Despesa', category: 'Moradia', description: 'Condomínio', value: 300, paymentMethod: 'Débito', installment: '-', status: 'Pendente' },
  { id: '20', date: '2026-04-30', type: 'Receita', category: 'Investimentos', description: 'Rendimento CDB', value: 42, paymentMethod: 'Transferência', installment: '-', status: 'Recebido' },
];

export function loadTransactions(): Transaction[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultTransactions;
}

export function saveTransactions(transactions: Transaction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}
