"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Wallet,
  Plus,
  Loader2,
  DollarSign,
} from "lucide-react"
import { accountService, type Account } from "@/lib/services/account-service"
import { useAuth } from "@/lib/hooks/use-auth"
import { toast } from "sonner"

export function AccountsContent() {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    account_type: "checking",
    currency: "USD",
  })

  useEffect(() => {
    if (user) {
      fetchAccounts()
    }
  }, [user])

  const fetchAccounts = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const data = await accountService.getUserAccounts(user.user_id)
      setAccounts(data)
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message || 
        error.message || 
        "Failed to load accounts"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsCreating(true)
    try {
      const account = await accountService.createAccount({
        user_id: user.user_id,
        account_type: formData.account_type,
        currency: formData.currency,
      })
      toast.success("Account created successfully")
      // Refresh accounts list from backend
      await fetchAccounts()
      setIsDialogOpen(false)
      setFormData({ account_type: "checking", currency: "USD" })
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message || 
        error.message || 
        "Failed to create account"
      toast.error(errorMessage)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Accounts</h2>
          <p className="text-muted-foreground mt-1">
            Manage your financial accounts
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl">
              <Plus className="w-4 h-4" />
              Create Account
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle>Create Account</DialogTitle>
              <DialogDescription>
                Create a new financial account
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="account_type">Account Type</Label>
                <Input
                  id="account_type"
                  type="text"
                  placeholder="checking"
                  value={formData.account_type}
                  onChange={(e) => setFormData({ ...formData, account_type: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  type="text"
                  placeholder="USD"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center h-64">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : accounts.length === 0 ? (
          <Card className="col-span-full rounded-xl border-border shadow-none">
            <CardContent className="text-center py-12">
              <Wallet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No accounts yet</p>
              <p className="text-sm text-muted-foreground">
                Create your first account to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          accounts.map((account) => (
            <Card key={account.account_id} className="rounded-xl border-border shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{account.account_type}</span>
                  <Badge variant="outline">{account.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Balance</span>
                    <span className="text-2xl font-bold flex items-center gap-1">
                      <DollarSign className="w-5 h-5" />
                      {Number(account.balance || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Currency</span>
                    <span className="text-sm font-medium">{account.currency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Account ID</span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {account.account_id.slice(0, 8)}...
                    </span>
                  </div>
                  {account.created_at && (
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-muted-foreground">Created</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(account.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

