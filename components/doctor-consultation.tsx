"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Search, User, FilterIcon as Filter2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { PermissionGate } from "@/components/permission-gate"

// Mock data for doctors
const mockDoctors = [
  {
    id: "DOC001",
    name: "Dr. Sarah Johnson",
    specialization: "Cardiology",
    experience: "15 years",
    avatar: "/placeholder.svg?height=40&width=40",
    availableDays: ["Monday", "Tuesday", "Thursday"],
    price: 150,
  },
  {
    id: "DOC002",
    name: "Dr. Michael Chen",
    specialization: "Neurology",
    experience: "12 years",
    avatar: "/placeholder.svg?height=40&width=40",
    availableDays: ["Monday", "Wednesday", "Friday"],
    price: 180,
  },
  {
    id: "DOC003",
    name: "Dr. Emily Rodriguez",
    specialization: "Pediatrics",
    experience: "8 years",
    avatar: "/placeholder.svg?height=40&width=40",
    availableDays: ["Tuesday", "Thursday", "Friday"],
    price: 120,
  },
  {
    id: "DOC004",
    name: "Dr. David Williams",
    specialization: "Orthopedics",
    experience: "20 years",
    avatar: "/placeholder.svg?height=40&width=40",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Friday"],
    price: 160,
  },
  {
    id: "DOC005",
    name: "Dr. Jessica Patel",
    specialization: "Dermatology",
    experience: "10 years",
    avatar: "/placeholder.svg?height=40&width=40",
    availableDays: ["Tuesday", "Wednesday", "Thursday"],
    price: 140,
  },
  {
    id: "DOC006",
    name: "Dr. Robert Thompson",
    specialization: "Gastroenterology",
    experience: "14 years",
    avatar: "/placeholder.svg?height=40&width=40",
    availableDays: ["Monday", "Wednesday", "Friday"],
    price: 170,
  },
  {
    id: "DOC007",
    name: "Dr. Amanda Wilson",
    specialization: "Endocrinology",
    experience: "9 years",
    avatar: "/placeholder.svg?height=40&width=40",
    availableDays: ["Monday", "Thursday", "Friday"],
    price: 155,
  },
  {
    id: "DOC008",
    name: "Dr. James Kim",
    specialization: "Pulmonology",
    experience: "16 years",
    avatar: "/placeholder.svg?height=40&width=40",
    availableDays: ["Tuesday", "Wednesday", "Thursday"],
    price: 165,
  },
]

// Mock time slots
const mockTimeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
]

// Mock specializations
const specializations = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "Gastroenterology",
  "Endocrinology",
  "Pulmonology",
]

interface DoctorConsultationProps {
  patientId?: string
  patientName?: string
}

