"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { PrescriptionView } from "@/components/prescription-view"
import { Skeleton } from "@/components/ui/skeleton"

export default function PrescriptionPage() {
  const params = useParams()
  const prescriptionId = params.id as string
  const [loading, setLoading] = useState(true)
  const [prescription, setPrescription] = useState<any>(null)

  useEffect(() => {
    // In a real app, you would fetch the prescription data from your API
    const fetchPrescription = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock prescription data
        setPrescription({
          id: prescriptionId,
          patientId: "P12345",
          patientName: "Emma Wilson",
          date: new Date().toISOString(),
          diagnosis: "Acute bronchitis with secondary bacterial infection",
          medications: [
            {
              id: "med1",
              name: "Amoxicillin",
              dose: "500mg",
              frequency: "Every 8 hours",
              duration: "7 days",
              instructions: "Take with food",
            },
            {
              id: "med2",
              name: "Guaifenesin",
              dose: "400mg",
              frequency: "Every 12 hours",
              duration: "5 days",
              instructions: "Take with plenty of water",
            },
          ],
          labOrders: [
            {
              id: "lab1",
              name: "Complete Blood Count (CBC)",
              code: "LAB001",
              price: 25.0,
              instructions: "Fasting not required",
            },
            {
              id: "lab2",
              name: "Chest X-Ray",
              code: "XR-CHEST",
              price: 120.0,
              instructions: "PA and lateral views",
            },
          ],
          followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          additionalNotes: "Rest recommended. Increase fluid intake. Contact if symptoms worsen or fever develops.",
          status: "active",
          barcode: prescriptionId,
          doctorName: "Dr. Sarah Johnson",
        })
      } catch (error) {
        console.error("Error fetching prescription:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPrescription()
  }, [prescriptionId])

  return (
    <ProtectedRoute requiredPermission="view_records">
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex-1 p-4 md:p-6">
          {loading ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-6 w-64" />
                  <Skeleton className="h-4 w-40 mt-2" />
                </div>
              </div>
              <Skeleton className="h-[500px] w-full mt-6" />
            </div>
          ) : prescription ? (
            <PrescriptionView data={prescription} />
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px]">
              <h2 className="text-xl font-semibold">Prescription not found</h2>
              <p className="text-muted-foreground">The requested prescription does not exist</p>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
