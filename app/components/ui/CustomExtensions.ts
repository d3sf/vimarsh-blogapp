// customExtensions.ts
import { Heading } from "@tiptap/extension-heading";
import { Paragraph } from "@tiptap/extension-paragraph";
import { BulletList } from "@tiptap/extension-bullet-list";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { CodeBlock } from "@tiptap/extension-code-block";
import { Blockquote } from "@tiptap/extension-blockquote";
import { Link } from "@tiptap/extension-link";

export const CustomExtensions = [
  Heading.configure({ HTMLAttributes: { class: "tiptap-heading" }, levels: [1, 2] }),
  Paragraph.configure({ HTMLAttributes: { class: "tiptap-paragraph" } }),
  BulletList.configure({ HTMLAttributes: { class: "tiptap-bullet-list" } }),
  OrderedList.configure({ HTMLAttributes: { class: "tiptap-ordered-list" } }),
  CodeBlock.configure({ HTMLAttributes: { class: "tiptap-code-block" } }),
  Blockquote.configure({ HTMLAttributes: { class: "tiptap-blockquote" } }),
  Link.configure({ HTMLAttributes: { class: "tiptap-link" } }),
];
