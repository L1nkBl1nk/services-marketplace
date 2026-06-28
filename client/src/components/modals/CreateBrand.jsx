import { useState } from "react"
import { createBrand } from "../../http/deviceApi"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const CreateBrand = () => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  const addBrand = () => {
    if (!value.trim()) return alert("Enter a brand name")
    createBrand({ name: value }).then(() => { setValue(""); setOpen(false) })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">Create brand</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle>New brand</DialogTitle></DialogHeader>
        <Input value={value} onChange={e => setValue(e.target.value)} placeholder="e.g. Apple"
          onKeyDown={e => e.key === "Enter" && addBrand()} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={addBrand}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateBrand