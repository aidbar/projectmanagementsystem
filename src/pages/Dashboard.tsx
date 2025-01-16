import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header" // Import the Header component
import { WorkspacesTable } from "../components/WorkspacesTable"

export function Dashboard() {
  const navigate = useNavigate()

  return (
    <div>
        <Header />
        <div className="flex flex-col gap-10 h-screen p-[0.5rem]">
            <h1 className="text-2xl text-center p-4">Welcome, {JSON.parse(localStorage.getItem('userInfo') || '{}').firstName} {JSON.parse(localStorage.getItem('userInfo') || '{}').lastName}!</h1>
            <Button className="w-28" onClick={() => navigate("/")}>New workspace</Button>
            <WorkspacesTable />
        </div>
    </div>
  )
}
