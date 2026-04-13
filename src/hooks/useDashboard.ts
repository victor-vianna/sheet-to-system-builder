import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ResumoMensal, GastoPorCategoria } from '@/lib/types';

export function useDashboard() {
  const { data: resumo, isLoading: loadingResumo } = useQuery({
    queryKey: ['resumo_mensal'],
    queryFn: async () => {
      const now = new Date();
      const mesAno = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const { data, error } = await supabase
        .from('resumo_mensal')
        .select('*')
        .eq('mes_ano', mesAno)
        .maybeSingle();
      if (error) throw error;
      return data as ResumoMensal | null;
    },
  });

  const { data: gastos = [], isLoading: loadingGastos } = useQuery({
    queryKey: ['gastos_por_categoria'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gastos_por_categoria')
        .select('*')
        .order('total_gasto', { ascending: false });
      if (error) throw error;
      return data as GastoPorCategoria[];
    },
  });

  const summary = {
    totalIncome: Number(resumo?.total_receitas ?? 0),
    totalExpense: Number(resumo?.total_despesas ?? 0),
    totalPending: Number(resumo?.pendente_pagar ?? 0),
    balance: Number(resumo?.saldo ?? 0),
  };

  const categoryData = gastos.map(g => ({
    category: g.categoria || 'Sem categoria',
    icon: g.icone || '📁',
    color: g.cor || null,
    total: Number(g.total_gasto ?? 0),
    percentage: 0,
  }));

  const totalExpense = summary.totalExpense;
  categoryData.forEach(c => {
    c.percentage = totalExpense > 0 ? (c.total / totalExpense) * 100 : 0;
  });

  return {
    summary,
    categoryData,
    isLoading: loadingResumo || loadingGastos,
  };
}
