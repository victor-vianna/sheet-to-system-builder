export interface CreditCardMonth {
  id: string;
  monthYear: string;
  limit: number;
  totalBill: number;
  paid: boolean;
  paymentDate: string;
}

const STORAGE_KEY = 'finance-credit-card';

const DEFAULT_DATA: CreditCardMonth[] = [
  { id: '1', monthYear: '2026-01', limit: 5000, totalBill: 1850, paid: true, paymentDate: '2026-01-15' },
  { id: '2', monthYear: '2026-02', limit: 5000, totalBill: 2100, paid: true, paymentDate: '2026-02-15' },
  { id: '3', monthYear: '2026-03', limit: 5000, totalBill: 1620, paid: true, paymentDate: '2026-03-15' },
  { id: '4', monthYear: '2026-04', limit: 5000, totalBill: 0, paid: false, paymentDate: '' },
  { id: '5', monthYear: '2026-05', limit: 5000, totalBill: 0, paid: false, paymentDate: '' },
  { id: '6', monthYear: '2026-06', limit: 5000, totalBill: 0, paid: false, paymentDate: '' },
];

export function loadCreditCard(): CreditCardMonth[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return DEFAULT_DATA;
}

export function saveCreditCard(data: CreditCardMonth[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
