"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/contexts/auth-context"

export function StatusIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "pending">("synced")
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) return

    // Check initial online status
    setIsOnline(navigator.onLine)

    // Add event listeners for online/offline status
    const handleOnline = () => {
      setIsOnline(true)
      setSyncStatus("syncing")

      // Simulate sync process
      setTimeout(() => {
        setSyncStatus("synced")
      }, 2000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setSyncStatus("pending")
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [isAuthenticated])

  if (!isAuthenticated) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge
            variant={isOnline ? "default" : "outline"}
            className={`gap-1 ${isOnline ? "bg-green-600 hover:bg-green-700" : "text-yellow-600 border-yellow-600"}`}
          >
            {isOnline ? (
              <>
                <Wifi className="h-3 w-3" />
                {syncStatus === "synced" ? "Online" : "Syncing..."}
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3" />
                Offline Mode
              </>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {isOnline
            ? syncStatus === "synced"
              ? "All changes are synced to the server"
              : "Syncing changes to the server..."
            : "Working offline. Changes will sync when you reconnect."}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
