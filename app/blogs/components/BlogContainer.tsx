"use client";
import { useState, useEffect, useCallback } from "react";

import BlogList from "./BlogList";

import Spinner from "@/app/components/Spinner";

const BlogContainer = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchBlogs = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/blogs?page=${page}&limit=10`);
      if (!res.ok) throw new Error("Failed to fetch blogs");

      const data = await res.json();
      if (data.blogs.length === 0) {
        setHasMore(false);
      } else {
        setBlogs((prev) => [
          ...prev.filter((b) => !data.blogs.some((blog: any) => b._id === blog._id)),
          ...data.blogs,
        ]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to load blogs.");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [hasMore, loading, page]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 flex justify-center">Blogs</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {initialLoading ? (
        <Spinner />
      ) : (
        <div className="max-w-2xl mx-auto">
          <BlogList blogs={blogs} />
          {loading && <Spinner />}
          {/* <LoadMoreButton fetchBlogs={fetchBlogs} hasMore={hasMore} loading={loading} /> */}
        </div>
      )}
    </div>
  );
};

export default BlogContainer;
