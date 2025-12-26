"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { PaymentMethodsContent } from "@/components/dashboard/payment-methods-content"

export default function PaymentMethodsPage() {
  return (
    <DashboardLayout>
      <PaymentMethodsContent />
    </DashboardLayout>
  )
}

