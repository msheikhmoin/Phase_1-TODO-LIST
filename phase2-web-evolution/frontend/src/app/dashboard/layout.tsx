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

  useEffect(() => {
    const savedGradient = localStorage.getItem('selectedGradient');
    if (savedGradient) setSelectedGradient(savedGradient);
  }, []);

  const handleCreateTask = async (newTask: Omit<Task, "id" | "created_at" | "updated_at" | "created_by">) => {
    try {
      await apiClient.createTask(newTask);
      setIsModalOpen(false);
      setEditingTask(null);
      toast.success("Task created successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!editingTask?.id) return;
    try {
      await apiClient.updateTask(editingTask.id, taskData);
      setIsModalOpen(false);
      setEditingTask(null);
      toast.success("Task updated successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  useEffect(() => {
    const handleOpenModal = () => { setIsModalOpen(true); setEditingTask(null); };
    const handleEditTask = (e: any) => { setEditingTask(e.detail); setIsModalOpen(true); };
    
    window.addEventListener('open-task-modal', handleOpenModal);
    window.addEventListener('edit-task-modal', handleEditTask);
    return () => {
      window.removeEventListener('open-task-modal', handleOpenModal);
      window.removeEventListener('edit-task-modal', handleEditTask);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar setIsModalOpen={setIsModalOpen} selectedGradient={selectedGradient} />
      <main className="flex-1 overflow-auto pt-16 md:pt-4 pb-8 px-4 md:px-8">
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