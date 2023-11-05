"use client";

import React from "react";
import { fetchMaterial } from "../../../services/fetchMaterial";
import TipTap from "../../../components/editor/Editor";
import { UserMenu } from "@/components/MaterialMenu";
import { RootState, store } from "@/redux/store";
import { useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/Skeleton";
import { MaterialCard } from "@/components/MaterialCard";
import Modal from "@/components/Modal";
import NewMaterialForm from "@/components/NewMaterialForm";
import { addLesson } from "@/services/addMaterial";
import Link from "next/link";

export default function Page({
  params,
  searchParams,
}: {
  params: { unitId: string };
  searchParams: { course: string };
}) {
  let courseId = searchParams.course;
  let course = useSelector((state: RootState) => state.courses.value[courseId]);
  if (course === undefined) {
    return <Skeleton className="h-4 w-[150px] p-4"></Skeleton>;
  }
  let unit = course.units[params.unitId];
  if (unit === undefined) {
    return <Skeleton className="h-4 w-[150px] p-4"></Skeleton>;
  }

  async function add(name: string, emoji: string, description: string) {
    let userId = course.userId;
    await addLesson(
      name,
      emoji,
      userId,
      searchParams.course + " " + params.unitId
    );
  }

  return (
    <div style={{ padding: "16px 20px", flex: "80%" }}>
      <div className="flex justify-between items-center">
        <p className="text-xl font-semibold pb-2">{unit.name}</p>
        <UserMenu
          ids={{
            unitId: params.unitId,
            courseId: courseId,
            lessonId: "",
          }}
          type={"unit"}
        />
      </div>
      {/* <div className="flex justify-between items-center">
        <h3>Lessons</h3>
      </div> */}

      <div className="flex flex-wrap gap-4">
        {Object.keys(unit.lessons).map((lessonId) => {
          let lesson = unit.lessons[lessonId];
          return (
            <div key={lessonId}>
              <Link
                href={
                  "/lesson/" +
                  lessonId +
                  "?course=" +
                  courseId +
                  "&unit=" +
                  params.unitId
                }
              >
                <MaterialCard title={lesson.name} />
              </Link>
            </div>
          );
        })}
        <Modal>
          <Modal.Trigger>
            <MaterialCard add={"Add Lesson"}></MaterialCard>
          </Modal.Trigger>
          <Modal.Content triggerText="Add Lesson">
            <NewMaterialForm add={add} lesson={true} />
          </Modal.Content>
        </Modal>
      </div>
    </div>
  );
}
