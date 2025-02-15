"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import Spinner from "../components/Spinner";


const BlogsPage = () => {
  const [blogs, setBlogs] = useState<
    { _id: string; title: string; description:string; content: string; author: { name: string }; createdAt: string }[]
  >([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true); // Track initial load

  const fetchBlogs = useCallback(async () => {
    if (!hasMore || loading) return; // Prevent multiple fetch calls

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/blogs?page=${page}&limit=10`);
      if (!res.ok) throw new Error("Failed to fetch blogs"); // Handle non-200 responses

      const data = await res.json();
      if (data.blogs.length === 0) {
        setHasMore(false);
      } else {
        setBlogs((prev) => {
          const newBlogs = data.blogs.filter(
            (blog: any) => !prev.some((b) => b._id === blog._id)
          ); // Prevent duplicates
          return [...prev, ...newBlogs];
        });
        setPage((prev) => prev + 1); // Increment page only after successful fetch
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to load blogs. Please try again later.");
    }

    setLoading(false);
    setInitialLoading(false); // Mark initial load as complete
  }, [hasMore, loading, page]);

  // Fetch blogs on initial render (ONLY ONCE)
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return (
    <div className="bg-white dark:bg-[#1E1F21] transition-colors duration-300 pb-16">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4 flex justify-center"></h1>

        {/* Error Message */}
        {/* {error && <p className="text-red-500 text-center">{error}</p>} */}

        {/* Show Spinner for Initial Load */}
        {initialLoading ? (
          <Spinner />
        ) : (
          <div className="max-w-3xl mx-auto px-0 sm:px-0">
            {/* Display Blogs */}
            {blogs.length === 0 ? (
              <p className="text-center">No blogs available</p>
            ) : (
              <div className="grid gap-6">
                {blogs.map((blog) => {
                  // Format date
                  const formattedDate = new Date(blog.createdAt)
                    .toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })
                    .replace(",", ""); // Remove comma

                  return (
                    <div key={blog._id}>
                      {/* Link directly to the blog ID page */}
                      <Link href={`/blogs/${blog._id}`}>
                        <h2 className="text-xl font-bold hover:text-customPink mb-2">{blog.title}</h2>
                      </Link>

                      {/* <p className="text-gray-600">{blog.description.substring(0, 350)}...</p> */}
                      <p className="text-gray-600">{blog.description}...</p>
                     
                      <p className="text-sm text-gray-500 mt-2">
                        <span className="flex gap-4 mt-3 mb-8">
                          <span>By {blog.author.name}</span> •
                          <span className="font-mono">{formattedDate}</span>
                        </span>
                      </p>
                  
                    </div>
                    
                  );
                })}
              </div>
            )}
  
            {/* Loading Spinner */}
            {loading && blogs.length > 0 && (
              <Spinner></Spinner>
            )}
            {/* Load More Button (only shows after initial load) */}
            {!initialLoading && hasMore && (

              <button
                onClick={fetchBlogs}
                className="font-bold mt-8 hover:text-customPink text-xl flex items-center gap-2"
                disabled={loading}
              >
                Read More
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
