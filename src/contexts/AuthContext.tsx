'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { apiClient } from '@/lib/api'

interface UserData {
  id: number
  email: string
  username: string
}

interface AuthContextType {
  user: UserData | null
  loading: boolean
  error: boolean
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  refetch: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchUser = async () => {
    try {
      setLoading(true)
      setError(false)
      const data = await apiClient.get("/api/auth/me")
      setUser(data.user)
    } catch (error) {
      console.error("Error fetching user:", error)
      setError(true)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      await apiClient.post("/api/auth/login", { username: username, password: password })
      await fetchUser() // Fetch user data after successful login
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
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
      await apiClient.post("/api/auth/logout", {})
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
    }
  }

  // Listen for unauthorized events from apiClient
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null)
      setError(true)
    }

    window.addEventListener('unauthorized', handleUnauthorized)
    return () => window.removeEventListener('unauthorized', handleUnauthorized)
  }, [])

  // Only fetch user if we don't have user data and we're not on login/signup pages
  useEffect(() => {
    fetchUser();
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        refetch: fetchUser
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
