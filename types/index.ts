export type TaskType = 'youtube' | 'tiktok' | 'instagram' | 'survey' | 'website' | 'app';

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  reward: number;
  url?: string;
  created_at: string;
  expires_at?: string;
  status: 'active' | 'completed' | 'expired';
  requirements?: {
    minDuration?: number;
    verificationMethod?: 'screenshot' | 'code' | 'auto';
  };
}

export interface UserTask {
  id: string;
  user_id: string;
  task_id: string;
  started_at: string;
  completed_at?: string;
  status: 'pending' | 'completed' | 'rejected';
  proof?: string;
  reward: number;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  total_earnings: number;
  balance: number;
  completed_tasks: number;
  role: 'user' | 'admin';
  created_at: string;
}

export interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount: number;
  payment_method: string;
  payment_details: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
  processed_at?: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTasks: number;
  completedTasks: number;
  totalPayout: number;
  pendingWithdrawals: number;
} 