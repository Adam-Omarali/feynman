"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { TiptapEditorProps } from "./props";
import { TiptapExtensions } from "./extensions";
import { useDebouncedCallback } from "use-debounce";
import "katex/dist/katex.min.css";

import { QuestionExtension } from "./QuestionExtension";
import { EditorBubbleMenu } from "./components/EditorBubbleMenu";

export default function TipTap({
  isEditable,
  setContent,
  content,
  flashcard,
  setSaved,
}: Readonly<{
  isEditable: boolean;
  setContent: Function;
  content: { content: { type: string; content: any }[] };
  flashcard?: boolean;
  setSaved?: Function;
}>) {
  const debouncedUpdates = useDebouncedCallback(async ({ editor }) => {
    const json = editor.getJSON();
    setContent(json);
    console.log("debounce", json);
  }, 4000);

  const editor = useEditor({
    extensions: [...TiptapExtensions, QuestionExtension],
    editorProps: TiptapEditorProps,
    onUpdate: (e) => {
      // Immediately mark as unsaved when content changes
      if (setSaved) {
        setSaved(false);
      }
      // Still use debounced updates for content
      debouncedUpdates(e);
    },
    autofocus: "start",
    editable: isEditable,
    content: content,
  });

  //Hydrate the editor with the content from localStorage for initial load
  useEffect(() => {
    if (editor && content) {
      // Only set content if it's different from current content
      const currentContent = editor.getJSON();
      if (JSON.stringify(currentContent) !== JSON.stringify(content)) {
        if (!Array.isArray(content) && content.content.length > 0) {
          editor.commands.setContent(content);
        }
      }
    }
  }, [editor, content]);

  return (
    <div
      onClick={() => {
        editor?.chain().focus().run();
      }}
      className={
        !flashcard
          ? "relative min-h-[500px] border-stone-200 bg-white p-12 px-8 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg h-fit overflow-scroll"
          : isEditable
          ? "relative border-stone-200 bg-white p-8 sm:mb-2 sm:rounded-lg sm:border max-h-[500px] overflow-scroll"
          : "relative py-8 max-h-[500px] overflow-scroll"
      }
    >
      {/* {isEditable ? (
        <div className="absolute right-5 top-5 mb-5 rounded-lg bg-stone-100 px-1 py-1 text-sm text-stone-400">
          {saveStatus}
        </div>
      ) : null} */}
      {editor && isEditable && !flashcard && (
        <EditorBubbleMenu editor={editor} />
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
