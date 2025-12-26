"use client"

import { useState, useEffect } from "react"
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
import { Switch } from "@/components/ui/switch"
import {
  Shield,
  Loader2,
} from "lucide-react"
import { complianceService, type FraudRule } from "@/lib/services/compliance-service"
import { toast } from "sonner"

export function ComplianceContent() {
  const [rules, setRules] = useState<FraudRule[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    setIsLoading(true)
    try {
      const data = await complianceService.getFraudRules()
      setRules(data)
    } catch (error) {
      toast.error("Failed to load fraud rules")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Compliance & Fraud Rules</h2>
        <p className="text-muted-foreground mt-1">
          Manage fraud detection and compliance rules
        </p>
      </div>

      <Card className="rounded-xl border-border shadow-none">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : rules.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No fraud rules configured</p>
              <p className="text-sm text-muted-foreground">
                Fraud rules will appear here when configured
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.rule_id}>
                    <TableCell className="font-medium">{rule.rule_name}</TableCell>
                    <TableCell>{rule.threshold}</TableCell>
                    <TableCell>
                      <Badge variant={rule.is_active ? "default" : "secondary"}>
                        {rule.is_active ? "Active" : "Inactive"}
                      </Badge>
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

