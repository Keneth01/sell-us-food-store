"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Store, Package, Users } from "lucide-react"

export default function StoresPage() {
  const [stores, setStores] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredStores, setFilteredStores] = useState<any[]>([])

  useEffect(() => {
    // Load stores from localStorage
    const allStores = JSON.parse(localStorage.getItem("pantry_stores") || "[]")

    // Add demo store
    const demoStore = {
      id: "demo-store",
      storeName: "Sarah's Sweet Treats",
      ownerName: "Sarah Johnson",
      description: "Homemade sweets and treats made with love",
      products: [
        { category: "Sweet", stock: 25 },
        { category: "Viand", stock: 15 },
        { category: "Others", stock: 10 },
      ],
      createdAt: new Date().toISOString(),
    }

    const storesWithDemo = [demoStore, ...allStores]
    setStores(storesWithDemo)
    setFilteredStores(storesWithDemo)
  }, [])

  useEffect(() => {
    const filtered = stores.filter(
      (store) =>
        store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredStores(filtered)
  }, [stores, searchTerm])

  const getTotalProducts = (store: any) => {
    return store.products?.length || 0
  }

  const getTotalStock = (store: any) => {
    return store.products?.reduce((sum: number, product: any) => sum + product.stock, 0) || 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-50 to-yellow-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 via-blue-500 to-yellow-500 text-white p-4">
        <div className="container mx-auto">
          <div className="flex items-center mb-4">
            <Link href="/" className="text-white mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold">Browse Stores</h1>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search stores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white text-black rounded-full"
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Available Stores</h2>
          <p className="text-gray-600">Browse our collection of local food vendors</p>
        </div>

        {filteredStores.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No stores found</h3>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <Card key={store.id} className="bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        <Store className="h-5 w-5 mr-2 text-pink-600" />
                        {store.storeName}
                      </CardTitle>
                      <CardDescription>by {store.ownerName}</CardDescription>
                    </div>
                    {store.id === "demo-store" && <Badge className="bg-yellow-500">Demo</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{store.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Package className="h-4 w-4 mr-1" />
                      <span>{getTotalProducts(store)} products</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{getTotalStock(store)} items</span>
                    </div>
                  </div>

                  <Link href={`/store/${store.id}`}>
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600">
                      Visit Store
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-pink-50 to-blue-50">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-2">Want to sell your products?</h3>
              <p className="text-gray-600 mb-4">Join our marketplace and reach more customers</p>
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600">
                  Register Your Store
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
