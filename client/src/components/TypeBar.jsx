import { observer } from "mobx-react-lite"
import { useContext } from "react"
import { Context } from "../main"
import { cn } from "@/lib/utils"

const TypeBar = observer(() => {
  const { device } = useContext(Context)

  const selectType = (type) => {
    // toggle off if the same type is clicked again
    if (device.selectedType.id === type.id) device.setSelectedType({})
    else device.setSelectedType(type)
  }

  return (
    <div className="flex flex-col gap-1">
      {device.types.map(type => (
        <button
          key={type.id}
          onClick={() => selectType(type)}
          className={cn(
            "rounded-md px-3 py-2 text-left text-sm transition-colors",
            type.id === device.selectedType.id
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {type.name}
        </button>
      ))}
      {device.types.length === 0 && (
        <span className="px-3 py-2 text-sm text-muted-foreground">No categories yet</span>
      )}
    </div>
  )
})

export default TypeBar