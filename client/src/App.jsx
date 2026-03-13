import { useContext, useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './components/AppRouter'
import Navbarchik from './components/Navbar'
import { Context } from './main'
import { check } from './http/userApi'
import { Spinner } from 'react-bootstrap'
import {observer} from 'mobx-react-lite'


const App = observer(() => {
  const {user} = useContext(Context)
  const [loading, setLoading] = useState(true)

  useEffect(() =>{
    
      check().then(data => {
      user.setUser(data)
      user.setIsAuth(true)
      }). finally(() => setLoading(false))
    
  }, [])

    

  if (loading){
    return <Spinner animation={'grow'} />
  }

 return(
  <BrowserRouter>
    <Navbarchik />
    <AppRouter />
  </BrowserRouter>
 )
})

export default App
