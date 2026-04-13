export type TransactionType = 'Receita' | 'Despesa';

export type PaymentMethod = 'Débito' | 'Crédito' | 'Dinheiro' | 'Transferência' | 'Pix';

export type TransactionStatus = 'Pago' | 'Pendente' | 'Recebido' | 'Realizado' | 'Cancelado';

export const PAYMENT_METHODS: PaymentMethod[] = ['Débito', 'Crédito', 'Dinheiro', 'Transferência', 'Pix'];

export const STATUSES: TransactionStatus[] = ['Pago', 'Pendente', 'Recebido', 'Realizado', 'Cancelado'];

export type PurchasePriority = 'Alta' | 'Média' | 'Baixa';
export type PurchaseStatus = 'Planejado' | 'Em análise' | 'Aprovado' | 'Comprado' | 'Cancelado';

export const PURCHASE_PRIORITIES: PurchasePriority[] = ['Alta', 'Média', 'Baixa'];
export const PURCHASE_STATUSES: PurchaseStatus[] = ['Planejado', 'Em análise', 'Aprovado', 'Comprado', 'Cancelado'];

// Supabase row types
export interface Categoria {
  id: string;
  nome: string;
  tipo: string;
  icone: string | null;
  cor: string | null;
  criado_em: string;
}

export interface Lancamento {
  id: string;
  data: string;
  tipo: string;
  categoria_id: string | null;
  descricao: string;
  valor: number;
  forma_pagamento: string | null;
  parcela_atual: number | null;
  total_parcelas: number | null;
  status: string;
  notas: string | null;
  criado_em: string;
  atualizado_em: string;
  // joined
  categorias?: Categoria | null;
}

export interface CartaoCredito {
  id: string;
  mes_ano: string;
  limite: number;
  total_fatura: number;
  pago: boolean;
  data_pagamento: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface CompraPlanejada {
  id: string;
  item: string;
  valor_estimado: number;
  prioridade: string;
  necessario: boolean;
  mes_planejado: string | null;
  status: string;
  notas: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface ResumoMensal {
  mes_ano: string | null;
  mes_label: string | null;
  total_receitas: number | null;
  total_despesas: number | null;
  pendente_pagar: number | null;
  saldo: number | null;
  qtd_receitas: number | null;
  qtd_despesas: number | null;
}

export interface GastoPorCategoria {
  categoria_id: string | null;
  categoria: string | null;
  icone: string | null;
  cor: string | null;
  total_gasto: number | null;
  qtd_lancamentos: number | null;
}
