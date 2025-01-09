/*import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navmenu"*/
import { Button, buttonVariants } from "@/components/ui/button"
export function Header() {
  return (
    <header className="w-full p-4 bg-primary text-white text-left">
      <h1 className="text-xl">Project Management System</h1>
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
        <Button className={buttonVariants({variant: "secondary"})} onClick={/*() => logoutMutation.mutate()*/ () => console.log("logout")}>Logout</Button>
      </div>
    </header>
  )
}
