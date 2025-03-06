import { NextRequest, NextResponse } from "next/server";
import { databases, client } from "@/app/appwrite";
import { Query, Storage, ID } from "appwrite"; // ✅ Import Storage & ID

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string;



// ✅ GET: Fetch Blogs with Pagination
export async function GET(req: NextRequest) {
  console.log("Fetching blogs...");
  console.log("DATABASE_ID:", DATABASE_ID);
  console.log("COLLECTION_ID:", COLLECTION_ID);
  console.log("BUCKET_ID:", BUCKET_ID);

  if (!DATABASE_ID || !COLLECTION_ID || !BUCKET_ID) {
    console.error("❌ Missing environment variables!");
    return NextResponse.json(
      { success: false, message: "Missing environment variables" },
      { status: 500 }
    );
  }

  try {
    // Get query parameters for pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "6", 10);
    const offset = (page - 1) * limit;

    console.log(`Pagination params - Page: ${page}, Limit: ${limit}, Offset: ${offset}`);

    // Fetch blogs with pagination
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(limit),
      Query.offset(offset),
      Query.orderDesc("$createdAt"),
    ]);

    console.log("✅ Blogs fetched successfully:", response.documents.length);

    // Attach image URLs if blogs have images
    const blogsWithImages = await Promise.all(
      response.documents.map(async (blog) => {
        let imageUrl = null;
        if (blog.imageId) {
          imageUrl = storage.getFileView(BUCKET_ID, blog.imageId);
        }
        return { ...blog, imageUrl };
      })
    );

    return NextResponse.json({ success: true, blogs: blogsWithImages });
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// ✅ POST: Add a New Blog with Image Upload
const storage = new Storage(client); // ✅ Initialize Storage

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("content") as string;
    const author = formData.get("author") as string;
    const file = formData.get("image") as File; // ✅ Direct File object

    if (!title || !description || !author) { 
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }
    console.log("📂 File details:", file);
console.log("✅ Is instance of File:", file instanceof File);


    let imageId = null;
    if (file) {
      console.log("📂 File details before upload:", {
        name: file.name,
        type: file.type,
        size: file.size,
        instanceofBlob: file instanceof Blob,
        instanceofFile: file instanceof File
      });
      // ✅ Directly pass File object
      const uploadedFile = await storage.createFile(

        BUCKET_ID,
        ID.unique(),
        file // 🔥 Appwrite supports File objects directly
      );

      imageId = uploadedFile.$id;
    }

    // ✅ Store Blog Post in Database
    const blogPost = await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
      title,
      content : description,
      imageId,
    });

    console.log("✅ Blog post added:", blogPost);

    return NextResponse.json({ success: true, blog: blogPost });
  } catch (error) {
    console.error("❌ Error adding blog:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add blog" },
      { status: 500 }
    );
  }
}
