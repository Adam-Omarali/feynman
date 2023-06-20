"use client";

import "../styles/styles.css";

import Highlight from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "@benrbray/prosemirror-math/style/math.css";
import "katex/dist/katex.min.css";
import { MathInline } from "./Math.extension";
import MenuBar from "./MenuBar";

export default () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Highlight,
      TaskList,
      TaskItem,
      Image,
      MathInline,
    ],
  });

  return (
    <div className="editor">
      {editor && <MenuBar editor={editor} />}
      <EditorContent className="editor__content" editor={editor} />
    </div>
  );
};
