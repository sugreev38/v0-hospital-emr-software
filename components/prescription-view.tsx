"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Printer,
  Download,
  Share2,
  QrCode,
  Pill,
  FlaskRoundIcon as Flask,
  CalendarClock,
  FileText,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import JsBarcode from "jsbarcode"
import { useEffect, useRef } from "react"

interface Medication {
  id: string
  name: string
  dose: string
  frequency: string
  duration: string
  instructions: string
}

interface LabOrder {
  id: string
  name: string
  code: string
  price: number
  instructions: string
}

interface PrescriptionData {
  id: string
  patientId: string
  patientName: string
  date: string
  diagnosis: string
  medications: Medication[]
  labOrders: LabOrder[]
  followUpDate: string
  additionalNotes: string
  status: string
  barcode: string
  doctorName: string
}

export function PrescriptionView({ data }: { data: PrescriptionData }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("prescription")
  const [printing, setPrinting] = useState(false)
  const barcodeRef = useRef<HTMLCanvasElement>(null)
  const prescriptionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (barcodeRef.current && data.barcode) {
      JsBarcode(barcodeRef.current, data.barcode, {
        format: "CODE128",
        width: 1.5,
        height: 50,
        displayValue: true,
        fontSize: 12,
        margin: 10,
      })
    }
  }, [data.barcode])

  const handlePrint = () => {
    setPrinting(true)
    setTimeout(() => {
      const printContent = document.getElementById("prescription-print-content")
      if (printContent) {
        const originalContents = document.body.innerHTML
        document.body.innerHTML = printContent.innerHTML
        window.print()
        document.body.innerHTML = originalContents
        setPrinting(false)
        window.location.reload()
      } else {
        setPrinting(false)
      }
    }, 300)
  }

  const calculateTotalCost = () => {
    return data.labOrders.reduce((total, test) => total + test.price, 0).toFixed(2)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/patients/${data.patientId}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Prescription</h1>
            <p className="text-muted-foreground">ID: {data.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <QrCode className="h-4 w-4" />
                Barcode
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Prescription Barcode</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center p-6">
                <canvas ref={barcodeRef}></canvas>
                <p className="text-sm text-muted-foreground mt-4">
                  This barcode can be scanned to access the prescription, lab orders, and pharmacy billing.
                </p>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" className="gap-1" onClick={handlePrint} disabled={printing}>
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <div id="prescription-print-content" ref={prescriptionRef}>
        <Card className="mb-6">
          <CardHeader className="pb-0">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Prescription Details</CardTitle>
                <p className="text-muted-foreground">{new Date(data.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Patient: {data.patientName}</p>
                <p className="text-muted-foreground">ID: {data.patientId}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Diagnosis</h3>
                <p>{data.diagnosis}</p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="print:hidden">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="prescription">
                    <Pill className="mr-2 h-4 w-4" /> Medications
                  </TabsTrigger>
                  <TabsTrigger value="labs">
                    <Flask className="mr-2 h-4 w-4" /> Lab Tests
                  </TabsTrigger>
                  <TabsTrigger value="instructions">
                    <FileText className="mr-2 h-4 w-4" /> Instructions
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="prescription" className="pt-4">
                  {data.medications.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Medication</TableHead>
                          <TableHead>Dose</TableHead>
                          <TableHead>Frequency</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Instructions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.medications.map((med) => (
                          <TableRow key={med.id}>
                            <TableCell className="font-medium">{med.name}</TableCell>
                            <TableCell>{med.dose}</TableCell>
                            <TableCell>{med.frequency}</TableCell>
                            <TableCell>{med.duration}</TableCell>
                            <TableCell>{med.instructions}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No medications prescribed</p>
                  )}
                </TabsContent>

                <TabsContent value="labs" className="pt-4">
                  {data.labOrders.length > 0 ? (
                    <div className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Test</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Instructions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.labOrders.map((test) => (
                            <TableRow key={test.id}>
                              <TableCell className="font-medium">{test.name}</TableCell>
                              <TableCell>{test.code}</TableCell>
                              <TableCell>${test.price.toFixed(2)}</TableCell>
                              <TableCell>{test.instructions}</TableCell>
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
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No lab tests ordered</p>
                  )}
                </TabsContent>

                <TabsContent value="instructions" className="pt-4">
                  <div className="space-y-4">
                    {data.followUpDate && (
                      <div>
                        <h3 className="font-medium flex items-center gap-2">
                          <CalendarClock className="h-4 w-4" /> Follow-up Appointment
                        </h3>
                        <p>{new Date(data.followUpDate).toLocaleDateString()}</p>
                      </div>
                    )}

                    {data.additionalNotes && (
                      <div>
                        <h3 className="font-medium">Additional Instructions</h3>
                        <p className="whitespace-pre-wrap">{data.additionalNotes}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Print version - shows all sections regardless of active tab */}
              <div className="hidden print:block space-y-6">
                <div>
                  <h3 className="font-medium flex items-center gap-2 mb-2">
                    <Pill className="h-4 w-4" /> Medications
                  </h3>
                  {data.medications.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Medication</TableHead>
                          <TableHead>Dose</TableHead>
                          <TableHead>Frequency</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Instructions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.medications.map((med) => (
                          <TableRow key={med.id}>
                            <TableCell className="font-medium">{med.name}</TableCell>
                            <TableCell>{med.dose}</TableCell>
                            <TableCell>{med.frequency}</TableCell>
                            <TableCell>{med.duration}</TableCell>
                            <TableCell>{med.instructions}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground">No medications prescribed</p>
                  )}
                </div>

                <div>
                  <h3 className="font-medium flex items-center gap-2 mb-2">
                    <Flask className="h-4 w-4" /> Lab Tests
                  </h3>
                  {data.labOrders.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Test</TableHead>
                          <TableHead>Code</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Instructions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.labOrders.map((test) => (
                          <TableRow key={test.id}>
                            <TableCell className="font-medium">{test.name}</TableCell>
                            <TableCell>{test.code}</TableCell>
                            <TableCell>${test.price.toFixed(2)}</TableCell>
                            <TableCell>{test.instructions}</TableCell>
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
                  ) : (
                    <p className="text-muted-foreground">No lab tests ordered</p>
                  )}
                </div>

                <div className="space-y-2">
                  {data.followUpDate && (
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        <CalendarClock className="h-4 w-4" /> Follow-up Appointment
                      </h3>
                      <p>{new Date(data.followUpDate).toLocaleDateString()}</p>
                    </div>
                  )}

                  {data.additionalNotes && (
                    <div>
                      <h3 className="font-medium">Additional Instructions</h3>
                      <p className="whitespace-pre-wrap">{data.additionalNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4 print:block">
            <Separator className="w-full" />
            <div className="w-full flex justify-between items-end">
              <div>
                <p className="font-medium">{data.doctorName || "Dr. Smith"}</p>
                <p className="text-sm text-muted-foreground">License #: MD12345</p>
              </div>
              <canvas ref={barcodeRef} className="hidden print:block"></canvas>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
