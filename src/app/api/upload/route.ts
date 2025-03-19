import { NextRequest, NextResponse } from "next/server"
import { storage, ID } from "@/app/appwrite" // Correct import path

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("image") as File
    const caption = formData.get("caption") as string

    if (!file) return NextResponse.json({ error: "No image provided" }, { status: 400 })

    // Convert File to Blob for Appwrite upload

    const fileName = `gallery_${ID.unique()}`
    const uploadedFile = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string,
      fileName,
      file
    )

    const imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${uploadedFile.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`

    return NextResponse.json({ success: true, imageUrl, caption })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
