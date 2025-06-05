"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Store, Minus, Plus, ShoppingCart, CreditCard, Banknote } from "lucide-react"

export default function StorePage() {
  const params = useParams()
  const [store, setStore] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [buyerName, setBuyerName] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Load store data
    if (params.id === "demo-store") {
      // Demo store data
      const demoStore = {
        id: "demo-store",
        storeName: "Sarah's Sweet Treats",
        ownerName: "Sarah Johnson",
        description: "Homemade sweets and treats made with love",
        gcashNumber: "09123456789",
        gcashName: "Sarah Johnson",
        products: [
          {
            id: "1",
            name: "Chocolate Chip Cookies",
            description: "Freshly baked cookies with premium chocolate chips",
            price: 150,
            category: "Sweet",
            stock: 25,
          },
          {
            id: "2",
            name: "Chicken Adobo",
            description: "Traditional Filipino chicken adobo with rice",
            price: 120,
            category: "Viand",
            stock: 15,
          },
          {
            id: "3",
            name: "Fresh Fruit Salad",
            description: "Mixed seasonal fruits with cream",
            price: 80,
            category: "Others",
            stock: 10,
          },
        ],
      }
      setStore(demoStore)
      setProducts(demoStore.products)
    } else {
      // Load from localStorage
      const stores = JSON.parse(localStorage.getItem("pantry_stores") || "[]")
      const foundStore = stores.find((s: any) => s.id === params.id)
      if (foundStore) {
        setStore(foundStore)
        setProducts(foundStore.products || [])
      }
    }
  }, [params.id])

  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId: string) => {
    const existingItem = cart.find((item) => item.id === productId)
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item)))
    } else {
      setCart(cart.filter((item) => item.id !== productId))
    }
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handlePurchase = async () => {
    if (!buyerName.trim()) {
      setMessage("Please enter your name")
      return
    }

    if (!paymentMethod) {
      setMessage("Please select a payment method")
      return
    }

    if (cart.length === 0) {
      setMessage("Your cart is empty")
      return
    }

    setLoading(true)

    // Create transaction
    const transaction = {
      id: Date.now().toString(),
      buyerName: buyerName.trim(),
      items: cart,
      total: getTotalAmount(),
      paymentMethod,
      timestamp: new Date().toISOString(),
    }

    // Update store data
    if (params.id !== "demo-store") {
      const stores = JSON.parse(localStorage.getItem("pantry_stores") || "[]")
      const storeIndex = stores.findIndex((s: any) => s.id === params.id)

      if (storeIndex !== -1) {
        // Update stock
        const updatedProducts = stores[storeIndex].products.map((product: any) => {
          const cartItem = cart.find((item) => item.id === product.id)
          if (cartItem) {
            return { ...product, stock: product.stock - cartItem.quantity }
          }
          return product
        })

        // Add transaction
        const updatedTransactions = [...(stores[storeIndex].transactions || []), transaction]

        stores[storeIndex] = {
          ...stores[storeIndex],
          products: updatedProducts,
          transactions: updatedTransactions,
        }

        localStorage.setItem("pantry_stores", JSON.stringify(stores))
      }
    }

    setTimeout(() => {
      setMessage("Purchase successful! Thank you for your order.")
      setCart([])
      setBuyerName("")
      setPaymentMethod("")
      setLoading(false)
    }, 1500)
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Store not found</p>
          <Link href="/scanner">
            <Button>Back to Scanner</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-50 to-yellow-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 via-blue-500 to-yellow-500 text-white p-4">
        <div className="container mx-auto">
          <div className="flex items-center">
            <Link href="/scanner" className="text-white mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center">
              <Store className="h-6 w-6 mr-2" />
              <h1 className="text-xl font-bold">{store.storeName}</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Store Info & Products */}
          <div className="lg:col-span-2">
            {/* Store Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Store className="h-5 w-5 mr-2" />
                  {store.storeName}
                </CardTitle>
                <CardDescription>by {store.ownerName}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{store.description}</p>
              </CardContent>
            </Card>

            {/* Products */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Available Products</h2>
              {products.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">No products available at the moment</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {products.map((product) => (
                    <Card key={product.id} className="bg-white">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{product.category}</Badge>
                              <Badge
                                variant={
                                  product.stock > 5 ? "default" : product.stock > 0 ? "secondary" : "destructive"
                                }
                              >
                                {product.stock} left
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-green-600">₱{product.price}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeFromCart(product.id)}
                                disabled={!cart.find((item) => item.id === product.id)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center">
                                {cart.find((item) => item.id === product.id)?.quantity || 0}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => addToCart(product)}
                                disabled={
                                  product.stock === 0 ||
                                  (cart.find((item) => item.id === product.id)?.quantity || 0) >= product.stock
                                }
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cart & Checkout */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Your Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Your cart is empty</p>
                ) : (
                  <>
                    {/* Cart Items */}
                    <div className="space-y-2">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              ₱{item.price} x {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold">₱{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span>Total:</span>
                        <span>₱{getTotalAmount().toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Buyer Info */}
                    <div className="space-y-2">
                      <Label htmlFor="buyerName">Your Name *</Label>
                      <Input
                        id="buyerName"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Payment Method *</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gcash">
                            <div className="flex items-center">
                              <CreditCard className="h-4 w-4 mr-2" />
                              GCash
                            </div>
                          </SelectItem>
                          <SelectItem value="cash">
                            <div className="flex items-center">
                              <Banknote className="h-4 w-4 mr-2" />
                              Cash Box
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* GCash Info */}
                    {paymentMethod === "gcash" && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium">GCash Payment</p>
                        <p className="text-sm text-gray-600">Send payment to:</p>
                        <p className="text-sm font-mono">{store.gcashNumber}</p>
                        <p className="text-sm">{store.gcashName}</p>
                      </div>
                    )}

                    {/* Cash Box Info */}
                    {paymentMethod === "cash" && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium">Cash Payment</p>
                        <p className="text-sm text-gray-600">Leave exact amount in the cash box</p>
                      </div>
                    )}

                    {message && (
                      <Alert>
                        <AlertDescription>{message}</AlertDescription>
                      </Alert>
                    )}

                    {/* Purchase Button */}
                    <Button
                      onClick={handlePurchase}
                      disabled={loading || !buyerName.trim() || !paymentMethod}
                      className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
                    >
                      {loading ? "Processing..." : "Complete Purchase"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
