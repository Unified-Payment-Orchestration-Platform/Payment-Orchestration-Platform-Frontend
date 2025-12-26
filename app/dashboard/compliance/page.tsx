"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ComplianceContent } from "@/components/dashboard/compliance-content"

export default function CompliancePage() {
  return (
    <DashboardLayout>
      <ComplianceContent />
    </DashboardLayout>
  )
}

