"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import Spinner from "./components/Spinner";

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch blogs
  const fetchBlogs = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/blogs?page=${page}&limit=12`);
      if (!res.ok) throw new Error("Failed to fetch blogs");

      const data = await res.json();
      
      // Check if we have any blogs in the response
      if (data.blogs.length === 0) {
        setHasMore(false);
        setLoading(false);
        setInitialLoading(false);
        return;
      }

      // Update blogs state
      setBlogs((prev) => {
        const newBlogs = data.blogs.filter(
          (blog) => !prev.some((b) => b._id === blog._id)
        );
        return [...prev, ...newBlogs];
      });

      // If we got less than 12 blogs, there are no more to load
      if (data.blogs.length < 12) {
        setHasMore(false);
      } else {
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to load blogs. Please try again later.");
    }

    setLoading(false);
    setInitialLoading(false);
  }, [hasMore, loading, page]);

  // Fetch blogs on mount
  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* <h1 className="text-2xl font-bold text-center mb-6">Latest Blogs</h1> */}

      {error && <p className="text-red-500 dark:text-red-400 text-center mb-6 transition-colors duration-200">{error}</p>}

      {initialLoading ? (
        <div className="flex justify-center mt-10">
          <Spinner size="lg" className="my-12" />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          {blogs.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10 transition-colors duration-200">No blogs available</p>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {blogs.map((blog) => {
                const formattedDate = new Date(blog.createdAt)
                  .toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                  .replace(",", "");

                return (
                  <div
                    key={blog._id}
                    className="py-6 transition-all duration-300 border-b border-gray-100 dark:border-gray-800"
                  >
                    <Link href={`/blogs/${blog._id}`}>
                      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 hover:text-customPink dark:hover:text-customPink transition duration-300">
                        {blog.title}
                      </h2>
                    </Link>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mt-3 mb-4 line-clamp-2 transition-colors duration-200">{blog.description}...</p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-4 transition-colors duration-200">
                      <Link href={`/${blog.author.username}`} className="flex items-center mr-2">
                        <Image
                          src={blog.author.image || "/images/defaultAvatar.png"}
                          alt={blog.author.name || "Author avatar"}
                          width={24}
                          height={24}
                          className="rounded-full mr-2 border border-gray-200 dark:border-gray-600 object-cover"
                        />
                        <span className="font-medium text-base hover:text-customPink transition-colors duration-200">
                          {blog.author.name}
                        </span>
                      </Link>
                      <span className="mx-2 text-base">•</span>
                      <span className="text-base">{formattedDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {loading && blogs.length > 0 && (
            <div className="flex justify-center mt-6">
              <Spinner size="md" />
            </div>
          )}

          {!initialLoading && hasMore && blogs.length > 0 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={fetchBlogs}
                className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-customPink dark:hover:text-customPink font-medium transition-colors duration-300 focus:outline-none"
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default BlogsPage;
