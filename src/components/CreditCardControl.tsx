import { useState } from 'react';
import { useCreditCard } from '@/hooks/useCreditCard';
import { formatCurrency, formatDate } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, CreditCard, Check, X, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function CreditCardControl() {
  const { cards, isLoading, addCard, deleteCard, updateCard } = useCreditCard();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ monthYear: '', limit: '5000', totalBill: '', paid: false, paymentDate: '' });

  const handleAdd = async () => {
    if (!form.monthYear) return;
    await addCard({
      mes_ano: form.monthYear,
      limite: parseFloat(form.limit) || 5000,
      total_fatura: parseFloat(form.totalBill) || 0,
      pago: form.paid,
      data_pagamento: form.paymentDate || null,
    });
    setForm({ monthYear: '', limit: '5000', totalBill: '', paid: false, paymentDate: '' });
    setShowForm(false);
  };

  const togglePaid = (entry: typeof cards[0]) => {
    updateCard({ id: entry.id, pago: !entry.pago });
  };

  const formatMonth = (m: string) => {
    if (!m) return '—';
    const [y, mo] = m.split('-');
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${months[parseInt(mo) - 1]}/${y}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
              {cards.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">Nenhum registro</TableCell></TableRow>
              )}
              {cards.map(entry => {
                const pct = entry.limite > 0 ? (entry.total_fatura / entry.limite) * 100 : 0;
                return (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{formatMonth(entry.mes_ano)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(entry.limite)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(entry.total_fatura)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 rounded-full bg-secondary overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${pct > 80 ? 'bg-destructive' : pct > 50 ? 'bg-[hsl(var(--warning))]' : 'bg-primary'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{pct.toFixed(1)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => togglePaid(entry)}>
                        {entry.pago ? <Check className="h-4 w-4 text-primary" /> : <X className="h-4 w-4 text-muted-foreground" />}
                      </Button>
                    </TableCell>
                    <TableCell className="text-sm">{entry.data_pagamento ? formatDate(entry.data_pagamento) : '—'}</TableCell>
                    <TableCell>
                      {entry.pago ? (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">✅ Pago</Badge>
                      ) : entry.total_fatura > 0 ? (
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Pendente</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteCard(entry.id)}><Trash2 className="h-3.5 w-3.5" /></Button></TableCell>
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
