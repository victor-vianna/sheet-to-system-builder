import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CartaoCredito } from '@/lib/types';
import { toast } from 'sonner';

export function useCreditCard() {
  const qc = useQueryClient();

  const { data: cards = [], isLoading } = useQuery({
    queryKey: ['cartao_credito'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cartao_credito')
        .select('*')
        .order('mes_ano', { ascending: false });
      if (error) throw error;
      return data as CartaoCredito[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (entry: { mes_ano: string; limite: number; total_fatura: number; pago: boolean; data_pagamento: string | null }) => {
      const { error } = await supabase.from('cartao_credito').insert(entry);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cartao_credito'] }); toast.success('Mês adicionado'); },
    onError: (e: Error) => toast.error('Erro: ' + e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('cartao_credito').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cartao_credito'] }); toast.success('Registro removido'); },
    onError: (e: Error) => toast.error('Erro: ' + e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<CartaoCredito>) => {
      const { error } = await supabase.from('cartao_credito').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cartao_credito'] }); toast.success('Atualizado'); },
    onError: (e: Error) => toast.error('Erro: ' + e.message),
  });

  return {
    cards,
    isLoading,
    addCard: addMutation.mutateAsync,
    deleteCard: deleteMutation.mutateAsync,
    updateCard: updateMutation.mutateAsync,
  };
}
