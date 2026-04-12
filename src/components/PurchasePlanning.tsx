import { useState } from 'react';
import { PurchaseItem, PurchasePriority, PurchaseStatus, PURCHASE_PRIORITIES, PURCHASE_STATUSES, loadPurchases, savePurchases } from '@/lib/purchases';
import { formatCurrency } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, ShoppingCart, X, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function PurchasePlanning() {
  const [items, setItems] = useState<PurchaseItem[]>(loadPurchases);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ item: '', estimatedValue: '', priority: 'Média' as PurchasePriority, necessary: false, plannedMonth: '', status: 'Planejado' as PurchaseStatus, notes: '' });

  const update = (newItems: PurchaseItem[]) => { setItems(newItems); savePurchases(newItems); };

  const handleAdd = () => {
    if (!form.item || !form.estimatedValue) return;
    const newItem: PurchaseItem = {
      id: crypto.randomUUID(), item: form.item, estimatedValue: parseFloat(form.estimatedValue),
      priority: form.priority, necessary: form.necessary, plannedMonth: form.plannedMonth,
      status: form.status, balanceAvailable: false, notes: form.notes,
    };
    update([...items, newItem]);
    setForm({ item: '', estimatedValue: '', priority: 'Média', necessary: false, plannedMonth: '', status: 'Planejado', notes: '' });
    setShowForm(false);
  };

  const handleDelete = (id: string) => update(items.filter(i => i.id !== id));

  const handleStatusChange = (id: string, status: PurchaseStatus) => {
    update(items.map(i => i.id === id ? { ...i, status } : i));
  };

  const priorityColor = (p: PurchasePriority) => {
    if (p === 'Alta') return 'bg-destructive/10 text-destructive border-destructive/20';
    if (p === 'Média') return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-muted text-muted-foreground border-border';
  };

  const statusColor = (s: PurchaseStatus) => {
    if (s === 'Comprado') return 'bg-primary/10 text-primary border-primary/20';
    if (s === 'Aprovado') return 'bg-primary/10 text-primary border-primary/20';
    if (s === 'Em análise') return 'bg-warning/10 text-warning border-warning/20';
    if (s === 'Cancelado') return 'bg-destructive/10 text-destructive border-destructive/20';
    return 'bg-muted text-muted-foreground border-border';
  };

  const formatMonth = (m: string) => {
    if (!m) return '—';
    const [y, mo] = m.split('-');
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${months[parseInt(mo) - 1]}/${y}`;
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-display">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Planejamento de Compras
          </CardTitle>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-1" /> Adicionar
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Valor Est.</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Necessário?</TableHead>
                <TableHead>Mês Planejado</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notas</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">Nenhum item planejado</TableCell></TableRow>
              )}
              {items.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.item}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.estimatedValue)}</TableCell>
                  <TableCell><Badge variant="outline" className={priorityColor(item.priority)}>{item.priority}</Badge></TableCell>
                  <TableCell>{item.necessary ? <Check className="h-4 w-4 text-primary" /> : <X className="h-4 w-4 text-destructive" />}</TableCell>
                  <TableCell>{formatMonth(item.plannedMonth)}</TableCell>
                  <TableCell>
                    <Select value={item.status} onValueChange={(v) => handleStatusChange(item.id, v as PurchaseStatus)}>
                      <SelectTrigger className="h-7 w-28 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{PURCHASE_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate">{item.notes || '—'}</TableCell>
                  <TableCell><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-3.5 w-3.5" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nova Compra Planejada</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Item</Label><Input value={form.item} onChange={e => setForm({ ...form, item: e.target.value })} placeholder="Ex: Notebook novo" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Valor Estimado (R$)</Label><Input type="number" value={form.estimatedValue} onChange={e => setForm({ ...form, estimatedValue: e.target.value })} /></div>
              <div><Label>Mês Planejado</Label><Input type="month" value={form.plannedMonth} onChange={e => setForm({ ...form, plannedMonth: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Prioridade</Label>
                <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v as PurchasePriority })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{PURCHASE_PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as PurchaseStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{PURCHASE_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.necessary} onCheckedChange={v => setForm({ ...form, necessary: v })} />
              <Label>Necessário?</Label>
            </div>
            <div><Label>Notas</Label><Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Observações..." /></div>
            <Button onClick={handleAdd} className="w-full">Adicionar Item</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
