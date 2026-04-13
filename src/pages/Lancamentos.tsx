import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { TransactionList } from "@/components/TransactionList";
import { AddTransactionForm } from "@/components/AddTransactionForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";

export default function Lancamentos() {
  const { transactions, addTransaction, deleteTransaction, isLoading } = useTransactions();
  const { expense, income, isLoading: loadingCat } = useCategories();
  const [showForm, setShowForm] = useState(false);

  if (isLoading || loadingCat) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display">Lançamentos</h1>
        <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" /> Novo Lançamento
        </Button>
      </div>
      <TransactionList transactions={transactions} onDelete={deleteTransaction} />
      {showForm && (
        <AddTransactionForm
          onAdd={addTransaction}
          onClose={() => setShowForm(false)}
          expenseCategories={expense}
          incomeCategories={income}
        />
      )}
    </div>
  );
}
