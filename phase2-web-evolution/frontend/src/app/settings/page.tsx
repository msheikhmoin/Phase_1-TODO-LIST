"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Bell, BellOff } from "lucide-react";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const applyGradient = (gradientType: string) => {
    // Apply the gradient to the body or a specific element
    document.body.style.background = `var(--gradient-${gradientType})`;
    document.body.style.backgroundClip = 'border-box';

    // Save the selected gradient to localStorage
    localStorage.setItem('selectedGradient', gradientType);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${theme === "dark" ? "bg-blue-500" : "bg-gray-200"}`}>
                  {theme === "dark" ? (
                    <Moon className="h-4 w-4 text-white" />
                  ) : (
                    <Sun className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-gray-500">Toggle dark/light theme</p>
                </div>
              </div>
              <Button
                type="button"
                variant={theme === "dark" ? "secondary" : "outline"}
                size="sm"
                onClick={toggleDarkMode}
              >
                {theme === "dark" ? "Light" : "Dark"}
              </Button>
            </div>

            {/* Professional Gradients */}
            <div className="p-4 border rounded-lg">
              <div className="mb-4">
                <h3 className="font-medium">Professional Gradients</h3>
                <p className="text-sm text-gray-500">Choose from premium gradient themes</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 bg-[var(--gradient-sunset)] text-white hover:opacity-90"
                  onClick={() => applyGradient('sunset')}
                >
                  Sunset
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 bg-[var(--gradient-ocean)] text-white hover:opacity-90"
                  onClick={() => applyGradient('ocean')}
                >
                  Ocean
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 bg-[var(--gradient-midnight)] text-white hover:opacity-90"
                  onClick={() => applyGradient('midnight')}
                >
                  Midnight
                </Button>
              </div>
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${notificationsEnabled ? "bg-blue-500" : "bg-gray-200"}`}>
                  {notificationsEnabled ? (
                    <Bell className="h-4 w-4 text-white" />
                  ) : (
                    <BellOff className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-sm text-gray-500">Enable/disable notifications</p>
                </div>
              </div>
              <Button
                type="button"
                variant={notificationsEnabled ? "secondary" : "outline"}
                size="sm"
                onClick={toggleNotifications}
              >
                {notificationsEnabled ? "On" : "Off"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}