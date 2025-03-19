import { NextResponse } from "next/server";
import { storage } from "@/app/appwrite"; // Correct import path

export async function GET() {
  try {
    const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string;
    
    // 🔹 Get all files from Appwrite storage
    const files = await storage.listFiles(bucketId);
    console.log(files)

    // 🔹 Filter files that contain "gallery" in the name
    const galleryImages = files.files
      .filter(file => (
        file.$id.includes("gallery")
    )
    ) // ✅ Ensure only gallery images are included
      .map(file => ({
        id: file.$id,
        name: file.name,
        url: `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${file.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
      }));

    return NextResponse.json(galleryImages);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery images" }, { status: 500 });
  }
}
