import { useState } from 'react';
import { Transaction, TransactionType, Category, PaymentMethod, TransactionStatus, EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS, STATUSES } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';

interface AddTransactionFormProps {
  onAdd: (tx: Omit<Transaction, 'id'>) => void;
  onClose: () => void;
}

export function AddTransactionForm({ onAdd, onClose }: AddTransactionFormProps) {
  const [type, setType] = useState<TransactionType>('Despesa');
  const [category, setCategory] = useState<Category>('Alimentação');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Débito');
  const [installment, setInstallment] = useState('-');
  const [status, setStatus] = useState<TransactionStatus>('Pago');

  const categories = type === 'Receita' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !value) return;
    onAdd({ date, type, category, description, value: parseFloat(value), paymentMethod, installment, status });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold font-display">Novo Lançamento</h3>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Tipo</label>
            <Select value={type} onValueChange={(v) => { setType(v as TransactionType); setCategory(v === 'Receita' ? 'Salário' : 'Alimentação'); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Receita">Receita</SelectItem>
                <SelectItem value="Despesa">Despesa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Data</label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Descrição</label>
          <Input placeholder="Ex: Supermercado" value={description} onChange={e => setDescription(e.target.value)} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Categoria</label>
            <Select value={category} onValueChange={v => setCategory(v as Category)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Valor (R$)</label>
            <Input type="number" step="0.01" min="0" placeholder="0,00" value={value} onChange={e => setValue(e.target.value)} required />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Pagamento</label>
            <Select value={paymentMethod} onValueChange={v => setPaymentMethod(v as PaymentMethod)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Parcela</label>
            <Input placeholder="-" value={installment} onChange={e => setInstallment(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Status</label>
            <Select value={status} onValueChange={v => setStatus(v as TransactionStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" /> Adicionar
        </Button>
      </form>
    </div>
  );
}
