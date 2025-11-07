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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      formularios_submetidos: {
        Row: {
          cpf: string
          created_at: string
          dados_completos: Json
          email_cliente: string
          id: string
          nome_completo: string
        }
        Insert: {
          cpf: string
          created_at?: string
          dados_completos: Json
          email_cliente: string
          id?: string
          nome_completo: string
        }
        Update: {
          cpf?: string
          created_at?: string
          dados_completos?: Json
          email_cliente?: string
          id?: string
          nome_completo?: string
        }
        Relationships: []
      }
      planejamento_previdenciario: {
        Row: {
          bombeiro_militar: boolean
          cpf: string
          criado_em: string
          data_ingresso_servico_publico: string | null
          data_nascimento: string
          email_cliente: string
          grau_deficiencia: string | null
          id: string
          insalubridade_ou_especial: boolean
          ip: string | null
          municipio: string | null
          nome_completo: string
          origem_formulario: string
          origem_funcional: string | null
          pessoa_com_deficiencia: boolean
          policial: boolean
          policial_civil_ou_federal: boolean | null
          policial_militar_ou_bombeiro: boolean | null
          professor: boolean
          recaptcha_score: number | null
          sexo: string
          tempo_afastamento_anos: number | null
          tempo_afastamento_dias: number | null
          tempo_afastamento_meses: number | null
          tempo_cargo_anos: number | null
          tempo_cargo_dias: number | null
          tempo_cargo_meses: number | null
          tempo_carreira_anos: number | null
          tempo_carreira_dias: number | null
          tempo_carreira_meses: number | null
          tempo_comum_anos: number
          tempo_comum_dias: number
          tempo_comum_meses: number
          tempo_especial_insalubre_anos: number | null
          tempo_especial_insalubre_dias: number | null
          tempo_especial_insalubre_meses: number | null
          tempo_fora_magisterio_anos: number | null
          tempo_fora_magisterio_dias: number | null
          tempo_fora_magisterio_meses: number | null
          tempo_magisterio_anos: number | null
          tempo_magisterio_dias: number | null
          tempo_magisterio_meses: number | null
          tempo_pcd_anos: number | null
          tempo_pcd_dias: number | null
          tempo_pcd_meses: number | null
          tempo_policial_anos: number | null
          tempo_policial_dias: number | null
          tempo_policial_meses: number | null
          uf: string | null
          user_agent: string | null
          versao: number
          vinculo: string
        }
        Insert: {
          bombeiro_militar: boolean
          cpf: string
          criado_em?: string
          data_ingresso_servico_publico?: string | null
          data_nascimento: string
          email_cliente: string
          grau_deficiencia?: string | null
          id?: string
          insalubridade_ou_especial: boolean
          ip?: string | null
          municipio?: string | null
          nome_completo: string
          origem_formulario?: string
          origem_funcional?: string | null
          pessoa_com_deficiencia: boolean
          policial: boolean
          policial_civil_ou_federal?: boolean | null
          policial_militar_ou_bombeiro?: boolean | null
          professor: boolean
          recaptcha_score?: number | null
          sexo: string
          tempo_afastamento_anos?: number | null
          tempo_afastamento_dias?: number | null
          tempo_afastamento_meses?: number | null
          tempo_cargo_anos?: number | null
          tempo_cargo_dias?: number | null
          tempo_cargo_meses?: number | null
          tempo_carreira_anos?: number | null
          tempo_carreira_dias?: number | null
          tempo_carreira_meses?: number | null
          tempo_comum_anos?: number
          tempo_comum_dias?: number
          tempo_comum_meses?: number
          tempo_especial_insalubre_anos?: number | null
          tempo_especial_insalubre_dias?: number | null
          tempo_especial_insalubre_meses?: number | null
          tempo_fora_magisterio_anos?: number | null
          tempo_fora_magisterio_dias?: number | null
          tempo_fora_magisterio_meses?: number | null
          tempo_magisterio_anos?: number | null
          tempo_magisterio_dias?: number | null
          tempo_magisterio_meses?: number | null
          tempo_pcd_anos?: number | null
          tempo_pcd_dias?: number | null
          tempo_pcd_meses?: number | null
          tempo_policial_anos?: number | null
          tempo_policial_dias?: number | null
          tempo_policial_meses?: number | null
          uf?: string | null
          user_agent?: string | null
          versao?: number
          vinculo: string
        }
        Update: {
          bombeiro_militar?: boolean
          cpf?: string
          criado_em?: string
          data_ingresso_servico_publico?: string | null
          data_nascimento?: string
          email_cliente?: string
          grau_deficiencia?: string | null
          id?: string
          insalubridade_ou_especial?: boolean
          ip?: string | null
          municipio?: string | null
          nome_completo?: string
          origem_formulario?: string
          origem_funcional?: string | null
          pessoa_com_deficiencia?: boolean
          policial?: boolean
          policial_civil_ou_federal?: boolean | null
          policial_militar_ou_bombeiro?: boolean | null
          professor?: boolean
          recaptcha_score?: number | null
          sexo?: string
          tempo_afastamento_anos?: number | null
          tempo_afastamento_dias?: number | null
          tempo_afastamento_meses?: number | null
          tempo_cargo_anos?: number | null
          tempo_cargo_dias?: number | null
          tempo_cargo_meses?: number | null
          tempo_carreira_anos?: number | null
          tempo_carreira_dias?: number | null
          tempo_carreira_meses?: number | null
          tempo_comum_anos?: number
          tempo_comum_dias?: number
          tempo_comum_meses?: number
          tempo_especial_insalubre_anos?: number | null
          tempo_especial_insalubre_dias?: number | null
          tempo_especial_insalubre_meses?: number | null
          tempo_fora_magisterio_anos?: number | null
          tempo_fora_magisterio_dias?: number | null
          tempo_fora_magisterio_meses?: number | null
          tempo_magisterio_anos?: number | null
          tempo_magisterio_dias?: number | null
          tempo_magisterio_meses?: number | null
          tempo_pcd_anos?: number | null
          tempo_pcd_dias?: number | null
          tempo_pcd_meses?: number | null
          tempo_policial_anos?: number | null
          tempo_policial_dias?: number | null
          tempo_policial_meses?: number | null
          uf?: string | null
          user_agent?: string | null
          versao?: number
          vinculo?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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
