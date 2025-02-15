"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Trash2 } from "lucide-react"; // Import trash icon

const BlogCard = ({ blog, onDelete }: { blog: any; onDelete?: (blogId: string) => void }) => {
  const { data: session } = useSession();
  const isOwner = session?.user?.email && blog?.author?.email && session.user.email === blog.author.email;

  const formattedDate = new Date(blog.createdAt)
    .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    .replace(",", "");

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to blog page
    e.stopPropagation();
    if (onDelete) {
      onDelete(blog._id);
    }
  };

  return (
    <div key={blog._id} className="relative">
      <Link href={`/blogs/${blog._id}`}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50 hover:text-customPink dark:hover:text-customPink transition-colors duration-200 mb-2">{blog.title}</h2>
      </Link>
      <p className="text-gray-600 dark:text-gray-300 transition-colors duration-200">{blog.description}...</p>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200 mt-2">
          <span className="flex gap-4 mt-3 mb-8">
            <span>By {blog?.author?.name}</span> •
            <span className="font-mono">{formattedDate}</span>
          </span>
        </p>
      
        {isOwner && onDelete && (
          <button 
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Delete blog"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default BlogCard;
