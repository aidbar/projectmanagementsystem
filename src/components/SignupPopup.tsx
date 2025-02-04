import { useState } from "react"
import { Button, buttonVariants } from "./ui/button"
import { validateEmail, validatePassword } from "@/lib/auth"

interface SignupPopupProps {
  onClose: () => void;
  onSignup: (firstname: string, lastname: string, username: string, email: string, password: string, confirmPassword: string) => Promise<{ data: any; email: string; password: string; }>;
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
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [firstNameError, setFirstNameError] = useState("")
  const [lastNameError, setLastNameError] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [serverError, setServerError] = useState(errorMessage)

  const handleSignupClick = async () => {
    try {
      await onSignup(firstName, lastName, username, email, password, confirmPassword)
    } catch (error : any) {
      setServerError(error.message)
      console.error("Signup failed", error)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" aria-label="Signup Popup">
      <div className="bg-white p-6 rounded shadow-md w-96" role="dialog" aria-labelledby="signup-dialog-title">
        <h2 id="signup-dialog-title" className="text-xl mb-4">Sign Up</h2>
        {serverError && <p className="text-red-700 mb-2">{serverError}</p>}
        {firstNameError && <p className="text-red-700 mb-2">{firstNameError}</p>}
        <label className="text-sm block mb-1" htmlFor="first-name-input">
          First Name <span className="text-red-700">*</span>
        </label>
        <input
          id="first-name-input"
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          onBlur={() => {
            if (firstName.length < 2) {
              setFirstNameError("First name must be at least 2 characters long.")
            } else {
              setFirstNameError("")
            }
          }}
          className={`mb-2 p-2 border rounded w-full ${firstNameError ? 'border-red-500' : ''}`}
        />
        {lastNameError && <p className="text-red-700 mb-2">{lastNameError}</p>}
        <label className="text-sm block mb-1" htmlFor="last-name-input">
          Last Name <span className="text-red-700">*</span>
        </label>
        <input
          id="last-name-input"
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          onBlur={() => {
            if (lastName.length < 2) {
              setLastNameError("Last name must be at least 2 characters long.")
            } else {
              setLastNameError("")
            }
          }}
          className={`mb-2 p-2 border rounded w-full ${lastNameError ? 'border-red-500' : ''}`}
        />
        {usernameError && <p className="text-red-700 mb-2">{usernameError}</p>}
        <label className="text-sm block mb-1" htmlFor="username-input">
          Username <span className="text-red-700">*</span>
        </label>
        <input
          id="username-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onBlur={() => {
            if (username.length < 4) {
              setUsernameError("Username must be at least 4 characters long.")
            } else {
              setUsernameError("")
            }
          }}
          className={`mb-2 p-2 border rounded w-full ${usernameError ? 'border-red-500' : ''}`}
        />
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
          className={`mb-2 p-2 border rounded w-full ${passwordError ? 'border-red-500' : ''}`}
        />
        {confirmPasswordError && <p className="text-red-700 mb-2">{confirmPasswordError}</p>}
        <label className="text-sm block mb-1" htmlFor="confirm-password-input">
          Confirm Password <span className="text-red-700">*</span>
        </label>
        <input
          id="confirm-password-input"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => {
            if (password !== confirmPassword) {
              setConfirmPasswordError("Passwords do not match.")
            } else {
              setConfirmPasswordError("")
            }
          }}
          className={`mb-4 p-2 border rounded w-full ${confirmPasswordError ? 'border-red-500' : ''}`}
        />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} className={buttonVariants({ variant: "secondary" })} aria-label="Cancel">Cancel</Button>
          <Button 
            onClick={handleSignupClick} 
            disabled={
              !email || !password || !confirmPassword || !firstName || !lastName || !username ||
              !!emailError || !!passwordError || !!confirmPasswordError || !!firstNameError || !!lastNameError || !!usernameError
            }
            aria-label="Sign Up"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  )
}
