// src/lib/api-client.ts
import { getAuthHeaders } from './auth-client';

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export const apiClient = {
  async getTasks() {
    const token = localStorage.getItem('access_token');
    console.log("Using Token:", token); // Debug log to see if token is missing

    const res = await fetch(
      `${API_BASE_URL}/tasks/?limit=10&offset=0`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch tasks: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // 🔥 IMPORTANT FIX - Updated to handle the response format from backend
    return data.tasks ? data.tasks : (Array.isArray(data.items) ? data.items : []);
  },

  async createTask(task: {
    title: string;
    description?: string;
  }) {
    const token = localStorage.getItem('access_token');
    console.log("Using Token:", token); // Debug log to see if token is missing

    const res = await fetch(`${API_BASE_URL}/tasks/`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify(task),
    });

    if (!res.ok) {
      throw new Error(`Failed to create task: ${res.status} ${res.statusText}`);
    }

    return res.json();
  },

  async deleteTask(taskId: number) {
    const token = localStorage.getItem('access_token');
    console.log("Using Token:", token); // Debug log to see if token is missing

    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to delete task: ${res.status} ${res.statusText}`);
    }
  },

  async completeTask(taskId: number) {
    const token = localStorage.getItem('access_token');
    console.log("Using Token:", token); // Debug log to see if token is missing

    const res = await fetch(
      `${API_BASE_URL}/tasks/${taskId}/complete`,
      {
        method: "PATCH",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to complete task: ${res.status} ${res.statusText}`);
    }
  },

  async updateTask(taskId: number, taskData: Partial<Task>) {
    const token = localStorage.getItem('access_token');
    console.log("Using Token:", token); // Debug log to see if token is missing

    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify(taskData),
    });

    if (!res.ok) {
      throw new Error(`Failed to update task: ${res.status} ${res.statusText}`);
    }

    return res.json();
  },
};
