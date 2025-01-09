import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"

export function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col justify-center items-center gap-10 h-screen">
      <h1 className="text-2xl">Welcome to your Dashboard!</h1>
      <Button onClick={() => navigate("/")}>Go to Home</Button>
    </div>
  )
}
