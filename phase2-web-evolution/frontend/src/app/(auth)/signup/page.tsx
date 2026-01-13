"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth-layout";
import { authClient } from "@/lib/auth-client"; 
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out. Please check your internet or backend status.'));
      }, 10000); // 10 seconds timeout
    });

    try {
      console.log('Connecting to:', `${process.env.NEXT_PUBLIC_API_URL}/auth/register`);

      const response = await (Promise.race([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
          method: "POST",
          mode: 'cors',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            username,
            password,
            full_name: fullName
          }),
        }),
        timeoutPromise
      ]) as any);

      const result = await response.json();

      if (!response.ok) {
        setError(result.detail || 'Registration failed');
      } else {
        router.push("/login");
      }
    } catch (err: any) {
      console.error('Signup Error:', err);
      setError(err instanceof Error ? err.message : "Failed to connect to backend server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" description="Sign up for a new account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="johndoe123"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="underline font-medium hover:text-primary">
          Log in
        </a>
      </div>
    </AuthLayout>
  );
}