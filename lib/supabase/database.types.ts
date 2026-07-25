/**
 * Auto-generated Supabase database types.
 *
 * Run ./ops.sh gen-types to regenerate from your live schema.
 * This placeholder will be replaced with your actual types.
 */
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
      // Your tables will appear here after running ./ops.sh gen-types
      [_ in never]: never
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
