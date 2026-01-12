export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  created_by: number;
  assigned_to?: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}