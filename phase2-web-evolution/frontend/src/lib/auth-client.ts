// Custom auth client to work with the existing backend API
// Since the backend doesn't use Better Auth, we'll create our own client

// Define types for our auth responses
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

interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

// Global state for session
let globalSessionData: { user: User } | null = null;

export const authClient = {
  signUp: {
    email: async (data: { email: string; password: string; name: string; username?: string }) => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            username: data.username || data.name || data.email.split('@')[0], // Use provided username, or name, or derive from email
            password: data.password,
            full_name: data.name
          }),
        });

        const result: LoginResponse = await response.json();

        if (!response.ok) {
          // Handle error response
          const errorDetail = result['detail'] || 'Registration failed';
          return {
            data: null,
            error: { message: errorDetail }
          };
        }

        // Store tokens in localStorage
        localStorage.setItem('access_token', result.tokens.access_token);
        localStorage.setItem('refresh_token', result.tokens.refresh_token);

        // Update global session data
        globalSessionData = { user: result.user };

        return { data: result, error: null };
      } catch (error) {
        return {
          data: null,
          error: { message: (error as Error).message || 'Network error' }
        };
      }
    }
  },
  signIn: {
    email: async (data: { email: string; password: string }) => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        });

        const result: LoginResponse = await response.json();

        if (!response.ok) {
          // Handle error response
          const errorDetail = result['detail'] || 'Login failed';
          return {
            data: null,
            error: { message: errorDetail }
          };
        }

        // Store tokens in localStorage
        localStorage.setItem('access_token', result.tokens.access_token);
        localStorage.setItem('refresh_token', result.tokens.refresh_token);

        // Update global session data
        globalSessionData = { user: result.user };

        return { data: result, error: null };
      } catch (error) {
        return {
          data: null,
          error: { message: (error as Error).message || 'Network error' }
        };
      }
    }
  },
  signOut: async () => {
    try {
      // Clear tokens from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      // Clear global session data
      globalSessionData = null;

      return { data: null, error: null };
    } catch (error) {
      return { data: null, error: { message: (error as Error).message || 'Error during logout' } };
    }
  },
  useSession: () => {
    // Check if we have a token in localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    // If we have a token and global session data, return it
    if (token && globalSessionData) {
      return {
        data: globalSessionData,
        isPending: false,
        isLoading: false
      };
    }

    // If we have a token but no cached session data, we need to get user info
    // For now, we'll return a loading state and would typically make an API call to get user info
    if (token) {
      // In a real implementation, you'd make an API call to get user info
      // For now, return a basic session object
      return {
        data: null,
        isPending: true,
        isLoading: true
      };
    }

    // No token, no session
    return {
      data: null,
      isPending: false,
      isLoading: false
    };
  }
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Ye exports zaroori hain taake Navbar aur Pages mein error na aaye
export const { useSession, signIn, signUp, signOut } = authClient;