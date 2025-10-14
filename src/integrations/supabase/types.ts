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
      bridge_fee_estimates: {
        Row: {
          amount: number
          bridge_fee: number | null
          created_at: string | null
          estimated_gas_usd: number | null
          from_chain: string
          id: string
          to_chain: string
          token: string
          total_cost_usd: number | null
          user_id: string | null
        }
        Insert: {
          amount: number
          bridge_fee?: number | null
          created_at?: string | null
          estimated_gas_usd?: number | null
          from_chain: string
          id?: string
          to_chain: string
          token: string
          total_cost_usd?: number | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          bridge_fee?: number | null
          created_at?: string | null
          estimated_gas_usd?: number | null
          from_chain?: string
          id?: string
          to_chain?: string
          token?: string
          total_cost_usd?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      bridge_preferences: {
        Row: {
          auto_claim_enabled: boolean | null
          claim_threshold: number | null
          created_at: string | null
          gas_alert_enabled: boolean | null
          preferred_chain: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_claim_enabled?: boolean | null
          claim_threshold?: number | null
          created_at?: string | null
          gas_alert_enabled?: boolean | null
          preferred_chain?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_claim_enabled?: boolean | null
          claim_threshold?: number | null
          created_at?: string | null
          gas_alert_enabled?: boolean | null
          preferred_chain?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      cross_chain_swaps: {
        Row: {
          bridge_fee: number | null
          completed_at: string | null
          created_at: string | null
          estimated_to_amount: number
          from_amount: number
          from_chain: string
          from_token: string
          gas_fees_paid: number | null
          id: string
          network: string | null
          price_impact: number | null
          route_used: Json | null
          slippage_tolerance: number | null
          status: Database["public"]["Enums"]["swap_status"] | null
          swap_fee: number | null
          to_amount: number | null
          to_chain: string
          to_token: string
          total_fees_usd: number | null
          tx_hash: string | null
          user_id: string | null
          wallet_address: string
        }
        Insert: {
          bridge_fee?: number | null
          completed_at?: string | null
          created_at?: string | null
          estimated_to_amount: number
          from_amount: number
          from_chain: string
          from_token: string
          gas_fees_paid?: number | null
          id?: string
          network?: string | null
          price_impact?: number | null
          route_used?: Json | null
          slippage_tolerance?: number | null
          status?: Database["public"]["Enums"]["swap_status"] | null
          swap_fee?: number | null
          to_amount?: number | null
          to_chain: string
          to_token: string
          total_fees_usd?: number | null
          tx_hash?: string | null
          user_id?: string | null
          wallet_address: string
        }
        Update: {
          bridge_fee?: number | null
          completed_at?: string | null
          created_at?: string | null
          estimated_to_amount?: number
          from_amount?: number
          from_chain?: string
          from_token?: string
          gas_fees_paid?: number | null
          id?: string
          network?: string | null
          price_impact?: number | null
          route_used?: Json | null
          slippage_tolerance?: number | null
          status?: Database["public"]["Enums"]["swap_status"] | null
          swap_fee?: number | null
          to_amount?: number | null
          to_chain?: string
          to_token?: string
          total_fees_usd?: number | null
          tx_hash?: string | null
          user_id?: string | null
          wallet_address?: string
        }
        Relationships: []
      }
      depin_reward_claims: {
        Row: {
          claimed_at: string | null
          destination_chain: string
          device_ids: string[]
          id: string
          status: string | null
          total_amount: number
          user_id: string
          wormhole_tx_id: string | null
        }
        Insert: {
          claimed_at?: string | null
          destination_chain: string
          device_ids: string[]
          id?: string
          status?: string | null
          total_amount: number
          user_id: string
          wormhole_tx_id?: string | null
        }
        Update: {
          claimed_at?: string | null
          destination_chain?: string
          device_ids?: string[]
          id?: string
          status?: string | null
          total_amount?: number
          user_id?: string
          wormhole_tx_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "depin_reward_claims_wormhole_tx_id_fkey"
            columns: ["wormhole_tx_id"]
            isOneToOne: false
            referencedRelation: "wormhole_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      depin_rewards: {
        Row: {
          amount: number
          batch_claim_id: string | null
          chain: string
          claimed_at: string | null
          claimed_via_tx: string | null
          created_at: string | null
          device_id: string
          id: string
          status: string | null
          token: string | null
          tx_hash: string | null
          user_id: string
        }
        Insert: {
          amount: number
          batch_claim_id?: string | null
          chain: string
          claimed_at?: string | null
          claimed_via_tx?: string | null
          created_at?: string | null
          device_id: string
          id?: string
          status?: string | null
          token?: string | null
          tx_hash?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          batch_claim_id?: string | null
          chain?: string
          claimed_at?: string | null
          claimed_via_tx?: string | null
          created_at?: string | null
          device_id?: string
          id?: string
          status?: string | null
          token?: string | null
          tx_hash?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "depin_rewards_claimed_via_tx_fkey"
            columns: ["claimed_via_tx"]
            isOneToOne: false
            referencedRelation: "wormhole_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "depin_rewards_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "device_registry"
            referencedColumns: ["device_id"]
          },
        ]
      }
      device_events: {
        Row: {
          created_at: string | null
          device_id: string
          event_type: string
          id: string
          metrics: Json
          reward_amount: number | null
          signature: string | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          device_id: string
          event_type: string
          id?: string
          metrics: Json
          reward_amount?: number | null
          signature?: string | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          device_id?: string
          event_type?: string
          id?: string
          metrics?: Json
          reward_amount?: number | null
          signature?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "device_events_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "device_registry"
            referencedColumns: ["device_id"]
          },
        ]
      }
      device_registry: {
        Row: {
          created_at: string | null
          device_id: string
          device_name: string
          device_type: string
          id: string
          is_verified: boolean | null
          last_seen_at: string | null
          metadata: Json | null
          public_key: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_id: string
          device_name: string
          device_type: string
          id?: string
          is_verified?: boolean | null
          last_seen_at?: string | null
          metadata?: Json | null
          public_key?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_id?: string
          device_name?: string
          device_type?: string
          id?: string
          is_verified?: boolean | null
          last_seen_at?: string | null
          metadata?: Json | null
          public_key?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      portfolio_snapshots: {
        Row: {
          chains_queried: string[] | null
          created_at: string | null
          guardian_verified: boolean | null
          id: string
          network: string | null
          snapshot_data: Json
          total_value_usd: number
          user_id: string
          wallet_address: string
        }
        Insert: {
          chains_queried?: string[] | null
          created_at?: string | null
          guardian_verified?: boolean | null
          id?: string
          network?: string | null
          snapshot_data: Json
          total_value_usd: number
          user_id: string
          wallet_address: string
        }
        Update: {
          chains_queried?: string[] | null
          created_at?: string | null
          guardian_verified?: boolean | null
          id?: string
          network?: string | null
          snapshot_data?: Json
          total_value_usd?: number
          user_id?: string
          wallet_address?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallet_connections: {
        Row: {
          chain_name: string
          chain_type: Database["public"]["Enums"]["chain_type"]
          connected_at: string | null
          id: string
          is_primary: boolean | null
          user_id: string
          wallet_address: string
        }
        Insert: {
          chain_name: string
          chain_type: Database["public"]["Enums"]["chain_type"]
          connected_at?: string | null
          id?: string
          is_primary?: boolean | null
          user_id: string
          wallet_address: string
        }
        Update: {
          chain_name?: string
          chain_type?: Database["public"]["Enums"]["chain_type"]
          connected_at?: string | null
          id?: string
          is_primary?: boolean | null
          user_id?: string
          wallet_address?: string
        }
        Relationships: []
      }
      wormhole_executions: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string | null
          estimated_completion: string | null
          execution_type: string
          from_chain: string
          guardian_verified: boolean | null
          id: string
          status: string | null
          to_chain: string
          token: string
          tx_hash: string | null
          user_id: string | null
          vaa: string | null
          wallet_address: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string | null
          estimated_completion?: string | null
          execution_type: string
          from_chain: string
          guardian_verified?: boolean | null
          id?: string
          status?: string | null
          to_chain: string
          token: string
          tx_hash?: string | null
          user_id?: string | null
          vaa?: string | null
          wallet_address: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string | null
          estimated_completion?: string | null
          execution_type?: string
          from_chain?: string
          guardian_verified?: boolean | null
          id?: string
          status?: string | null
          to_chain?: string
          token?: string
          tx_hash?: string | null
          user_id?: string | null
          vaa?: string | null
          wallet_address?: string
        }
        Relationships: []
      }
      wormhole_transactions: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string | null
          from_chain: string
          from_token: string
          id: string
          needs_redemption: boolean | null
          redemption_completed_at: string | null
          redemption_tx_hash: string | null
          source_reference_ids: string[] | null
          source_type: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          to_chain: string
          to_token: string
          tx_hash: string | null
          user_id: string | null
          wallet_address: string
          wormhole_vaa: string | null
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string | null
          from_chain: string
          from_token: string
          id?: string
          needs_redemption?: boolean | null
          redemption_completed_at?: string | null
          redemption_tx_hash?: string | null
          source_reference_ids?: string[] | null
          source_type?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          to_chain: string
          to_token: string
          tx_hash?: string | null
          user_id?: string | null
          wallet_address?: string
          wormhole_vaa?: string | null
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string | null
          from_chain?: string
          from_token?: string
          id?: string
          needs_redemption?: boolean | null
          redemption_completed_at?: string | null
          redemption_tx_hash?: string | null
          source_reference_ids?: string[] | null
          source_type?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          to_chain?: string
          to_token?: string
          tx_hash?: string | null
          user_id?: string | null
          wallet_address?: string
          wormhole_vaa?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      chain_type: "EVM" | "SOLANA"
      swap_status: "pending" | "bridging" | "swapping" | "completed" | "failed"
      transaction_status: "pending" | "completed" | "failed"
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
    Enums: {
      app_role: ["admin", "user"],
      chain_type: ["EVM", "SOLANA"],
      swap_status: ["pending", "bridging", "swapping", "completed", "failed"],
      transaction_status: ["pending", "completed", "failed"],
    },
  },
} as const
