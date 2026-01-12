"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Task } from "@/types/task";

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => void;
  onUpdate?: (taskData: Partial<Task>) => void;
  editingTask?: Task | null;
}

export function CreateTaskModal({ open, onOpenChange, onCreate, onUpdate, editingTask }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [status, setStatus] = useState<"pending" | "in_progress" | "completed">("pending");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  // Update form fields when editingTask changes
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setDescription(editingTask.description || "");
      setPriority(editingTask.priority as "low" | "medium" | "high" | "urgent" || "medium");
      setStatus(editingTask.status as "pending" | "in_progress" | "completed" || "pending");

      // Parse due date from string to Date object
      if (editingTask.due_date) {
        setDueDate(new Date(editingTask.due_date));
      } else {
        setDueDate(undefined);
      }
    } else {
      // Reset form when not editing
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus("pending");
      setDueDate(undefined);
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const taskData = {
      title,
      description,
      priority,
      status,
      due_date: dueDate ? dueDate.toISOString() : undefined,
    };

    if (editingTask) {
      // Update existing task
      onUpdate?.({
        ...taskData,
        id: editingTask.id, // Include id for update
      });
    } else {
      // Create new task
      onCreate(taskData);
    }

    // Reset form
    if (!editingTask) {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus("pending");
      setDueDate(undefined);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-gray-200/60 dark:border-gray-700/60 shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {editingTask ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogDescription>
            {editingTask ? "Update the task details below." : "Add a new task to your dashboard. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
              className="bg-white/70 dark:bg-gray-700/70 border-gray-200/60 dark:border-gray-600/60"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description (optional)"
              className="bg-white/70 dark:bg-gray-700/70 border-gray-200/60 dark:border-gray-600/60 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger className="bg-white/70 dark:bg-gray-700/70 border-gray-200/60 dark:border-gray-600/60">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger className="bg-white/70 dark:bg-gray-700/70 border-gray-200/60 dark:border-gray-600/60">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white/70 dark:bg-gray-700/70 border-gray-200/60 dark:border-gray-600/60",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              {editingTask ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}