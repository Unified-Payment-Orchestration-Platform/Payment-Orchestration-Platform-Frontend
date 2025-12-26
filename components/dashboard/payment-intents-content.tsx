"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Plus,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  paymentIntentService,
  type PaymentIntent,
} from "@/lib/services/payment-intent-service";
import { useAuth } from "@/lib/hooks/use-auth";
import { toast } from "sonner";

export function PaymentIntentsContent() {
  const { user } = useAuth();
  const [intents, setIntents] = useState<PaymentIntent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    currency: "USD",
    payment_method_id: "",
  });

  useEffect(() => {
    fetchIntents();
  }, []);

  const fetchIntents = async () => {
    setIsLoading(true);
    try {
      // Payment intents service is not implemented in backend yet (returns 501)
      // For now, show empty state
      // When backend is implemented, uncomment:
      // const data = await paymentIntentService.getPaymentIntents(user?.user_id)
      // setIntents(data)
      setIntents([]);
    } catch (error: any) {
      // Only show error if it's not a 501 (Not Implemented)
      if (error.response?.status !== 501) {
        const errorMessage = 
          error.response?.data?.error || 
          error.response?.data?.message || 
          error.message || 
          "Failed to load payment intents"
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsCreating(true);
    try {
      const intent = await paymentIntentService.createPaymentIntent({
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        user_id: user.user_id,
        payment_method_id: formData.payment_method_id || undefined,
      });
      toast.success("Payment intent created successfully");
      // Refresh intents list from backend
      await fetchIntents();
      setIsDialogOpen(false);
      setFormData({ amount: "", currency: "USD", payment_method_id: "" });
    } catch (error: any) {
      // Extract error message from API response
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to create payment intent";
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusBadge = (status: PaymentIntent["status"]) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      succeeded: "default",
      processing: "secondary",
      failed: "destructive",
      created: "outline",
      requires_action: "secondary",
    };
    const icons = {
      succeeded: CheckCircle2,
      processing: Clock,
      failed: XCircle,
      created: AlertCircle,
      requires_action: AlertCircle,
    };
    const Icon = icons[status] || AlertCircle;

    return (
      <Badge variant={variants[status] || "outline"} className="gap-1">
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Payment Intents
          </h2>
          <p className="text-muted-foreground mt-1">
            Create and manage payment intents
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl">
              <Plus className="w-4 h-4" />
              Create Payment Intent
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle>Create Payment Intent</DialogTitle>
              <DialogDescription>
                Create a new payment intent to process a payment
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="100.00"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_method_id">
                  Payment Method ID (Optional)
                </Label>
                <Input
                  id="payment_method_id"
                  type="text"
                  placeholder="pm_..."
                  value={formData.payment_method_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      payment_method_id: e.target.value,
                    })
                  }
                />
              </div>
              <Button type="submit" className="w-full" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Payment Intent"
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
          ) : intents.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">
                No payment intents yet
              </p>
              <p className="text-sm text-muted-foreground">
                Create your first payment intent to get started
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Intent ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {intents.map((intent) => (
                  <TableRow key={intent.intent_id}>
                    <TableCell className="font-mono text-sm">
                      {intent.intent_id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>{intent.amount}</TableCell>
                    <TableCell>{intent.currency}</TableCell>
                    <TableCell>{getStatusBadge(intent.status)}</TableCell>
                    <TableCell>
                      {new Date(intent.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
