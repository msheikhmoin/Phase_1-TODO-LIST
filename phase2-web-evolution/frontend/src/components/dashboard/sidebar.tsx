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
}

export function Sidebar({ setIsModalOpen, selectedGradient }: SidebarProps) {
  const pathname = usePathname();

  const getSidebarBackground = () => {
    if (selectedGradient) return `var(--gradient-${selectedGradient})`;
    return undefined;
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/tasks", label: "Tasks", icon: Calendar },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const SidebarContent = () => (
    <div
      className={cn(
        "rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-lg p-4 h-full flex flex-col",
        selectedGradient ? "backdrop-blur-lg bg-white/30 dark:bg-gray-800/30" : "backdrop-blur-lg bg-white/80 dark:bg-gray-800/80"
      )}
      style={selectedGradient ? { backgroundImage: getSidebarBackground() } : {}}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          TodoPro
        </h1>
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-blue-100/70 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200/50"
                    : "hover:bg-gray-100/70 dark:hover:bg-gray-700/70"
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8">
        <Button
          onClick={() => setIsModalOpen?.(true)}
          className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Task
        </Button>
        <div className="mt-4 text-center">
          <p className="text-xs text-white/60">Built with ❤️ by Moin Sheikh</p>
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
            <Button variant="outline" size="icon" className="rounded-full shadow-md bg-white dark:bg-gray-800">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-4 w-72 bg-transparent border-none">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}