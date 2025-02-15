"use client";

import axios from "axios";
import BlogEditor from "./BlogEditor";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CreateBlog = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState<any>(null); // Store editor content
    const [focusedField, setFocusedField] = useState<"title" | "content" | "description" | null>(null);
    const [loading, setLoading] = useState(false);
    const titleRef = useRef<HTMLTextAreaElement>(null!);
    const descriptionRef = useRef<HTMLTextAreaElement>(null!);
    const router = useRouter(); // Router for redirection

    // Adjust height dynamically as user types
    const adjustHeight = (ref: React.RefObject<HTMLTextAreaElement>) => {
        if (ref.current) {
            ref.current.style.height = "auto"; // Reset height
            ref.current.style.height = `${ref.current.scrollHeight}px`; // Set new height
        }
    };

    useEffect(() => {
        adjustHeight(titleRef);
    }, [title]);

    useEffect(() => {
        adjustHeight(descriptionRef);
    }, [description]);

    // Function to handle saving content
    const handleSave = async () => {
        if (!title.trim() || !description.trim() || !content) {
            toast.warning('Title, description, and content are required')
            return; // Prevent further execution
        }

        setLoading(true);

        try {
            const res = await axios.post("/api/blogs/create", { title, description, content });
            console.log("Blog saved:", res.data);

            // Show success alert
            toast.success("Blog Published Successfully", {
                duration: 2000,
            })
            
            setTimeout(() => {
                router.push("/");
            }, 1000); // Redirect after 1 second
        } catch (error) {
            console.error("Error saving blog:", error);
            toast.warning("Failed to save Blog, something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 flex justify-center">
            <div className="flex flex-col w-full max-w-3xl px-4 sm:px-0">
                {/* Title Section */}
                <div className="relative mb-4">
                    <div className={`absolute left-[-50px] top-2 text-sm font-medium transition-opacity duration-200 ${focusedField === "title" ? "opacity-100 text-customPink" : "opacity-0"}`}>
                        Title
                    </div>

                    <textarea
                        ref={titleRef}
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onFocus={() => setFocusedField("title")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full text-4xl font-bold font-serif outline-none p-0 resize-none overflow-hidden bg-white dark:bg-[#1E1F21] text-gray-900 dark:text-gray-50 transition-all duration-300"
                        rows={1} // Starts with 1 row
                        style={{ caretColor: '#db2777' }}
                    />
                </div>

                {/* Description Input */}
                <div className="relative mb-6">
                    <div className={`absolute left-[-100px] top-2 text-sm font-medium transition-opacity duration-200 ${focusedField === "description" ? "opacity-100 text-customPink" : "opacity-0"}`}>
                        Description
                    </div>
                    <textarea
                        ref={descriptionRef}
                        placeholder="Short description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onFocus={() => setFocusedField("description")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full text-lg font-serif outline-none p-0 bg-white dark:bg-[#1E1F21] text-gray-800 dark:text-gray-200 resize-none overflow-hidden transition-all duration-300"
                        rows={2}
                        style={{ caretColor: '#db2777' }}
                    />
                </div>

                {/* Blog Editor */}
                <div className="mb-6">
                    <BlogEditor setContent={setContent} />
                </div>

                {/* Save Button */}
                <div className="flex justify-end mb-36">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className={`bg-customPink text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 ${
                            loading ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg hover:bg-pink-700"
                        }`}
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Publishing...
                            </div>
                        ) : (
                            "Publish Blog"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateBlog;
