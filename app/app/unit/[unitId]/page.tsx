"use client";

import React from "react";
import { fetchMaterial } from "@/services/fetchMaterial";
import { UserMenu } from "@/components/MaterialMenu";
import { RootState } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { MaterialCard } from "@/components/MaterialCard";
import Modal from "@/components/Modal";
import NewMaterialForm from "@/components/NewMaterialForm";
import { addLesson } from "@/services/addMaterial";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { addUnitStore } from "@/redux/unit";
import MaterialSkeleton from "@/components/MaterialSkeleton";
import { Button } from "@/components/ui/Button";
import FileUpload from "@/components/FileUpload";

export default function Page({
  params,
  searchParams,
}: Readonly<{
  params: { unitId: string };
  searchParams: { course: string };
}>) {
  let courseId = searchParams.course;
  let user = useSelector((state: RootState) => state.user);
  let unitState = useSelector(
    (state: RootState) => state.unit.value[params.unitId]
  );
  const dispatch = useDispatch();

  const { isLoading, data: unit } = useQuery(
    ["unit"],
    async () => {
      if (unitState === undefined) {
        console.log("fetching unit");
        let unit = await fetchMaterial("/unit/" + params.unitId);
        dispatch(addUnitStore(unit));
        return unit;
      } else {
        return unitState;
      }
    },
    {
      //also prevents a user trying to access a courseId they don't own
      enabled: !!user.courses[searchParams.course].units[params.unitId],
    }
  );

  async function add(name: string, emoji: string, description: string) {
    let userId = user.id;
    await addLesson(
      name,
      emoji,
      userId,
      searchParams.course + " " + params.unitId
    );
  }

  if (user.courses[searchParams.course].units[params.unitId] === undefined) {
    //just transitioning from a delete unit to course page
    return <>You don't have access to this unit</>;
  }
  let lessons = user.courses[searchParams.course].units[params.unitId].lessons;

  if (isLoading) {
    return (
      <MaterialSkeleton
        text={user.courses[searchParams.course].units[params.unitId].name}
      />
    );
  } else {
    return (
      <div style={{ padding: "16px 20px", flex: "80%" }}>
        <div className="flex justify-between items-center">
          <p className="text-xl font-semibold pb-2">{unit.name}</p>
          <div className="flex items-center gap-4">
            <UserMenu
              ids={{
                unitId: params.unitId,
                courseId: courseId,
                lessonId: "",
              }}
              type={"unit"}
            />
          </div>
        </div>
        {/* <div className="flex justify-between items-center">
          <h3>Lessons</h3>
        </div> */}

        <div className="flex flex-wrap gap-4">
          {Object.keys(lessons).map((lessonId) => {
            let lesson = lessons[lessonId];
            return (
              <div key={lessonId}>
                <Link
                  href={
                    "/app/lesson/" +
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
        <div className="mt-4">
          <Button>
            <Link href={`/app/unit/${params.unitId}/quiz`}>Generate Quiz</Link>
          </Button>
        </div>
        <FileUpload userId={user.id} path={params.unitId} />
      </div>
    );
  }
}
