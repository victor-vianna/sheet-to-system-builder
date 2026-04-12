import { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { SummaryCards } from '@/components/SummaryCards';
import { CategoryBreakdown } from '@/components/CategoryBreakdown';
import { TransactionList } from '@/components/TransactionList';
import { AddTransactionForm } from '@/components/AddTransactionForm';
import { HomeCardCustomizer, useHomeCards } from '@/components/HomeCardCustomizer';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Index() {
  const { transactions, addTransaction, deleteTransaction, summary } = useTransactions();
  const { categories } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const { cards, toggleCard, isVisible } = useHomeCards();

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
      {isVisible("categories") && <CategoryBreakdown categoryData={summary.categoryData} categories={categories} />}
      {isVisible("transactions") && (
        <TransactionList transactions={transactions.slice(0, 5)} onDelete={deleteTransaction} categories={categories} />
      )}

      {showForm && <AddTransactionForm onAdd={addTransaction} onClose={() => setShowForm(false)} categories={categories} />}
      <HomeCardCustomizer open={showCustomizer} onOpenChange={setShowCustomizer} cards={cards} onToggle={toggleCard} />
    </div>
  );
}
