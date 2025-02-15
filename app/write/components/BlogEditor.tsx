"use client";

import Image from "@tiptap/extension-image";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState, useRef, useEffect } from "react";
import "./styles.css";
import SvgIconUse from "@/app/components/ui/SvgIconUse";
import EditorToolbar from "./EditorToolbar";
import { Link } from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  Heading1, Heading2, Heading3, List, ListOrdered, 
  Quote, Code, Link as LinkIcon, Image as ImageIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Table as TableIcon, CheckSquare
} from "lucide-react";

const BlogEditor = ({setContent}:{setContent:(content:any)=> void}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [editorClicked, setEditorClicked] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<{ top: number | null }>({ top: null });
  const [currentParagraphPos, setCurrentParagraphPos] = useState<number | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'tiptap-link'
        }
      }),
      Placeholder.configure({
        placeholder: 'Start writing your blog...',
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    onUpdate: ({ editor }) => {
      setContent(editor.getJSON());
    },
    onSelectionUpdate: ({ editor }) => {
      if (!editorClicked) return;

      updateButtonPosition(editor);

      const { selection } = editor.state;
      const { $from } = selection;
      const currentNode = $from.parent;

      // Safe way to get paragraph position
      const paragraphPos = $from.depth > 0 ? $from.before() : null;

      // Check if we've moved to a different paragraph
      if (currentParagraphPos !== null && currentParagraphPos !== paragraphPos) {
        setIsMenuOpen(false); // Reset menu state when changing paragraphs
      }

      setCurrentParagraphPos(paragraphPos);

      const isEmpty = currentNode.type.name === "paragraph" && currentNode.content.size === 0;
      setShowButton(isEmpty);
    },
  });

  // Handle keyboard events
  useEffect(() => {
    if (editor) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
          setIsMenuOpen(false);
        }
      };

      editor.view.dom.addEventListener("keydown", handleKeyDown);
      return () => {
        editor.view.dom.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [editor]);

  const handleImageUpload = async (file: File) => {
    try {
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        try {
          const base64String = reader.result as string;
          
          const response = await fetch('api/blogs/upload-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageData: base64String }),
          });
          
          if (!response.ok) {
            throw new Error(`Image upload failed: ${response.status} ${response.statusText}`);
          }
          
          const data = await response.json();
          
          editor?.chain().focus().setImage({ 
            src: data.url,
          }).run();
        } catch (error) {
          console.error('Error in upload request:', error);
          alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      };
      
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Error setting up upload:', error);
      alert('Failed to process image. Please try again.');
    }
  };
  
  const updateButtonPosition = (editor: any): void => {
    if (!editor || !editorRef.current) return;

    const { selection } = editor.state;
    const { from } = selection;
    const cursorCoords = editor.view.coordsAtPos(from);
    const editorRect = editorRef.current.getBoundingClientRect();

    setButtonPosition({ top: cursorCoords.top - editorRect.top });
  };

  // Handle focus/click events
  useEffect(() => {
    if (editor) {
      const handleFocus = () => {
        setEditorClicked(true);

        const { selection } = editor.state;
        const { $from } = selection;
        const currentNode = $from.parent;

        setCurrentParagraphPos($from.depth > 0 ? $from.before() : null);

        const isEmpty = currentNode.type.name === "paragraph" && currentNode.content.size === 0;

        setShowButton(isEmpty);
        updateButtonPosition(editor);
      };

      const handleClickOutside = (event: MouseEvent) => {
        if (
          editorRef.current &&
          !editorRef.current.contains(event.target as Node) &&
          !(event.target as Element).closest(".editor-toolbar")
        ) {
          setIsMenuOpen(false);
        }
      };

      editor.view.dom.addEventListener("focus", handleFocus);
      editor.view.dom.addEventListener("click", handleFocus);
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        editor.view.dom.removeEventListener("focus", handleFocus);
        editor.view.dom.removeEventListener("click", handleFocus);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [editor]);

  // Close menu when Escape is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div ref={editorRef} className="relative bg-white dark:bg-[#1E1F21] rounded-lg shadow-sm dark:shadow-lg dark:shadow-gray-800/30 border dark:border-gray-800 transition-colors duration-300 w-[800px]">
      {/* Permanent Menubar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-1">
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              editor?.isActive('bold') ? 'bg-pink-50 dark:bg-pink-950/30 text-customPink' : 'text-gray-700 dark:text-gray-300'
            }`}
            title="Bold"
          >
            <Bold size={18} />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              editor?.isActive('italic') ? 'bg-pink-50 dark:bg-pink-950/30 text-customPink' : 'text-gray-700 dark:text-gray-300'
            }`}
            title="Italic"
          >
            <Italic size={18} />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              editor?.isActive('underline') ? 'bg-pink-50 dark:bg-pink-950/30 text-customPink' : 'text-gray-700 dark:text-gray-300'
            }`}
            title="Underline"
          >
            <UnderlineIcon size={18} />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              editor?.isActive('strike') ? 'bg-pink-50 dark:bg-pink-950/30 text-customPink' : 'text-gray-700 dark:text-gray-300'
            }`}
            title="Strikethrough"
          >
            <Strikethrough size={18} />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

        <div className="flex items-center gap-1">
          <button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              editor?.isActive('heading', { level: 1 }) ? 'bg-pink-50 dark:bg-pink-950/30 text-customPink' : 'text-gray-700 dark:text-gray-300'
            }`}
            title="Heading 1"
          >
            <Heading1 size={18} />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              editor?.isActive('heading', { level: 2 }) ? 'bg-pink-50 dark:bg-pink-950/30 text-customPink' : 'text-gray-700 dark:text-gray-300'
            }`}
            title="Heading 2"
          >
            <Heading2 size={18} />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              editor?.isActive('heading', { level: 3 }) ? 'bg-pink-50 dark:bg-pink-950/30 text-customPink' : 'text-gray-700 dark:text-gray-300'
            }`}
            title="Heading 3"
          >
            <Heading3 size={18} />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

        <div className="flex items-center gap-1">
          <button
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              editor?.isActive('bulletList') ? 'bg-pink-50 dark:bg-pink-950/30 text-customPink' : 'text-gray-700 dark:text-gray-300'
            }`}
            title="Bullet List"
          >
            <List size={18} />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              editor?.isActive('orderedList') ? 'bg-pink-50 dark:bg-pink-950/30 text-customPink' : 'text-gray-700 dark:text-gray-300'
            }`}
            title="Numbered List"
          >
            <ListOrdered size={18} />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleTaskList().run()}
            className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              editor?.isActive('taskList') ? 'bg-pink-50 dark:bg-pink-950/30 text-customPink' : 'text-gray-700 dark:text-gray-300'
            }`}
            title="Task List"
          >
            <CheckSquare size={18} />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

        <div className="flex items-center gap-1">
          <button
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              editor?.isActive('blockquote') ? 'bg-pink-50 dark:bg-pink-950/30 text-customPink' : 'text-gray-700 dark:text-gray-300'
            }`}
            title="Blockquote"
          >
            <Quote size={18} />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              editor?.isActive('codeBlock') ? 'bg-pink-50 dark:bg-pink-950/30 text-customPink' : 'text-gray-700 dark:text-gray-300'
            }`}
            title="Code Block"
          >
            <Code size={18} />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const url = prompt('Enter the URL:');
              if (url) {
                editor?.chain().focus().setLink({ href: url }).run();
              }
            }}
            className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              editor?.isActive('link') ? 'bg-pink-50 dark:bg-pink-950/30 text-customPink' : 'text-gray-700 dark:text-gray-300'
            }`}
            title="Insert Link"
          >
            <LinkIcon size={18} />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
            title="Insert Image"
          >
            <ImageIcon size={18} />
          </button>
          <button
            onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
            title="Insert Table"
          >
            <TableIcon size={18} />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

        <div className="flex items-center gap-1">
          <button
            onClick={() => editor?.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              editor?.isActive({ textAlign: 'left' }) ? 'bg-pink-50 dark:bg-pink-950/30 text-customPink' : 'text-gray-700 dark:text-gray-300'
            }`}
            title="Align Left"
          >
            <AlignLeft size={18} />
          </button>
          <button
            onClick={() => editor?.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              editor?.isActive({ textAlign: 'center' }) ? 'bg-pink-50 dark:bg-pink-950/30 text-customPink' : 'text-gray-700 dark:text-gray-300'
            }`}
            title="Align Center"
          >
            <AlignCenter size={18} />
          </button>
          <button
            onClick={() => editor?.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              editor?.isActive({ textAlign: 'right' }) ? 'bg-pink-50 dark:bg-pink-950/30 text-customPink' : 'text-gray-700 dark:text-gray-300'
            }`}
            title="Align Right"
          >
            <AlignRight size={18} />
          </button>
          <button
            onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
            className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              editor?.isActive({ textAlign: 'justify' }) ? 'bg-pink-50 dark:bg-pink-950/30 text-customPink' : 'text-gray-700 dark:text-gray-300'
            }`}
            title="Justify"
          >
            <AlignJustify size={18} />
          </button>
        </div>
      </div>

      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleImageUpload(file);
            e.target.value = '';
          }
        }}
      />

      {/* Floating Toolbar */}
      <div className="absolute left-[-25px] z-10">
        <EditorToolbar editor={editor} position={buttonPosition} isVisible={isMenuOpen} />
      </div>

      {/* Plus Button */}
      {showButton && buttonPosition.top !== null && (
        <button
          className={`absolute left-[-60px] transform transition-all duration-300 ease-in-out ${
            isMenuOpen ? "rotate-45 scale-105" : "rotate-0"
          }`}
          style={{ top: buttonPosition.top - 5 < 0 ? 10 : buttonPosition.top - 5 }}
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
          aria-label="Add content options"
        >
          <SvgIconUse />
        </button>
      )}

      {/* Editor Content */}
      <div className="p-4">
        <EditorContent 
          editor={editor} 
          className="tiptap prose prose-lg dark:prose-invert max-w-none focus:outline-none" 
        />
      </div>
    </div>
  );
};

export default BlogEditor;
