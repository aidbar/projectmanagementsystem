import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'

import App from "./App"
import "./index.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Dashboard } from "./pages/Dashboard"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="dashboard" element={<Dashboard />}/>
          {/*<Route index element={<DashboardPage />} />
          <Route path="roles" element={<RoleSystemDash />} />
        </Route>*/}
      </Routes>
    </BrowserRouter>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
)
