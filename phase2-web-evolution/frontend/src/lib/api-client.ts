// src/lib/api-client.ts
import { getAuthHeaders } from './auth-client';

// FIXED: Now using environment variable instead of localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = {
  async getTasks() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    const res = await fetch(
      `${API_BASE_URL}/tasks/?limit=50&offset=0`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch tasks: ${res.status}`);
    }

    const data = await res.json();
    // Handling different backend response formats
    return data.tasks ? data.tasks : (Array.isArray(data.items) ? data.items : (Array.isArray(data) ? data : []));
  },

  async createTask(task: {
    title: string;
    description?: string;
  }) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    const res = await fetch(`${API_BASE_URL}/tasks/`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    if (!res.ok) {
      throw new Error(`Failed to create task: ${res.status}`);
    }

    return res.json();
  },

  async deleteTask(taskId: number) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to delete task: ${res.status}`);
    }
  },

  async completeTask(taskId: number) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    const res = await fetch(
      `${API_BASE_URL}/tasks/${taskId}/complete`,
      {
        method: "PATCH",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to complete task: ${res.status}`);
    }
  },

  async updateTask(taskId: number, taskData: any) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!res.ok) {
      throw new Error(`Failed to update task: ${res.status}`);
    }

    return res.json();
  },
};