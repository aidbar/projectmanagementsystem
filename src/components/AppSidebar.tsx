import { Home, Slack } from "lucide-react"
import { useWorkspaces } from "@/context/WorkspacesContext"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  }
]

export function AppSidebar() {
  const { workspaces, loading: workspacesLoading } = useWorkspaces();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Project Management System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workspacesLoading ? (
                <div>Loading...</div>
              ) : (
                workspaces.map((workspace) => (
                  <SidebarMenuItem key={workspace.id}>
                    <SidebarMenuButton asChild>
                      <a href={`/workspace/${workspace.id}`}>
                        <Slack />
                        <span>{workspace.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
