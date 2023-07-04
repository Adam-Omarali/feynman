"use client";

import "../styles/styles.css";

import Highlight from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Image from "@tiptap/extension-image";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import "@benrbray/prosemirror-math/style/math.css";
import "katex/dist/katex.min.css";
import { MathInline } from "./Math.extension";
import MenuBar from "./MenuBar";
import { useEffect } from "react";
import Typography from "@tiptap/extension-typography";

export default ({
  isEditable,
  setContent,
  content,
}: {
  isEditable: boolean;
  setContent: Function;
  content: string;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Highlight,
      TaskList,
      TaskItem,
      Typography,
      Image,
      MathInline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "right", "center"],
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
      {editor && isEditable && <MenuBar editor={editor} />}
      <EditorContent
        className={"editor__content"}
        editor={editor}
        style={isEditable ? {} : { padding: 0 }}
        onChange={(e) => console.log(2)}
      />
    </div>
  );
};