export function DoctorConsultation({ patientId, patientName }: DoctorConsultationProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState<(typeof mockDoctors)[0] | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [activeTab, setActiveTab] = useState<string>("doctors")
  const [timeSlot, setTimeSlot] = useState<string>("")
  const [consultationType, setConsultationType] = useState<string>("in-person")
  const [reason, setReason] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredDoctors = mockDoctors.filter((doctor) => {
    const matchesSpecialization = specialization ? doctor.specialization === specialization : true
    const matchesSearch = searchQuery
      ? doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
      : true

    return matchesSpecialization && matchesSearch
  })

  // Get available time slots for selected date and doctor
  const getAvailableTimeSlots = () => {
    if (!selectedDoctor || !date) return []

    const day = format(date, "EEEE")
    if (!selectedDoctor.availableDays.includes(day)) return []

    // In a real app, you would fetch actual availability from the backend
    // For this demo, we'll randomly make some slots unavailable
    const availableSlots = mockTimeSlots.filter(() => Math.random() > 0.3)
    return availableSlots
  }

  const availableTimeSlots = getAvailableTimeSlots()

  const handleSelectDoctor = (doctor: (typeof mockDoctors)[0]) => {
    setSelectedDoctor(doctor)
    setActiveTab("scheduling")
  }

  const handleBookAppointment = () => {
    if (!selectedDoctor || !date || !timeSlot) return

    setIsSubmitting(true)

    // In a real app, you would send this data to your backend
    const appointmentData = {
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      patientId: patientId || "Unknown",
      patientName: patientName || "Unknown Patient",
      date: format(date, "yyyy-MM-dd"),
      time: timeSlot,
      type: consultationType,
      reason,
      status: "scheduled",
    }

    console.log("Booking appointment:", appointmentData)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/appointments")
    }, 1500)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Doctor Consultation Booking</CardTitle>
        <CardDescription>Find and schedule appointments with doctors</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="doctors">
              <User className="mr-2 h-4 w-4" /> Find Doctors
            </TabsTrigger>
            <TabsTrigger value="scheduling" disabled={!selectedDoctor}>
              <Clock className="mr-2 h-4 w-4" /> Schedule Appointment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="doctors" className="space-y-4">
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="md:w-2/3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search doctors by name or specialization"
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 md:w-1/3">
                <Filter2 className="h-4 w-4 text-muted-foreground" />
                <Select value={specialization} onValueChange={setSpecialization}>
                  <SelectTrigger>
                    <SelectValue placeholder="All specializations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All specializations</SelectItem>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              {filteredDoctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className="overflow-hidden cursor-pointer hover:border-primary"
                  onClick={() => handleSelectDoctor(doctor)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} />
                        <AvatarFallback>
                          {doctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{doctor.name}</h3>
                        <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                        <p className="text-sm">{doctor.experience} experience</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          ${doctor.price} per visit
                        </Badge>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectDoctor(doctor)
                          }}
                        >
                          Book Now
                        </Button>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Available on: {doctor.availableDays.join(", ")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredDoctors.length === 0 && (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">No doctors match your search criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="scheduling" className="space-y-6">
            {selectedDoctor && (
              <div className="space-y-6">
                <Card className="border-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={selectedDoctor.avatar || "/placeholder.svg"} alt={selectedDoctor.name} />
                        <AvatarFallback>
                          {selectedDoctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{selectedDoctor.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedDoctor.specialization}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            ${selectedDoctor.price} per visit
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDoctor(null)}
                            className="h-7 px-2 text-xs"
                          >
                            Change Doctor
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Select Date</Label>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="border rounded-md p-3"
                      disabled={(date) => {
                        const day = format(date, "EEEE")
                        return date < new Date() || !selectedDoctor.availableDays.includes(day)
                      }}
                    />
                    <div className="text-sm text-muted-foreground">
                      Only showing dates when the doctor is available.
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Available Time Slots</Label>
                      {availableTimeSlots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {availableTimeSlots.map((slot) => (
                            <Button
                              key={slot}
                              variant={timeSlot === slot ? "default" : "outline"}
                              className="h-10"
                              onClick={() => setTimeSlot(slot)}
                            >
                              {slot}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center border rounded-md">
                          <p className="text-muted-foreground">
                            No available slots for this date. Please select another date.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="consultation-type">Consultation Type</Label>
                      <Select value={consultationType} onValueChange={setConsultationType}>
                        <SelectTrigger id="consultation-type">
                          <SelectValue placeholder="Select consultation type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-person">In-Person</SelectItem>
                          <SelectItem value="video">Video Call</SelectItem>
                          <SelectItem value="phone">Phone Call</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason for Visit</Label>
                      <Textarea
                        id="reason"
                        placeholder="Briefly describe your symptoms or reason for consultation"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end border-t p-4">
        {activeTab === "scheduling" && (
          <PermissionGate permission="edit_appointments">
            <Button onClick={handleBookAppointment} disabled={!selectedDoctor || !date || !timeSlot || isSubmitting}>
              {isSubmitting ? "Processing..." : "Confirm Booking"}
            </Button>
          </PermissionGate>
        )}
      </CardFooter>
    </Card>
  )
}
