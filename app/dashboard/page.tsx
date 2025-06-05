"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Package, QrCode, Users, LogOut, Edit, Trash2, Clock, User, ExternalLink } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [store, setStore] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    const currentStore = localStorage.getItem("pantry_current_store")
    if (!currentStore) {
      router.push("/auth/login")
      return
    }

    const storeData = JSON.parse(currentStore)
    setStore(storeData)
    setProducts(storeData.products || [])
    setTransactions(storeData.transactions || [])
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("pantry_current_store")
    router.push("/")
  }

  const deleteProduct = (productId: string) => {
    const updatedProducts = products.filter((p) => p.id !== productId)
    setProducts(updatedProducts)

    // Update store data
    const updatedStore = { ...store, products: updatedProducts }
    localStorage.setItem("pantry_current_store", JSON.stringify(updatedStore))

    // Update stores array
    const stores = JSON.parse(localStorage.getItem("pantry_stores") || "[]")
    const storeIndex = stores.findIndex((s: any) => s.id === store.id)
    if (storeIndex !== -1) {
      stores[storeIndex] = updatedStore
      localStorage.setItem("pantry_stores", JSON.stringify(stores))
    }
  }

  const getStoreUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/store/${store?.id}`
    }
    return ""
  }

  if (!store) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 via-blue-500 to-yellow-500 text-white p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">{store.storeName}</h1>
          <div className="flex items-center space-x-4">
            <Link href={`/store/${store.id}/qr`}>
              <Button variant="outline" size="sm" className="text-blue-600 bg-white hover:bg-gray-100">
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </Button>
            </Link>
            <Link href={`/store/${store.id}`} target="_blank">
              <Button variant="outline" size="sm" className="text-green-600 bg-white hover:bg-gray-100">
                <ExternalLink className="h-4 w-4 mr-2" />
                Preview Store
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="text-pink-600 bg-white hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-pink-100 to-pink-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-pink-700 flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-800">{products.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-100 to-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">{transactions.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-100 to-yellow-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700 flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Total Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-800">{products.reduce((sum, p) => sum + p.stock, 0)}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-100 to-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">
                ₱{transactions.reduce((sum, t) => sum + t.total, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-pink-50 to-blue-50">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Share Your Store</h3>
                  <p className="text-sm text-gray-600">Get customers to scan your QR code or share your store link</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/store/${store.id}/qr`}>
                    <Button className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600">
                      <QrCode className="h-4 w-4 mr-2" />
                      Get QR Code
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={() => navigator.clipboard.writeText(getStoreUrl())}>
                    Copy Store Link
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-white">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="transactions">Sales History</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Products</h2>
              <Link href="/add-product">
                <Button className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            </div>

            {products.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                  <p className="text-gray-600 mb-4">Start by adding your first product</p>
                  <Link href="/add-product">
                    <Button className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600">
                      Add Your First Product
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="bg-white">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <CardDescription>₱{product.price}</CardDescription>
                        </div>
                        <Badge
                          variant={product.stock > 5 ? "default" : product.stock > 0 ? "secondary" : "destructive"}
                          className={
                            product.stock > 5 ? "bg-green-500" : product.stock > 0 ? "bg-yellow-500" : "bg-red-500"
                          }
                        >
                          {product.stock} left
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{product.category}</Badge>
                        <div className="flex space-x-2">
                          <Link href={`/edit-product/${product.id}`}>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button size="sm" variant="outline" onClick={() => deleteProduct(product.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Sales History</CardTitle>
                <CardDescription>Track who bought your products and when</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No sales yet. Share your QR code to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="font-semibold">{transaction.buyerName}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(transaction.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <div className="space-y-1">
                          {transaction.items.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>
                                {item.name} x{item.quantity}
                              </span>
                              <span>₱{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t">
                          <Badge variant={transaction.paymentMethod === "gcash" ? "default" : "secondary"}>
                            {transaction.paymentMethod === "gcash" ? "GCash" : "Cash Box"}
                          </Badge>
                          <span className="font-bold">Total: ₱{transaction.total.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* QR Code Tab */}
          <TabsContent value="qr">
            <Card>
              <CardHeader>
                <CardTitle>Your Store QR Code</CardTitle>
                <CardDescription>Print this QR code and place it in the pantry for customers to scan</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="bg-white p-8 rounded-lg border-2 border-dashed border-gray-300 inline-block">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(getStoreUrl())}&bgcolor=ffffff&color=000000&margin=20`}
                    alt={`QR Code for ${store.storeName}`}
                    className="mx-auto mb-4 rounded-lg"
                    width={300}
                    height={300}
                  />
                  <p className="text-lg font-semibold">{store.storeName}</p>
                  <p className="text-sm text-gray-500">Store ID: {store.qrCode}</p>
                </div>
                <div className="mt-6 space-x-4">
                  <Link href={`/store/${store.id}/qr`}>
                    <Button variant="outline">View Full Size</Button>
                  </Link>
                  <Button className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600">
                    Print QR Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
