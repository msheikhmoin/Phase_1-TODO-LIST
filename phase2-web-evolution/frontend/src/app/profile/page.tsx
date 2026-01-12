"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<{ email: string; username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get user info from localStorage
    const token = localStorage.getItem('access_token');
    if (token) {
      // In a real implementation, you'd make an API call to get user info
      // For now, we'll get the user data from localStorage if available
      const storedUserData = localStorage.getItem('user_data');
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          setUser({ email: userData.email, username: userData.username });
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      } else {
        // Try to get user from global session data if available
        const storedToken = localStorage.getItem('access_token');
        if (storedToken) {
          // We can't extract user info from JWT token here, so we'll show a generic message
          setUser({ email: 'User Email', username: 'Username' });
        }
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-12">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : user ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Username</p>
                <p className="font-medium">{user.username}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div className="pt-4">
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full"
                >
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600">No user information available</p>
              <Button
                onClick={() => router.push('/login')}
                className="mt-4"
              >
                Go to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}