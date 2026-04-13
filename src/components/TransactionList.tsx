import { Lancamento } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/format';
import { Trash2 } from 'lucide-react';

interface TransactionListProps {
  transactions: Lancamento[];
  onDelete: (id: string) => void;
}

const statusStyles: Record<string, string> = {
  Pago: 'bg-income/15 text-income',
  Recebido: 'bg-income/15 text-income',
  Realizado: 'bg-primary/15 text-primary',
  Pendente: 'bg-pending/15 text-pending',
  Cancelado: 'bg-expense/15 text-expense',
};

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const sorted = [...transactions].sort((a, b) => b.data.localeCompare(a.data));

  if (sorted.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground animate-fade-in">
        Nenhum lançamento encontrado.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card animate-fade-in" style={{ animationDelay: '400ms' }}>
      <div className="p-5 border-b border-border">
        <h3 className="text-lg font-semibold font-display">📒 Lançamentos</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left p-3 font-medium">Data</th>
              <th className="text-left p-3 font-medium">Descrição</th>
              <th className="text-left p-3 font-medium">Categoria</th>
              <th className="text-left p-3 font-medium">Pagamento</th>
              <th className="text-right p-3 font-medium">Valor</th>
              <th className="text-center p-3 font-medium">Status</th>
              <th className="text-center p-3 font-medium w-12"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((tx) => {
              const cat = tx.categorias;
              const icon = cat?.icone || '📁';
              const catName = cat?.nome || 'Sem categoria';

              return (
                <tr key={tx.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="p-3 text-muted-foreground">{formatDate(tx.data)}</td>
                  <td className="p-3 font-medium">{tx.descricao}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <span>{icon}</span>
                      <span className="text-xs">{catName}</span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{tx.forma_pagamento || '—'}</td>
                  <td className={`p-3 text-right font-semibold ${tx.tipo === 'Receita' ? 'text-income' : 'text-expense'}`}>
                    {tx.tipo === 'Receita' ? '+' : '-'} {formatCurrency(tx.valor)}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[tx.status] || ''}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onDelete(tx.id)}
                      className="text-muted-foreground hover:text-expense transition-colors p-1 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
