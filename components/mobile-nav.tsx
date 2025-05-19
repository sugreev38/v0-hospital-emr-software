"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import {
  Activity,
  Calendar,
  FileText,
  Users,
  Stethoscope,
  BarChart3,
  Settings,
  UserCog,
  Bed,
  CalendarClock,
  QrCode,
} from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { hasPermission, hasRole } = useAuth()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <div className="flex items-center gap-2 font-semibold py-4">
          <Stethoscope className="h-6 w-6 text-primary" />
          <span>MediTrack EMR</span>
        </div>
        <nav className="grid gap-2 py-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
              pathname === "/" ? "bg-primary/10 text-primary" : "text-muted-foreground"
            } transition-all hover:text-primary`}
          >
            <Activity className="h-4 w-4" />
            Dashboard
          </Link>
          {hasPermission("view_patients") && (
            <Link
              href="/patients"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                pathname.startsWith("/patients") ? "bg-primary/10 text-primary" : "text-muted-foreground"
              } transition-all hover:text-primary`}
            >
              <Users className="h-4 w-4" />
              Patients
            </Link>
          )}
          {hasPermission("view_appointments") && (
            <Link
              href="/appointments"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                pathname.startsWith("/appointments") ? "bg-primary/10 text-primary" : "text-muted-foreground"
              } transition-all hover:text-primary`}
            >
              <Calendar className="h-4 w-4" />
              Appointments
            </Link>
          )}
          {hasPermission("view_records") && (
            <Link
              href="/records"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                pathname.startsWith("/records") ? "bg-primary/10 text-primary" : "text-muted-foreground"
              } transition-all hover:text-primary`}
            >
              <FileText className="h-4 w-4" />
              Medical Records
            </Link>
          )}
          <Link
            href="/prescriptions/new"
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
              pathname.startsWith("/prescriptions") ? "bg-primary/10 text-primary" : "text-muted-foreground"
            } transition-all hover:text-primary`}
          >
            <FileText className="h-4 w-4" />
            Prescriptions
          </Link>
          <Link
            href="/beds"
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
              pathname.startsWith("/beds") ? "bg-primary/10 text-primary" : "text-muted-foreground"
            } transition-all hover:text-primary`}
          >
            <Bed className="h-4 w-4" />
            Bed Management
          </Link>
          <Link
            href="/book-consultation"
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
              pathname.startsWith("/book-consultation") ? "bg-primary/10 text-primary" : "text-muted-foreground"
            } transition-all hover:text-primary`}
          >
            <CalendarClock className="h-4 w-4" />
            Book Consultation
          </Link>
          <Link
            href="/scan"
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
              pathname.startsWith("/scan") ? "bg-primary/10 text-primary" : "text-muted-foreground"
            } transition-all hover:text-primary`}
          >
            <QrCode className="h-4 w-4" />
            Scan Barcode
          </Link>
          {hasPermission("view_all") && (
            <Link
              href="/analytics"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                pathname.startsWith("/analytics") ? "bg-primary/10 text-primary" : "text-muted-foreground"
              } transition-all hover:text-primary`}
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Link>
          )}
          {hasRole("admin") && (
            <Link
              href="/admin/users"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                pathname.startsWith("/admin") ? "bg-primary/10 text-primary" : "text-muted-foreground"
              } transition-all hover:text-primary`}
            >
              <UserCog className="h-4 w-4" />
              User Management
            </Link>
          )}
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
              pathname.startsWith("/settings") ? "bg-primary/10 text-primary" : "text-muted-foreground"
            } transition-all hover:text-primary`}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
