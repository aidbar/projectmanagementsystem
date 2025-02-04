import { useMutation } from "@tanstack/react-query"
import api from "@/api"
import { NavigateFunction } from "react-router-dom"
import { AxiosError } from "axios"

export function useLogout(navigate: NavigateFunction) {
  return useMutation({
    mutationFn: async () => {
      const response = await api.delete("/Authenticate/logout")
      return response.data
    },
    onSuccess: () => {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("userInfo")
      navigate("/logged-out")
    },
    onError: () => {
      console.error("Logout failed")
    }
  })
}

export async function login(email: string, password: string) {
  const response = await api.post("/Authenticate/login", { email, password })
  localStorage.setItem('refreshToken', response.data.token.refreshToken)
  localStorage.setItem('accessToken', response.data.token.accessToken)
  localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo))
  return response.data
}

export async function signup(firstname: string, lastname: string, username: string, email: string, password: string, confirmPassword: string) {
  const response = await api.post("/Users", { firstname, lastname, username, email, password, confirmPassword })
  return { data: response.data, email, password }
}

export function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function validatePassword(password: string) {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return re.test(password)
}

export function useLoginMutation(navigate: NavigateFunction) {
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await login(email, password)
      return response
    },
    onSuccess: () => {
      navigate("/dashboard")
    },
    onError: (error: any) => {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data || "Server error")
      }
      throw new Error(error.message || "Login failed")
    }
  })
}

export function useSignupMutation(navigate: NavigateFunction, loginMutation: ReturnType<typeof useLoginMutation>) {
  return useMutation({
    mutationFn: async ({ firstname, lastname, username, email, password, confirmPassword }: { firstname: string; lastname: string; username: string; email: string; password: string; confirmPassword: string }) => {
      const response = await signup(firstname, lastname, username, email, password, confirmPassword)
      return response
    },
    onSuccess: async (data) => {
      const { email, password } = data
      try {
        await loginMutation.mutateAsync({ email, password })
      } catch (error) {
        console.error("Auto-login failed", error)
      }
      navigate("/dashboard")
    },
    onError: (error: any) => {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data || "Server error")
      }
      throw new Error(error.message || "Signup failed")
    }
  })
}