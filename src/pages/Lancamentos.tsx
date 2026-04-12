import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { TransactionList } from "@/components/TransactionList";
import { AddTransactionForm } from "@/components/AddTransactionForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Lancamentos() {
  const { transactions, addTransaction, deleteTransaction } = useTransactions();
  const { categories } = useCategories();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display">Lançamentos</h1>
        <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" /> Novo Lançamento
        </Button>
      </div>
      <TransactionList transactions={transactions} onDelete={deleteTransaction} categories={categories} />
      {showForm && (
        <AddTransactionForm onAdd={addTransaction} onClose={() => setShowForm(false)} categories={categories} />
      )}
    </div>
  );
}
