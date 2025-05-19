"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { CreatePrescription } from "@/components/create-prescription"
import { ProtectedRoute } from "@/components/protected-route"
import Link from "next/link"

export default function NewPrescriptionPage() {
  const searchParams = useSearchParams()
  const patientId = searchParams.get("patient") || ""
  const [patientName, setPatientName] = useState("Patient")

  useEffect(() => {
    // In a real app, you would fetch the patient's name from your database
    if (patientId) {
      // Mock patient names - in a real app this would come from your database
      const mockPatientNames: Record<string, string> = {
        P12345: "Emma Wilson",
        P12346: "James Brown",
        P12347: "Sophia Martinez",
        P12348: "Michael Johnson",
        P12349: "Olivia Davis",
      }

      setPatientName(mockPatientNames[patientId] || "Unknown Patient")
    }
  }, [patientId])

  return (
    <ProtectedRoute requiredPermission="edit_records">
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex-1 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="outline" size="icon" asChild>
              <Link href={patientId ? `/patients/${patientId}` : "/patients"}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">New Prescription</h1>
              <p className="text-muted-foreground">
                {patientId ? `Creating prescription for ${patientName}` : "Create a new prescription"}
              </p>
            </div>
          </div>

          <CreatePrescription patientId={patientId} patientName={patientName} />
        </main>
      </div>
    </ProtectedRoute>
  )
}
