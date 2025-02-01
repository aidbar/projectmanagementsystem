import { useState } from "react"
import { Button, buttonVariants } from "../components/ui/button"
import { LoginPopup } from "../components/LoginPopup"
import { SignupPopup } from "../components/SignupPopup"
import { useLoginMutation, useSignupMutation } from "@/lib/auth"
import { useNavigate } from "react-router-dom"

export function Home() {
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [showSignupPopup, setShowSignupPopup] = useState(false)
  const [signupError, setSignupError] = useState("")
  const navigate = useNavigate()

  const loginMutation = useLoginMutation(navigate)
  const signupMutation = useSignupMutation(navigate, loginMutation)

  return (
    <div className="flex flex-col justify-center items-center gap-10 h-screen relative p-4">
      <h1 className="text-2xl text-center">Welcome to the Project Management System!</h1>
      <div className="gap-1 items-center flex flex-col text-center">
        <p className="italic pb-0">Please <a className="underline" href="#" onClick={(e) => { e.preventDefault(); setShowLoginPopup(true); }}>sign in</a> to view your account.</p>
        <p className="italic">No account? <a className="underline" href="#" onClick={(e) => { e.preventDefault(); setShowSignupPopup(true); }}>Sign up.</a></p>
      </div>
      <div className="absolute top-4 right-4">
        <div className="flex gap-2">
          <Button className={buttonVariants({variant: "secondary"})} onClick={() => setShowSignupPopup(true)} aria-label="Sign Up">Sign Up</Button>
          <Button onClick={() => setShowLoginPopup(true)} aria-label="Login">Login</Button>
        </div>
      </div>
      {showLoginPopup && (
      <LoginPopup
        onClose={ () => { setShowLoginPopup(false); setLoginError("") } }
        onLogin={(email : string, password : string) => loginMutation.mutateAsync({ email, password }).catch(error => setLoginError(error.message)) }
        errorMessage={loginError}
        aria-label="Login Popup"
      />
      )}
      {showSignupPopup && (
      <SignupPopup
        onClose={ () => { setShowSignupPopup(false); setSignupError("") } }
        onSignup={(firstname: string, lastname: string, username: string, email: string, password: string, confirmPassword: string) => signupMutation.mutateAsync({ firstname, lastname, username, email, password, confirmPassword }) }
        errorMessage={signupError}
        aria-label="Signup Popup"
      />
      )}
    </div>
  )
}
