"use client";

import React from "react";
import { fetchMaterial } from "../../../services/fetchMaterial";
import TipTap from "../../../components/Editor";
import { UserMenu } from "@/components/MaterialMenu";
import { RootState, store } from "@/redux/store";
import { useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/Skeleton";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string[] };
  searchParams: { course: string };
}) {
  let course = useSelector(
    (state: RootState) => state.courses.value[searchParams.course]
  );
  if (course === undefined) {
    return <Skeleton className="h-4 w-[150px] p-4"></Skeleton>;
  }
  let unit = course.units[params.id[0]];
  if (unit === undefined) {
    return <Skeleton className="h-4 w-[150px] p-4"></Skeleton>;
  }
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl">{unit.name}</h1>
        <UserMenu
          ids={{
            unitId: params.id[0],
            courseId: searchParams.course,
            lessonId: "",
          }}
          type={"unit"}
        />
      </div>
      <TipTap />
    </div>
  );
}
