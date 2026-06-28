import { useNavigate } from "react-router-dom"
import { Star } from "lucide-react"
import { DEVICE_ROUTE } from "../utils/consts"

const DeviceItem = ({ device }) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(DEVICE_ROUTE + "/" + device.id)}
      className="group cursor-pointer overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={`${import.meta.env.VITE_API_URL}/static/${device.img}`}
          alt={device.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='100%25' height='100%25' fill='%23f4f4f5'/%3E%3C/svg%3E" }}
        />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Volt</span>
          <span className="flex items-center gap-1">
            {device.rating}
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          </span>
        </div>
        <div className="mt-1 line-clamp-1 font-medium">{device.name}</div>
        <div className="mt-1 font-semibold">${device.price}</div>
      </div>
    </div>
  )
}

export default DeviceItem