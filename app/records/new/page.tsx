"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Calendar, Upload } from "lucide-react"
import Link from "next/link"
import { getDBService } from "@/lib/db-service"

export default function NewRecordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const patientId = searchParams.get("patient") || ""

  const [formData, setFormData] = useState({
    patientId: patientId,
    type: "consultation",
    date: new Date().toISOString().split("T")[0],
    provider: "Dr. Smith",
    diagnosis: "",
    treatment: "",
    medications: [] as string[],
    notes: "",
    attachments: [] as string[],
    status: "complete",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Common medications for quick selection
  const commonMedications = [
    "Lisinopril 10mg",
    "Atorvastatin 20mg",
    "Metformin 500mg",
    "Levothyroxine 50mcg",
    "Amlodipine 5mg",
    "Albuterol inhaler",
    "Omeprazole 20mg",
    "Sertraline 50mg",
  ]

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleMedicationToggle = (medication: string) => {
    if (formData.medications.includes(medication)) {
      setFormData({
        ...formData,
        medications: formData.medications.filter((med) => med !== medication),
      })
    } else {
      setFormData({
        ...formData,
        medications: [...formData.medications, medication],
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const dbService = getDBService()
      const recordId = await dbService.saveMedicalRecord(formData)

      // Redirect to the record page
      router.push(`/records/${recordId}`)
    } catch (error) {
      console.error("Error saving record:", error)
      setIsSubmitting(false)
      // Show error message
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 p-4 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href={patientId ? `/patients/${patientId}` : "/records"}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">New Medical Record</h1>
            <p className="text-muted-foreground">
              {patientId ? `Creating record for patient ${patientId}` : "Create a new medical record"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Record Information</CardTitle>
              <CardDescription>Enter the details for this medical record</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!patientId && (
                <div className="grid gap-2">
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input
                    id="patientId"
                    placeholder="Enter patient ID"
                    value={formData.patientId}
                    onChange={(e) => handleChange("patientId", e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="type">Record Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select record type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="lab">Lab Results</SelectItem>
                    <SelectItem value="imaging">Imaging</SelectItem>
                    <SelectItem value="prescription">Prescription</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      className="pl-8"
                      value={formData.date}
                      onChange={(e) => handleChange("date", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="provider">Provider</Label>
                  <Input
                    id="provider"
                    placeholder="Doctor or provider name"
                    value={formData.provider}
                    onChange={(e) => handleChange("provider", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  placeholder="Enter diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) => handleChange("diagnosis", e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="treatment">Treatment</Label>
                <Textarea
                  id="treatment"
                  placeholder="Enter treatment details"
                  value={formData.treatment}
                  onChange={(e) => handleChange("treatment", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label>Medications</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {commonMedications.map((medication) => (
                    <div key={medication} className="flex items-center space-x-2">
                      <Checkbox
                        id={`medication-${medication}`}
                        checked={formData.medications.includes(medication)}
                        onCheckedChange={() => handleMedicationToggle(medication)}
                      />
                      <Label htmlFor={`medication-${medication}`} className="text-sm font-normal">
                        {medication}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid gap-2">
                <Label>Attachments</Label>
                <div className="border border-dashed rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">Drag and drop files here or click to browse</p>
                  <p className="text-xs text-muted-foreground">Supports images, PDFs, and documents up to 10MB</p>
                  <Button type="button" variant="outline" size="sm" className="mt-2">
                    Browse Files
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="incomplete">Incomplete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" asChild>
                <Link href={patientId ? `/patients/${patientId}` : "/records"}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Record"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </main>
    </div>
  )
}
