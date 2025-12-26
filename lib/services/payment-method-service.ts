import apiClient from "@/lib/api/client"

export interface PaymentMethod {
  method_id: string
  user_id: string
  type: "card" | "bank_account" | "wallet" | "crypto"
  details: Record<string, any>
  is_default: boolean
  created_at: string
}

export interface CreatePaymentMethodRequest {
  type: "card" | "bank_account" | "wallet" | "crypto"
  details: Record<string, any>
  is_default?: boolean
}

class PaymentMethodService {
  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    const response = await apiClient.get<PaymentMethod[]>(`/users/${userId}/payment-methods`)
    return response.data
  }

  async createPaymentMethod(
    userId: string,
    data: CreatePaymentMethodRequest
  ): Promise<PaymentMethod> {
    const response = await apiClient.post<PaymentMethod>(
      `/users/${userId}/payment-methods`,
      data
    )
    return response.data
  }

  async getPaymentMethod(userId: string, methodId: string): Promise<PaymentMethod> {
    const response = await apiClient.get<PaymentMethod>(
      `/users/${userId}/payment-methods/${methodId}`
    )
    return response.data
  }

  async setDefaultPaymentMethod(userId: string, methodId: string): Promise<PaymentMethod> {
    const response = await apiClient.put<PaymentMethod>(
      `/users/${userId}/payment-methods/${methodId}/default`,
      {}
    )
    return response.data
  }

  async deletePaymentMethod(userId: string, methodId: string): Promise<void> {
    await apiClient.delete(`/users/${userId}/payment-methods/${methodId}`)
  }
}

export const paymentMethodService = new PaymentMethodService()

