import { ProtectedRoute } from "@/components/protected-route"
import { BedAllotment } from "@/components/bed-allotment"
import { UserNav } from "@/components/user-nav"
import { MobileNav } from "@/components/mobile-nav"
import { StatusIndicator } from "@/components/status-indicator"
import Link from "next/link"
import { Stethoscope } from "lucide-react"

export default function BedsPage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Stethoscope className="h-6 w-6 text-primary" />
            <span>MediTrack EMR</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <StatusIndicator />
            <UserNav />
            <MobileNav />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Bed Management</h1>
              <p className="text-muted-foreground">View and allocate hospital beds for patients</p>
            </div>
          </div>

          <BedAllotment />
        </main>
      </div>
    </ProtectedRoute>
  )
}
