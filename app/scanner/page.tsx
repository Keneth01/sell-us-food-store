"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QrCode, Camera, ArrowLeft, Scan } from "lucide-react"

export default function ScannerPage() {
  const [storeId, setStoreId] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState("")
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleManualEntry = () => {
    if (storeId.trim()) {
      // Check if it's a full URL
      if (storeId.includes("/store/")) {
        const urlParts = storeId.split("/store/")
        if (urlParts.length > 1) {
          const extractedId = urlParts[1].split("?")[0].split("#")[0]
          window.location.href = `/store/${extractedId}`
          return
        }
      }
      // Direct store ID
      window.location.href = `/store/${storeId.trim()}`
    }
  }

  const startCamera = async () => {
    try {
      setError("")
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
        },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }
      setIsScanning(true)
    } catch (err) {
      setError("Camera access denied. Please use manual entry or check camera permissions.")
      console.error("Camera error:", err)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsScanning(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleManualEntry()
    }
  }

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-50 to-yellow-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 via-blue-500 to-yellow-500 text-white p-4">
        <div className="container mx-auto">
          <div className="flex items-center">
            <Link href="/" className="text-white mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold">Scan Store QR Code</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* QR Scanner */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center">
                <QrCode className="h-6 w-6 mr-2" />
                QR Code Scanner
              </CardTitle>
              <CardDescription>Scan a store's QR code to view their products</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {isScanning ? (
                <div className="space-y-4">
                  <div className="relative w-64 h-64 mx-auto bg-black rounded-lg overflow-hidden">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                    <div className="absolute inset-0 border-2 border-white border-dashed rounded-lg m-4 pointer-events-none">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-pink-500"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-pink-500"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-pink-500"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-pink-500"></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Point your camera at the QR code</p>
                  <Button variant="outline" onClick={stopCamera}>
                    Stop Camera
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-64 h-64 mx-auto bg-gradient-to-br from-pink-100 to-blue-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Camera className="h-16 w-16 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500">Camera not active</p>
                    </div>
                  </div>
                  <Button
                    onClick={startCamera}
                    className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
                  >
                    <Scan className="h-4 w-4 mr-2" />
                    Start Camera
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Manual Entry */}
          <Card>
            <CardHeader>
              <CardTitle>Manual Entry</CardTitle>
              <CardDescription>Enter store ID or paste store URL if scanning doesn't work</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeId">Store ID or URL</Label>
                <Input
                  id="storeId"
                  value={storeId}
                  onChange={(e) => setStoreId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter store ID or paste URL"
                />
              </div>
              <Button onClick={handleManualEntry} variant="outline" className="w-full" disabled={!storeId.trim()}>
                Go to Store
              </Button>
            </CardContent>
          </Card>

          {/* Demo Store */}
          <Card className="bg-gradient-to-r from-yellow-100 to-pink-100">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-600 mb-2">Try our demo store:</p>
              <Link href="/store/demo-store">
                <Button variant="outline" size="sm">
                  Visit Demo Store
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-blue-50">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">How to scan:</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Allow camera access when prompted</li>
                <li>• Point camera at the QR code</li>
                <li>• Keep the code within the frame</li>
                <li>• Wait for automatic detection</li>
                <li>• Or use manual entry if needed</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
