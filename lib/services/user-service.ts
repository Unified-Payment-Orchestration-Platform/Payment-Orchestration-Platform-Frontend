import apiClient from "@/lib/api/client"
import { User } from "./auth-service"

export interface UpdateUserRequest {
  username?: string
  email?: string
  phone_number?: string
}

export interface UpdateUserStatusRequest {
  is_active: boolean
}

class UserService {
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>("/users/me")
    return response.data
  }

  async updateCurrentUser(data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<User>("/users/me", data)
    return response.data
  }

  async getUserById(userId: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${userId}`)
    return response.data
  }

  async updateUserStatus(userId: string, data: UpdateUserStatusRequest): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${userId}/status`, data)
    return response.data
  }
}

export const userService = new UserService()

