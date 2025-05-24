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
          checklist_completo: boolean
          codigo: string
          created_at: string
          estado: string
          fecha_creacion: string
          fecha_verificacion: string
          firmado: boolean
          id: string
          jefe_centro: string
          jefe_centro_firma: string | null
          observaciones_generales: string | null
          operacion_id: string
          progreso: number
          supervisor: string
          supervisor_firma: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          checklist_completo?: boolean
          codigo: string
          created_at?: string
          estado?: string
          fecha_creacion?: string
          fecha_verificacion: string
          firmado?: boolean
          id?: string
          jefe_centro: string
          jefe_centro_firma?: string | null
          observaciones_generales?: string | null
          operacion_id: string
          progreso?: number
          supervisor: string
          supervisor_firma?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          checklist_completo?: boolean
          codigo?: string
          created_at?: string
          estado?: string
          fecha_creacion?: string
          fecha_verificacion?: string
          firmado?: boolean
          id?: string
          jefe_centro?: string
          jefe_centro_firma?: string | null
          observaciones_generales?: string | null
          operacion_id?: string
          progreso?: number
          supervisor?: string
          supervisor_firma?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "anexo_bravo_operacion_id_fkey"
            columns: ["operacion_id"]
            isOneToOne: false
            referencedRelation: "operacion"
            referencedColumns: ["id"]
          },
        ]
      }
      anexo_bravo_checklist: {
        Row: {
          anexo_bravo_id: string
          created_at: string
          id: string
          item: string
          observaciones: string | null
          orden: number
          verificado: boolean
        }
        Insert: {
          anexo_bravo_id: string
          created_at?: string
          id?: string
          item: string
          observaciones?: string | null
          orden: number
          verificado?: boolean
        }
        Update: {
          anexo_bravo_id?: string
          created_at?: string
          id?: string
          item?: string
          observaciones?: string | null
          orden?: number
          verificado?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "anexo_bravo_checklist_anexo_bravo_id_fkey"
            columns: ["anexo_bravo_id"]
            isOneToOne: false
            referencedRelation: "anexo_bravo"
            referencedColumns: ["id"]
          },
        ]
      }
      operacion: {
        Row: {
          codigo: string
          contratista_id: string | null
          created_at: string
          estado: string
          fecha_fin: string | null
          fecha_inicio: string
          id: string
          nombre: string
          salmonera_id: string | null
          sitio_id: string | null
          updated_at: string
        }
        Insert: {
          codigo: string
          contratista_id?: string | null
          created_at?: string
          estado?: string
          fecha_fin?: string | null
          fecha_inicio: string
          id?: string
          nombre: string
          salmonera_id?: string | null
          sitio_id?: string | null
          updated_at?: string
        }
        Update: {
          codigo?: string
          contratista_id?: string | null
          created_at?: string
          estado?: string
          fecha_fin?: string | null
          fecha_inicio?: string
          id?: string
          nombre?: string
          salmonera_id?: string | null
          sitio_id?: string | null
          updated_at?: string
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
    Enums: {},
  },
} as const
