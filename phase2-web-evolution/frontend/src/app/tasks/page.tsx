"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCard } from "@/components/dashboard/task-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

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
     DELETE TASK
  ========================= */
  const handleDeleteTask = async (taskId: number) => {
    try {
      await apiClient.deleteTask(taskId);
      await fetchTasks();
      toast.success("Task deleted successfully");
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
      toast.success("Task completed successfully");
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Failed to complete task");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
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
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium">No tasks found</h3>
                  <p className="text-gray-500 mt-1">Try adjusting your search</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}