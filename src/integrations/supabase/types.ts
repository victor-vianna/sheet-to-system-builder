export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cartao_credito: {
        Row: {
          atualizado_em: string
          criado_em: string
          data_pagamento: string | null
          id: string
          limite: number
          mes_ano: string
          pago: boolean
          total_fatura: number
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          data_pagamento?: string | null
          id?: string
          limite?: number
          mes_ano: string
          pago?: boolean
          total_fatura?: number
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          data_pagamento?: string | null
          id?: string
          limite?: number
          mes_ano?: string
          pago?: boolean
          total_fatura?: number
        }
        Relationships: []
      }
      categorias: {
        Row: {
          cor: string | null
          criado_em: string
          icone: string | null
          id: string
          nome: string
          tipo: string
        }
        Insert: {
          cor?: string | null
          criado_em?: string
          icone?: string | null
          id?: string
          nome: string
          tipo: string
        }
        Update: {
          cor?: string | null
          criado_em?: string
          icone?: string | null
          id?: string
          nome?: string
          tipo?: string
        }
        Relationships: []
      }
      compras_planejadas: {
        Row: {
          atualizado_em: string
          criado_em: string
          id: string
          item: string
          mes_planejado: string | null
          necessario: boolean
          notas: string | null
          prioridade: string
          status: string
          valor_estimado: number
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          item: string
          mes_planejado?: string | null
          necessario?: boolean
          notas?: string | null
          prioridade?: string
          status?: string
          valor_estimado: number
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          item?: string
          mes_planejado?: string | null
          necessario?: boolean
          notas?: string | null
          prioridade?: string
          status?: string
          valor_estimado?: number
        }
        Relationships: []
      }
      lancamentos: {
        Row: {
          atualizado_em: string
          categoria_id: string | null
          criado_em: string
          data: string
          descricao: string
          forma_pagamento: string | null
          id: string
          notas: string | null
          parcela_atual: number | null
          status: string
          tipo: string
          total_parcelas: number | null
          valor: number
        }
        Insert: {
          atualizado_em?: string
          categoria_id?: string | null
          criado_em?: string
          data: string
          descricao: string
          forma_pagamento?: string | null
          id?: string
          notas?: string | null
          parcela_atual?: number | null
          status?: string
          tipo: string
          total_parcelas?: number | null
          valor: number
        }
        Update: {
          atualizado_em?: string
          categoria_id?: string | null
          criado_em?: string
          data?: string
          descricao?: string
          forma_pagamento?: string | null
          id?: string
          notas?: string | null
          parcela_atual?: number | null
          status?: string
          tipo?: string
          total_parcelas?: number | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "lancamentos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "gastos_por_categoria"
            referencedColumns: ["categoria_id"]
          },
        ]
      }
    }
    Views: {
      gastos_por_categoria: {
        Row: {
          categoria: string | null
          categoria_id: string | null
          cor: string | null
          icone: string | null
          qtd_lancamentos: number | null
          total_gasto: number | null
        }
        Relationships: []
      }
      resumo_mensal: {
        Row: {
          mes_ano: string | null
          mes_label: string | null
          pendente_pagar: number | null
          qtd_despesas: number | null
          qtd_receitas: number | null
          saldo: number | null
          total_despesas: number | null
          total_receitas: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
