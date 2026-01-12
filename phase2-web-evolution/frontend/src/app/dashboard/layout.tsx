"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { CreateTaskModal } from "@/components/dashboard/create-task-modal";
import { Task } from "@/types/task";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedGradient, setSelectedGradient] = useState<string | undefined>(undefined);

  // Load the selected gradient from localStorage on initial render
  useEffect(() => {
    const savedGradient = localStorage.getItem('selectedGradient');
    if (savedGradient) {
      setSelectedGradient(savedGradient);
    }
  }, []);

  const handleCreateTask = async (
    newTask: Omit<Task, "id" | "created_at" | "updated_at" | "created_by">
  ) => {
    try {
      await apiClient.createTask(newTask);
      setIsModalOpen(false);
      setEditingTask(null); // Reset editing task
      toast.success("Task created successfully");
      // Refresh the page to update tasks - the dashboard will handle its own refetching
      window.location.reload();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!editingTask?.id) return;

    try {
      await apiClient.updateTask(editingTask.id, taskData);
      setIsModalOpen(false);
      setEditingTask(null); // Reset editing task
      toast.success("Task updated successfully");
      // Refresh the page to update tasks - the dashboard will handle its own refetching
      window.location.reload();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  // Listen for custom event to open modal from anywhere in the dashboard
  useEffect(() => {
    const handleOpenModal = () => {
      setEditingTask(null); // Reset editing task when opening for creation
      setIsModalOpen(true);
    };

    window.addEventListener('open-task-modal', handleOpenModal);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('open-task-modal', handleOpenModal);
    };
  }, []);

  // Listen for custom event to open modal in edit mode
  useEffect(() => {
    const handleEditTask = (e: Event) => {
      const customEvent = e as CustomEvent;
      const task = customEvent.detail;
      setEditingTask(task);
      setIsModalOpen(true);
    };

    window.addEventListener('edit-task-modal', handleEditTask);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('edit-task-modal', handleEditTask);
    };
  }, []);

  return (
    <div className="flex h-screen bg-transparent">
      <Sidebar setIsModalOpen={setIsModalOpen} selectedGradient={selectedGradient} />
      <main className="flex-1 overflow-auto pt-4 pb-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
      <CreateTaskModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCreate={handleCreateTask}
        onUpdate={handleUpdateTask}
        editingTask={editingTask}
      />
    </div>
  );
}