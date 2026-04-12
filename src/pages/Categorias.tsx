import { useCategories } from "@/hooks/useCategories";
import { CategoryManager } from "@/components/CategoryManager";

export default function Categorias() {
  const { categories, addCategory, removeCategory } = useCategories();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold font-display">Gerenciar Categorias</h1>
      <CategoryManager
        categories={categories}
        onAdd={addCategory}
        onRemove={removeCategory}
        onClose={() => {}}
        embedded
      />
    </div>
  );
}
