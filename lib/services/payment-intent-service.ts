import apiClient from "@/lib/api/client";

export interface PaymentIntent {
  intent_id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: "created" | "processing" | "requires_action" | "succeeded" | "failed";
  metadata?: Record<string, any>;
  created_at: string;
}

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  user_id: string;
  payment_method_id?: string;
  metadata?: Record<string, any>;
}

export interface ConfirmPaymentIntentRequest {
  payment_method_id: string;
}

export interface InitiatePaymentRequest {
  paymentType: string;
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  transaction_id: string;
  status: string;
  amount: string;
  [key: string]: any;
}

class PaymentIntentService {
  async createPaymentIntent(
    data: CreatePaymentIntentRequest
  ): Promise<PaymentIntent> {
    try {
      const response = await apiClient.post<PaymentIntent>(
        "/payment-intents",
        data
      );
      return response.data;
    } catch (error: any) {
      // Extract error message from API response
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to create payment intent";
      throw new Error(errorMessage);
    }
  }

  async initiatePayment(
    data: InitiatePaymentRequest
  ): Promise<PaymentResponse> {
    const response = await apiClient.post<PaymentResponse>(
      "/v1/payments",
      data
    );
    return response.data;
  }

  async getPaymentIntent(intentId: string): Promise<PaymentIntent> {
    const response = await apiClient.get<PaymentIntent>(
      `/payment-intents/${intentId}`
    );
    return response.data;
  }

  async confirmPaymentIntent(
    intentId: string,
    data: ConfirmPaymentIntentRequest
  ): Promise<PaymentIntent> {
    const response = await apiClient.post<PaymentIntent>(
      `/payment-intents/${intentId}/confirm`,
      data
    );
    return response.data;
  }
}

export const paymentIntentService = new PaymentIntentService();
