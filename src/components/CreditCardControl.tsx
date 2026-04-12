import { useState } from 'react';
import { CreditCardMonth, loadCreditCard, saveCreditCard } from '@/lib/creditCard';
import { formatCurrency, formatDate } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, CreditCard, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';

export function CreditCardControl() {
  const [data, setData] = useState<CreditCardMonth[]>(loadCreditCard);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ monthYear: '', limit: '5000', totalBill: '', paid: false, paymentDate: '' });

  const update = (newData: CreditCardMonth[]) => { setData(newData); saveCreditCard(newData); };

  const handleAdd = () => {
    if (!form.monthYear) return;
    const newEntry: CreditCardMonth = {
      id: crypto.randomUUID(), monthYear: form.monthYear, limit: parseFloat(form.limit) || 5000,
      totalBill: parseFloat(form.totalBill) || 0, paid: form.paid, paymentDate: form.paymentDate,
    };
    update([...data, newEntry]);
    setForm({ monthYear: '', limit: '5000', totalBill: '', paid: false, paymentDate: '' });
    setShowForm(false);
  };

  const handleDelete = (id: string) => update(data.filter(d => d.id !== id));

  const togglePaid = (id: string) => {
    update(data.map(d => d.id === id ? { ...d, paid: !d.paid } : d));
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
            <CreditCard className="h-5 w-5 text-primary" />
            Controle de Cartão de Crédito
          </CardTitle>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-1" /> Adicionar Mês
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Mês/Ano</TableHead>
                <TableHead className="text-right">Limite</TableHead>
                <TableHead className="text-right">Total Fatura</TableHead>
                <TableHead>% Limite Usado</TableHead>
                <TableHead>Pago?</TableHead>
                <TableHead>Data Pagamento</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">Nenhum registro</TableCell></TableRow>
              )}
              {data.map(entry => {
                const pct = entry.limit > 0 ? (entry.totalBill / entry.limit) * 100 : 0;
                const progressColor = pct > 80 ? 'bg-destructive' : pct > 50 ? 'bg-warning' : 'bg-primary';
                return (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{formatMonth(entry.monthYear)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(entry.limit)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(entry.totalBill)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={pct} className="h-2 w-20" indicatorClassName={progressColor} />
                        <span className="text-xs text-muted-foreground">{pct.toFixed(1)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => togglePaid(entry.id)}>
                        {entry.paid ? <Check className="h-4 w-4 text-primary" /> : <X className="h-4 w-4 text-muted-foreground" />}
                      </Button>
                    </TableCell>
                    <TableCell className="text-sm">{entry.paymentDate ? formatDate(entry.paymentDate) : '—'}</TableCell>
                    <TableCell>
                      {entry.paid ? (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">✅ Pago</Badge>
                      ) : entry.totalBill > 0 ? (
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Pendente</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(entry.id)}><Trash2 className="h-3.5 w-3.5" /></Button></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Novo Mês - Cartão de Crédito</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Mês/Ano</Label><Input type="month" value={form.monthYear} onChange={e => setForm({ ...form, monthYear: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Limite (R$)</Label><Input type="number" value={form.limit} onChange={e => setForm({ ...form, limit: e.target.value })} /></div>
              <div><Label>Total Fatura (R$)</Label><Input type="number" value={form.totalBill} onChange={e => setForm({ ...form, totalBill: e.target.value })} /></div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.paid} onCheckedChange={v => setForm({ ...form, paid: v })} />
              <Label>Pago?</Label>
            </div>
            {form.paid && <div><Label>Data de Pagamento</Label><Input type="date" value={form.paymentDate} onChange={e => setForm({ ...form, paymentDate: e.target.value })} /></div>}
            <Button onClick={handleAdd} className="w-full">Adicionar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
