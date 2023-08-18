"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useRef, useState } from "react";
import TipTap from "../../../components/editor/Editor";
import { UserMenu } from "../../../components/MaterialMenu";
import { fetchMaterial } from "../../../services/fetchMaterial";
import { RootState, store } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { BookOpen, Edit } from "lucide-react";
import { EditLessonContent } from "@/services/updateMaterial";

export default function Page({
  params,
  searchParams,
}: {
  params: { lessonId: string };
  searchParams: { course: string; unit: string };
}) {
  let course = useSelector(
    (state: RootState) => state.courses.value[searchParams.course]
  );

  if (course === undefined) {
    return <Skeleton className="h-4 w-[150px] p-4"></Skeleton>;
  }
  let unit = course.units[searchParams.unit];
  if (unit === undefined) {
    return <Skeleton className="h-4 w-[150px] p-4"></Skeleton>;
  }
  let lesson = unit.lessons[params.lessonId];
  if (lesson === undefined) {
    return <Skeleton className="h-4 w-[150px] p-4"></Skeleton>;
  }

  let [editable, setEditable] = useState(true);
  let [content, setContent] = useState(lesson.content ? lesson.content : "");
  const contentRef = useRef<string>(content);

  function updateContent() {
    if (contentRef.current != lesson.content) {
      EditLessonContent(
        contentRef.current,
        searchParams.course,
        searchParams.unit,
        params.lessonId
      );
    }
  }

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    window.addEventListener("beforeunload", (ev) => {
      updateContent();
    });
    return () => {
      updateContent();
    };
  }, []);

  return (
    <div style={{ padding: "0px 20px", flex: "80%" }}>
      <div className="flex items-center justify-between py-2">
        <h1>{lesson.name + " " + lesson.emoji}</h1>
        <div className="flex items-center">
          <button onClick={() => setEditable(!editable)}>
            {editable ? <BookOpen /> : <Edit />}
          </button>
          <UserMenu
            ids={{
              courseId: searchParams.course,
              unitId: searchParams.unit,
              lessonId: params.lessonId,
            }}
            type={"lesson"}
          />
        </div>
      </div>
      <TipTap
        isEditable={editable}
        setContent={setContent}
        content={lesson.content ? lesson.content : ""}
      />
    </div>
  );
}
