"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Video, Phone } from "lucide-react"
import Link from "next/link"

// Mock data for upcoming appointments
const appointments = [
  {
    id: "A5001",
    patientName: "Emma Wilson",
    patientId: "P12345",
    time: "09:00 AM",
    duration: "30 min",
    type: "Check-up",
    mode: "in-person",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "A5002",
    patientName: "Robert Garcia",
    patientId: "P12350",
    time: "10:00 AM",
    duration: "45 min",
    type: "Follow-up",
    mode: "video",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "A5003",
    patientName: "Sophia Martinez",
    patientId: "P12347",
    time: "11:30 AM",
    duration: "60 min",
    type: "Consultation",
    mode: "in-person",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "A5004",
    patientName: "David Lee",
    patientId: "P12351",
    time: "01:15 PM",
    duration: "30 min",
    type: "Follow-up",
    mode: "phone",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function UpcomingAppointments() {
  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={appointment.avatar || "/placeholder.svg"} alt={appointment.patientName} />
              <AvatarFallback>
                {appointment.patientName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{appointment.patientName}</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                {appointment.time} • {appointment.duration}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={appointment.mode === "in-person" ? "default" : "outline"} className="capitalize">
              {appointment.mode === "video" && <Video className="mr-1 h-3 w-3" />}
              {appointment.mode === "phone" && <Phone className="mr-1 h-3 w-3" />}
              {appointment.mode}
            </Badge>
            <Button size="sm" asChild>
              <Link href={`/appointments/${appointment.id}`}>Start</Link>
            </Button>
          </div>
        </div>
      ))}
      <Button variant="outline" className="w-full" asChild>
        <Link href="/appointments">View All Appointments</Link>
      </Button>
    </div>
  )
}
