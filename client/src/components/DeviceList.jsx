import { useContext } from "react"
import { Context } from "../main"
import DeviceItem from "./DeviceItem"
import { observer } from "mobx-react-lite"

const DeviceList = observer(() => {
  const { device } = useContext(Context)

  if (device.devices.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
        No products found
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
      {device.devices.map(d => (
        <DeviceItem key={d.id} device={d} />
      ))}
    </div>
  )
})

export default DeviceList