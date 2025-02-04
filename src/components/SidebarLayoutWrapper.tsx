import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"

export default function SidebarLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
        <SidebarTrigger aria-label="Toggle Sidebar">Toggle Sidebar</SidebarTrigger>
        {children}
    </SidebarProvider>
  )
}
