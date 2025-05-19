"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, FileText, Calendar } from "lucide-react"
import Link from "next/link"

// Mock data for recent patients
const recentPatients = [
  {
    id: "P12345",
    name: "Emma Wilson",
    age: 42,
    lastVisit: "2023-05-10",
    condition: "Hypertension",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "P12346",
    name: "James Brown",
    age: 35,
    lastVisit: "2023-05-11",
    condition: "Diabetes Type 2",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "P12347",
    name: "Sophia Martinez",
    age: 28,
    lastVisit: "2023-05-12",
    condition: "Pregnancy",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "P12348",
    name: "Michael Johnson",
    age: 56,
    lastVisit: "2023-05-13",
    condition: "Arthritis",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "P12349",
    name: "Olivia Davis",
    age: 19,
    lastVisit: "2023-05-14",
    condition: "Asthma",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function RecentPatients() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPatients = recentPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search patients..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                <AvatarFallback>
                  {patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{patient.name}</div>
                <div className="text-sm text-muted-foreground">
                  {patient.id} • {patient.age} years • {patient.condition}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" asChild>
                <Link href={`/records/${patient.id}`}>
                  <FileText className="h-4 w-4" />
                  <span className="sr-only">View Records</span>
                </Link>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <Link href={`/appointments/new?patient=${patient.id}`}>
                  <Calendar className="h-4 w-4" />
                  <span className="sr-only">Schedule Appointment</span>
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
