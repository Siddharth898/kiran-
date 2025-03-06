"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface AddBlogFormProps {
  onBack: () => void;
}

const AddBlogForm: React.FC<AddBlogFormProps> = ({ onBack }) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !author) {
      alert("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", description);
    formData.append("author", author);
    if (image) formData.append("image", image);

    setLoading(true);
    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        alert("Blog added successfully!");
        setTitle("");
        setDescription("");
        setAuthor("");
        setImage(null);
        onBack(); // Navigate back
        router.refresh(); // Refresh blogs
      } else {
        alert("Failed to add blog. Try again!");
      }
    } catch (error) {
      console.error("Error submitting blog:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
          disabled={loading}
        >
          Back
        </button>
        <button
          type="submit"
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Blog Post"}
        </button>
      </div>
    </form>
  );
};

export default AddBlogForm;
