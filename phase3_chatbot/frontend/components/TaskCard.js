'use client';
import { TrashIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';

export const TaskCard = ({ task, onDelete }) => {
  // Safety check for task object
  if (!task) {
    console.error("TaskCard received undefined/null task");
    return null;
  }

  // Debug log to check incoming data in Browser Console (F12)
  console.log("Rendering Task:", task);

  const formatDate = (dateValue) => {
    if (!dateValue) return 'No Date';
    try {
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? 'No Date' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return 'No Date';
    }
  };

  return (
    <div className="bg-black/20 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-4 mb-3 relative group shadow-[0_0_15px_rgba(52,211,153,0.1)] hover:border-emerald-400/60 transition-all">
      {/* DELETE BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if(window.confirm('Delete this task?')) onDelete(task.id); // Keeping task.id as it should match the backend
        }}
        className="absolute top-3 right-3 p-1.5 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors z-50"
      >
        <TrashIcon className="h-5 w-5" />
      </button>

      <h3 className="text-white font-bold text-lg pr-8">{task.title || "Untitled Task"}</h3>
      <p className="text-emerald-300/80 text-sm font-medium mt-1">{task.description}</p>

      <div className="flex items-center space-x-4 mt-4 text-[10px] uppercase tracking-wider text-emerald-400 font-black">
        <div className="flex items-center bg-emerald-500/10 px-2 py-1 rounded-md">
          <TagIcon className="h-3 w-3 mr-1" />
          {task.category || 'General'}
        </div>
        <div className="flex items-center bg-emerald-500/10 px-2 py-1 rounded-md">
          <CalendarIcon className="h-3 w-3 mr-1" />
          {formatDate(task.deadline || task.date)}
        </div>
      </div>
    </div>
  );
};