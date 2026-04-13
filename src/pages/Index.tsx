import { useState } from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { SummaryCards } from '@/components/SummaryCards';
import { CategoryBreakdown } from '@/components/CategoryBreakdown';
import { TransactionList } from '@/components/TransactionList';
import { AddTransactionForm } from '@/components/AddTransactionForm';
import { HomeCardCustomizer, useHomeCards } from '@/components/HomeCardCustomizer';
import { Plus, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Index() {
  const { summary, categoryData, isLoading: loadingDash } = useDashboard();
  const { transactions, isLoading: loadingTx, addTransaction, deleteTransaction } = useTransactions();
  const { expense, income, isLoading: loadingCat } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const { cards, toggleCard, isVisible } = useHomeCards();

  const isLoading = loadingDash || loadingTx || loadingCat;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Início</h1>
          <p className="text-sm text-muted-foreground">Visão geral das suas finanças</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setShowCustomizer(true)}>
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" /> Novo Lançamento
          </Button>
        </div>
      </div>

      {isVisible("summary") && <SummaryCards {...summary} />}
      {isVisible("categories") && <CategoryBreakdown categoryData={categoryData} />}
      {isVisible("transactions") && (
        <TransactionList transactions={transactions.slice(0, 5)} onDelete={deleteTransaction} />
      )}

      {showForm && (
        <AddTransactionForm
          onAdd={addTransaction}
          onClose={() => setShowForm(false)}
          expenseCategories={expense}
          incomeCategories={income}
        />
      )}
      <HomeCardCustomizer open={showCustomizer} onOpenChange={setShowCustomizer} cards={cards} onToggle={toggleCard} />
    </div>
  );
}
