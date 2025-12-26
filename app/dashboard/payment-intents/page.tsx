"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { PaymentIntentsContent } from "@/components/dashboard/payment-intents-content"

export default function PaymentIntentsPage() {
  return (
    <DashboardLayout>
      <PaymentIntentsContent />
    </DashboardLayout>
  )
}

