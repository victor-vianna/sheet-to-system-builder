import { useState, useCallback, useMemo } from 'react';
import { Transaction, Category } from '@/lib/types';
import { loadTransactions, saveTransactions } from '@/lib/data';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(loadTransactions);

  const update = useCallback((txs: Transaction[]) => {
    setTransactions(txs);
    saveTransactions(txs);
  }, []);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id'>) => {
    const newTx = { ...tx, id: crypto.randomUUID() };
    update([...transactions, newTx]);
  }, [transactions, update]);

  const deleteTransaction = useCallback((id: string) => {
    update(transactions.filter(t => t.id !== id));
  }, [transactions, update]);

  const updateTransaction = useCallback((id: string, data: Partial<Transaction>) => {
    update(transactions.map(t => t.id === id ? { ...t, ...data } : t));
  }, [transactions, update]);

  const summary = useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === 'Receita').reduce((s, t) => s + t.value, 0);
    const totalExpense = transactions.filter(t => t.type === 'Despesa').reduce((s, t) => s + t.value, 0);
    const totalPending = transactions.filter(t => t.status === 'Pendente').reduce((s, t) => s + t.value, 0);
    const balance = totalIncome - totalExpense;

    const byCategory = transactions
      .filter(t => t.type === 'Despesa')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.value;
        return acc;
      }, {} as Record<string, number>);

    const categoryData = Object.entries(byCategory)
      .map(([category, total]) => ({
        category: category as Category,
        total,
        percentage: totalExpense > 0 ? (total / totalExpense) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total);

    return { totalIncome, totalExpense, totalPending, balance, categoryData };
  }, [transactions]);

  return { transactions, addTransaction, deleteTransaction, updateTransaction, summary };
}
