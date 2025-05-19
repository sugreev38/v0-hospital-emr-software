"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Filter, Search } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PermissionGate } from "@/components/permission-gate"

// Mock data for bed availability
const bedTypes = ["General", "Semi-Private", "Private", "ICU", "CCU", "Pediatric", "Maternity"]

const mockBeds = [
  { id: "BED001", type: "General", ward: "General Ward", room: "101", number: "A", status: "available", price: 100 },
  { id: "BED002", type: "General", ward: "General Ward", room: "101", number: "B", status: "occupied", price: 100 },
  { id: "BED003", type: "General", ward: "General Ward", room: "101", number: "C", status: "available", price: 100 },
  {
    id: "BED004",
    type: "Semi-Private",
    ward: "General Ward",
    room: "102",
    number: "A",
    status: "available",
    price: 200,
  },
  {
    id: "BED005",
    type: "Semi-Private",
    ward: "General Ward",
    room: "102",
    number: "B",
    status: "maintenance",
    price: 200,
  },
  { id: "BED006", type: "Private", ward: "Private Ward", room: "201", number: "A", status: "available", price: 350 },
  { id: "BED007", type: "Private", ward: "Private Ward", room: "202", number: "A", status: "reserved", price: 350 },
  { id: "BED008", type: "ICU", ward: "Intensive Care", room: "301", number: "A", status: "available", price: 500 },
  { id: "BED009", type: "ICU", ward: "Intensive Care", room: "301", number: "B", status: "occupied", price: 500 },
  { id: "BED010", type: "CCU", ward: "Cardiac Care", room: "401", number: "A", status: "available", price: 550 },
  {
    id: "BED011",
    type: "Pediatric",
    ward: "Pediatric Ward",
    room: "501",
    number: "A",
    status: "available",
    price: 150,
  },
  {
    id: "BED012",
    type: "Maternity",
    ward: "Maternity Ward",
    room: "601",
    number: "A",
    status: "available",
    price: 250,
  },
]

interface BedAllotmentProps {
  patientId?: string
  patientName?: string
}

export function BedAllotment({ patientId, patientName }: BedAllotmentProps) {
  const [bedType, setBedType] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedBed, setSelectedBed] = useState<(typeof mockBeds)[0] | null>(null)
  const [showAllotmentDialog, setShowAllotmentDialog] = useState(false)
  const [patientNotes, setPatientNotes] = useState("")
  const [estimatedDuration, setEstimatedDuration] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredBeds = mockBeds.filter((bed) => {
    const matchesType = bedType ? bed.type === bedType : true
    const matchesSearch = searchQuery
      ? bed.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bed.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${bed.room}${bed.number}`.toLowerCase().includes(searchQuery.toLowerCase())
      : true

    return matchesType && matchesSearch
  })

  const availableBeds = filteredBeds.filter((bed) => bed.status === "available")

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200"
      case "occupied":
        return "bg-red-100 text-red-800 border-red-200"
      case "reserved":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "maintenance":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return ""
    }
  }

  const handleAllotBed = () => {
    if (!selectedBed) return

    setIsSubmitting(true)

    // Simulate API call to allot bed
    setTimeout(() => {
      setIsSubmitting(false)
      // Close dialog and reset form
      setShowAllotmentDialog(false)
      setSelectedBed(null)
      setPatientNotes("")
      setEstimatedDuration("")
      // You would update the UI to show the bed as occupied
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bed Availability</CardTitle>
          <CardDescription>View and allocate hospital beds for patients</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="sm:w-1/3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search beds by ID, ward, or room..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:w-1/3">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={bedType} onValueChange={setBedType}>
                <SelectTrigger>
                  <SelectValue placeholder="All bed types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All bed types</SelectItem>
                  {bedTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:w-1/3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {filteredBeds.map((bed) => (
              <Card
                key={bed.id}
                className={`overflow-hidden ${bed.status === "available" ? "cursor-pointer hover:border-primary" : ""}`}
                onClick={() => bed.status === "available" && setSelectedBed(bed)}
              >
                <div
                  className={`h-2 ${bed.status === "available" ? "bg-green-500" : bed.status === "occupied" ? "bg-red-500" : bed.status === "reserved" ? "bg-yellow-500" : "bg-gray-500"}`}
                ></div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{bed.ward}</h3>
                      <p className="text-sm text-muted-foreground">
                        Room {bed.room}
                        {bed.number}
                      </p>
                    </div>
                    <Badge variant="outline" className={`capitalize ${getBadgeColor(bed.status)}`}>
                      {bed.status}
                    </Badge>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium">Type: {bed.type}</span>
                      <p className="text-sm text-muted-foreground">ID: {bed.id}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">${bed.price}</span>
                      <p className="text-xs text-muted-foreground">per day</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredBeds.length === 0 && (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No beds match your search criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t p-4 bg-muted/30">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full">
            <div className="space-y-1">
              <p className="text-sm font-medium">Total beds: {filteredBeds.length}</p>
              <p className="text-sm text-green-600">Available: {availableBeds.length}</p>
            </div>
            <PermissionGate permission="edit_records">
              <Dialog open={showAllotmentDialog} onOpenChange={setShowAllotmentDialog}>
                <DialogTrigger asChild>
                  <Button disabled={!selectedBed}>
                    {selectedBed ? `Allot Bed ${selectedBed.room}${selectedBed.number}` : "Select a bed to allot"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Allot Hospital Bed</DialogTitle>
                    <DialogDescription>Assign the selected bed to a patient.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {selectedBed && (
                      <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Bed ID</Label>
                            <p className="font-medium">{selectedBed.id}</p>
                          </div>
                          <div>
                            <Label>Location</Label>
                            <p className="font-medium">
                              {selectedBed.ward}, Room {selectedBed.room}
                              {selectedBed.number}
                            </p>
                          </div>
                        </div>

                        {!patientId && (
                          <div className="space-y-2">
                            <Label htmlFor="patient-id">Patient ID</Label>
                            <Input id="patient-id" placeholder="Enter patient ID" />
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="admit-date">Admission Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="duration">Estimated Stay Duration</Label>
                          <Input
                            id="duration"
                            placeholder="e.g., 5 days"
                            value={estimatedDuration}
                            onChange={(e) => setEstimatedDuration(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="notes">Notes</Label>
                          <Textarea
                            id="notes"
                            placeholder="Any special requirements or additional information"
                            value={patientNotes}
                            onChange={(e) => setPatientNotes(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAllotmentDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAllotBed} disabled={isSubmitting}>
                      {isSubmitting ? "Processing..." : "Confirm Bed Allotment"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </PermissionGate>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
