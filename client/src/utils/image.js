// Resolve a product image: full URL (Cloudinary) is used as-is,
// a bare filename falls back to the server's /static folder.
export const productImg = (img) => {
  if (!img) return ""
  return img.startsWith("http") ? img : `${import.meta.env.VITE_API_URL}/static/${img}`
}