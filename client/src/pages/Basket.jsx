import { useContext, useEffect, useState } from "react"
import { Context } from "../main"
import { observer } from "mobx-react-lite"
import { useNavigate } from "react-router-dom"
import { fetchBasketDevices, deleteBasketDevice, updateBasketQuantity } from "../http/deviceApi"
import { checkout } from "../http/orderApi"
import { Loader2, Minus, Plus, Trash2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SHOP_ROUTE } from "../utils/consts"
import { productImg } from "../utils/image"

const Basket = observer(() => {
  const { basket } = useContext(Context)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)

  const loadBasket = async () => {
    try {
      const data = await fetchBasketDevices()
      basket.setDevices(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadBasket() }, [])

  const changeQty = async (id, quantity) => {
    if (quantity < 1) return removeItem(id)
    try { await updateBasketQuantity(id, quantity); await loadBasket() } catch (e) { console.error(e) }
  }

  const removeItem = async (id) => {
    try { await deleteBasketDevice(id); await loadBasket() } catch (e) { console.error(e) }
  }

  const pay = async () => {
    setPaying(true)
    try {
      const { url } = await checkout()
      window.location.href = url
    } catch (e) {
      alert(e?.response?.data?.message || "Checkout failed")
      setPaying(false)
    }
  }

  const total = basket.devices.reduce((sum, item) => sum + item.device.price * item.quantity, 0)

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
  }

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Your Cart</h1>

      {basket.devices.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-16 text-center">
          <ShoppingCart className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">Your cart is empty</p>
          <Button onClick={() => navigate(SHOP_ROUTE)}>Browse products</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            {basket.devices.map(item => (
              <Card key={item.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <img
                    src={productImg(item.device.img)}
                    alt={item.device.name}
                    className="h-20 w-20 shrink-0 rounded-md border object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{item.device.name}</div>
                    <div className="text-sm text-muted-foreground">${item.device.price}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => changeQty(item.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => changeQty(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                  </div>
                  <div className="w-20 text-right font-semibold">${(item.device.price * item.quantity).toFixed(2)}</div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="h-fit">
            <CardContent className="p-6">
              <h2 className="font-semibold">Order summary</h2>
              <div className="my-4 flex items-center justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="text-xl font-bold">${total.toFixed(2)}</span>
              </div>
              <Button className="w-full" disabled={paying} onClick={pay}>
                {paying ? <><Loader2 className="h-4 w-4 animate-spin" /> Redirecting…</> : "Checkout"}
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">Secure payment via Stripe</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
})

export default Basket