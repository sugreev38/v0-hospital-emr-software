"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Trash2, FlaskRoundIcon as Flask, Pill, CalendarClock } from "lucide-react"
import { PermissionGate } from "@/components/permission-gate"

// Common medications for quick selection
const commonMedications = [
  { name: "Acetaminophen", dose: "500mg", frequency: "Every 6 hours", duration: "5 days" },
  { name: "Amoxicillin", dose: "500mg", frequency: "Every 8 hours", duration: "7 days" },
  { name: "Lisinopril", dose: "10mg", frequency: "Once daily", duration: "30 days" },
  { name: "Atorvastatin", dose: "20mg", frequency: "Once daily at bedtime", duration: "30 days" },
  { name: "Metformin", dose: "500mg", frequency: "Twice daily with meals", duration: "30 days" },
]

// Common lab tests
const labTests = [
  { name: "Complete Blood Count (CBC)", code: "LAB001", price: 25.0 },
  { name: "Basic Metabolic Panel", code: "LAB002", price: 30.0 },
  { name: "Lipid Panel", code: "LAB003", price: 35.0 },
  { name: "Liver Function Tests", code: "LAB004", price: 40.0 },
  { name: "Thyroid Function Tests", code: "LAB005", price: 45.0 },
  { name: "HbA1c", code: "LAB006", price: 35.0 },
  { name: "Urinalysis", code: "LAB007", price: 20.0 },
]

