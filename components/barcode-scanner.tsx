"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, QrCode, Search } from "lucide-react"
import { useRouter } from "next/navigation"

// In a real application, you'd use a library like quagga.js or html5-qrcode
// For this demo, we'll simulate scanning with manual input

export function BarcodeScanner() {
  const router = useRouter()
  const [barcode, setBarcode] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus on input field when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleScan = () => {
    setIsScanning(true)
    setError(null)

    // Simulate scanning process
    setTimeout(() => {
      // Generate a fake barcode for demo purposes
      const scannedBarcode = `PRES-${Math.floor(100000 + Math.random() * 900000)}`
      setBarcode(scannedBarcode)
      setIsScanning(false)
    }, 2000)
  }

  const searchBarcode = async () => {
    if (!barcode.trim()) {
      setError("Please enter or scan a barcode")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // In a real app, you'd make an API call to fetch data based on the barcode
      // For demo, we'll simulate a successful lookup after a short delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate routing to the prescription page
      if (barcode.startsWith("PRES-")) {
        router.push(`/prescriptions/${barcode}`)
      } else {
        // If it's not a recognized format, show an error
        setError("Unrecognized barcode format")
        setIsProcessing(false)
      }
    } catch (error) {
      setError("Error processing barcode. Please try again.")
      setIsProcessing(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Barcode Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Enter barcode manually or scan"
            className="pl-8"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchBarcode()
              }
            }}
          />
        </div>

        {error && <div className="text-sm text-destructive">{error}</div>}

        <div className="bg-muted rounded-md p-6 flex flex-col items-center justify-center min-h-[200px]">
          {isScanning ? (
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
              <p>Scanning...</p>
            </div>
          ) : (
            <div className="text-center">
              <QrCode className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                Position the barcode in front of the camera to scan, or enter it manually above.
              </p>
              <Button onClick={handleScan}>Start Camera Scan</Button>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={searchBarcode} disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Search"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
