"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Star, ArrowLeft, User, MessageCircle } from "lucide-react"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [seller, setSeller] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Load product
    const allProducts = JSON.parse(localStorage.getItem("sellus_products") || "[]")
    const foundProduct = allProducts.find((p: any) => p.id === params.id)

    if (!foundProduct) {
      router.push("/marketplace")
      return
    }

    setProduct(foundProduct)

    // Load seller info
    const allUsers = JSON.parse(localStorage.getItem("sellus_users") || "[]")
    const foundSeller = allUsers.find((u: any) => u.id === foundProduct.sellerId)
    setSeller(foundSeller)

    // Check if user is logged in
    const user = localStorage.getItem("sellus_current_user")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
  }, [params.id, router])

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) {
      setMessage("Please log in to leave a review")
      return
    }

    if (currentUser.id === product.sellerId) {
      setMessage("You cannot review your own product")
      return
    }

    setLoading(true)

    // Add review to product
    const review = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      rating: newReview.rating,
      comment: newReview.comment,
      createdAt: new Date().toISOString(),
    }

    const allProducts = JSON.parse(localStorage.getItem("sellus_products") || "[]")
    const productIndex = allProducts.findIndex((p: any) => p.id === product.id)

    if (productIndex !== -1) {
      allProducts[productIndex].reviews = allProducts[productIndex].reviews || []
      allProducts[productIndex].reviews.push(review)

      // Update rating
      const reviews = allProducts[productIndex].reviews
      const avgRating = reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
      allProducts[productIndex].rating = avgRating
      allProducts[productIndex].reviewCount = reviews.length

      localStorage.setItem("sellus_products", JSON.stringify(allProducts))

      // Update seller rating
      const allUsers = JSON.parse(localStorage.getItem("sellus_users") || "[]")
      const sellerIndex = allUsers.findIndex((u: any) => u.id === product.sellerId)
      if (sellerIndex !== -1) {
        const sellerProducts = allProducts.filter((p: any) => p.sellerId === product.sellerId)
        const totalReviews = sellerProducts.reduce((sum: number, p: any) => sum + (p.reviewCount || 0), 0)
        const totalRating = sellerProducts.reduce(
          (sum: number, p: any) => sum + (p.rating || 0) * (p.reviewCount || 0),
          0,
        )

        allUsers[sellerIndex].rating = totalReviews > 0 ? totalRating / totalReviews : 0
        allUsers[sellerIndex].reviewCount = totalReviews

        localStorage.setItem("sellus_users", JSON.stringify(allUsers))
      }

      setProduct(allProducts[productIndex])
      setNewReview({ rating: 5, comment: "" })
      setMessage("Review submitted successfully!")
    }

    setLoading(false)
  }

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"} ${
          interactive ? "cursor-pointer hover:text-yellow-400" : ""
        }`}
        onClick={() => interactive && onRate && onRate(i + 1)}
      />
    ))
  }

  if (!product || !seller) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/marketplace">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Product Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{product.name}</CardTitle>
                    <CardDescription className="text-2xl font-bold text-green-600">
                      ${product.price.toFixed(2)}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {product.category}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">{renderStars(Math.round(product.rating || 0))}</div>
                  <span className="text-sm text-gray-600">({product.reviewCount || 0} reviews)</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-700">{product.description}</p>
                  </div>

                  <div className="flex items-center space-x-4 pt-4 border-t">
                    <Badge variant={product.available ? "default" : "secondary"}>
                      {product.available ? "Available" : "Out of Stock"}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Listed on {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Reviews ({product.reviewCount || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add Review Form */}
                {currentUser && currentUser.id !== product.sellerId && (
                  <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-3">Leave a Review</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Rating</label>
                        <div className="flex items-center space-x-1">
                          {renderStars(newReview.rating, true, (rating) => setNewReview({ ...newReview, rating }))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Comment</label>
                        <Textarea
                          value={newReview.comment}
                          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          placeholder="Share your experience with this product..."
                          rows={3}
                        />
                      </div>
                      <Button type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submit Review"}
                      </Button>
                    </div>
                  </form>
                )}

                {message && (
                  <Alert className="mb-4">
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review: any) => (
                      <div key={review.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{review.userName}</span>
                            <div className="flex items-center space-x-1">{renderStars(review.rating)}</div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No reviews yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seller Info */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Seller Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{seller.name}</h3>
                    <div className="flex items-center space-x-1 mt-1">
                      {renderStars(Math.round(seller.rating || 0))}
                      <span className="text-sm text-gray-600 ml-1">({seller.reviewCount || 0} reviews)</span>
                    </div>
                  </div>

                  {seller.bio && (
                    <div>
                      <h4 className="font-medium mb-1">About</h4>
                      <p className="text-sm text-gray-700">{seller.bio}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium mb-1">Contact</h4>
                    <p className="text-sm text-gray-700">{seller.phone}</p>
                    <p className="text-sm text-gray-700">{seller.address}</p>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-500">
                      Member since {new Date(seller.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
