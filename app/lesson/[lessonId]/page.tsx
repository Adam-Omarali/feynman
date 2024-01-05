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
import { content } from "@/redux/questions";
import { addLessonStore } from "@/redux/lesson";

export default function Page({
  params,
  searchParams,
}: {
  params: { lessonId: string };
  searchParams: { course: string; unit: string };
}) {
  let lessonState = useSelector(
    (state: RootState) => state.lesson.value[params.lessonId]
  );
  let user = useSelector((state: RootState) => state.user);
  let dispatch = useDispatch();

  const {
    isLoading,
    error,
    data: lesson,
  } = useQuery(
    ["lesson"],
    async () => {
      if (lessonState === undefined) {
        console.log("fetching lesson");
        let lesson = await fetchMaterial("/lesson/" + params.lessonId);
        dispatch(addLessonStore(lesson));
        return lesson;
      } else {
        return lessonState;
      }
    },
    {
      enabled:
        !!user.courses[searchParams.course].units[searchParams.unit].lessons[
          params.lessonId
        ],
    }
  );

  let [editable, setEditable] = useState(true);
  let [content, setContent] = useState<[]>([]);
  const contentRef = useRef<content | []>(content);

  function updateContent() {
    console.log("updating lesson content");
    if (lesson && contentRef.current != lesson.content) {
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
      console.log("unloading lesson");
      updateContent();
    });
    return () => {
      updateContent();
    };
  }, []);

  if (
    user.courses[searchParams.course].units[searchParams.unit].lessons[
      params.lessonId
    ] === undefined
  ) {
    //transistioning between deleting lesson and unit page
    return <></>;
  }

  if (isLoading) {
    return <Skeleton className="h-10 w-[150px] mx-4 pt-2"></Skeleton>;
  } else {
    return (
      <div style={{ padding: "0px 20px", flex: "80%" }}>
        <div className="flex items-center justify-between py-2">
          <h1>{lesson.name + " " + lesson.emoji}</h1>
          <div className="flex items-center">
            {/* <button onClick={() => setEditable(!editable)}>
              {editable ? <BookOpen /> : <Edit />}
            </button> */}
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
          content={lesson.content ? lesson.content : null}
        />
      </div>
    );
  }
}
