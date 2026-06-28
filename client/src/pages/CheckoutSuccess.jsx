import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { confirmOrder } from "../http/orderApi"
import { ORDERS_ROUTE, SHOP_ROUTE } from "../utils/consts"
import { Loader2, CheckCircle2, Clock, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const CheckoutSuccess = () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState("loading")
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const sessionId = params.get("session_id")
    if (!sessionId) { setStatus("error"); return }
    confirmOrder(sessionId)
      .then(data => { setOrder(data); setStatus(data.status === "paid" ? "paid" : "pending") })
      .catch(() => setStatus("error"))
  }, [])

  if (status === "loading") {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Confirming your payment…</p>
      </div>
    )
  }

  return (
    <div className="container flex justify-center py-12">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          {status === "paid" && (
            <>
              <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
              <h1 className="mt-4 text-2xl font-bold">Payment successful!</h1>
              <p className="mt-1 text-muted-foreground">Thank you for your order.</p>
              {order && (
                <div className="my-5 text-left">
                  {order.items?.map(it => (
                    <div key={it.id} className="flex justify-between border-b py-2 text-sm">
                      <span>{it.name} × {it.quantity}</span>
                      <span>${(it.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 font-bold">
                    <span>Total</span><span>${order.total?.toFixed(2)}</span>
                  </div>
                </div>
              )}
              <Button className="w-full" onClick={() => navigate(ORDERS_ROUTE)}>View my orders</Button>
            </>
          )}
          {status === "pending" && (
            <>
              <Clock className="mx-auto h-14 w-14 text-amber-500" />
              <h1 className="mt-4 text-2xl font-bold">Payment processing</h1>
              <p className="mt-1 text-muted-foreground">We'll update your order shortly.</p>
              <Button className="mt-6 w-full" onClick={() => navigate(ORDERS_ROUTE)}>Go to my orders</Button>
            </>
          )}
          {status === "error" && (
            <>
              <AlertTriangle className="mx-auto h-14 w-14 text-destructive" />
              <h1 className="mt-4 text-2xl font-bold">Something went wrong</h1>
              <p className="mt-1 text-muted-foreground">We couldn't confirm this payment.</p>
              <Button variant="outline" className="mt-6 w-full" onClick={() => navigate(SHOP_ROUTE)}>Back to shop</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CheckoutSuccess