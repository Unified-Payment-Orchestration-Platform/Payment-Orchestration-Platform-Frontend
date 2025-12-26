"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { TransactionsContent } from "@/components/dashboard/transactions-content"

export default function TransactionsPage() {
  return (
    <DashboardLayout>
      <TransactionsContent />
    </DashboardLayout>
  )
}

