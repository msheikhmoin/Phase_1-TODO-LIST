"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, Calendar, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  setIsModalOpen?: (open: boolean) => void;
  selectedGradient?: string;
}

export function Sidebar({ setIsModalOpen, selectedGradient }: SidebarProps) {
  const pathname = usePathname();

  // Determine the background style based on the selected gradient
  const getSidebarBackground = () => {
    if (selectedGradient) {
      return `var(--gradient-${selectedGradient})`;
    }
    return undefined; // default background will be used
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/tasks", label: "Tasks", icon: Calendar },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="hidden md:block w-64 p-4">
      <div
        className={cn(
          "rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-lg p-4 h-full",
          selectedGradient ? "backdrop-blur-lg bg-white/30 dark:bg-gray-800/30" : "backdrop-blur-lg bg-white/80 dark:bg-gray-800/80"
        )}
        style={selectedGradient ? { backgroundImage: getSidebarBackground() } : {}}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TodoPro
          </h1>
        </div>

        <nav className="space-y-2">
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

          {/* Developer Credit */}
          <div className="mt-4 text-center">
            <p className="text-xs text-white/60 hover:text-white/80 transition-colors cursor-default">
              Built with ❤️ by Moin Sheikh
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}