// Custom auth client to work with the existing backend API
interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  is_active: boolean;
  is_verified: boolean;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface LoginResponse {
  user: User;
  tokens: TokenResponse;
}

// Global state for session
let globalSessionData: { user: User } | null = null;

// Backend URL from Environment Variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const authClient = {
  signUp: {
    email: async (data: { email: string; password: string; name: string; username?: string }) => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            username: data.username || data.name || data.email.split('@')[0],
            password: data.password,
            full_name: data.name
          }),
        });

        const result = await response.json();
        if (!response.ok) return { data: null, error: { message: result.detail || 'Registration failed' } };

        localStorage.setItem('access_token', result.tokens.access_token);
        localStorage.setItem('refresh_token', result.tokens.refresh_token);
        globalSessionData = { user: result.user };
        return { data: result, error: null };
      } catch (error) {
        return { data: null, error: { message: 'Network error' } };
      }
    }
  },
  signIn: {
    email: async (data: { email: string; password: string }) => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        });

        const result = await response.json();
        if (!response.ok) return { data: null, error: { message: result.detail || 'Login failed' } };

        localStorage.setItem('access_token', result.tokens.access_token);
        localStorage.setItem('refresh_token', result.tokens.refresh_token);
        globalSessionData = { user: result.user };
        return { data: result, error: null };
      } catch (error) {
        return { data: null, error: { message: 'Network error' } };
      }
    }
  },
  signOut: async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    globalSessionData = null;
    return { data: null, error: null };
  },
  useSession: () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token && globalSessionData) return { data: globalSessionData, isPending: false, isLoading: false };
    if (token) return { data: null, isPending: true, isLoading: true };
    return { data: null, isPending: false, isLoading: false };
  }
};

export const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
};

export const { useSession, signIn, signUp, signOut } = authClient;