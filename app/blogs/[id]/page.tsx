"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Spinner from "@/app/components/Spinner";
import { calculateReadTime } from "@/app/components/utility/readTime";
import { generateHTML } from "@tiptap/html";
import defaultExtensions, { StarterKit } from "@tiptap/starter-kit";
import DOMPurify from "dompurify";
import NextImage from "next/image"; // Import and rename next/image
import TipTapImage from "@tiptap/extension-image"; // Keep TipTap's Image extension
// import "../../components/ui/blogstyles.css";
// import { CustomExtensions } from "@/app/components/ui/customExtensions";

import "./blogstyles.css"
import TipTapLink from "@tiptap/extension-link";
import Link from "next/link";
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';

const BlogDetailsPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        if (!res.ok) {
          throw new Error("Blog not found");
        }
        const data = await res.json();
        // console.log("API response :", data);
        console.log("API response :", data.blog.content);
        setBlog(data.blog);
      } catch (error) {
        setError("Blog not found");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <div><Spinner /></div>;
  if (error) return <p className="text-center text-red-500 dark:text-red-400 mt-8">{error}</p>;
  if (!blog) return <p className="text-center text-gray-700 dark:text-gray-300 mt-8">Blog not found</p>;

  // ✅ Ensure blog.content exists before using generateHTML
  const formattedContent = blog?.content
    ? generateHTML(blog.content, [
        defaultExtensions,
        TipTapImage,
        StarterKit,
        TipTapLink,
        Underline,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        TaskList,
        TaskItem.configure({
          nested: true,
        })
      ])
    : "<p>No content available</p>"; // Default message if content is missing
    console.log("Generated HTML:", formattedContent);


  // ✅ Calculate read time safely
  const readTime = blog?.content ? calculateReadTime(blog.content) : 0;

  return (
    <div className="bg-white dark:bg-[#1E1F21] transition-colors duration-300 pb-16">
      <div className="p-8">
        <div className="max-w-3xl mx-auto px-0 sm:px-0 pt-10 pb-16">
        <p className="text-gray-500 dark:text-gray-400 text-md font-mono mb-8 transition-colors duration-200">
          {new Date(blog.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "2-digit",
            year: "numeric",
          })}
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-4 leading-tight transition-colors duration-200">{blog.title}</h1>
        <div>
          <p className="text-xl text-gray-700 dark:text-gray-200 transition-colors duration-200 leading-relaxed">{blog.description}</p>
        </div>
        <div className="flex items-center gap-4 mt-8 mb-12 border-b border-gray-100 dark:border-gray-800 pb-8">
        <Link href={`/${blog.author.username}`} >
          <NextImage
            src={blog.author.image || "/images/defaultAvatar.png"}
            alt={blog.author.name || "Author avatar"}
            width={48} // equivalent to w-12 (12*4px)
            height={48} // equivalent to h-12 (12*4px)
            className="rounded-full border border-gray-300 dark:border-gray-700 transition-colors duration-200 object-cover"
          />
           </Link>
          <div>
          <Link href={`/${blog.author.username}`} className="hover:underline">
            <p className="font-semibold text-gray-900 dark:text-gray-50 transition-colors duration-200">{blog.author.name}</p>
          </Link>
            
            <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">{readTime} min read</p>
          </div>
        </div>

        {/* ✅ Blog Content with Full Formatting */}
        <article className="mt-8 prose prose-lg dark:prose-invert blog-content transition-colors duration-200" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formattedContent) }} />
      </div>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
