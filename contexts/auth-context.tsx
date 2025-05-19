"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { getAuthService, type User, type UserRole } from "@/lib/auth-service"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hasPermission: (permission: string) => boolean
  hasRole: (role: UserRole | UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const authService = getAuthService()

  useEffect(() => {
    // Initialize auth state
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)

    // Subscribe to auth changes
    const unsubscribe = authService.subscribe((updatedUser) => {
      setUser(updatedUser)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      await authService.login(email, password)
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const logout = () => {
    authService.logout()
  }

  const hasPermission = (permission: string) => {
    return authService.hasPermission(permission)
  }

  const hasRole = (role: UserRole | UserRole[]) => {
    return authService.hasRole(role)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
