// src/lib/api-client.ts
import { getAuthHeaders } from './auth-client';

// Hum ensures kar rahe hain ke URL ke aakhir mein slash na ho
const BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export const apiClient = {
  async getTasks() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const url = `${BASE}/tasks/`; // Backend aksar aakhir mein slash mangta hai
    
    console.log("Fetching from:", url);

    const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );

    if (!res.ok) throw new Error(`Failed to fetch tasks: ${res.status}`);
    const data = await res.json();
    
    // Multiple formats handling
    return data.tasks ? data.tasks : (Array.isArray(data.items) ? data.items : (Array.isArray(data) ? data : []));
  },

  async createTask(task: { title: string; description?: string; }) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const url = `${BASE}/tasks/`;

    const res = await fetch(url, {
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
      throw new Error(errorData.detail || "Failed to create task");
    }

    return res.json();
  },

  async deleteTask(taskId: number) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const res = await fetch(`${BASE}/tasks/${taskId}/`, { // Added trailing slash
      method: "DELETE",
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Failed to delete task`);
  },

  async completeTask(taskId: number) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const res = await fetch(`${BASE}/tasks/${taskId}/complete/`, { // Added trailing slash
      method: "PATCH",
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Failed to complete task`);
  }
};