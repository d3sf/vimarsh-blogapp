"use client";

import React, { useRef, useState } from "react";
import {
  Code, Image as ImageIcon, Type, List, ListOrdered, Quote, Link, Heading1, Heading2, Heading3,
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Table, CheckSquare, FileText, PenTool,
} from "lucide-react";

type ToolbarProps = {
  editor: any;
  position: { top: number | null };
  isVisible: boolean;
};

type ToolbarSection = {
  name: string;
  icon: React.ReactNode;
  items: ToolbarItem[];
}

type ToolbarItem = {
  icon: React.ReactNode;
  title: string;
  action: () => void;
  isActive?: () => boolean;
}

const EditorToolbar = ({ editor, position, isVisible }: ToolbarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("basic");

  if (!isVisible || !editor || position.top === null) return null;

  const handleImageUpload = async (file: File) => {
    try {
      // Create a FileReader to convert the file to base64
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        try {
          // The result attribute contains the data as a base64 encoded string
          const base64String = reader.result as string;
          
          console.log("Starting upload to API...");
          
          // Call your API endpoint with the base64 data
          const response = await fetch('api/blogs/upload-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageData: base64String }),
          });
          
          console.log("Response status:", response.status);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Upload error response:', errorText);
            
            let errorData;
            try {
              errorData = JSON.parse(errorText);
            } catch (error) {
              errorData = { error: errorText };
            }
            
            console.error('Upload error details:', errorData);
            throw new Error(`Image upload failed: ${response.status} ${response.statusText}`);
          }
          
          const data = await response.json();
          console.log("Upload successful, received URL:", data.url);
          
          // Insert the image URL into the editor
          editor.chain().focus().setImage({ 
            src: data.url,
          }).run();
        } catch (error) {
          console.error('Error in upload request:', error);
          alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      };
      
      // Read the file as a data URL (base64)
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Error setting up upload:', error);
      alert('Failed to process image. Please try again.');
    }
  };

  const toolbarSections: ToolbarSection[] = [
    {
      name: "basic",
      icon: <PenTool size={16} />,
      items: [
        { 
          icon: <Bold size={18} />, 
          title: "Bold", 
          action: () => editor.chain().focus().toggleBold().run(),
          isActive: () => editor.isActive('bold')
        },
        { 
          icon: <Italic size={18} />, 
          title: "Italic", 
          action: () => editor.chain().focus().toggleItalic().run(),
          isActive: () => editor.isActive('italic')
        },
        { 
          icon: <Underline size={18} />, 
          title: "Underline", 
          action: () => editor.chain().focus().toggleUnderline().run(),
          isActive: () => editor.isActive('underline')
        },
        { 
          icon: <Strikethrough size={18} />, 
          title: "Strikethrough", 
          action: () => editor.chain().focus().toggleStrike().run(),
          isActive: () => editor.isActive('strike')
        },
        { 
          icon: <Heading1 size={18} />, 
          title: "Heading 1", 
          action: () => {
            editor.chain().focus().toggleHeading({ 
              level: 1,
              HTMLAttributes: {
                class: 'tiptap-heading-1'
              }
            }).run();
          },
          isActive: () => editor.isActive('heading', { level: 1 })
        },
        { 
          icon: <Heading2 size={18} />, 
          title: "Heading 2", 
          action: () => {
            editor.chain().focus().toggleHeading({ 
              level: 2,
              HTMLAttributes: {
                class: 'tiptap-heading-2'
              }
            }).run();
          },
          isActive: () => editor.isActive('heading', { level: 2 })
        },
        { 
          icon: <Heading3 size={18} />, 
          title: "Heading 3", 
          action: () => {
            editor.chain().focus().toggleHeading({ 
              level: 3,
              HTMLAttributes: {
                class: 'tiptap-heading-3'
              }
            }).run();
          },
          isActive: () => editor.isActive('heading', { level: 3 })
        },
        { 
          icon: <Type size={18} />, 
          title: "Paragraph", 
          action: () => {
            editor.chain().focus().setParagraph({
              HTMLAttributes: {
                class: 'tiptap-paragraph'
              }
            }).run();
          },
          isActive: () => editor.isActive('paragraph')
        },
      ]
    },
    {
      name: "lists",
      icon: <List size={16} />,
      items: [
        { 
          icon: <List size={18} />, 
          title: "Bullet List", 
          action: () => {
            editor.chain().focus().toggleBulletList({
              HTMLAttributes: {
                class: 'tiptap-bullet-list'
              }
            }).run();
          },
          isActive: () => editor.isActive('bulletList')
        },
        { 
          icon: <ListOrdered size={18} />, 
          title: "Numbered List", 
          action: () => {
            editor.chain().focus().toggleOrderedList({
              HTMLAttributes: {
                class: 'tiptap-ordered-list'
              }
            }).run();
          },
          isActive: () => editor.isActive('orderedList')
        },
        { 
          icon: <CheckSquare size={18} />, 
          title: "Task List", 
          action: () => {
            editor.chain().focus().toggleTaskList().run();
          },
          isActive: () => editor.isActive('taskList')
        }
      ]
    },
    {
      name: "blocks",
      icon: <FileText size={16} />,
      items: [
        { 
          icon: <Quote size={18} />, 
          title: "Blockquote", 
          action: () => {
            editor.chain().focus().toggleBlockquote({
              HTMLAttributes: {
                class: 'tiptap-blockquote'
              }
            }).run();
          },
          isActive: () => editor.isActive('blockquote')
        },
        { 
          icon: <Code size={18} />, 
          title: "Code Block", 
          action: () => {
            editor.chain().focus().toggleCodeBlock({
              HTMLAttributes: {
                class: 'tiptap-code-block'
              }
            }).run();
          },
          isActive: () => editor.isActive('codeBlock')
        },
        {
          icon: <Table size={18} />,
          title: "Insert Table",
          action: () => {
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
        },
        {
          icon: <ImageIcon size={18} />, 
          title: "Insert Image",
          action: () => {
            fileInputRef.current?.click();
          }
        },
        {
          icon: <Link size={18} />, 
          title: "Insert Link",
          action: () => {
            const url = prompt("Enter the URL:");
            if (url) {
              editor.chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ 
                  href: url,
                  HTMLAttributes: {
                    class: 'tiptap-link'
                  }
                })
                .run();
            }
          },
          isActive: () => editor.isActive('link')
        },
      ]
    },
    {
      name: "align",
      icon: <AlignLeft size={16} />,
      items: [
        {
          icon: <AlignLeft size={18} />,
          title: "Align Left",
          action: () => editor.chain().focus().setTextAlign('left').run(),
          isActive: () => editor.isActive({ textAlign: 'left' })
        },
        {
          icon: <AlignCenter size={18} />,
          title: "Align Center",
          action: () => editor.chain().focus().setTextAlign('center').run(),
          isActive: () => editor.isActive({ textAlign: 'center' })
        },
        {
          icon: <AlignRight size={18} />,
          title: "Align Right",
          action: () => editor.chain().focus().setTextAlign('right').run(),
          isActive: () => editor.isActive({ textAlign: 'right' })
        },
        {
          icon: <AlignJustify size={18} />,
          title: "Justify",
          action: () => editor.chain().focus().setTextAlign('justify').run(),
          isActive: () => editor.isActive({ textAlign: 'justify' })
        }
      ]
    }
  ];

  const currentSection = toolbarSections.find(section => section.name === activeTab) || toolbarSections[0];

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleImageUpload(file);
            e.target.value = '';
          }
        }}
      />
      <div
        className="absolute bg-white dark:bg-[#1E1F21] rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-10 editor-toolbar transform transition-all duration-200 ease-in-out origin-left w-80"
        style={{
          top: position.top - 30,
          left: "-400px",
          maxWidth: "100vw",
        }}
      >
        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-100 dark:border-gray-700">
          {toolbarSections.map((section) => (
            <button
              key={section.name}
              className={`p-2 flex-1 flex items-center justify-center text-xs font-medium transition-colors ${
                activeTab === section.name 
                  ? 'text-customPink border-b-2 border-customPink bg-pink-50 dark:bg-pink-950/30' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => setActiveTab(section.name)}
              title={`${section.name.charAt(0).toUpperCase()}${section.name.slice(1)} Formatting`}
            >
              {section.icon}
              <span className="ml-1 capitalize">{section.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-3">
          <div className="grid grid-cols-4 gap-2">
            {currentSection.items.map((item, index) => {
              const isActive = item.isActive?.() || false;
              return (
                <button
                  key={index}
                  onClick={item.action}
                  className={`flex flex-col items-center justify-center p-2 rounded-md transition-all ${
                    isActive 
                      ? 'bg-pink-50 dark:bg-pink-950/30 text-customPink ring-1 ring-pink-200 dark:ring-pink-800' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-customPink dark:hover:text-customPink'
                  }`}
                  title={item.title}
                >
                  <div className="p-1">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-medium mt-1 truncate w-full text-center">
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditorToolbar;