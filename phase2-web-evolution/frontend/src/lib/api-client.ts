// src/lib/api-client.ts
import { getAuthHeaders } from './auth-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = {
  async getTasks() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const res = await fetch(`${API_BASE_URL}/tasks`, { // Removed extra slash
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );
    if (!res.ok) throw new Error(`Failed to fetch tasks`);
    const data = await res.json();
    return data.tasks ? data.tasks : (Array.isArray(data.items) ? data.items : (Array.isArray(data) ? data : []));
  },

  async createTask(task: { title: string; description?: string; }) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    // Yahan humne URL ko simple rakha hai aur JSON stringify check kiya hai
    const res = await fetch(`${API_BASE_URL}/tasks`, { 
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: task.title,
        description: task.description || ""
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Server Error:", errorData);
      throw new Error(errorData.detail || "Failed to create task");
    }

    return res.json();
  },

  async deleteTask(taskId: number) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Failed to delete task`);
  },

  async completeTask(taskId: number) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/complete`, {
      method: "PATCH",
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Failed to complete task`);
  }
};