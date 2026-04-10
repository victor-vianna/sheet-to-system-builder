export interface CategoryNode {
  id: string;
  name: string;
  icon: string;
  children: CategoryNode[];
}

const STORAGE_KEY = 'finance-categories';

const DEFAULT_EXPENSE_CATEGORIES: CategoryNode[] = [
  { id: 'moradia', name: 'Moradia', icon: '🏠', children: [] },
  { id: 'contas', name: 'Contas', icon: '📄', children: [] },
  { id: 'alimentacao', name: 'Alimentação', icon: '🍔', children: [] },
  { id: 'transporte', name: 'Transporte', icon: '🚗', children: [] },
  { id: 'lazer', name: 'Lazer', icon: '🎮', children: [] },
  { id: 'assinaturas', name: 'Assinaturas', icon: '📺', children: [] },
  { id: 'dividas', name: 'Dívidas', icon: '💳', children: [] },
  { id: 'investimentos', name: 'Investimentos', icon: '📈', children: [] },
  { id: 'saude', name: 'Saúde', icon: '🏥', children: [
    { id: 'farmacia', name: 'Farmácia', icon: '💊', children: [] },
    { id: 'consultas', name: 'Consultas', icon: '🩺', children: [] },
  ]},
  { id: 'educacao', name: 'Educação', icon: '📚', children: [] },
];

const DEFAULT_INCOME_CATEGORIES: CategoryNode[] = [
  { id: 'salario', name: 'Salário', icon: '💰', children: [] },
  { id: 'extra', name: 'Extra', icon: '✨', children: [] },
  { id: 'investimentos-r', name: 'Investimentos', icon: '📈', children: [] },
];

export interface CategoryStore {
  expense: CategoryNode[];
  income: CategoryNode[];
}

export function loadCategories(): CategoryStore {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { expense: DEFAULT_EXPENSE_CATEGORIES, income: DEFAULT_INCOME_CATEGORIES };
}

export function saveCategories(store: CategoryStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function findNodeByPath(nodes: CategoryNode[], path: string[]): CategoryNode | null {
  if (path.length === 0) return null;
  const node = nodes.find(n => n.name === path[0]);
  if (!node) return null;
  if (path.length === 1) return node;
  return findNodeByPath(node.children, path.slice(1));
}

export function getIconForPath(nodes: CategoryNode[], path: string[]): string {
  const node = findNodeByPath(nodes, path);
  return node?.icon || '📁';
}

export function addNodeToTree(nodes: CategoryNode[], parentPath: string[], newNode: CategoryNode): CategoryNode[] {
  if (parentPath.length === 0) return [...nodes, newNode];
  return nodes.map(n => {
    if (n.name === parentPath[0]) {
      return {
        ...n,
        children: parentPath.length === 1
          ? [...n.children, newNode]
          : addNodeToTree(n.children, parentPath.slice(1), newNode),
      };
    }
    return n;
  });
}

export function removeNodeFromTree(nodes: CategoryNode[], path: string[]): CategoryNode[] {
  if (path.length === 1) return nodes.filter(n => n.name !== path[0]);
  return nodes.map(n => {
    if (n.name === path[0]) {
      return { ...n, children: removeNodeFromTree(n.children, path.slice(1)) };
    }
    return n;
  });
}

export function flattenCategories(nodes: CategoryNode[], prefix: string[] = []): string[][] {
  const result: string[][] = [];
  for (const node of nodes) {
    const currentPath = [...prefix, node.name];
    result.push(currentPath);
    if (node.children.length > 0) {
      result.push(...flattenCategories(node.children, currentPath));
    }
  }
  return result;
}
