"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const stores = JSON.parse(localStorage.getItem("pantry_stores") || "[]")
    const store = stores.find((s: any) => s.username === formData.username && s.password === formData.password)

    if (!store) {
      setError("Invalid username or password")
      setLoading(false)
      return
    }

    localStorage.setItem("pantry_current_store", JSON.stringify(store))

    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-blue-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription>Sign in to manage your store</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {"Don't have a store? "}
            <a href="/auth/register" className="text-blue-600 hover:underline">
              Register here
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
