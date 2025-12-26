"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Plus,
  Loader2,
  Trash2,
  CreditCard as CreditCardIcon,
} from "lucide-react"
import { paymentMethodService, type PaymentMethod } from "@/lib/services/payment-method-service"
import { useAuth } from "@/lib/hooks/use-auth"
import { toast } from "sonner"

export function PaymentMethodsContent() {
  const { user } = useAuth()
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    type: "card" as "card" | "bank_account" | "wallet" | "crypto",
    details: "",
    is_default: false,
  })

  useEffect(() => {
    if (user) {
      fetchMethods()
    }
  }, [user])

  const fetchMethods = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const data = await paymentMethodService.getPaymentMethods(user.user_id)
      setMethods(data)
    } catch (error) {
      toast.error("Failed to load payment methods")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsCreating(true)
    try {
      let details: Record<string, any> = {}
      try {
        // Try to parse as JSON, otherwise use as string
        details = formData.details ? JSON.parse(formData.details) : {}
      } catch {
        // If not valid JSON, create a simple object
        details = { value: formData.details }
      }

      const method = await paymentMethodService.createPaymentMethod(user.user_id, {
        type: formData.type,
        details,
        is_default: formData.is_default,
      })
      toast.success("Payment method added successfully")
      await fetchMethods() // Refresh list
      setIsDialogOpen(false)
      setFormData({ type: "card", details: "", is_default: false })
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message || 
        error.message || 
        "Failed to add payment method"
      toast.error(errorMessage)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDelete = async (methodId: string) => {
    if (!user) return
    if (!confirm("Are you sure you want to delete this payment method?")) return

    try {
      await paymentMethodService.deletePaymentMethod(user.user_id, methodId)
      toast.success("Payment method deleted")
      await fetchMethods() // Refresh list
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message || 
        error.message || 
        "Failed to delete payment method"
      toast.error(errorMessage)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "card":
        return <CreditCardIcon className="w-4 h-4" />
      default:
        return <Building2 className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Payment Methods</h2>
          <p className="text-muted-foreground mt-1">
            Manage your payment methods
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl">
              <Plus className="w-4 h-4" />
              Add Payment Method
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>
                Add a new payment method to your account
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  required
                >
                  <option value="card">Card</option>
                  <option value="bank_account">Bank Account</option>
                  <option value="wallet">Wallet</option>
                  <option value="crypto">Crypto</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="details">Details (JSON or text)</Label>
                <Input
                  id="details"
                  type="text"
                  placeholder='{"card_number": "****1234", "expiry": "12/25"}'
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Enter JSON object or plain text
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="is_default" className="text-sm font-normal">
                  Set as default payment method
                </Label>
              </div>
              <Button type="submit" className="w-full" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Payment Method"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="rounded-xl border-border shadow-none">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : methods.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No payment methods yet</p>
              <p className="text-sm text-muted-foreground">
                Add a payment method to get started
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {methods.map((method) => (
                  <TableRow key={method.method_id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(method.type)}
                        <span className="capitalize">{method.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {JSON.stringify(method.details).slice(0, 30)}...
                    </TableCell>
                    <TableCell>
                      {method.is_default ? (
                        <Badge variant="default">Default</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(method.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(method.method_id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
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

