import apiClient from "@/lib/api/client"

export interface Subscription {
  subscription_id: string
  user_id: string
  plan_type: string
  status: string
  created_at: string
  updated_at?: string
}

export interface CreateSubscriptionRequest {
  plan_type: string
  metadata?: Record<string, any>
}

class SubscriptionService {
  async getSubscriptions(userId: string): Promise<Subscription[]> {
    const response = await apiClient.get<Subscription[]>(`/users/${userId}/subscriptions`)
    return response.data
  }

  async createSubscription(userId: string, data: CreateSubscriptionRequest): Promise<Subscription> {
    const response = await apiClient.post<Subscription>(
      `/users/${userId}/subscriptions`,
      data
    )
    return response.data
  }

  async deleteSubscription(userId: string, subscriptionId: string): Promise<void> {
    await apiClient.delete(`/users/${userId}/subscriptions/${subscriptionId}`)
  }
}

export const subscriptionService = new SubscriptionService()

