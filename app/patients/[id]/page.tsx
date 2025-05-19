"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  FileText,
  MoreHorizontal,
  Pill,
  Plus,
  Printer,
  Share2,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { getDBService } from "@/lib/db-service"

export default function PatientDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const patientId = params.id as string
  const [loading, setLoading] = useState(true)
  const [patient, setPatient] = useState<any>(null)
  const [records, setRecords] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const dbService = getDBService()

        // Load patient data
        const patientData = await dbService.getPatientById(patientId)
        if (patientData) {
          setPatient(patientData)
        } else {
          // If no data in IndexedDB, use mock data
          setPatient({
            id: patientId,
            name: "Emma Wilson",
            dateOfBirth: "1981-05-15",
            gender: "Female",
            contact: "+1 (555) 123-4567",
            address: "123 Main St, Anytown, USA",
            email: "emma.wilson@example.com",
            emergencyContact: "John Wilson (Husband) - +1 (555) 987-6543",
            bloodType: "A+",
            allergies: ["Penicillin", "Peanuts"],
            medicalConditions: ["Hypertension", "Asthma"],
            medications: ["Lisinopril 10mg", "Albuterol inhaler"],
            insuranceProvider: "Blue Cross Blue Shield",
            insuranceNumber: "BCBS123456789",
            lastVisit: "2023-05-10",
            status: "active",
            notes: "Patient is managing hypertension well with current medication.",
            createdAt: "2020-03-15T10:30:00Z",
            updatedAt: "2023-05-10T14:45:00Z",
          })
        }

        // Load medical records
        const recordsData = await dbService.getPatientMedicalRecords(patientId)
        if (recordsData && recordsData.length > 0) {
          setRecords(recordsData)
        } else {
          // Mock records data
          setRecords([
            {
              id: "R78901",
              patientId: patientId,
              type: "consultation",
              date: "2023-05-10",
              provider: "Dr. Smith",
              diagnosis: "Hypertension, well-controlled",
              treatment: "Continue current medication regimen",
              medications: ["Lisinopril 10mg"],
              notes: "Blood pressure readings: 128/82. Patient reports feeling well.",
              attachments: [],
              status: "complete",
              createdAt: "2023-05-10T14:30:00Z",
              updatedAt: "2023-05-10T14:45:00Z",
            },
            {
              id: "R78890",
              patientId: patientId,
              type: "lab",
              date: "2023-04-25",
              provider: "Dr. Johnson",
              diagnosis: "Routine blood work",
              treatment: "",
              medications: [],
              notes: "All values within normal range. Cholesterol slightly elevated but not concerning.",
              attachments: ["lab_results_04252023.pdf"],
              status: "complete",
              createdAt: "2023-04-25T10:15:00Z",
              updatedAt: "2023-04-25T16:30:00Z",
            },
            {
              id: "R78850",
              patientId: patientId,
              type: "prescription",
              date: "2023-03-15",
              provider: "Dr. Smith",
              diagnosis: "Hypertension",
              treatment: "Medication renewal",
              medications: ["Lisinopril 10mg"],
              notes: "90-day supply, 3 refills",
              attachments: [],
              status: "complete",
              createdAt: "2023-03-15T09:45:00Z",
              updatedAt: "2023-03-15T09:50:00Z",
            },
          ])
        }

        // Load appointments
        const appointmentsData = await dbService.getPatientAppointments(patientId)
        if (appointmentsData && appointmentsData.length > 0) {
          setAppointments(appointmentsData)
        } else {
          // Mock appointments data
          setAppointments([
            {
              id: "A5001",
              patientId: patientId,
              date: "2023-06-10",
              time: "09:00 AM",
              duration: "30 min",
              type: "Follow-up",
              mode: "in-person",
              provider: "Dr. Smith",
              notes: "Routine blood pressure check",
              status: "scheduled",
              createdAt: "2023-05-15T11:30:00Z",
              updatedAt: "2023-05-15T11:30:00Z",
            },
            {
              id: "A4980",
              patientId: patientId,
              date: "2023-05-10",
              time: "10:30 AM",
              duration: "30 min",
              type: "Check-up",
              mode: "in-person",
              provider: "Dr. Smith",
              notes: "Annual physical examination",
              status: "completed",
              createdAt: "2023-04-20T14:15:00Z",
              updatedAt: "2023-05-10T11:00:00Z",
            },
          ])
        }

        setLoading(false)
      } catch (error) {
        console.error("Error loading patient data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [patientId])

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading patient data...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Patient not found</h2>
          <p className="text-muted-foreground">The requested patient record does not exist</p>
          <Button className="mt-4" asChild>
            <Link href="/patients">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Patients
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // Calculate age from date of birth
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  const patientAge = calculateAge(patient.dateOfBirth)

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 p-4 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href="/patients">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{patient.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>{patient.id}</span>
              <span>•</span>
              <span>{patientAge} years</span>
              <span>•</span>
              <span>{patient.gender}</span>
              <Badge className="ml-2 capitalize">{patient.status}</Badge>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button size="sm" className="gap-1" asChild>
              <Link href={`/patients/${patientId}/edit`}>
                <Edit className="h-4 w-4" />
                Edit
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Date of Birth</div>
                      <div>{new Date(patient.dateOfBirth).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Blood Type</div>
                      <div>{patient.bloodType}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Contact</div>
                    <div>{patient.contact}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Email</div>
                    <div>{patient.email}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Address</div>
                    <div>{patient.address}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Emergency Contact</div>
                    <div>{patient.emergencyContact}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Medical Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Allergies</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {patient.allergies.length > 0 ? (
                        patient.allergies.map((allergy: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            {allergy}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">No known allergies</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Medical Conditions</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {patient.medicalConditions.length > 0 ? (
                        patient.medicalConditions.map((condition: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {condition}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">No medical conditions</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Current Medications</div>
                    <div className="flex flex-col gap-1 mt-1">
                      {patient.medications.length > 0 ? (
                        patient.medications.map((medication: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <Pill className="h-4 w-4 text-green-600" />
                            <span>{medication}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-muted-foreground">No current medications</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Insurance</div>
                    <div>{patient.insuranceProvider}</div>
                    <div className="text-sm text-muted-foreground">{patient.insuranceNumber}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                  <CardDescription>Last updated on {new Date(patient.updatedAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{patient.notes}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="records">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Medical Records</CardTitle>
                <Button asChild>
                  <Link href={`/records/new?patient=${patientId}`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Record
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {records.length > 0 ? (
                  <div className="space-y-4">
                    {records.map((record) => (
                      <div key={record.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <h3 className="font-medium">
                              {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                            </h3>
                            <Badge
                              variant="outline"
                              className={`
                              ${record.status === "complete" ? "bg-green-50 text-green-700 border-green-200" : ""}
                              ${record.status === "pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                              ${record.status === "incomplete" ? "bg-red-50 text-red-700 border-red-200" : ""}
                            `}
                            >
                              {record.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-2">
                          <div>
                            <div className="text-sm font-medium text-muted-foreground">Date</div>
                            <div>{new Date(record.date).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-muted-foreground">Provider</div>
                            <div>{record.provider}</div>
                          </div>
                        </div>
                        <div className="mb-2">
                          <div className="text-sm font-medium text-muted-foreground">Diagnosis</div>
                          <div>{record.diagnosis}</div>
                        </div>
                        {record.treatment && (
                          <div className="mb-2">
                            <div className="text-sm font-medium text-muted-foreground">Treatment</div>
                            <div>{record.treatment}</div>
                          </div>
                        )}
                        {record.medications && record.medications.length > 0 && (
                          <div className="mb-2">
                            <div className="text-sm font-medium text-muted-foreground">Medications</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {record.medications.map((medication: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200"
                                >
                                  {medication}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="mt-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/records/${record.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-2 text-lg font-medium">No Records</h3>
                    <p className="text-muted-foreground">This patient doesn't have any medical records yet.</p>
                    <Button className="mt-4" asChild>
                      <Link href={`/records/new?patient=${patientId}`}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Record
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Appointments</CardTitle>
                <Button asChild>
                  <Link href={`/appointments/new?patient=${patientId}`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule Appointment
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {appointments.length > 0 ? (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            <h3 className="font-medium">{appointment.type}</h3>
                            <Badge
                              variant="outline"
                              className={`
                              ${appointment.status === "scheduled" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                              ${appointment.status === "completed" ? "bg-green-50 text-green-700 border-green-200" : ""}
                              ${appointment.status === "cancelled" ? "bg-red-50 text-red-700 border-red-200" : ""}
                              ${appointment.status === "no-show" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                            `}
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-2">
                          <div>
                            <div className="text-sm font-medium text-muted-foreground">Date</div>
                            <div>{new Date(appointment.date).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-muted-foreground">Time</div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              {appointment.time} ({appointment.duration})
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-2">
                          <div>
                            <div className="text-sm font-medium text-muted-foreground">Provider</div>
                            <div>{appointment.provider}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-muted-foreground">Mode</div>
                            <div className="capitalize">{appointment.mode}</div>
                          </div>
                        </div>
                        {appointment.notes && (
                          <div className="mb-2">
                            <div className="text-sm font-medium text-muted-foreground">Notes</div>
                            <div>{appointment.notes}</div>
                          </div>
                        )}
                        <div className="mt-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/appointments/${appointment.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-2 text-lg font-medium">No Appointments</h3>
                    <p className="text-muted-foreground">This patient doesn't have any appointments scheduled.</p>
                    <Button className="mt-4" asChild>
                      <Link href={`/appointments/new?patient=${patientId}`}>
                        <Plus className="mr-2 h-4 w-4" />
                        Schedule First Appointment
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Medications</CardTitle>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Medication
                </Button>
              </CardHeader>
              <CardContent>
                {patient.medications.length > 0 ? (
                  <div className="space-y-4">
                    {patient.medications.map((medication: string, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Pill className="h-5 w-5 text-primary" />
                            <h3 className="font-medium">{medication}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Separator className="my-2" />
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium text-muted-foreground">Prescribed</div>
                            <div>March 15, 2023</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-muted-foreground">Refills</div>
                            <div>3 remaining</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Pill className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-2 text-lg font-medium">No Medications</h3>
                    <p className="text-muted-foreground">This patient isn't currently taking any medications.</p>
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Medication
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
