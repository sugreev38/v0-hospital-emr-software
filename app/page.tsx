import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Calendar, FileText, Users, Stethoscope, BarChart3, Settings, UserCog } from "lucide-react"
import { StatusIndicator } from "@/components/status-indicator"
import { RecentPatients } from "@/components/recent-patients"
import { UpcomingAppointments } from "@/components/upcoming-appointments"
import { StatsCards } from "@/components/stats-cards"
import { ProtectedRoute } from "@/components/protected-route"
import { UserNav } from "@/components/user-nav"
import { PermissionGate } from "@/components/permission-gate"
import { MobileNav } from "@/components/mobile-nav"
import { UserGreeting } from "@/components/user-greeting"

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Stethoscope className="h-6 w-6 text-primary" />
            <span>MediTrack EMR</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium ml-6">
            <Link href="/" className="text-primary">
              Dashboard
            </Link>
            <PermissionGate permission="view_patients">
              <Link href="/patients" className="text-muted-foreground hover:text-primary">
                Patients
              </Link>
            </PermissionGate>
            <PermissionGate permission="view_appointments">
              <Link href="/appointments" className="text-muted-foreground hover:text-primary">
                Appointments
              </Link>
            </PermissionGate>
            <PermissionGate permission="view_records">
              <Link href="/records" className="text-muted-foreground hover:text-primary">
                Medical Records
              </Link>
            </PermissionGate>
            <PermissionGate role="admin">
              <Link href="/admin/users" className="text-muted-foreground hover:text-primary">
                User Management
              </Link>
            </PermissionGate>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <StatusIndicator />
            <UserNav />
            <MobileNav />
          </div>
        </header>
        <div className="flex flex-1">
          <aside className="hidden w-[200px] flex-col border-r bg-muted/40 md:flex">
            <nav className="grid gap-2 p-4 text-sm font-medium">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <Activity className="h-4 w-4" />
                Dashboard
              </Link>
              <PermissionGate permission="view_patients">
                <Link
                  href="/patients"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Users className="h-4 w-4" />
                  Patients
                </Link>
              </PermissionGate>
              <PermissionGate permission="view_appointments">
                <Link
                  href="/appointments"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Calendar className="h-4 w-4" />
                  Appointments
                </Link>
              </PermissionGate>
              <PermissionGate permission="view_records">
                <Link
                  href="/records"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <FileText className="h-4 w-4" />
                  Medical Records
                </Link>
              </PermissionGate>
              <PermissionGate permission="view_all">
                <Link
                  href="/analytics"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Link>
              </PermissionGate>
              <PermissionGate role="admin">
                <Link
                  href="/admin/users"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <UserCog className="h-4 w-4" />
                  User Management
                </Link>
              </PermissionGate>
              <Link
                href="/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </nav>
          </aside>
          <main className="flex-1 p-4 md:p-6">
            <div className="grid gap-6">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, <UserGreeting />
                </p>
              </div>

              <StatsCards />

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <PermissionGate permission="view_patients">
                  <Card className="md:col-span-1 lg:col-span-4">
                    <CardHeader>
                      <CardTitle>Recent Patients</CardTitle>
                      <CardDescription>You have seen 12 patients this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RecentPatients />
                    </CardContent>
                  </Card>
                </PermissionGate>
                <PermissionGate permission="view_appointments">
                  <Card className="md:col-span-1 lg:col-span-3">
                    <CardHeader>
                      <CardTitle>Upcoming Appointments</CardTitle>
                      <CardDescription>You have 8 appointments scheduled today</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <UpcomingAppointments />
                    </CardContent>
                  </Card>
                </PermissionGate>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
