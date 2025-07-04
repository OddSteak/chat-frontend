'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { apiClient } from '@/lib/api'
import { useRetryConnection } from '@/hooks/useRetryConnection'
import { User } from '@/types/User'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: boolean
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  refetch: () => Promise<void>
  setShowNotifications: (silent: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children, initialShowNotifications = true }: { children: ReactNode, initialShowNotifications?: boolean }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [showNotifications, setShowNotifications] = useState(initialShowNotifications);
  const { retryState, startRetryLoop, stopRetryLoop } = useRetryConnection({showNotifications: showNotifications});

  // Only fetch user if we don't have user data
  useEffect(() => {
    if (!user && !loading) {
      fetchUser();
    }
  }, [])

  // Auto-start retry loop when there's an error
  useEffect(() => {
    if (error && !retryState.isRetrying) {
      setLoading(true);
      startRetryLoop(
        async () => {
          const data = await apiClient.get("/api/auth/me");
          return await data.json();
        },
        (data: any) => {
          showNotifications && console.log('Connection restored successfully!');
          setLoading(false);
          setUser(data.user);
          setError(false);
        },
        () => {
          showNotifications && console.log('Max retries reached. Please check your connection.')
          setLoading(false);
          setError(true);
        }
      );
    }

    return () => {
      stopRetryLoop();
    };
  }, [error]);

  // Listen for unauthorized events from apiClient
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null)
      setError(true)
    }

    window.addEventListener('unauthorized', handleUnauthorized)
    return () => window.removeEventListener('unauthorized', handleUnauthorized)
  }, [])

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get("/api/auth/me")
      const dat = await data.json()
      setUser(dat.user);
      setError(false);
    } catch (error) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      await apiClient.post("/api/auth/login", { username: username, password: password })
      await fetchUser(); // Fetch user data after successful login
      setLoading(false);
      console.log("fetched user data after login");
      return true;
    } catch (error) {
      console.error("Login error:", error)
      setLoading(false);
      setError(true);
      return false;
    }
  }

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      await apiClient.post("/api/auth/register", { username: username, email: email, password: password });
      await fetchUser(); // Fetch user data after successful login
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  }

  const logout = async () => {
    try {
      setLoading(true);
      await apiClient.post("/api/auth/logout", {});
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        refetch: fetchUser,
        setShowNotifications
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
