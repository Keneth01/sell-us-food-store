import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Search, QrCode, Store, Package } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-50 to-yellow-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 via-blue-500 to-yellow-500 text-white p-4 sticky top-0 z-10">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">BentaUs Pickup</h1>
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="text-blue-600 bg-white hover:bg-gray-100">
                  Seller Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" size="sm" className="text-pink-600 bg-white hover:bg-gray-100">
                  Register Store
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input placeholder="Search for stores or products..." className="pl-10 bg-white text-black rounded-full" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-pink-600 via-blue-600 to-yellow-600 bg-clip-text text-transparent">
            Self-Service Pantry System
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Scan QR codes to browse stores, select products, and pay instantly. Pick up your items from our convenient
            pantry locations.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/scanner">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
              >
                <QrCode className="h-5 w-5 mr-2" />
                Scan Store QR
              </Button>
            </Link>
            <Link href="/stores">
              <Button size="lg" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                Browse Stores
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <QrCode className="h-8 w-8 text-pink-600" />
              </div>
              <h4 className="text-xl font-bold mb-2">1. Scan QR Code</h4>
              <p className="text-gray-600">Each store has one QR code. Scan it to see their products and prices.</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold mb-2">2. Select & Pay</h4>
              <p className="text-gray-600">Choose quantities, pay via GCash or leave cash in the box.</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Store className="h-8 w-8 text-yellow-600" />
              </div>
              <h4 className="text-xl font-bold mb-2">3. Pick Up</h4>
              <p className="text-gray-600">Collect your items from the pantry. It's that simple!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-gradient-to-r from-pink-50 via-blue-50 to-yellow-50">
        <div className="container mx-auto text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-pink-600 mb-2">30</div>
              <div className="text-gray-600">Maximum Stores</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">30</div>
              <div className="text-gray-600">Items per Product</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-600 mb-2">24/7</div>
              <div className="text-gray-600">Pantry Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Pantry Pickup. Your convenient self-service food marketplace.</p>
        </div>
      </footer>
    </main>
  )
}
