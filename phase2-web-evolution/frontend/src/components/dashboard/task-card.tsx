import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Calendar, Clock, User, Pencil, Trash2 } from "lucide-react";
import { Task } from "@/types/task";
import { toast } from "sonner";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: number) => void;
  onComplete?: (taskId: number) => void;
}

export function TaskCard({ task, onEdit, onDelete, onComplete }: TaskCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "urgent":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400";
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      onDelete?.(task.id);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {task.title}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onEdit?.(task)}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {task.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={`${getStatusColor(task.status)} rounded-full px-3 py-1 text-xs font-medium`}>
            {task.status.replace(/_/g, ' ').toUpperCase()}
          </Badge>
          <Badge className={`${getPriorityColor(task.priority)} rounded-full px-3 py-1 text-xs font-medium`}>
            {task.priority.toUpperCase()}
          </Badge>
        </div>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
          {task.due_date && (
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{new Date(task.due_date).toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span>{new Date(task.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onComplete?.(task.id)}
          disabled={task.status === "completed"}
        >
          {task.status === "completed" ? "Completed" : "Mark Complete"}
        </Button>
        <div className="flex gap-2">
          <Button
            variant="edit"
            size="sm"
            onClick={() => onEdit?.(task)}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="delete"
            size="sm"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}