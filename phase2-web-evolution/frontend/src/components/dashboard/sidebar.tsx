"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, Calendar, Settings, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface SidebarProps {
  setIsModalOpen?: (open: boolean) => void;
  selectedGradient?: string;
  activeView?: 'tasks' | 'chat';
  setActiveView?: (view: 'tasks' | 'chat') => void;
}

export function Sidebar({ setIsModalOpen, selectedGradient, activeView, setActiveView }: SidebarProps) {
  const pathname = usePathname();

  const getSidebarBackground = () => {
    if (selectedGradient) return `var(--gradient-${selectedGradient})`;
    return undefined;
  };

  const navItems = [
    {
      id: 'tasks',
      label: "My Tasks",
      icon: Calendar,
      onClick: () => setActiveView?.('tasks')
    },
    {
      id: 'chat',
      label: "AI Assistant",
      icon: Home,
      onClick: () => setActiveView?.('chat')
    },
  ];

  const SidebarContent = () => (
    <div
      className={cn(
        "rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-lg p-4 h-full flex flex-col bg-gradient-to-b from-slate-800/90 to-slate-900/90 backdrop-blur-xl",
        selectedGradient ? "bg-slate-800/30 dark:bg-slate-900/30" : ""
      )}
      style={selectedGradient ? { backgroundImage: getSidebarBackground() } : {}}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          TodoPro AI
        </h1>
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={item.onClick}
              className={cn(
                "w-full justify-start rounded-xl transition-all duration-200",
                isActive
                  ? "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                  : "hover:bg-slate-700/50 text-slate-300"
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <div className="mt-auto pt-8">
        <Button
          onClick={() => setIsModalOpen?.(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Task
        </Button>
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-400">Powered by AI Assistant</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 p-4 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Trigger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full shadow-md bg-slate-800 dark:bg-slate-800 text-white">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-4 w-72 bg-slate-900 border-slate-700">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}