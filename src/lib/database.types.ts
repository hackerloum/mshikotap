export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          full_name: string
          email: string
          phone: string
          wallet_balance: number
          referral_code: string
          referred_by?: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          phone: string
          wallet_balance?: number
          referral_code?: string
          referred_by?: string
        }
        Update: {
          full_name?: string
          email?: string
          phone?: string
          wallet_balance?: number
          referral_code?: string
          referred_by?: string
        }
      }
      tasks: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          reward: number
          type: 'video' | 'social_follow' | 'survey' | 'website_visit'
          status: 'active' | 'inactive'
          requirements: Json
        }
        Insert: {
          title: string
          description: string
          reward: number
          type: 'video' | 'social_follow' | 'survey' | 'website_visit'
          status?: 'active' | 'inactive'
          requirements: Json
        }
        Update: {
          title?: string
          description?: string
          reward?: number
          type?: 'video' | 'social_follow' | 'survey' | 'website_visit'
          status?: 'active' | 'inactive'
          requirements?: Json
        }
      }
      task_completions: {
        Row: {
          id: string
          created_at: string
          user_id: string
          task_id: string
          status: 'completed' | 'pending' | 'rejected'
          proof: Json
        }
        Insert: {
          user_id: string
          task_id: string
          status?: 'completed' | 'pending' | 'rejected'
          proof: Json
        }
        Update: {
          status?: 'completed' | 'pending' | 'rejected'
          proof?: Json
        }
      }
      withdrawals: {
        Row: {
          id: string
          created_at: string
          user_id: string
          amount: number
          status: 'pending' | 'approved' | 'rejected'
          payment_method: Json
        }
        Insert: {
          user_id: string
          amount: number
          status?: 'pending' | 'approved' | 'rejected'
          payment_method: Json
        }
        Update: {
          status?: 'pending' | 'approved' | 'rejected'
          payment_method?: Json
        }
      }
    }
  }
} 