export function CreatePrescription({ patientId, patientName }: { patientId: string; patientName: string }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("medications")
  const [diagnosis, setDiagnosis] = useState("")
  const [medications, setMedications] = useState<
    Array<{
      id: string
      name: string
      dose: string
      frequency: string
      duration: string
      instructions: string
    }>
  >([])
  const [newMedication, setNewMedication] = useState({
    name: "",
    dose: "",
    frequency: "",
    duration: "",
    instructions: "",
  })
  const [labOrders, setLabOrders] = useState<
    Array<{
      id: string
      name: string
      code: string
      price: number
      instructions: string
    }>
  >([])
  const [selectedLabTest, setSelectedLabTest] = useState("")
  const [labInstructions, setLabInstructions] = useState("")
  const [followUpDate, setFollowUpDate] = useState("")
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddMedication = () => {
    if (newMedication.name && newMedication.dose) {
      setMedications([...medications, { id: uuidv4(), ...newMedication }])
      setNewMedication({
        name: "",
        dose: "",
        frequency: "",
        duration: "",
        instructions: "",
      })
    }
  }

  const handleSelectMedication = (medIndex: number) => {
    const med = commonMedications[medIndex]
    setNewMedication({
      name: med.name,
      dose: med.dose,
      frequency: med.frequency,
      duration: med.duration,
      instructions: "",
    })
  }

  const handleRemoveMedication = (id: string) => {
    setMedications(medications.filter((med) => med.id !== id))
  }

  const handleAddLabTest = () => {
    if (selectedLabTest) {
      const test = labTests.find((test) => test.code === selectedLabTest)
      if (test) {
        setLabOrders([
          ...labOrders,
          {
            id: uuidv4(),
            name: test.name,
            code: test.code,
            price: test.price,
            instructions: labInstructions,
          },
        ])
        setSelectedLabTest("")
        setLabInstructions("")
      }
    }
  }

  const handleRemoveLabTest = (id: string) => {
    setLabOrders(labOrders.filter((test) => test.id !== id))
  }

  const calculateTotalCost = () => {
    return labOrders.reduce((total, test) => total + test.price, 0).toFixed(2)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Create the prescription data
    const prescriptionData = {
      id: `PRES-${Date.now().toString(36)}`,
      patientId,
      patientName,
      date: new Date().toISOString(),
      diagnosis,
      medications,
      labOrders,
      followUpDate,
      additionalNotes,
      status: "active",
      barcode: uuidv4(), // Generate a unique ID for the barcode
    }

    // In a real application, you would save this to your database
    console.log("Prescription data:", prescriptionData)

    // Simulate a successful save
    setTimeout(() => {
      setIsSubmitting(false)
      // Navigate to the prescription view page
      router.push(`/prescriptions/${prescriptionData.id}`)
    }, 1000)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">New Prescription for {patientName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis</Label>
            <Textarea
              id="diagnosis"
              placeholder="Enter diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              rows={2}
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="medications">
                <Pill className="mr-2 h-4 w-4" /> Medications
              </TabsTrigger>
              <TabsTrigger value="labs">
                <Flask className="mr-2 h-4 w-4" /> Lab Tests
              </TabsTrigger>
              <TabsTrigger value="followup">
                <CalendarClock className="mr-2 h-4 w-4" /> Follow-up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="medications" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Common Medications</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {commonMedications.map((med, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="justify-start"
                          onClick={() => handleSelectMedication(index)}
                        >
                          {med.name} {med.dose}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="med-name">Medication</Label>
                    <Input
                      id="med-name"
                      placeholder="Medication name"
                      value={newMedication.name}
                      onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="med-dose">Dose</Label>
                      <Input
                        id="med-dose"
                        placeholder="e.g., 500mg"
                        value={newMedication.dose}
                        onChange={(e) => setNewMedication({ ...newMedication, dose: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="med-frequency">Frequency</Label>
                      <Input
                        id="med-frequency"
                        placeholder="e.g., Twice daily"
                        value={newMedication.frequency}
                        onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="med-duration">Duration</Label>
                      <Input
                        id="med-duration"
                        placeholder="e.g., 7 days"
                        value={newMedication.duration}
                        onChange={(e) => setNewMedication({ ...newMedication, duration: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="med-instructions">Special Instructions</Label>
                      <Input
                        id="med-instructions"
                        placeholder="e.g., Take with food"
                        value={newMedication.instructions}
                        onChange={(e) => setNewMedication({ ...newMedication, instructions: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddMedication} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Medication
                  </Button>
                </div>
              </div>

              {medications.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medication</TableHead>
                      <TableHead>Dose</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Instructions</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medications.map((med) => (
                      <TableRow key={med.id}>
                        <TableCell className="font-medium">{med.name}</TableCell>
                        <TableCell>{med.dose}</TableCell>
                        <TableCell>{med.frequency}</TableCell>
                        <TableCell>{med.duration}</TableCell>
                        <TableCell>{med.instructions}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveMedication(med.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="labs" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="labTest">Lab Test</Label>
                    <Select value={selectedLabTest} onValueChange={setSelectedLabTest}>
                      <SelectTrigger id="labTest">
                        <SelectValue placeholder="Select lab test" />
                      </SelectTrigger>
                      <SelectContent>
                        {labTests.map((test) => (
                          <SelectItem key={test.code} value={test.code}>
                            {test.name} (${test.price.toFixed(2)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lab-instructions">Instructions</Label>
                    <Textarea
                      id="lab-instructions"
                      placeholder="Any special instructions for the lab"
                      value={labInstructions}
                      onChange={(e) => setLabInstructions(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleAddLabTest} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Lab Test
                  </Button>
                </div>

                {labOrders.length > 0 && (
                  <div className="space-y-4">
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Test</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {labOrders.map((test) => (
                            <TableRow key={test.id}>
                              <TableCell className="font-medium">{test.name}</TableCell>
                              <TableCell>{test.code}</TableCell>
                              <TableCell>${test.price.toFixed(2)}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveLabTest(test.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={2} className="text-right font-medium">
                              Total:
                            </TableCell>
                            <TableCell className="font-bold">${calculateTotalCost()}</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="followup" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="follow-up-date">Follow-up Date</Label>
                  <Input
                    id="follow-up-date"
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additional-notes">Additional Notes</Label>
                  <Textarea
                    id="additional-notes"
                    placeholder="Any other information or instructions for the patient"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <PermissionGate permission="edit_records">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Generating Prescription..." : "Generate Prescription"}
          </Button>
        </PermissionGate>
      </CardFooter>
    </Card>
  )
}
