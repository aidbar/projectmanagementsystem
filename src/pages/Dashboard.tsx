import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header" // Import the Header component

export function Dashboard() {
  const navigate = useNavigate()

  return (
    <div>
        <Header />
        <div className="flex flex-col gap-10 h-screen p-[0.5rem]">
            <h1 className="text-2xl">Welcome, USER!</h1>
            <Button className="w-24" onClick={() => navigate("/")}>Go to Home</Button>
        </div>
    </div>
  )
}
