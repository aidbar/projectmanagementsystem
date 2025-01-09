import { Button } from "../components/ui/button"
import { useNavigate, useParams } from "react-router-dom"
import { Header } from "../components/Header"

export function ProjectBoard() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <Header />
      <div className="flex flex-col gap-10 h-screen p-[0.5rem]">
        <h1 className="text-2xl">Project Board Page</h1>
        <p>Project Board ID: {id}</p>
        <Button className="w-28" onClick={() => navigate(-1)}>
          Back to Workspace
        </Button>
      </div>
    </div>
  )
}
