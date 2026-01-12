"use client";

import { useState, useEffect } from "react";
import { TaskCard } from "@/components/dashboard/task-card";
import { CreateTaskModal } from "@/components/dashboard/create-task-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { Task } from "@/types/task";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

/* =========================
   API RESPONSE TYPE
========================= */
type TaskApiResponse =
  | Task[]
  | {
      tasks?: Task[];
      data?: Task[];
    };

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  // FIX: Added missing state for modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* =========================
      FETCH TASKS (NO any ❌)
  ========================= */
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const response = (await apiClient.getTasks()) as TaskApiResponse;

      let list: Task[] = [];

      if (Array.isArray(response)) {
        list = response;
      } else if (Array.isArray(response.tasks)) {
        list = response.tasks;
      } else if (Array.isArray(response.data)) {
        list = response.data;
      }

      setTasks(list);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
      INITIAL LOAD
  ========================= */
  useEffect(() => {
    fetchTasks();
  }, []);

  /* =========================
      SEARCH FILTER
  ========================= */
  useEffect(() => {
    if (!searchTerm) {
      setFilteredTasks(tasks);
      return;
    }

    const result = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredTasks(result);
  }, [tasks, searchTerm]);

  /* =========================
      CREATE TASK
  ========================= */
  const handleCreateTask = async (
    newTask: Omit<Task, "id" | "created_at" | "updated_at" | "created_by">
  ) => {
    try {
      await apiClient.createTask(newTask);
      await fetchTasks();
      // Logic for modal close
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  };

  /* =========================
      DELETE TASK
  ========================= */
  const handleDeleteTask = async (taskId: number) => {
    try {
      await apiClient.deleteTask(taskId);
      await fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  /* =========================
      COMPLETE TASK
  ========================= */
  const handleCompleteTask = async (taskId: number) => {
    try {
      await apiClient.completeTask(taskId);
      await fetchTasks();
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Failed to complete task");
    }
  };

  /* =========================
      UI
  ========================= */
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-white/80 mt-1">
            Manage your tasks and stay organized
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button onClick={() => window.dispatchEvent(new CustomEvent('open-task-modal'))}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(
              (task) =>
                task.id && (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={(task) => window.dispatchEvent(new CustomEvent('edit-task-modal', { detail: task }))}
                    onDelete={handleDeleteTask}
                    onComplete={handleCompleteTask}
                  />
                )
            )
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
              <Button variant="outline" onClick={() => window.dispatchEvent(new CustomEvent('open-task-modal'))}>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}