"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
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
}: {
  isEditable: boolean;
  setContent: Function;
  content: { content: { type: string; content: any }[] };
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
    console.log("debounce", json);
  }, 750);

  const editor = useEditor({
    extensions: [...TiptapExtensions, QuestionExtension],
    editorProps: TiptapEditorProps,
    onUpdate: (e) => {
      //update consistently
      setSaveStatus("Unsaved");
      debouncedUpdates(e);
      // setContent(e.editor.getHTML()); this was updating the context twice. once in debouncedUpdates and again here.
    },
    autofocus: "start",
    editable: isEditable,
  });

  //Hydrate the editor with the content from localStorage for initial load
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
      setHydrated(true);
    }
    // if (editor && content.length > 0 || content.content.length == 0) {
    //   editor.commands.setContent(content);
    // }
  }, [editor, content]); //editor needed for initial load, content needed if a change is made, pages are switched, and then switch back because editor is already loaded.

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
