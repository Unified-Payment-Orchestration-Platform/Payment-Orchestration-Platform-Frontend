import apiClient from "@/lib/api/client"

export interface FraudRule {
  rule_id: string
  rule_name: string
  threshold: number
  is_active: boolean
}

export interface ComplianceCheckRequest {
  transaction_id: string
  amount: number
  currency: string
  user_id: string
  metadata?: Record<string, any>
}

export interface ComplianceCheckResponse {
  approved: boolean
  risk_score: number
  reason?: string
}

export interface ComplianceLog {
  log_id: string
  transaction_id: string
  rule_id: string
  rule_name: string
  result: string
  created_at: string
}

class ComplianceService {
  async getFraudRules(): Promise<FraudRule[]> {
    try {
      const response = await apiClient.get<FraudRule[]>("/compliance/fraud-rules")
      return response.data
    } catch (error: any) {
      // If endpoint doesn't exist, return empty array or throw
      if (error.response?.status === 404) {
        console.warn("Fraud rules endpoint not implemented in backend")
        return []
      }
      throw error
    }
  }

  async checkCompliance(data: ComplianceCheckRequest): Promise<ComplianceCheckResponse> {
    const response = await apiClient.post<ComplianceCheckResponse>(
      "/compliance/check",
      data
    )
    return response.data
  }

  async getComplianceLogs(transactionId: string): Promise<ComplianceLog[]> {
    const response = await apiClient.get<ComplianceLog[]>(
      `/compliance/logs/${transactionId}`
    )
    return response.data
  }
}

export const complianceService = new ComplianceService()

