"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Printer, Download, Copy, Check } from "lucide-react"

export default function StoreQRPage() {
  const params = useParams()
  const [store, setStore] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const currentStore = localStorage.getItem("pantry_current_store")
    if (currentStore) {
      const storeData = JSON.parse(currentStore)
      if (storeData.id === params.id) {
        setStore(storeData)
      }
    }
  }, [params.id])

  const getStoreUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/store/${store?.id}`
    }
    return ""
  }

  const getQRCodeUrl = () => {
    const storeUrl = getStoreUrl()
    return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(storeUrl)}&bgcolor=ffffff&color=000000&margin=20`
  }

  const handlePrint = () => {
    window.print()
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(getStoreUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy URL:", err)
    }
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = getQRCodeUrl()
    link.download = `${store?.storeName}-QR-Code.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!store) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 print:hidden">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
            Store QR Code
          </h1>
          <p className="text-gray-600">Print this QR code and place it in the pantry</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-white">
            <CardHeader className="text-center">
              <CardTitle>Scan to Shop</CardTitle>
              <CardDescription>Customers scan this code to view your products</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              {/* QR Code Display */}
              <div className="bg-white p-8 rounded-lg border-2 border-gray-200 inline-block">
                <img
                  src={getQRCodeUrl() || "/placeholder.svg"}
                  alt={`QR Code for ${store.storeName}`}
                  className="mx-auto mb-4 rounded-lg"
                  width={400}
                  height={400}
                />
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">{store.storeName}</h2>
                  <p className="text-gray-600">by {store.ownerName}</p>
                  <p className="text-sm text-gray-500 font-mono">Store ID: {store.qrCode}</p>
                  <p className="text-sm text-gray-500">Scan with any QR code reader</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gradient-to-r from-pink-50 to-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">Instructions for Customers:</h3>
                <ol className="text-left text-sm space-y-1">
                  <li>1. Open your phone's camera app</li>
                  <li>2. Point camera at the QR code</li>
                  <li>3. Tap the notification to open the store</li>
                  <li>4. Browse products and add to cart</li>
                  <li>5. Enter your name and payment method</li>
                  <li>6. Complete purchase and pick up items</li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4 print:hidden">
                <Button
                  onClick={handlePrint}
                  className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print QR Code
                </Button>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Image
                </Button>
                <Button variant="outline" onClick={handleCopyUrl}>
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
              </div>

              {/* Store URL */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Direct link to your store:</p>
                <p className="text-sm font-mono bg-white p-2 rounded border break-all">{getStoreUrl()}</p>
              </div>

              {/* Print-only content */}
              <div className="hidden print:block mt-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-2">{store.storeName}</h2>
                  <p className="text-xl mb-4">Scan to Shop</p>
                  <p className="text-lg">by {store.ownerName}</p>
                  <p className="text-sm mt-4">Store ID: {store.qrCode}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block,
          .print\\:block * {
            visibility: visible;
          }
          .print\\:hidden {
            display: none !important;
          }
          @page {
            margin: 1in;
          }
        }
      `}</style>
    </div>
  )
}
