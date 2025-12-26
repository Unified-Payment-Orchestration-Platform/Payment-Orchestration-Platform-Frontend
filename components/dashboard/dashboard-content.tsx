"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CreditCard,
  Wallet,
  Receipt,
  TrendingUp,
  Loader2,
  Plus,
} from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"
import { paymentIntentService } from "@/lib/services/payment-intent-service"
import { accountService } from "@/lib/services/account-service"
import { useState, useEffect } from "react"

export function DashboardContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalIntents: 0,
    totalAccounts: 0,
    totalTransactions: 0,
    totalVolume: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return
      setIsLoading(true)
      try {
        // Fetch accounts to get count
        const accounts = await accountService.getUserAccounts(user.user_id)
        
        // Fetch transactions from all accounts to calculate stats
        let allTransactions: any[] = []
        let totalVolume = 0
        
        for (const account of accounts) {
          try {
            const accountTransactions = await accountService.getAccountTransactions(account.account_id)
            allTransactions.push(...accountTransactions)
            // Calculate volume from completed transactions
            accountTransactions
              .filter(t => t.status === "completed" || t.status === "COMPLETED")
              .forEach(t => {
                totalVolume += typeof t.amount === "number" ? t.amount : parseFloat(t.amount.toString())
              })
          } catch (error) {
            // Continue if one account fails
            console.error(`Failed to fetch transactions for account ${account.account_id}:`, error)
          }
        }
        
        // Payment intents service not implemented, so set to 0
        const totalIntents = 0
        
        setStats({
          totalIntents,
          totalAccounts: accounts.length,
          totalTransactions: allTransactions.length,
          totalVolume,
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
        // Set defaults on error
        setStats({
          totalIntents: 0,
          totalAccounts: 0,
          totalTransactions: 0,
          totalVolume: 0,
        })
      } finally {
        setIsLoading(false)
      }
    }
    if (user) {
      fetchStats()
    }
  }, [user])

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Welcome back, {user?.username || "User"}!
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your payments, accounts, and transactions
          </p>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Payment Intents"
          value={stats.totalIntents.toString()}
          icon={CreditCard}
          isLoading={isLoading}
          onClick={() => router.push("/dashboard/payment-intents")}
        />
        <MetricCard
          title="Accounts"
          value={stats.totalAccounts.toString()}
          icon={Wallet}
          isLoading={isLoading}
          onClick={() => router.push("/dashboard/accounts")}
        />
        <MetricCard
          title="Transactions"
          value={stats.totalTransactions.toString()}
          icon={Receipt}
          isLoading={isLoading}
          onClick={() => router.push("/dashboard/transactions")}
        />
        <MetricCard
          title="Total Volume"
          value={`$${stats.totalVolume.toLocaleString()}`}
          icon={TrendingUp}
          isLoading={isLoading}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="rounded-xl border-border shadow-none">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start gap-2 rounded-xl"
              onClick={() => router.push("/dashboard/payment-intents?new=true")}
            >
              <Plus className="w-4 h-4" />
              Create Payment Intent
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 rounded-xl"
              onClick={() => router.push("/dashboard/accounts?new=true")}
            >
              <Plus className="w-4 h-4" />
              Create Account
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 rounded-xl"
              onClick={() => router.push("/dashboard/payment-methods?new=true")}
            >
              <Plus className="w-4 h-4" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border shadow-none">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No recent activity</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Your recent payments and transactions will appear here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  icon: Icon,
  isLoading,
  onClick,
}: {
  title: string
  value: string
  icon: React.ElementType
  isLoading?: boolean
  onClick?: () => void
}) {
  const content = (
    <Card className="rounded-xl border-border shadow-none cursor-pointer hover:bg-accent/50 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            ) : (
              <span className="text-3xl font-bold text-foreground">{value}</span>
            )}
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (onClick) {
    return <div onClick={onClick}>{content}</div>
  }

  return content
}
