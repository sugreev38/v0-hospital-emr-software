"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Stethoscope, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await login(email, password)

      // Check if there's a redirect URL stored
      const redirectUrl = sessionStorage.getItem("redirectAfterLogin") || "/"
      sessionStorage.removeItem("redirectAfterLogin")

      router.push(redirectUrl)
    } catch (err) {
      setError("Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Stethoscope className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">MediTrack EMR</CardTitle>
          <CardDescription>Enter your credentials to access the system</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <div className="w-full">
            <p>Demo Accounts:</p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              <div>
                <p className="font-semibold">Admin</p>
                <p>admin@hospital.com</p>
                <p>admin123</p>
              </div>
              <div>
                <p className="font-semibold">Doctor</p>
                <p>doctor@hospital.com</p>
                <p>doctor123</p>
              </div>
              <div>
                <p className="font-semibold">Nurse</p>
                <p>nurse@hospital.com</p>
                <p>nurse123</p>
              </div>
              <div>
                <p className="font-semibold">Receptionist</p>
                <p>receptionist@hospital.com</p>
                <p>reception123</p>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
