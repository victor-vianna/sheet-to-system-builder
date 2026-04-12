export type PurchasePriority = 'Alta' | 'Média' | 'Baixa';
export type PurchaseStatus = 'Planejado' | 'Em análise' | 'Aprovado' | 'Comprado' | 'Cancelado';

export interface PurchaseItem {
  id: string;
  item: string;
  estimatedValue: number;
  priority: PurchasePriority;
  necessary: boolean;
  plannedMonth: string;
  status: PurchaseStatus;
  balanceAvailable: boolean;
  notes: string;
}

export const PURCHASE_PRIORITIES: PurchasePriority[] = ['Alta', 'Média', 'Baixa'];
export const PURCHASE_STATUSES: PurchaseStatus[] = ['Planejado', 'Em análise', 'Aprovado', 'Comprado', 'Cancelado'];

const STORAGE_KEY = 'finance-purchases';

const DEFAULT_PURCHASES: PurchaseItem[] = [
  { id: '1', item: 'Notebook novo', estimatedValue: 3500, priority: 'Alta', necessary: true, plannedMonth: '2026-05', status: 'Planejado', balanceAvailable: false, notes: '' },
  { id: '2', item: 'TV 55 polegadas', estimatedValue: 2800, priority: 'Média', necessary: false, plannedMonth: '2026-06', status: 'Planejado', balanceAvailable: false, notes: '' },
  { id: '3', item: 'Reforma do banheiro', estimatedValue: 4000, priority: 'Alta', necessary: true, plannedMonth: '2026-07', status: 'Em análise', balanceAvailable: false, notes: '' },
  { id: '4', item: 'Tênis de corrida', estimatedValue: 350, priority: 'Baixa', necessary: false, plannedMonth: '2026-05', status: 'Planejado', balanceAvailable: false, notes: '' },
  { id: '5', item: 'Curso online inglês', estimatedValue: 480, priority: 'Média', necessary: true, plannedMonth: '2026-04', status: 'Aprovado', balanceAvailable: false, notes: '' },
];

export function loadPurchases(): PurchaseItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return DEFAULT_PURCHASES;
}

export function savePurchases(items: PurchaseItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
