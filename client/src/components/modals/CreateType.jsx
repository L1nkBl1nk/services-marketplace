import { useState } from "react"
import { createType } from "../../http/deviceApi"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const CreateType = () => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  const addType = () => {
    if (!value.trim()) return alert("Enter a category name")
    createType({ name: value }).then(() => { setValue(""); setOpen(false) })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">Create category</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle>New category</DialogTitle></DialogHeader>
        <Input value={value} onChange={e => setValue(e.target.value)} placeholder="e.g. Laptops"
          onKeyDown={e => e.key === "Enter" && addType()} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={addType}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateType