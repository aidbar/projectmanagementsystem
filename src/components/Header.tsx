import { Button, buttonVariants } from "@/components/ui/button"
import { useLogout } from "@/lib/auth"
import { useNavigate } from "react-router-dom"

export function Header() {
  const navigate = useNavigate()
  const logoutMutation = useLogout(navigate)

  return (
    <header className="w-full p-4 bg-primary text-white text-left">
      <a href="/" className="text-xl text-white no-underline hover:underline">
        Project Management System
      </a>
      <div className="absolute top-3 right-4">
        <Button className={buttonVariants({variant: "secondary"})} onClick={() => logoutMutation.mutate()} aria-label="Logout">Logout</Button>
      </div>
    </header>
  )
}
