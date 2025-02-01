import { useMutation } from "@tanstack/react-query"
import api from "@/api"
import { NavigateFunction } from "react-router-dom"

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
