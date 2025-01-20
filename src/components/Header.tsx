import { Button, buttonVariants } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import api from "@/api"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function Header() {
  const navigate = useNavigate()

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete("/v1/Authenticate/logout")
      return response.data
    },
    onSuccess: () => {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("userInfo")
      navigate("/logged-out")
    },
    onError: () => {
      console.error("Logout failed")
    }
  })

  return (
    <header className="w-full p-4 bg-primary text-white text-left">
      <a href="/" className="text-xl text-white no-underline hover:underline">
        Project Management System
      </a>
      {/*<NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
              <NavigationMenuContent>
                  <NavigationMenuLink>Link</NavigationMenuLink>
              </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu> */}
      <div className="absolute top-3 right-4">
        <Button className={buttonVariants({variant: "secondary"})} onClick={() => logoutMutation.mutate()}>Logout</Button>
      </div>
    </header>
  )
}
