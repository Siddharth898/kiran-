"use client";

import { useState, useEffect } from "react";
import AddBlogForm from "./AddBlogForm";
import AddImageToGallery from "./AddImageToGallery";

interface Blog {
  id: string;
  title: string;
  description: string;
  author: string;
  imageUrl: string;
}

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"blog" | "gallery" | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  // Function to fetch blogs from localStorage
  const loadBlogs = () => {
    const savedBlogs = JSON.parse(localStorage.getItem("blogs") || "[]");
    setBlogs(savedBlogs);
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-sky-800 mb-6">Dashboard</h1>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveSection("blog")}
          className={`px-4 py-2 rounded transition ${activeSection === "blog" ? "bg-sky-600 text-white" : "bg-sky-200 text-sky-800 hover:bg-sky-300"
            }`}
        >
          Add Blog
        </button>
        <button
          onClick={() => setActiveSection("gallery")}
          className={`px-4 py-2 rounded transition ${activeSection === "gallery" ? "bg-sky-600 text-white" : "bg-sky-200 text-sky-800 hover:bg-sky-300"
            }`}
        >
          Add Image to Gallery
        </button>
      </div>

      <div className="mt-4">
        {activeSection === "blog" && <AddBlogForm onBack={() => { setActiveSection(null); loadBlogs(); }} />}
        {activeSection === "gallery" && <AddImageToGallery onBack={() => setActiveSection(null)} />}
      </div>

      {/* Blog Listing */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">Blog Posts</h2>
      <div className="grid grid-cols-4 gap-4">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog.id} className="border p-4 rounded shadow-lg">
              <img src={blog.imageUrl} alt={blog.title} className="w-full h-40 object-cover rounded" />
              <h2 className="text-lg font-semibold mt-2">{blog.title}</h2>
              <p className="text-sm text-gray-600">{blog.description}</p>
              <p className="text-sm text-gray-500 mt-1">By {blog.author}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No blog posts available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
