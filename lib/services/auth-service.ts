import apiClient from "@/lib/api/client";

// Types based on Payment Orchestration Platform API
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone_number?: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    user_id: string;
    username: string;
    email: string;
    role: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    user_id: string;
    username: string;
    email: string;
    role: string;
  };
  token: string; // Backend returns 'token' not 'accessToken'
  refreshToken: string;
}

export interface User {
  user_id: string;
  username: string;
  email: string;
  phone_number?: string;
  role: string;
  is_active: boolean;
  risk_profile?: string;
  created_at: string;
}

class AuthService {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>(
      "/auth/register",
      data
    );
    return response.data;
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>("/auth/login", data);
      // Store tokens - backend returns 'token' not 'accessToken'
      if (typeof window !== "undefined") {
        const token = response.data.token || response.data.accessToken;
        localStorage.setItem("accessToken", token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
      // Normalize response to always have accessToken for frontend consistency
      return {
        ...response.data,
        accessToken: response.data.token || response.data.accessToken,
      };
    } catch (error: any) {
      console.error("Login error:", error);

      if (
        error.code === "ECONNREFUSED" ||
        error.message?.includes("Network Error")
      ) {
        throw new Error(
          "Cannot connect to backend server. Please check if the server is running and the API URL is correct."
        );
      }
      if (error.response?.status === 401) {
        throw new Error("Invalid email or password.");
      }
      if (error.response?.status === 404) {
        throw new Error(
          "Backend endpoint not found. Please check API URL configuration."
        );
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || "Login failed. Please try again.");
    }
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await apiClient.post<{ accessToken: string }>(
      "/auth/refresh-token",
      {
        refreshToken: refreshToken,
      }
    );
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>("/users/me");
    return response.data;
  }

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }

  isAuthenticated(): boolean {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("accessToken");
    }
    return false;
  }

  getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  }
}

export const authService = new AuthService();
