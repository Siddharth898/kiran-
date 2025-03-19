"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState<
    { id: string; url: string; caption: string }[]
  >([]);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch("/api/get-images");
        const data = await response.json();

        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setGalleryImages(data);
        }
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      }
    };

    fetchGalleryImages();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
        Image Gallery
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryImages.map((image) => (
          <div
            key={image.id}
            className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
          >
            <Image
              src={image.url}
              alt={image.caption}
              width={300}
              height={300}
              className="w-full h-60 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
