import { useContext, useEffect } from "react"
import { Context } from "../main"
import { observer } from "mobx-react-lite"
import { fetchBrands, fetchDevices, fetchTypes } from "../http/deviceApi"
import TypeBar from "../components/TypeBar"
import BrandBar from "../components/BrandBar"
import DeviceList from "../components/DeviceList"
import Pages from "../components/Pages"

const Shop = observer(() => {
  const { device } = useContext(Context)

  useEffect(() => {
    fetchTypes().then(data => device.setTypes(data))
    fetchBrands().then(data => device.setBrands(data))
    fetchDevices(null, null, 1, device.limit).then(data => {
      device.setDevices(data.rows)
      device.setTotalCount(data.count)
    })
  }, [])

  useEffect(() => {
    fetchDevices(device.selectedType.id, device.selectedBrand.id, device.page, device.limit)
      .then(data => {
        device.setDevices(data.rows)
        device.setTotalCount(data.count)
      })
  }, [device.page, device.selectedType, device.selectedBrand])

  return (
    <div className="container py-8">
      {/* Hero */}
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-700 px-8 py-12 text-white">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Tech that keeps up with you</h1>
        <p className="mt-2 max-w-xl text-zinc-300">
          Hand-picked electronics — laptops, phones and accessories. Fast shipping, secure checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-2">
          <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categories</h2>
          <TypeBar />
        </aside>

        <div>
          <BrandBar />
          <DeviceList />
          <Pages />
        </div>
      </div>
    </div>
  )
})

export default Shop