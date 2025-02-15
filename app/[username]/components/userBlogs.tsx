"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import Spinner from "@/app/components/Spinner";
import LoadMoreButton from "@/app/blogs/components/LoadMoreButton";
import HorizontalLine from "@/app/components/ui/HorizontalLine";

interface UserBlogsProps {
  onReady?: () => void;
}

const UserBlogs = ({ onReady }: UserBlogsProps) => {
  const { username } = useParams();
  const { data: session } = useSession();
  const [userId, setUserId] = useState<string | null>(null);
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${username}`);
        if (!res.ok) throw new Error("User not found");
        const data = await res.json();
        if (data?._id) {
          setUserId(data._id);
        } else {
          throw new Error("Invalid user ID");
        }
      } catch (err) {
        setError("User not found");
      }
    };
    fetchUser();
  }, [username]);

  const fetchBlogs = useCallback(async () => {
    if (!userId || loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/blogs/user/${userId}?page=${page}&limit=10`
      );
      if (!res.ok) throw new Error("Failed to fetch blogs");
      const data = await res.json();
      if (data.blogs.length === 0) {
        setHasMore(false);
      } else {
        setBlogs((prev) => [
          ...prev,
          ...data.blogs.filter((blog) => !prev.some((b) => b._id === blog._id)),
        ]);
        setPage((prev) => prev + 1);
      }
    } catch {
      setError("Failed to load blogs.");
    }
    setLoading(false);
    setInitialLoading(false);
    onReady?.();
  }, [userId, page, hasMore, onReady]);

  const handleDeleteBlog = async (blogId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/blogs/${blogId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete blog");
      setBlogs((prev) => prev.filter((blog) => blog._id !== blogId));
      setShowDeleteConfirm(false);
      setBlogToDelete(null);
    } catch {
      alert("Failed to delete blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      setBlogs([]);
      setPage(1);
      setHasMore(true);
      fetchBlogs();
    }
  }, [userId]);

  if (error) return <p className="text-center text-red-500 dark:text-red-400 transition-colors duration-200">{error}</p>;
  if (initialLoading) return <div className="w-full flex justify-center items-center min-h-[200px]"><Spinner /></div>;

  return (
    <div className="w-full">
      {blogs.length === 0 ? (
        <p className="text-center text-gray-700 dark:text-gray-50 transition-colors duration-200 py-8">No blogs available</p>
      ) : (
        <>
          <div className="px-6 py-4">
            <div className="grid gap-8">
              {blogs.map((blog) => {
                const isOwner =
                  session?.user?.email &&
                  blog?.author?.email &&
                  session.user.email === blog.author.email;
                const formattedDate = new Date(blog.createdAt)
                  .toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                  .replace(",", "");
                return (
                  <div key={blog._id} className="relative">
                    <Link href={`/blogs/${blog._id}`}>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white hover:text-customPink dark:hover:text-customPink transition-colors duration-200 mb-3">
                        {blog.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-100 transition-colors duration-200 line-clamp-2">{blog.description}...</p>
                    <div className="flex justify-between items-center py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-200 flex items-center gap-4 transition-colors duration-200">
                        <span>By {blog?.author?.name}</span> •
                        <span className="font-mono">{formattedDate}</span>
                      </div>

                      {isOwner && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setBlogToDelete(blog._id);
                            setShowDeleteConfirm(true);
                          }}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                          aria-label="Delete blog"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                    <div className="mt-4">
                      <HorizontalLine />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="py-4">
              <LoadMoreButton
                fetchBlogs={fetchBlogs}
                hasMore={hasMore}
                loading={loading}
              />
            </div>
          </div>
        </>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[60]">
          <div className="bg-white dark:bg-[#1E1F21] p-6 rounded-lg shadow-lg w-80 border border-gray-200 dark:border-gray-700">
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Delete Blog</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Are you sure you want to delete this blog? This action cannot be undone.</p>
            
            <div className="flex gap-3">
              <button
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setBlogToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
                onClick={() => blogToDelete && handleDeleteBlog(blogToDelete)}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBlogs;
