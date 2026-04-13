import { useCategories } from "@/hooks/useCategories";
import { CategoryManager } from "@/components/CategoryManager";
import { Loader2 } from "lucide-react";

export default function Categorias() {
  const { expense, income, isLoading, addCategory, removeCategory } = useCategories();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold font-display">Gerenciar Categorias</h1>
      <CategoryManager
        expense={expense}
        income={income}
        onAdd={addCategory}
        onRemove={removeCategory}
        onClose={() => {}}
        embedded
      />
    </div>
  );
}
