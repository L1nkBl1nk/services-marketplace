import { useContext } from "react"
import { Context } from "../main"
import { observer } from "mobx-react-lite"
import { cn } from "@/lib/utils"

const Pages = observer(() => {
  const { device } = useContext(Context)
  const pageCount = Math.ceil(device.totalCount / device.limit)
  if (pageCount <= 1) return null

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1)

  return (
    <div className="mt-8 flex flex-wrap gap-2">
      {pages.map(page => (
        <button
          key={page}
          onClick={() => device.setPage(page)}
          className={cn(
            "h-9 w-9 rounded-md border text-sm transition-colors",
            device.page === page
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input hover:bg-accent"
          )}
        >
          {page}
        </button>
      ))}
    </div>
  )
})

export default Pages