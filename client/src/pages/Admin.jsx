import CreateType from "../components/modals/CreateType"
import CreateBrand from "../components/modals/CreateBrand"
import CreateDevice from "../components/modals/CreateDevice"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tag, Bookmark, PackagePlus } from "lucide-react"

const Admin = () => {
  return (
    <div className="container py-8">
      <h1 className="mb-1 text-2xl font-bold tracking-tight">Admin panel</h1>
      <p className="mb-6 text-muted-foreground">Manage your catalog — create categories, brands and products.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <Tag className="h-6 w-6 text-muted-foreground" />
            <CardTitle className="mt-2">Categories</CardTitle>
            <CardDescription>Product types like Laptops, Phones…</CardDescription>
          </CardHeader>
          <CardContent><CreateType /></CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Bookmark className="h-6 w-6 text-muted-foreground" />
            <CardTitle className="mt-2">Brands</CardTitle>
            <CardDescription>Manufacturers like Apple, Samsung…</CardDescription>
          </CardHeader>
          <CardContent><CreateBrand /></CardContent>
        </Card>

        <Card>
          <CardHeader>
            <PackagePlus className="h-6 w-6 text-muted-foreground" />
            <CardTitle className="mt-2">Products</CardTitle>
            <CardDescription>Add a new device with image &amp; specs.</CardDescription>
          </CardHeader>
          <CardContent><CreateDevice /></CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Admin