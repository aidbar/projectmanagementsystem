import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import App from "./App"
import "./index.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Dashboard } from "./pages/Dashboard"
import { Workspace } from "./pages/Workspace"
import { ProjectBoard } from "./pages/ProjectBoard"
import { Home } from "./pages/home"

const queryClient = new QueryClient()

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const isLoggedIn = localStorage.getItem("accessToken") ? true : false
  return isLoggedIn ? element : <Home />;
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="workspace/:id" element={<ProtectedRoute element={<Workspace />} />} />
        <Route path="project-board/:id" element={<ProtectedRoute element={<ProjectBoard />} />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
)
