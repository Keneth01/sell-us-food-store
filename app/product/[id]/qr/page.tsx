"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, PrinterIcon as Print } from "lucide-react"

export default function ProductQRPage() {
  const params = useParams()
  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    const allProducts = JSON.parse(localStorage.getItem("pantry_products") || "[]")
    const foundProduct = allProducts.find((p: any) => p.id === params.id)
    setProduct(foundProduct)
  }, [params.id])

  const generateQRCode = (text: string) => {
    // Using a simple QR code generator URL
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`
  }

  const handlePrint = () => {
    window.print()
  }

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
            Product QR Code
          </h1>
          <p className="text-gray-600">Print this QR code and place it with your product in the pantry</p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="border-pink-200 print:shadow-none">
            <CardHeader className="text-center">
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>
                ₱{product.price} • {product.category}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                <img
                  src={generateQRCode(product.id) || "/placeholder.svg"}
                  alt={`QR Code for ${product.name}`}
                  className="mx-auto"
                  width={300}
                  height={300}
                />
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Product ID:</strong> {product.id}
                </p>
                <p>
                  <strong>Seller:</strong> {product.sellerName}
                </p>
                <p>
                  <strong>Stock:</strong> {product.stock} items
                </p>
              </div>

              <div className="flex space-x-2 print:hidden">
                <Button
                  onClick={handlePrint}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
                >
                  <Print className="h-4 w-4 mr-2" />
                  Print QR Code
                </Button>
              </div>

              <div className="text-xs text-gray-500 mt-4 print:block hidden">
                <p>Scan this QR code to purchase this item</p>
                <p>Payment via GCash or cash box</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  )
}
