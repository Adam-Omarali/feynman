"use client";

import React, { useContext, useState } from "react";
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

function FlashcardForm() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [difficulty, setDifficulty] = useState(0);
  const [lesson, setLesson] = useState("none");
  const user = useSelector((state: RootState) => state.user);
  const lessonList = getLessonList();
  const modal = useContext(modalContext);

  async function createFlashCard() {
    if (lesson == "none") {
      alert("needs a lesson");
    } else {
      let lessonId = lessonList[lesson].id;
      let unitId = lessonList[lesson].unitId;
      let courseId = lessonList[lesson].courseId;
      await addFlashcard(
        user.id,
        { lessonId, courseId, unitId },
        {
          question: question,
          answer: answer,
          difficulty: difficulty,
          lesson: lesson,
        }
      );
      setQuestion("");
      setAnswer("");
      setDifficulty(0);
      setLesson("none");
    }
  }
  return (
    <div className="grid gap-4 py-2">
      <div>
        <p>Question</p>
        <TipTap
          isEditable={true}
          setContent={setQuestion}
          content={question}
          flashcard={true}
        />
        <div className="divider"></div>
        <p>Answer</p>
        <TipTap
          isEditable={true}
          setContent={setAnswer}
          content={answer}
          flashcard={true}
        />
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <p>Difficulty</p>
            <div
              className="rating"
              onChange={(e: any) => setDifficulty(e.target.id)}
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
          <Select onValueChange={(e) => setLesson(e)} value={lesson}>
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
      <Button onClick={createFlashCard}>Submit</Button>
    </div>
  );
}

export type Flashcard = {
  question: string;
  answer: string;
  difficulty: number;
  lesson: string;
};

export default FlashcardForm;
