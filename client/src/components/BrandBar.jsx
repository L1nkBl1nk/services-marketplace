import { observer } from "mobx-react-lite"
import { useContext } from "react"
import { Context } from "../main"
import { cn } from "@/lib/utils"

const BrandBar = observer(() => {
  const { device } = useContext(Context)

  const selectBrand = (brand) => {
    if (device.selectedBrand.id === brand.id) device.setSelectedBrand({})
    else device.setSelectedBrand(brand)
  }

  if (device.brands.length === 0) return null

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {device.brands.map(brand => (
        <button
          key={brand.id}
          onClick={() => selectBrand(brand)}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm transition-colors",
            brand.id === device.selectedBrand?.id
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input hover:bg-accent"
          )}
        >
          {brand.name}
        </button>
      ))}
    </div>
  )
})

export default BrandBar