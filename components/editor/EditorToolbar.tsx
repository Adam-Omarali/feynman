"use client";

import "../../styles/styles.css";

import Highlight from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Image from "@tiptap/extension-image";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import "katex/dist/katex.min.css";
import { useEffect } from "react";
import Typography from "@tiptap/extension-typography";
import Youtube from "@tiptap/extension-youtube";
import Link from "@tiptap/extension-link";
import MenuBar from "./components/MenuBar";
import Mathematics from "@tiptap-pro/extension-mathematics";

export default function TipTap({
  isEditable,
  setContent,
  content,
  flashcard,
}: {
  isEditable: boolean;
  setContent: Function;
  content: string | Object;
  flashcard?: boolean;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Highlight,
      TaskList,
      TaskItem,
      Typography,
      // Image,
      Link,
      Mathematics,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "right", "center"],
      }),
      Youtube.configure({
        controls: true,
        width: window.innerWidth * 0.7,
      }),
    ],
    content: `${content}`,
    onUpdate: ({ editor }) => {
      let html = editor.getHTML();
      setContent(html);
    },
  });

  useEffect(() => {
    editor?.setEditable(isEditable);
  }, [isEditable]);

  return (
    <div className={isEditable ? "editor" : ""}>
      {editor && isEditable && !flashcard && <MenuBar editor={editor} />}
      <EditorContent
        className={"editor__content"}
        editor={editor}
        style={isEditable ? {} : { padding: 0 }}
      />
    </div>
  );
}
