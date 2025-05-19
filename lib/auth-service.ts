"use client"
import { jwtDecode } from "jwt-decode"

// Define user roles
export type UserRole = "admin" | "doctor" | "nurse" | "receptionist" | "lab_technician" | "pharmacist"

// Define user interface
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  department?: string
  specialization?: string
  avatar?: string
  permissions: string[]
}

// Define JWT payload
interface JWTPayload {
  sub: string
  email: string
  name: string
  role: UserRole
  permissions: string[]
  exp: number
}

// Mock users for demonstration
const MOCK_USERS = [
  {
    id: "user_1",
    email: "admin@hospital.com",
    password: "admin123", // In a real app, this would be hashed
    name: "Admin User",
    role: "admin" as UserRole,
    department: "Administration",
    permissions: ["manage_users", "manage_roles", "view_all", "edit_all"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user_2",
    email: "doctor@hospital.com",
    password: "doctor123",
    name: "Dr. Smith",
    role: "doctor" as UserRole,
    department: "Cardiology",
    specialization: "Cardiologist",
    permissions: [
      "view_patients",
      "edit_patients",
      "view_records",
      "edit_records",
      "view_appointments",
      "edit_appointments",
    ],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user_3",
    email: "nurse@hospital.com",
    password: "nurse123",
    name: "Nurse Johnson",
    role: "nurse" as UserRole,
    department: "General",
    permissions: ["view_patients", "view_records", "edit_records", "view_appointments"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user_4",
    email: "receptionist@hospital.com",
    password: "reception123",
    name: "Sarah Receptionist",
    role: "receptionist" as UserRole,
    department: "Front Desk",
    permissions: ["view_patients", "edit_patients", "view_appointments", "edit_appointments"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

// Permission mapping for roles
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ["manage_users", "manage_roles", "view_all", "edit_all"],
  doctor: ["view_patients", "edit_patients", "view_records", "edit_records", "view_appointments", "edit_appointments"],
  nurse: ["view_patients", "view_records", "edit_records", "view_appointments"],
  receptionist: ["view_patients", "edit_patients", "view_appointments", "edit_appointments"],
  lab_technician: ["view_patients", "view_records", "edit_records"],
  pharmacist: ["view_patients", "view_records", "view_prescriptions", "edit_prescriptions"],
}

class AuthService {
  private currentUser: User | null = null
  private token: string | null = null
  private listeners: Array<(user: User | null) => void> = []

  constructor() {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
      if (this.token) {
        try {
          const decoded = jwtDecode<JWTPayload>(this.token)
          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
            this.logout()
          } else {
            this.currentUser = {
              id: decoded.sub,
              email: decoded.email,
              name: decoded.name,
              role: decoded.role,
              permissions: decoded.permissions,
            }
          }
        } catch (error) {
          console.error("Failed to decode token:", error)
          this.logout()
        }
      }
    }
  }

  // Login method
  async login(email: string, password: string): Promise<User> {
    // In a real app, this would make an API call to validate credentials
    const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (!user) {
      throw new Error("Invalid email or password")
    }

    // Create a JWT token (in a real app, this would come from the server)
    const now = Math.floor(Date.now() / 1000)
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions,
      exp: now + 24 * 60 * 60, // 24 hours
    }

    // In a real app, this token would be signed by the server
    this.token = btoa(JSON.stringify(payload))

    // Store in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", this.token)
    }

    // Set current user
    this.currentUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      specialization: user.specialization,
      permissions: user.permissions,
      avatar: user.avatar,
    }

    // Notify listeners
    this.notifyListeners()

    return this.currentUser
  }

  // Logout method
  logout(): void {
    this.currentUser = null
    this.token = null

    // Remove from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }

    // Notify listeners
    this.notifyListeners()
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser
  }

  // Get token
  getToken(): string | null {
    return this.token
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.currentUser
  }

  // Check if user has a specific permission
  hasPermission(permission: string): boolean {
    if (!this.currentUser) return false

    // Admin has all permissions
    if (this.currentUser.role === "admin") return true

    return this.currentUser.permissions.includes(permission)
  }

  // Check if user has a specific role
  hasRole(role: UserRole | UserRole[]): boolean {
    if (!this.currentUser) return false

    if (Array.isArray(role)) {
      return role.includes(this.currentUser.role)
    }

    return this.currentUser.role === role
  }

  // Subscribe to auth changes
  subscribe(listener: (user: User | null) => void): () => void {
    this.listeners.push(listener)

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  // Notify all listeners
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.currentUser))
  }

  // Get all users (admin only)
  async getAllUsers(): Promise<User[]> {
    if (!this.hasRole("admin")) {
      throw new Error("Unauthorized")
    }

    // In a real app, this would make an API call
    return MOCK_USERS.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      specialization: user.specialization,
      permissions: user.permissions,
      avatar: user.avatar,
    }))
  }

  // Create a new user (admin only)
  async createUser(userData: Omit<User, "id"> & { password: string }): Promise<User> {
    if (!this.hasRole("admin")) {
      throw new Error("Unauthorized")
    }

    // In a real app, this would make an API call
    const newUser = {
      id: `user_${Date.now()}`,
      email: userData.email,
      password: userData.password,
      name: userData.name,
      role: userData.role,
      department: userData.department,
      specialization: userData.specialization,
      permissions: userData.permissions || ROLE_PERMISSIONS[userData.role],
      avatar: userData.avatar || "/placeholder.svg?height=40&width=40",
    }

    // Add to mock users (in a real app, this would be saved to the database)
    MOCK_USERS.push(newUser)

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      department: newUser.department,
      specialization: newUser.specialization,
      permissions: newUser.permissions,
      avatar: newUser.avatar,
    }
  }
}

// Create a singleton instance
let authServiceInstance: AuthService | null = null

export function getAuthService(): AuthService {
  if (!authServiceInstance) {
    authServiceInstance = new AuthService()
  }
  return authServiceInstance
}
