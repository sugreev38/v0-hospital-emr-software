"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import type { UserRole } from "@/lib/auth-service"

interface PermissionGateProps {
  children: React.ReactNode
  permission?: string
  role?: UserRole | UserRole[]
  fallback?: React.ReactNode
}

export function PermissionGate({ children, permission, role, fallback = null }: PermissionGateProps) {
  const { hasPermission, hasRole } = useAuth()

  // Check permission if specified
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>
  }

  // Check role if specified
  if (role && !hasRole(role)) {
    return <>{fallback}</>
  }

  // If all checks pass, render children
  return <>{children}</>
}
