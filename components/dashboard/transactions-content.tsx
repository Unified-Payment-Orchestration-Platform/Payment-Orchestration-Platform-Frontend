"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Receipt,
  Loader2,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react"
import { accountService, type Transaction } from "@/lib/services/account-service"
import { useAuth } from "@/lib/hooks/use-auth"
import { toast } from "sonner"

export function TransactionsContent() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchTransactions()
    }
  }, [user])

  const fetchTransactions = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      // Get all user accounts first
      const accounts = await accountService.getUserAccounts(user.user_id)
      
      // Fetch transactions for each account and combine them
      const allTransactions: Transaction[] = []
      for (const account of accounts) {
        try {
          const accountTransactions = await accountService.getAccountTransactions(account.account_id)
          allTransactions.push(...accountTransactions)
        } catch (error) {
          // If one account fails, continue with others
          console.error(`Failed to fetch transactions for account ${account.account_id}:`, error)
        }
      }
      
      // Sort by created_at (newest first)
      allTransactions.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      
      setTransactions(allTransactions)
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message || 
        error.message || 
        "Failed to load transactions"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
  }

  const getTransactionIcon = (type: string) => {
    if (type.includes("deposit") || type.includes("credit")) {
      return <ArrowDownLeft className="w-4 h-4 text-green-500" />
    }
    return <ArrowUpRight className="w-4 h-4 text-red-500" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Transactions</h2>
        <p className="text-muted-foreground mt-1">
          View all your transaction history
        </p>
      </div>

      <Card className="rounded-xl border-border shadow-none">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No transactions yet</p>
              <p className="text-sm text-muted-foreground">
                Your transaction history will appear here
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.transaction_id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTransactionIcon(transaction.transaction_type)}
                        <span className="capitalize">{transaction.transaction_type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{transaction.amount}</TableCell>
                    <TableCell>{transaction.currency}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell>
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

