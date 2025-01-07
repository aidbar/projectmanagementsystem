import { useState } from "react"
import { Button, buttonVariants } from "./ui/button"

interface SignupPopupProps {
  onClose: () => void;
  onSignup: (email: string, password: string) => void;
  errorMessage: string;
}

export function SignupPopup({ onClose, onSignup, errorMessage }: SignupPopupProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [emailError, setEmailError] = useState("")

  const handleSignup = () => {
    if (!validateEmail(email)) {
      setEmailError("Invalid email address")
      return
    }
    if (password !== confirmPassword) {
      setEmailError("Passwords do not match")
      return
    }
    setEmailError("")
    onSignup(email, password)
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl mb-4">Sign Up</h2>
        {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
        {emailError && <p className="text-red-500 mb-2">{emailError}</p>}
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
        />
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
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
        />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} className={buttonVariants({ variant: "secondary" })}>Cancel</Button>
          <Button onClick={handleSignup}>Sign Up</Button>
        </div>
      </div>
    </div>
  )
}
