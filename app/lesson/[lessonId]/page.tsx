"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import TipTap from "../../../components/Editor";
import { UserMenu } from "../../../components/MaterialMenu";
import { fetchMaterial } from "../../../services/fetchMaterial";
import { RootState, store } from "@/redux/store";
import { useSelector } from "react-redux";
import { BookOpen, Edit } from "lucide-react";

export default function Page({
  params,
  searchParams,
}: {
  params: { lessonId: string };
  searchParams: { course: string; unit: string };
}) {
  let [editable, setEditable] = useState(true);

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

  return (
    <div style={{ padding: "0px 20px", flex: "80%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p>{lesson.name + " " + lesson.emoji}</p>
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
      <TipTap isEditable={editable} />
    </div>
  );
}
