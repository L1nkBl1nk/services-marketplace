import { useContext, useState, useEffect } from "react"
import { Context } from "../../main"
import { createDevice, fetchBrands, fetchTypes } from "../../http/deviceApi"
import { observer } from "mobx-react-lite"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

const selectClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

const CreateDevice = observer(() => {
  const { device } = useContext(Context)
  const [open, setOpen] = useState(false)
  const [info, setInfo] = useState([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [file, setFile] = useState(null)

  useEffect(() => {
    if (!open) return
    fetchTypes().then(data => device.setTypes(data))
    fetchBrands().then(data => device.setBrands(data))
  }, [open])

  const addInfo = () => setInfo([...info, { title: "", description: "", number: Date.now() }])
  const removeInfo = (number) => setInfo(info.filter(i => i.number !== number))
  const changeInfo = (key, value, number) => setInfo(info.map(i => i.number === number ? { ...i, [key]: value } : i))

  const addDevice = () => {
    if (!name || !file || !device.selectedType.id || !device.selectedBrand.id) {
      return alert("Fill name, price, image, category and brand")
    }
    const formData = new FormData()
    formData.append("name", name)
    formData.append("price", `${price}`)
    formData.append("img", file)
    formData.append("brandId", device.selectedBrand.id)
    formData.append("typeId", device.selectedType.id)
    formData.append("info", JSON.stringify(info))
    createDevice(formData).then(() => {
      setName(""); setPrice(0); setFile(null); setInfo([]); setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Add product</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>New product</DialogTitle></DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <select className={selectClass} value={device.selectedType.id || ""}
                onChange={e => device.setSelectedType(device.types.find(t => t.id === Number(e.target.value)) || {})}>
                <option value="">Choose…</option>
                {device.types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Brand</Label>
              <select className={selectClass} value={device.selectedBrand.id || ""}
                onChange={e => device.setSelectedBrand(device.brands.find(b => b.id === Number(e.target.value)) || {})}>
                <option value="">Choose…</option>
                {device.brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Device name" />
          </div>
          <div className="space-y-1.5">
            <Label>Price ($)</Label>
            <Input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} />
          </div>
          <div className="space-y-1.5">
            <Label>Image</Label>
            <Input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label>Specifications</Label>
              <Button type="button" variant="outline" size="sm" onClick={addInfo}><Plus className="h-3 w-3" /> Add</Button>
            </div>
            <div className="space-y-2">
              {info.map(i => (
                <div key={i.number} className="flex gap-2">
                  <Input value={i.title} onChange={e => changeInfo("title", e.target.value, i.number)} placeholder="Title" />
                  <Input value={i.description} onChange={e => changeInfo("description", e.target.value, i.number)} placeholder="Description" />
                  <Button type="button" variant="ghost" size="icon" className={cn("shrink-0 text-muted-foreground hover:text-destructive")} onClick={() => removeInfo(i.number)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={addDevice}>Add product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})

export default CreateDevice