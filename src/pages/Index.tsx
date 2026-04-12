import { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { SummaryCards } from '@/components/SummaryCards';
import { CategoryBreakdown } from '@/components/CategoryBreakdown';
import { TransactionList } from '@/components/TransactionList';
import { AddTransactionForm } from '@/components/AddTransactionForm';
import { CategoryManager } from '@/components/CategoryManager';
import { PurchasePlanning } from '@/components/PurchasePlanning';
import { CreditCardControl } from '@/components/CreditCardControl';
import { Plus, Wallet, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Index() {
  const { transactions, addTransaction, deleteTransaction, summary } = useTransactions();
  const { categories, addCategory, removeCategory } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container max-w-6xl mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary p-2 rounded-xl">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display">Controle Financeiro</h1>
              <p className="text-xs text-muted-foreground">Painel de controle pessoal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowCategories(true)}>
              <Settings className="h-4 w-4 mr-2" /> Categorias
            </Button>
            <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" /> Novo Lançamento
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto py-6 px-4 space-y-6">
        <SummaryCards {...summary} />
        <CategoryBreakdown categoryData={summary.categoryData} categories={categories} />
        <TransactionList transactions={transactions} onDelete={deleteTransaction} categories={categories} />
        <PurchasePlanning />
        <CreditCardControl />
      </main>

      {showForm && <AddTransactionForm onAdd={addTransaction} onClose={() => setShowForm(false)} categories={categories} />}
      {showCategories && <CategoryManager categories={categories} onAdd={addCategory} onRemove={removeCategory} onClose={() => setShowCategories(false)} />}
    </div>
  );
}