import { useState } from "react"
import { Button, buttonVariants } from "./ui/button"

interface LoginPopupProps {
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  errorMessage: string;
}

export function LoginPopup({ onClose, onLogin, errorMessage }: LoginPopupProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")

  const handleLogin = () => {
    if (!validateEmail(email)) {
      setEmailError("Invalid email address")
      return
    }
    setEmailError("")
    onLogin(email, password)
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl mb-4">Login</h2>
        {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
        {emailError && <p className="text-red-500 mb-2">{emailError}</p>}
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
        />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} className={buttonVariants({ variant: "secondary" })}>Cancel</Button>
          <Button onClick={handleLogin}>Login</Button>
        </div>
      </div>
    </div>
  )
}
