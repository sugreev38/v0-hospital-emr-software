"use client"

import { useAuth } from "@/contexts/auth-context"

export function UserGreeting() {
  const { user } = useAuth()

  if (!user) return null

  return <span className="font-medium">{user.name}</span>
}
