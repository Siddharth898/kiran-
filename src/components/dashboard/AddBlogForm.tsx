"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Blog {
  id: string;
  title: string;
  description: string;
  author: string;
  imageUrl: string;
}

interface AddBlogFormProps {
  onBack: () => void;
}

const AddBlogForm: React.FC<AddBlogFormProps> = ({ onBack }) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  // ✅ Load blogs from localStorage when component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedBlogs = JSON.parse(localStorage.getItem("blogs") || "[]");
      setBlogs(savedBlogs);
    }
  }, []);

  // ✅ Function to handle adding a blog
  const handleAddBlog = (newBlog: Blog) => {
    console.log("Adding Blog:", newBlog); // 🛠 Debugging Log
    const updatedBlogs = [...blogs, newBlog];
    localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
    setBlogs(updatedBlogs);
    window.dispatchEvent(new Event("storage")); // ✅ Ensures updates across pages
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted!"); // 🛠 Debugging Log

    if (!title || !description || !author) {
      alert("Please fill in all fields.");
      return;
    }

    const newBlog: Blog = {
      id: Date.now().toString(),
      title,
      description,
      author,
      imageUrl: image ? URL.createObjectURL(image) : "",
    };

    handleAddBlog(newBlog); // ✅ Call `handleAddBlog`

    // ✅ Clear form after submission
    setTitle("");
    setDescription("");
    setAuthor("");
    setImage(null);

    onBack(); // Go back to dashboard
    router.refresh(); // Refresh page (Next.js-specific fix)
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Blog Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50"
          required
        ></textarea>
      </div>
      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700">
          Author Name
        </label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          Blog Image
        </label>
        <input
          type="file"
          id="image"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
          accept="image/*"
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
        >
          Add Blog Post
        </button>
      </div>
    </form>
  );
};

export default AddBlogForm;
