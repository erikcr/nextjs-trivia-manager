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
      base_table: {
        Row: {
          created_at: string
          created_by: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          created_at?: string
          created_by: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          created_at?: string
          created_by?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: []
      }
      event: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          join_code: string
          location: string | null
          max_teams: number | null
          name: string
          scheduled_at: string
          status: Database["public"]["Enums"]["event_status"]
          team_size_limit: number | null
          updated_at: string
          updated_by: string
          venue: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          join_code: string
          location?: string | null
          max_teams?: number | null
          name: string
          scheduled_at: string
          status?: Database["public"]["Enums"]["event_status"]
          team_size_limit?: number | null
          updated_at?: string
          updated_by: string
          venue?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          join_code?: string
          location?: string | null
          max_teams?: number | null
          name?: string
          scheduled_at?: string
          status?: Database["public"]["Enums"]["event_status"]
          team_size_limit?: number | null
          updated_at?: string
          updated_by?: string
          venue?: string | null
        }
        Relationships: []
      }
      question: {
        Row: {
          correct_answer: string
          created_at: string
          created_by: string
          id: string
          points: number
          question_text: string
          round_id: string
          sequence_number: number
          status: Database["public"]["Enums"]["question_status"]
          time_limit_seconds: number | null
          updated_at: string
          updated_by: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          created_by: string
          id?: string
          points: number
          question_text: string
          round_id: string
          sequence_number: number
          status?: Database["public"]["Enums"]["question_status"]
          time_limit_seconds?: number | null
          updated_at?: string
          updated_by: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          created_by?: string
          id?: string
          points?: number
          question_text?: string
          round_id?: string
          sequence_number?: number
          status?: Database["public"]["Enums"]["question_status"]
          time_limit_seconds?: number | null
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "round"
            referencedColumns: ["id"]
          },
        ]
      }
      response: {
        Row: {
          created_at: string
          created_by: string
          id: string
          is_correct: boolean | null
          points_awarded: number | null
          question_id: string
          response_time_seconds: number | null
          submitted_answer: string
          team_id: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          is_correct?: boolean | null
          points_awarded?: number | null
          question_id: string
          response_time_seconds?: number | null
          submitted_answer: string
          team_id: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          is_correct?: boolean | null
          points_awarded?: number | null
          question_id?: string
          response_time_seconds?: number | null
          submitted_answer?: string
          team_id?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "response_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "response_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "response_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_score"
            referencedColumns: ["team_id"]
          },
        ]
      }
      round: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          event_id: string
          id: string
          name: string
          sequence_number: number
          status: Database["public"]["Enums"]["round_status"]
          time_limit_seconds: number | null
          updated_at: string
          updated_by: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          event_id: string
          id?: string
          name: string
          sequence_number: number
          status?: Database["public"]["Enums"]["round_status"]
          time_limit_seconds?: number | null
          updated_at?: string
          updated_by: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          event_id?: string
          id?: string
          name?: string
          sequence_number?: number
          status?: Database["public"]["Enums"]["round_status"]
          time_limit_seconds?: number | null
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "round_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["id"]
          },
        ]
      }
      team: {
        Row: {
          created_at: string
          created_by: string
          event_id: string
          id: string
          name: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          created_at?: string
          created_by: string
          event_id: string
          id?: string
          name: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          created_at?: string
          created_by?: string
          event_id?: string
          id?: string
          name?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["id"]
          },
        ]
      }
      team_member: {
        Row: {
          created_at: string
          created_by: string
          id: string
          is_captain: boolean
          team_id: string
          updated_at: string
          updated_by: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          is_captain?: boolean
          team_id: string
          updated_at?: string
          updated_by: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          is_captain?: boolean
          team_id?: string
          updated_at?: string
          updated_by?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_member_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_member_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team_score"
            referencedColumns: ["team_id"]
          },
        ]
      }
    }
    Views: {
      team_score: {
        Row: {
          avg_response_time: number | null
          correct_answers: number | null
          event_id: string | null
          team_id: string | null
          team_name: string | null
          total_points: number | null
        }
        Relationships: [
          {
            foreignKeyName: "team_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      event_status: "pending" | "ongoing" | "completed"
      question_status: "pending" | "ongoing" | "completed"
      round_status: "pending" | "ongoing" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
