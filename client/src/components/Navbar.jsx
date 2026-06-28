import { useContext } from "react"
import { Context } from "../main"
import { NavLink, useNavigate } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { ShoppingCart, Package, LayoutDashboard, LogOut, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ADMIN_ROUTE, BASKET_ROUTE, LOGIN_ROUTE, ORDERS_ROUTE, SHOP_ROUTE } from "../utils/consts"

const Navbar = observer(() => {
  const navigate = useNavigate()
  const { user } = useContext(Context)

  const logOut = () => {
    user.setUser({})
    user.setIsAuth(false)
    localStorage.removeItem("token")
    navigate(SHOP_ROUTE)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <NavLink to={SHOP_ROUTE} className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" />
          </span>
          Volt
        </NavLink>

        <nav className="flex items-center gap-2">
          {user.isAuth ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate(ORDERS_ROUTE)}>
                <Package className="h-4 w-4" /> Orders
              </Button>
              {user.user?.role === "ADMIN" && (
                <Button variant="ghost" size="sm" onClick={() => navigate(ADMIN_ROUTE)}>
                  <LayoutDashboard className="h-4 w-4" /> Admin
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => navigate(BASKET_ROUTE)}>
                <ShoppingCart className="h-4 w-4" /> Cart
              </Button>
              <Button variant="ghost" size="icon" onClick={logOut} title="Log out">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => navigate(LOGIN_ROUTE)}>Sign in</Button>
          )}
        </nav>
      </div>
    </header>
  )
})

export default Navbar