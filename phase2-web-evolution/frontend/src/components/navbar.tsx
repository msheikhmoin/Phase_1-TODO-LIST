"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client"; // Naya rasta

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Naye version mein hooks is tarah use hote hain
  const session = authClient.useSession();
  const userData = session.data;
  const isPending = session.isPending;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state during SSR to prevent hydration errors
  if (!mounted) {
    return (
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">TodoPro</span>
          </Link>
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">TodoPro</span>
        </Link>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {userData?.user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm hidden sm:inline-block">
                {userData.user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await authClient.signOut(); // Updated signout call
                  window.location.href = "/login";
                }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}