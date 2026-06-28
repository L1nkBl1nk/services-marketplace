import { useEffect, useState } from "react"
import { fetchMyOrders } from "../http/orderApi"
import { Loader2, Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyOrders().then(setOrders).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
  }

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">My Orders</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center text-muted-foreground">
          <Package className="h-10 w-10" />
          You have no orders yet
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order.id}>
              <CardContent className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-semibold">Order #{order.id}</span>
                  <Badge variant={order.status === "paid" ? "success" : "secondary"}>{order.status}</Badge>
                </div>
                <div className="mb-3 text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</div>
                <div className="divide-y border-t">
                  {order.items?.map(it => (
                    <div key={it.id} className="flex justify-between py-2 text-sm">
                      <span>{it.name} × {it.quantity}</span>
                      <span>${(it.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-3 font-semibold">
                  <span>Total</span><span>${order.total?.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders