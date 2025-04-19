import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import React, { useState } from "react";
import AddFlashcard from "@/components/AddFlashcard";
import TipTap from "@/components/editor/Editor";
import { Button } from "../ui/Button";

const QuestionComponent = ({ node, updateAttributes, editor }: any) => {
  const [showForm, setShowForm] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleSubmit = (flashcard: any) => {
    updateAttributes({
      question: flashcard.question,
      answer: flashcard.answer,
      solution: flashcard.solution,
    });
    setShowForm(false);
  };

  if (!editor.isEditable && !node.attrs.question) {
    return null;
  }

  return (
    <NodeViewWrapper className="border-2 border-blue-200 bg-blue-50 pb-2 -pt-4 rounded-md px-4 mt-4">
      {node.attrs.question ? (
        <div className="-mt-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Question:</h3>
              <TipTap
                isEditable={false}
                content={node.attrs.question}
                setContent={() => {}}
                flashcard={true}
              />
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAnswer(!showAnswer)}
            className="mt-2"
          >
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </Button>

          {showAnswer && (
            <>
              <div className="mt-2">
                <h3 className="font-semibold mb-1">Answer:</h3>
                <TipTap
                  isEditable={false}
                  content={node.attrs.answer}
                  setContent={() => {}}
                  flashcard={true}
                />
              </div>
              {node.attrs.solution &&
                node.attrs.solution.content.length > 0 && (
                  <div className="mt-2">
                    <h3 className="font-semibold mb-1">Solution:</h3>
                    <TipTap
                      isEditable={false}
                      content={node.attrs.solution}
                      setContent={() => {}}
                      flashcard={true}
                    />
                  </div>
                )}
            </>
          )}
        </div>
      ) : (
        editor.isEditable && <AddFlashcard onSubmit={handleSubmit} />
      )}
    </NodeViewWrapper>
  );
};

export const QuestionExtension = Node.create({
  name: "questionNode",
  group: "block",
  content: "",
  atom: true,

  addAttributes() {
    return {
      question: { default: "" },
      answer: { default: "" },
      solution: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="question"]',
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return {};
          const attrs = {
            question: element.getAttribute("data-question"),
            answer: element.getAttribute("data-answer"),
            solution: element.getAttribute("data-solution"),
          };
          console.log("Parsing HTML to Node:", { element, attrs });
          return attrs;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    console.log("Rendering Node to HTML:", HTMLAttributes);
    return [
      "div",
      {
        "data-type": "question",
        "data-question": HTMLAttributes.question,
        "data-answer": HTMLAttributes.answer,
        "data-solution": HTMLAttributes.solution,
      },
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(QuestionComponent);
  },
});
