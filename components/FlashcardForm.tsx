"use client";

import React, { useContext, useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addFlashcard } from "@/services/addMaterial";
import TipTap from "./editor/Editor";
import { getLessonList } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { modalContext } from "./Modal";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { defaultDoc } from "@/redux/questions";
import { usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type doc = {
  type: string;
  content: any;
};

function FlashcardForm({
  onSubmit,
}: Readonly<{ onSubmit?: (flashcard: any) => void }>) {
  const [question, setQuestion] = useState<doc>(defaultDoc);
  const [answer, setAnswer] = useState<false | doc>(false);
  const [solution, setSolution] = useState<false | doc>(false);
  const [difficulty, setDifficulty] = useState(0);
  const [lesson, setLesson] = useState("none");
  const [alertLesson, setAlertLesson] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const user = useSelector((state: RootState) => state.user);
  const lessonList = getLessonList();
  const modal = useContext(modalContext);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const pathParts = pathname?.split("/");
    if (pathParts && pathParts.includes("lesson")) {
      const lessonId = pathParts[pathParts.indexOf("lesson") + 1];
      const lessonName = Object.keys(lessonList).find(
        (name) => lessonList[name].id === lessonId
      );
      if (lessonName) {
        setLesson(lessonName);
      }
    }
  }, [pathname, searchParams, lessonList]);

  async function createFlashCard() {
    if (lesson == "none") {
      setAlertLesson(true);
      alert("needs a lesson");
    } else {
      let lessonId = lessonList[lesson].id;
      let unitId = lessonList[lesson].unitId;
      let courseId = lessonList[lesson].courseId;
      let flashcard = {
        question: question,
        answer: answer ?? defaultDoc,
        solution: solution ?? defaultDoc,
        difficulty: difficulty,
        lesson: lesson,
      };

      await addFlashcard(user.id, { lessonId, courseId, unitId }, flashcard);

      onSubmit?.(flashcard);

      setQuestion({ type: "doc", content: [] });
      setAnswer(false);
      setSolution(false);
      setDifficulty(0);
      setLesson("none");
      setEditorKey((prev) => prev + 1);
      if (onSubmit) {
        modal.close();
      } else {
        toast.success("Flashcard Created");
      }
    }
  }
  return (
    <div className="grid gap-4">
      <div>
        <p>Question</p>
        <TipTap
          key={editorKey}
          isEditable={true}
          setContent={setQuestion}
          content={question}
          flashcard={true}
        />
        <div className="divider"></div>
        <div className="flex items-center gap-4 mb-4">
          <Switch
            id="answer"
            onCheckedChange={() =>
              answer ? setAnswer(false) : setAnswer(defaultDoc)
            }
            checked={!!answer}
          />
          <Label htmlFor="answer">Answer</Label>
          <Switch
            id="solution"
            onCheckedChange={() =>
              solution ? setSolution(false) : setSolution(defaultDoc)
            }
            checked={!!solution}
          />
          <Label htmlFor="solution">Solution</Label>
        </div>
        {answer && (
          <div>
            <p>Answer (Exact Number, Word or Formula)</p>
            <TipTap
              isEditable={true}
              setContent={setAnswer}
              content={answer}
              flashcard={true}
            />
          </div>
        )}
        {solution && (
          <div>
            <p>Solution</p>
            <TipTap
              isEditable={true}
              setContent={setSolution}
              content={solution}
              flashcard={true}
            />
          </div>
        )}
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <p>Difficulty</p>
            <div
              className="rating"
              onChange={(e: any) => setDifficulty(e.target.id)}
              key={editorKey}
            >
              <input
                type="radio"
                name="rating-1"
                id="1"
                className="mask mask-star"
              />
              <input
                type="radio"
                name="rating-1"
                id="2"
                className="mask mask-star"
              />
              <input
                type="radio"
                name="rating-1"
                id="3"
                className="mask mask-star"
              />
              <input
                type="radio"
                name="rating-1"
                id="4"
                className="mask mask-star"
              />
              <input
                type="radio"
                name="rating-1"
                id="5"
                className="mask mask-star"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className={alertLesson ? "text-red-600" : ""}>Lesson</p>
            <Select
              onValueChange={(e) => {
                setLesson(e);
                setAlertLesson(false);
              }}
              value={lesson}
            >
              <SelectTrigger className="w-[260px]">
                <SelectValue placeholder="Related Lesson" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(lessonList).map((lesson) => {
                  return (
                    <SelectItem value={lesson} key={lessonList[lesson].id}>
                      {lesson}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <Button onClick={createFlashCard}>Submit</Button>
    </div>
  );
}

export type Flashcard = {
  question: Object;
  answer: Object;
  solution: Object;
  difficulty: number;
  lesson: string;
};

export default FlashcardForm;
