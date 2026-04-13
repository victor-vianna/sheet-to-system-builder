import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Lancamento } from '@/lib/types';
import { toast } from 'sonner';

export function useTransactions() {
  const qc = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['lancamentos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lancamentos')
        .select('*, categorias(*)')
        .order('data', { ascending: false });
      if (error) throw error;
      return data as Lancamento[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (tx: {
      data: string;
      tipo: string;
      categoria_id: string | null;
      descricao: string;
      valor: number;
      forma_pagamento: string | null;
      parcela_atual: number | null;
      total_parcelas: number | null;
      status: string;
      notas?: string | null;
    }) => {
      const { error } = await supabase.from('lancamentos').insert(tx);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lancamentos'] });
      qc.invalidateQueries({ queryKey: ['resumo_mensal'] });
      qc.invalidateQueries({ queryKey: ['gastos_por_categoria'] });
      toast.success('Lançamento adicionado');
    },
    onError: (e: Error) => toast.error('Erro ao adicionar: ' + e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('lancamentos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lancamentos'] });
      qc.invalidateQueries({ queryKey: ['resumo_mensal'] });
      qc.invalidateQueries({ queryKey: ['gastos_por_categoria'] });
      toast.success('Lançamento excluído');
    },
    onError: (e: Error) => toast.error('Erro ao excluir: ' + e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<Lancamento>) => {
      // Remove joined fields
      const { categorias, ...rest } = data as any;
      const { error } = await supabase.from('lancamentos').update(rest).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lancamentos'] });
      qc.invalidateQueries({ queryKey: ['resumo_mensal'] });
      qc.invalidateQueries({ queryKey: ['gastos_por_categoria'] });
      toast.success('Lançamento atualizado');
    },
    onError: (e: Error) => toast.error('Erro ao atualizar: ' + e.message),
  });

  return {
    transactions,
    isLoading,
    addTransaction: addMutation.mutateAsync,
    deleteTransaction: deleteMutation.mutateAsync,
    updateTransaction: updateMutation.mutateAsync,
  };
}
