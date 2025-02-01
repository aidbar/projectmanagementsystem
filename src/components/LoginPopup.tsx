import { useState } from "react"
import { Button, buttonVariants } from "./ui/button"
import { handleLogin, login, validateEmail, validatePassword } from "@/lib/auth"

interface LoginPopupProps {
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  errorMessage: string;
}

export function LoginPopup({ onClose, onLogin, errorMessage }: LoginPopupProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const handleLoginClick = async () => {
    try {
      await handleLogin(email, password)
      await onLogin(email, password)
    } catch (error : any) {
      setEmailError(error.message)
      console.error("Login failed", error)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" aria-label="Login Popup">
      <div className="bg-white p-6 rounded shadow-md w-96" role="dialog" aria-labelledby="login-dialog-title">
        <h2 id="login-dialog-title" className="text-xl mb-4">Login</h2>
        {errorMessage && <p className="text-red-700 mb-2">{errorMessage}</p>}
        {emailError && <p className="text-red-700 mb-2">{emailError}</p>}
        <label className="text-sm block mb-1" htmlFor="email-input">
          Email <span className="text-red-700">*</span>
        </label>
        <input
          id="email-input"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => {
            if (!validateEmail(email)) {
              setEmailError("Please enter a valid email.")
            } else {
              setEmailError("")
            }
          }}
          className={`mb-2 p-2 border rounded w-full ${emailError ? 'border-red-500' : ''}`}
        />
        {passwordError && <p className="text-red-700 mb-2 w-64 h-34 break-words">{passwordError}</p>}
        <label className="text-sm block mb-1" htmlFor="password-input">
          Password <span className="text-red-700">*</span>
        </label>
        <input
          id="password-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => {
            if (!validatePassword(password)) {
              setPasswordError("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.")
            } else {
              setPasswordError("")
            }
          }}
          className={`mb-4 p-2 border rounded w-full ${passwordError ? 'border-red-500' : ''}`}
        />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} className={buttonVariants({ variant: "secondary" })} aria-label="Cancel">Cancel</Button>
          <Button 
            onClick={handleLoginClick} 
            disabled={!validateEmail(email) || !validatePassword(password)}
            aria-label="Login button"
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  )
}
