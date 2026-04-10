import { formatCurrency } from '@/lib/format';
import { TrendingUp, TrendingDown, Clock, Wallet } from 'lucide-react';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
  totalPending: number;
  balance: number;
}

const cards = [
  { key: 'income', label: 'Total Receitas', icon: TrendingUp, color: 'text-income', bg: 'bg-income/10' },
  { key: 'expense', label: 'Total Despesas', icon: TrendingDown, color: 'text-expense', bg: 'bg-expense/10' },
  { key: 'pending', label: 'Pendente a Pagar', icon: Clock, color: 'text-pending', bg: 'bg-pending/10' },
  { key: 'balance', label: 'Saldo Líquido', icon: Wallet, color: 'text-primary', bg: 'bg-primary/10' },
] as const;

export function SummaryCards({ totalIncome, totalExpense, totalPending, balance }: SummaryCardsProps) {
  const values = { income: totalIncome, expense: totalExpense, pending: totalPending, balance };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="rounded-xl border border-border bg-card p-5 animate-fade-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
              <div className={`${card.bg} ${card.color} p-2 rounded-lg`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className={`text-2xl font-bold font-display ${card.color}`}>
              {formatCurrency(values[card.key])}
            </p>
          </div>
        );
      })}
    </div>
  );
}
