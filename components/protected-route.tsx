"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import type { UserRole } from "@/lib/auth-service"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: string
  requiredRole?: UserRole | UserRole[]
}

export function ProtectedRoute({ children, requiredPermission, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasPermission, hasRole } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store the intended destination for redirect after login
      if (typeof window !== "undefined") {
        sessionStorage.setItem("redirectAfterLogin", pathname)
      }
      router.push("/login")
      return
    }

    if (!isLoading && isAuthenticated) {
      // Check permission if required
      if (requiredPermission && !hasPermission(requiredPermission)) {
        router.push("/unauthorized")
        return
      }

      // Check role if required
      if (requiredRole && !hasRole(requiredRole)) {
        router.push("/unauthorized")
        return
      }
    }
  }, [isLoading, isAuthenticated, pathname, router, requiredPermission, requiredRole, hasPermission, hasRole])

  // Show loading state
  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  // If not authenticated, don't render children
  if (!isAuthenticated) {
    return null
  }

  // If permission check fails, don't render children
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null
  }

  // If role check fails, don't render children
  if (requiredRole && !hasRole(requiredRole)) {
    return null
  }

  // Otherwise, render children
  return <>{children}</>
}
