"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Blog {
    id: string;
    title: string;
    description: string;
    author: string;
    imageUrl: string;
}

const Page = () => {
    const router = useRouter();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 8; // 4 per row, 2 rows

    // Function to fetch blogs from localStorage
    const loadBlogs = () => {
        const savedBlogs = JSON.parse(localStorage.getItem("blogs") || "[]");
        setBlogs(savedBlogs);
    };

    // Fetch Blogs when component mounts
    useEffect(() => {
        loadBlogs();

        // Listen for storage changes (sync updates across pages)
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "blogs") {
                loadBlogs();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Pagination logic
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

    return (
        <div className="max-w-6xl mx-auto py-8">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Recent Blogs</h1>

            {/* Blog Grid */}
            <div className="grid grid-cols-4 gap-6">
                {currentBlogs.map((blog) => (
                    <div key={blog.id} className="bg-white p-4 rounded-lg shadow-md">
                        <img src={blog.imageUrl} alt={blog.title} className="w-full h-40 object-cover rounded-md" />
                        <h2 className="text-lg font-semibold mt-2">{blog.title}</h2>
                        <p className="text-sm text-gray-600">{blog.description.slice(0, 100)}...</p>
                        <p className="text-xs text-gray-500 mt-1">By {blog.author}</p>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6 space-x-2">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-sky-600 text-white rounded-md disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => setCurrentPage((prev) => (indexOfLastBlog < blogs.length ? prev + 1 : prev))}
                    disabled={indexOfLastBlog >= blogs.length}
                    className="px-4 py-2 bg-sky-600 text-white rounded-md disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {/* Button to Add Blog */}
            <div className="mt-6 flex justify-center">
                <button
                    onClick={() => router.push("/dashboard/add-blog")}
                    className="px-6 py-3 bg-sky-700 text-white rounded-lg shadow hover:bg-sky-800"
                >
                    Add New Blog
                </button>
            </div>
        </div>
    );
};

export default Page;
