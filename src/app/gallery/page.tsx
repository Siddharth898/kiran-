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

<<<<<<< HEAD
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
=======
    setGalleryImages(galleryData);
    console.log(galleryImages);
  });
>>>>>>> upstream/main

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
<<<<<<< HEAD
=======

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeLightbox}
        >
          <div
            className="max-w-3xl w-full p-4 bg-white rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-auto object-contain max-h-[80vh]"
            />
            <p className="mt-2 text-center text-gray-600">
              {selectedImage.alt}
            </p>
            <button
              className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition duration-300 w-full"
              onClick={closeLightbox}
            >
              Close
            </button>
          </div>
        </div>
      )}
>>>>>>> upstream/main
    </div>
  );
};

export default Gallery;
