"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function UnauthorizedPage() {
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
          <CardTitle className="text-2xl mt-4">Access Denied</CardTitle>
          <CardDescription>You don't have permission to access this page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user && (
            <p className="text-center text-muted-foreground">
              You are logged in as <span className="font-medium">{user.name}</span> with the role of{" "}
              <span className="font-medium capitalize">{user.role}</span>.
            </p>
          )}
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
