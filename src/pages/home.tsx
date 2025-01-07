import { useState } from "react"
import { Button, buttonVariants } from "../components/ui/button"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { LoginPopup } from "../components/LoginPopup"
import { SignupPopup } from "../components/SignupPopup"

export function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [showSignupPopup, setShowSignupPopup] = useState(false)
  const [signupError, setSignupError] = useState("")

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await axios.post("/login", { email, password })
      return response.data
    },
    onSuccess: () => {
      setIsLoggedIn(true)
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
    },
    onError: () => {
      console.error("Logout failed")
    }
  })

  return (
    <div className="flex flex-col justify-center items-center gap-10 h-screen relative">
      <h1 className="text-2xl">Welcome to the Project Management System!</h1>
      <div className="gap-1 items-center flex flex-col">
        <p className="italic pb-0">Please <a className="underline" href="#" onClick={(e) => { e.preventDefault(); setShowLoginPopup(true); }}>sign in</a> to view your account.</p>
        <p className="italic">No account? <a className="underline" href="#" onClick={(e) => { e.preventDefault(); setShowSignupPopup(true); }}>Sign up.</a></p>
      </div>
      <div className="absolute top-4 right-4">
      {!isLoggedIn ? (
        <div className="flex gap-2">
          <Button className={buttonVariants({variant: "secondary"})} onClick={() => setShowSignupPopup(true)}>Sign Up</Button>
          <Button onClick={() => setShowLoginPopup(true)}>Login</Button>
        </div>
      ) : (
        <Button onClick={() => logoutMutation.mutate()}>Logout</Button>
      )}
      </div>
      {showLoginPopup && (
      <LoginPopup
        onClose={ () => { setShowLoginPopup(false); setLoginError("") } }
        onLogin={(email : string, password : string) => loginMutation.mutate({ email, password }) }
        errorMessage={loginError}
      />
      )}
      {showSignupPopup && (
      <SignupPopup
        onClose={ () => { setShowSignupPopup(false); setSignupError("") } }
        onSignup={(email : string, password : string) => {/* handle signup */}}
        errorMessage={signupError}
      />
      )}
    </div>
  )
}
