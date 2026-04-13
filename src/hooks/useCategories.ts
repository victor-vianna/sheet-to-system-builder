import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Categoria } from '@/lib/types';
import { toast } from 'sonner';

export function useCategories() {
  const qc = useQueryClient();

  const { data: categorias = [], isLoading } = useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nome');
      if (error) throw error;
      return data as Categoria[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (cat: { nome: string; tipo: string; icone?: string; cor?: string }) => {
      const { error } = await supabase.from('categorias').insert(cat);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categorias'] });
      toast.success('Categoria criada');
    },
    onError: (e: Error) => toast.error('Erro: ' + e.message),
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categorias').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categorias'] });
      toast.success('Categoria removida');
    },
    onError: (e: Error) => toast.error('Erro: ' + e.message),
  });

  const expense = categorias.filter(c => c.tipo === 'Despesa');
  const income = categorias.filter(c => c.tipo === 'Receita');

  return { categorias, expense, income, isLoading, addCategory: addMutation.mutateAsync, removeCategory: removeMutation.mutateAsync };
}
