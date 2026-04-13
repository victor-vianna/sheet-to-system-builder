import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CompraPlanejada } from '@/lib/types';
import { toast } from 'sonner';

export function usePurchases() {
  const qc = useQueryClient();

  const { data: purchases = [], isLoading } = useQuery({
    queryKey: ['compras_planejadas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compras_planejadas')
        .select('*')
        .order('criado_em', { ascending: false });
      if (error) throw error;
      return data as CompraPlanejada[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (item: { item: string; valor_estimado: number; prioridade: string; necessario: boolean; mes_planejado: string | null; status: string; notas: string | null }) => {
      const { error } = await supabase.from('compras_planejadas').insert(item);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['compras_planejadas'] }); toast.success('Item adicionado'); },
    onError: (e: Error) => toast.error('Erro: ' + e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('compras_planejadas').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['compras_planejadas'] }); toast.success('Item removido'); },
    onError: (e: Error) => toast.error('Erro: ' + e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<CompraPlanejada>) => {
      const { error } = await supabase.from('compras_planejadas').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['compras_planejadas'] }); toast.success('Atualizado'); },
    onError: (e: Error) => toast.error('Erro: ' + e.message),
  });

  return {
    purchases,
    isLoading,
    addPurchase: addMutation.mutateAsync,
    deletePurchase: deleteMutation.mutateAsync,
    updatePurchase: updateMutation.mutateAsync,
  };
}
