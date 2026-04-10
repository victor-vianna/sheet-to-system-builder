import { useState, useCallback } from 'react';
import { CategoryStore, CategoryNode, loadCategories, saveCategories, addNodeToTree, removeNodeFromTree } from '@/lib/categories';

export function useCategories() {
  const [categories, setCategories] = useState<CategoryStore>(loadCategories);

  const update = useCallback((store: CategoryStore) => {
    setCategories(store);
    saveCategories(store);
  }, []);

  const addCategory = useCallback((type: 'expense' | 'income', parentPath: string[], name: string, icon: string) => {
    const newNode: CategoryNode = { id: crypto.randomUUID(), name, icon, children: [] };
    const updated = { ...categories };
    updated[type] = addNodeToTree(updated[type], parentPath, newNode);
    update(updated);
  }, [categories, update]);

  const removeCategory = useCallback((type: 'expense' | 'income', path: string[]) => {
    const updated = { ...categories };
    updated[type] = removeNodeFromTree(updated[type], path);
    update(updated);
  }, [categories, update]);

  return { categories, addCategory, removeCategory };
}
