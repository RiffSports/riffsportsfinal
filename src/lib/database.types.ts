// Tipos do banco. Gerados a partir do Supabase com `npm run db:types`.
// Não edite à mão depois que o projeto estiver linkado: regenere.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          gender: string | null
          accessibility_needs: string | null
          verification_level: number
          presence_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          gender?: string | null
          accessibility_needs?: string | null
          verification_level?: number
          presence_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          gender?: string | null
          accessibility_needs?: string | null
          verification_level?: number
          presence_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      sports: {
        Row: {
          id: number
          slug: string
          name: string
          category: string
          created_at: string
        }
        Insert: {
          id?: number
          slug: string
          name: string
          category: string
          created_at?: string
        }
        Update: {
          id?: number
          slug?: string
          name?: string
          category?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
