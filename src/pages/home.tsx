import { useState } from "react"
import { Button } from "../components/ui/button"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { LoginPopup } from "../components/LoginPopup"

export function Home() {
  const [message, setMessage] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [loginError, setLoginError] = useState("")

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const response = await axios.post("/login", { username, password })
      return response.data
    },
    onSuccess: () => {
      setIsLoggedIn(true)
      setMessage("Logged in successfully")
      setShowLoginPopup(false)
      setLoginError("")
    },
    onError: () => {
      setLoginError("Login failed")
    }
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.delete("/logout")
      return response.data
    },
    onSuccess: () => {
      setIsLoggedIn(false)
      setMessage("Logged out successfully")
    },
    onError: () => {
      setMessage("Logout failed")
    }
  })

  const handleWelcome = () => {
    setMessage("Why did you?")
  }

  const handleCleanState = () => {
    setMessage("")
  }

  return (
    <div className="flex flex-col justify-center items-center gap-10 h-screen">
      <h1 className="text-2xl">Welcome!</h1>
      {message && <p>{message}</p>}
      {!message ? (
        <Button onClick={handleWelcome}>Do not click me</Button>
      ) : (
        <Button onClick={handleCleanState}>Undo the damage</Button>
      )}
      {!isLoggedIn ? (
        <Button onClick={() => setShowLoginPopup(true)}>Login</Button>
      ) : (
        <Button onClick={() => logoutMutation.mutate()}>Logout</Button>
      )}
      {showLoginPopup && (
        <LoginPopup
          onClose={() => setShowLoginPopup(false)}
          onLogin={(username : string, password : string) => loginMutation.mutate({ username, password })}
          errorMessage={loginError}
        />
      )}
    </div>
  )
}
