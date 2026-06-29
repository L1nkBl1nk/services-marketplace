import { useContext, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { addToBasket, fetchOneDevice } from "../http/deviceApi"
import { Context } from "../main"
import { observer } from "mobx-react-lite"
import { Star, ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BASKET_ROUTE, LOGIN_ROUTE } from "../utils/consts"
import { productImg } from "../utils/image"

const DevicePage = observer(() => {
  const [device, setDevice] = useState({ info: [] })
  const [added, setAdded] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(Context)

  useEffect(() => {
    fetchOneDevice(id).then(data => setDevice(data))
  }, [id])

  const addDeviceToBasket = async () => {
    if (!user.isAuth) return navigate(LOGIN_ROUTE)
    try {
      await addToBasket(device.id)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl border bg-muted">
          <img
            src={productImg(device.img)}
            alt={device.name}
            className="aspect-square w-full object-cover"
            onError={(e) => { e.currentTarget.style.opacity = 0.3 }}
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {device.rating} rating
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{device.name}</h1>
          <div className="mt-4 text-3xl font-semibold">${device.price}</div>

          <Card className="mt-6">
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div className="text-sm text-muted-foreground">In stock · Free shipping</div>
              <Button onClick={addDeviceToBasket}>
                {added ? <><Check className="h-4 w-4" /> Added</> : <><ShoppingCart className="h-4 w-4" /> Add to cart</>}
              </Button>
            </CardContent>
          </Card>

          {device.info?.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-semibold">Specifications</h2>
              <dl className="divide-y rounded-lg border">
                {device.info.map(info => (
                  <div key={info.id} className="flex justify-between px-4 py-3 text-sm">
                    <dt className="text-muted-foreground">{info.title}</dt>
                    <dd className="font-medium">{info.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default DevicePage