import { useContext, useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './components/AppRouter'
import Navbar from './components/Navbar'
import { Context } from './main'
import { check } from './http/userApi'
import { observer } from 'mobx-react-lite'
import { Loader2 } from 'lucide-react'

const App = observer(() => {
  const { user } = useContext(Context)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    check().then(data => {
      user.setUser(data)
      user.setIsAuth(true)
    }).catch(() => {
      user.setIsAuth(false)
      localStorage.removeItem('token')
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <AppRouter />
        </main>
        <footer className="border-t py-8">
          <div className="container flex flex-col items-center justify-between gap-2 text-sm text-muted-foreground sm:flex-row">
            <span>© 2026 Volt — Electronics Store</span>
            <span>Built with React, Node.js &amp; Stripe</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
})

export default App