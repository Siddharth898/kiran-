"use client";

import { useEffect } from "react";

function Page() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/blogs");
        const data = await res.json();
        console.log(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  return (
    <div className="bg-blue-400 h-screen w-full flex justify-center items-center">
      <div className="bg-blue-500 h-1/4 w-1/3 rounded-lg shadow-xl border-2 border-blue-600 text-white text-4xl text-center flex justify-center items-center">
        Coming Soon
      </div>
    </div>
  );
}

export default Page;
