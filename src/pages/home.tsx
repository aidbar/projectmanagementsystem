import { useState } from "react"
import { Button, buttonVariants } from "../components/ui/button"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { LoginPopup } from "../components/LoginPopup"
import { SignupPopup } from "../components/SignupPopup"
import api from "../api"
import { useNavigate } from "react-router-dom"

export function Home() {
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [showSignupPopup, setShowSignupPopup] = useState(false)
  const [signupError, setSignupError] = useState("")
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await api.post("/Authenticate/login", 
        { "email": email, "password": password }
      )
      return response.data
    },
    onSuccess: () => {
      setShowLoginPopup(false)
      setLoginError("")
      navigate("/dashboard")
    },
    onError: (error: AxiosError) => {
      setLoginError(typeof error.response?.data === 'string' ? error.response.data : "Login failed")
    }
  })

  const signupMutation = useMutation({
    mutationFn: async ({ firstname, lastname, username, email, password, confirmPassword }: { firstname: string; lastname: string; username: string; email: string; password: string; confirmPassword: string }) => {
      const response = await api.post("/Users", 
        { "firstname" : firstname, "lastname" : lastname, "username": username, "email": email, "password": password, "confirmPassword": confirmPassword }
      )
      return { data: response.data, email, password }
    },
    onSuccess: async ({ data, email, password }) => {
      setShowSignupPopup(false)
      setSignupError("")
      try {
        const response = await loginMutation.mutateAsync({ email, password })
        localStorage.setItem('refreshToken', response.token.refreshToken)
        localStorage.setItem('accessToken', response.token.accessToken)
        localStorage.setItem('userInfo', JSON.stringify(response.userInfo))
      } catch (error) {
        console.error("Auto-login failed", error)
      }
      navigate("/dashboard")
    },
    onError: (error : AxiosError) => {
      setSignupError(typeof error.response?.data === 'string' ? error.response.data : "Signup failed")
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
        <div className="flex gap-2">
          <Button className={buttonVariants({variant: "secondary"})} onClick={() => setShowSignupPopup(true)}>Sign Up</Button>
          <Button onClick={() => setShowLoginPopup(true)}>Login</Button>
        </div>
      </div>
      {showLoginPopup && (
      <LoginPopup
        onClose={ () => { setShowLoginPopup(false); setLoginError("") } }
        onLogin={(email : string, password : string) => loginMutation.mutateAsync({ email, password }) }
        errorMessage={loginError}
      />
      )}
      {showSignupPopup && (
      <SignupPopup
        onClose={ () => { setShowSignupPopup(false); setSignupError("") } }
        onSignup={(firstname: string, lastname: string, username: string, email: string, password: string, confirmPassword: string) => signupMutation.mutateAsync({ firstname, lastname, username, email, password, confirmPassword }) }
        errorMessage={signupError}
      />
      )}
    </div>
  )
}
