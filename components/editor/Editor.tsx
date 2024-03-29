"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { TiptapEditorProps } from "./props";
import { TiptapExtensions } from "./extensions";
import { useDebouncedCallback } from "use-debounce";
import { EditorBubbleMenu } from "./components";
import "katex/dist/katex.min.css";

export default function TipTap({
  isEditable,
  setContent,
  content,
  flashcard,
}: {
  isEditable: boolean;
  setContent: Function;
  content: Object;
  flashcard?: boolean;
}) {
  const [saveStatus, setSaveStatus] = useState("Saved");

  const [hydrated, setHydrated] = useState(false);

  const debouncedUpdates = useDebouncedCallback(async ({ editor }) => {
    const json = editor.getJSON();
    setSaveStatus("Saving...");
    setContent(json);
    // Simulate a delay in saving.
    setTimeout(() => {
      setSaveStatus("Saved");
    }, 500);
  }, 750);

  const editor = useEditor({
    extensions: TiptapExtensions,
    editorProps: TiptapEditorProps,
    onUpdate: (e) => {
      setSaveStatus("Unsaved");
      debouncedUpdates(e);
      setContent(e.editor.getHTML());
    },
    autofocus: "all",
    editable: isEditable,
  });

  // Hydrate the editor with the content from localStorage.
  useEffect(() => {
    if (editor && content && !hydrated) {
      editor.commands.setContent(content);
      setHydrated(true);
    }
  }, [editor, content, hydrated]);

  return (
    <div
      onClick={() => {
        editor?.chain().focus().run();
      }}
      className={
        !flashcard
          ? "relative min-h-[500px] w-full max-w-screen-lg border-stone-200 bg-white p-12 px-8 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg h-fit"
          : isEditable
          ? "relative w-full border-stone-200 bg-white p-8 sm:mb-2 sm:rounded-lg sm:border max-h-[500px]"
          : "relative w-full py-8 max-h-[500px]"
      }
    >
      {isEditable ? (
        <div className="absolute right-5 top-5 mb-5 rounded-lg bg-stone-100 px-1 py-1 text-sm text-stone-400">
          {saveStatus}
        </div>
      ) : null}
      {editor && isEditable && <EditorBubbleMenu editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
