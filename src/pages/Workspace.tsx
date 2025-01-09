import { Button } from "../components/ui/button"
import { useNavigate, useParams } from "react-router-dom"
import { Header } from "../components/Header"

export function Workspace() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  return (
    <div>
        <Header />
        <div className="flex flex-col gap-10 h-screen p-[0.5rem]">
            <h1 className="text-2xl">Workspace Page</h1>
            <p>Workspace ID: {id}</p>
            <Button className="w-28" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
            {/* Add more workspace-specific content here */}
        </div>
    </div>
  )
}
