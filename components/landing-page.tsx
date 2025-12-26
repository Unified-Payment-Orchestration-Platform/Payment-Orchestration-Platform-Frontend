"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/contexts/theme-context"
import {
  CreditCard,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  Sun,
  Moon,
  Menu,
  X,
  Check,
} from "lucide-react"

export function LandingPage() {
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const features = [
    {
      icon: CreditCard,
      title: "Payment Orchestration",
      description: "Seamlessly manage payment intents and process transactions across multiple payment methods.",
    },
    {
      icon: Shield,
      title: "Compliance & Security",
      description: "Built-in fraud detection and compliance rules to keep your transactions secure.",
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Process payments instantly with our high-performance payment infrastructure.",
    },
    {
      icon: Globe,
      title: "Multi-currency Support",
      description: "Support for multiple currencies and payment methods worldwide.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Payment Platform</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
                Features
              </Link>
              <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground">
                About
              </Link>
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-xl">
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Link href="/login">
                <Button variant="ghost" className="rounded-xl">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-xl">Get Started</Button>
              </Link>
            </nav>

            <div className="flex items-center gap-2 md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-xl">
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-xl"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card/50 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-4 space-y-2">
              <Link href="#features" className="block py-2 text-sm">
                Features
              </Link>
              <Link href="#about" className="block py-2 text-sm">
                About
              </Link>
              <Link href="/login" className="block py-2 text-sm">
                Sign In
              </Link>
              <Link href="/register">
                <Button className="w-full rounded-xl">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 lg:px-8 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground">
              Unified Payment
              <br />
              Orchestration Platform
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Streamline your payment processing with a comprehensive platform that handles
              everything from payment intents to compliance and fraud detection.
            </p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="rounded-xl gap-2">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="rounded-xl">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Features</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to manage payments at scale
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="rounded-xl border-border shadow-none">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 lg:px-8 py-20">
        <Card className="rounded-2xl border-border bg-primary/5">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Ready to get started?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of businesses using our payment orchestration platform
            </p>
            <Link href="/register">
              <Button size="lg" className="rounded-xl gap-2">
                Create Account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">Payment Platform</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Payment Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
