import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from "../utils/consts"
import { login, registration } from "../http/userApi"
import { useContext, useState } from "react"
import { observer } from "mobx-react-lite"
import { Context } from "../main"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const Auth = observer(() => {
  const { user } = useContext(Context)
  const navigate = useNavigate()
  const location = useLocation()
  const isLogin = location.pathname === LOGIN_ROUTE
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const auth = async () => {
    setLoading(true)
    try {
      const data = isLogin
        ? await login(email, password)
        : await registration(email, password)
      user.setUser(data)
      user.setIsAuth(true)
      navigate(SHOP_ROUTE)
    } catch (e) {
      alert(e.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex min-h-[calc(100vh-9rem)] items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{isLogin ? "Welcome back" : "Create your account"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && auth()} />
          </div>
          <Button className="w-full" onClick={auth} disabled={loading}>
            {loading ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? (
              <>Don't have an account? <NavLink to={REGISTRATION_ROUTE} className="font-medium text-foreground underline-offset-4 hover:underline">Sign up</NavLink></>
            ) : (
              <>Already have an account? <NavLink to={LOGIN_ROUTE} className="font-medium text-foreground underline-offset-4 hover:underline">Sign in</NavLink></>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
})

export default Auth