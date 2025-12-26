import apiClient from "@/lib/api/client";

export interface Account {
  account_id: string;
  user_id: string;
  account_type: string;
  currency: string;
  status: string;
  balance: string | number; // API returns as string (e.g., "0.00")
  created_at?: string;
  updated_at?: string;
}

export interface CreateAccountRequest {
  user_id: string;
  account_type: string;
  currency: string;
}

export interface Transaction {
  transaction_id: string;
  intent_id?: string;
  transaction_type: string;
  amount: number;
  currency: string;
  status: string;
  from_account_id?: string;
  to_account_id?: string;
  created_at: string;
}

class AccountService {
  async createAccount(data: CreateAccountRequest): Promise<Account> {
    const response = await apiClient.post<Account>("/core/accounts", data);
    // Ensure balance is handled correctly (API returns as string)
    return {
      ...response.data,
      balance: response.data.balance || "0.00",
    };
  }

  async getAccount(accountId: string): Promise<Account> {
    const response = await apiClient.get<Account>(
      `/core/accounts/${accountId}`
    );
    return response.data;
  }

  async getUserAccounts(userId: string): Promise<Account[]> {
    const response = await apiClient.get<Account[]>(
      `/core/accounts/user/${userId}`
    );
    return response.data;
  }

  async updateAccountStatus(
    accountId: string,
    status: string
  ): Promise<Account> {
    const response = await apiClient.patch<Account>(
      `/core/accounts/${accountId}/status`,
      { status }
    );
    return response.data;
  }

  async getBalanceHistory(accountId: string): Promise<any[]> {
    const response = await apiClient.get<any[]>(
      `/core/accounts/${accountId}/balance-history`
    );
    return response.data;
  }

  async getAccountTransactions(accountId: string): Promise<Transaction[]> {
    const response = await apiClient.get<Transaction[]>(
      `/core/accounts/${accountId}/transactions`
    );
    return response.data;
  }

  async getTransaction(transactionId: string): Promise<Transaction> {
    const response = await apiClient.get<Transaction>(
      `/core/transactions/${transactionId}`
    );
    return response.data;
  }

  async getTransactionLedger(transactionId: string): Promise<any> {
    const response = await apiClient.get<any>(
      `/core/transactions/${transactionId}/ledger`
    );
    return response.data;
  }

  async reverseTransaction(transactionId: string): Promise<Transaction> {
    const response = await apiClient.post<Transaction>(
      `/core/transactions/${transactionId}/reverse`,
      {}
    );
    return response.data;
  }

  async transferFunds(data: {
    from_account_id: string;
    to_account_id: string;
    amount: number;
    currency: string;
    idempotency_key: string;
    description?: string;
  }): Promise<Transaction> {
    const response = await apiClient.post<Transaction>(
      "/core/transactions/transfer",
      data
    );
    return response.data;
  }

  async depositFunds(data: {
    account_id: string;
    amount: number;
    currency: string;
    idempotency_key: string;
    provider?: string;
    provider_transaction_id?: string;
  }): Promise<Transaction> {
    const response = await apiClient.post<Transaction>(
      "/core/transactions/deposit",
      data
    );
    return response.data;
  }

  async withdrawFunds(data: {
    account_id: string;
    amount: number;
    currency: string;
    idempotency_key: string;
  }): Promise<Transaction> {
    const response = await apiClient.post<Transaction>(
      "/core/transactions/withdrawal",
      data
    );
    return response.data;
  }
}

export const accountService = new AccountService();
