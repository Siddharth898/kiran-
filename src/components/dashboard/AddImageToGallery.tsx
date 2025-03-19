"use client"

import { useState } from "react"

interface AddImageToGalleryProps {
  onBack: () => void
}

const AddImageToGallery: React.FC<AddImageToGalleryProps> = ({ onBack }) => {
  const [image, setImage] = useState<File | null>(null)
  const [caption, setCaption] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!image) {
      setError("Please select an image to upload.")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData()
    formData.append("image", image)
    formData.append("caption", caption)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to upload image")

      const data = await response.json()
      console.log("Image uploaded:", data)

      setSuccess("Image uploaded successfully!")
      setImage(null)
      setCaption("")

      // Go back after short delay
      setTimeout(() => onBack(), 1500)
    } catch (err) {
      setError("Upload failed. Please try again.")
      console.error(err)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-sky-800 mb-6">Add Image to Gallery</h1>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <div>
        <label htmlFor="gallery-image" className="block text-sm font-medium text-gray-700">
          Gallery Image
        </label>
        <input
          type="file"
          id="gallery-image"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
          accept="image/*"
          required
        />
      </div>
      <div>
        <label htmlFor="caption" className="block text-sm font-medium text-gray-700">
          Image Caption
        </label>
        <input
          type="text"
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-sky-600 bg-white hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          Back
        </button>
        <button
          type="submit"
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Add to Gallery"}
        </button>
      </div>
    </form>
  )
}

export default AddImageToGallery
