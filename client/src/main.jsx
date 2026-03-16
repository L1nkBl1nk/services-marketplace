import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createContext } from 'react'
import UserStore from './store/UserStore.jsx'
import DeviceStore from './store/DeviceStore.jsx'
import BasketStore from './store/BasketStore.jsx'

export const Context = createContext(null)

createRoot(document.getElementById('root')).render(
  <Context.Provider value={{
    user: new UserStore(),
    device: new DeviceStore(), 
    basket: new BasketStore()
  }}>
    <StrictMode>
      <App />
    </StrictMode>
  </Context.Provider>
)
