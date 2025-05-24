export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      anexo_bravo: {
        Row: {
          anexo_id: string
          checklist_completo: boolean | null
          checklist_items: Json | null
          codigo: string
          created_at: string | null
          estado: string | null
          fecha_creacion: string | null
          fecha_verificacion: string | null
          firmado: boolean | null
          jefe_centro: string | null
          jefe_centro_firma: string | null
          observaciones_generales: string | null
          operacion_id: string | null
          progreso: number | null
          supervisor: string | null
          supervisor_firma: string | null
          updated_at: string | null
        }
        Insert: {
          anexo_id?: string
          checklist_completo?: boolean | null
          checklist_items?: Json | null
          codigo: string
          created_at?: string | null
          estado?: string | null
          fecha_creacion?: string | null
          fecha_verificacion?: string | null
          firmado?: boolean | null
          jefe_centro?: string | null
          jefe_centro_firma?: string | null
          observaciones_generales?: string | null
          operacion_id?: string | null
          progreso?: number | null
          supervisor?: string | null
          supervisor_firma?: string | null
          updated_at?: string | null
        }
        Update: {
          anexo_id?: string
          checklist_completo?: boolean | null
          checklist_items?: Json | null
          codigo?: string
          created_at?: string | null
          estado?: string | null
          fecha_creacion?: string | null
          fecha_verificacion?: string | null
          firmado?: boolean | null
          jefe_centro?: string | null
          jefe_centro_firma?: string | null
          observaciones_generales?: string | null
          operacion_id?: string | null
          progreso?: number | null
          supervisor?: string | null
          supervisor_firma?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "anexo_bravo_operacion_id_fkey"
            columns: ["operacion_id"]
            isOneToOne: false
            referencedRelation: "operacion"
            referencedColumns: ["operacion_id"]
          },
        ]
      }
      operacion: {
        Row: {
          codigo: string
          created_at: string | null
          descripcion: string | null
          estado: string | null
          fecha_fin: string | null
          fecha_inicio: string | null
          nombre: string
          operacion_id: string
          updated_at: string | null
        }
        Insert: {
          codigo: string
          created_at?: string | null
          descripcion?: string | null
          estado?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          nombre: string
          operacion_id?: string
          updated_at?: string | null
        }
        Update: {
          codigo?: string
          created_at?: string | null
          descripcion?: string | null
          estado?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          nombre?: string
          operacion_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_super: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      jwt_salmonera: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      jwt_servicio: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      centro_tipo: "centro" | "barco"
      firma_tipo: "supervisor_servicio" | "supervisor_mandante" | "buzo"
      user_role:
        | "superuser"
        | "admin_salmonera"
        | "admin_servicio"
        | "supervisor"
        | "buzo"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      centro_tipo: ["centro", "barco"],
      firma_tipo: ["supervisor_servicio", "supervisor_mandante", "buzo"],
      user_role: [
        "superuser",
        "admin_salmonera",
        "admin_servicio",
        "supervisor",
        "buzo",
      ],
    },
  },
} as const
