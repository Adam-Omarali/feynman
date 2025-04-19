"use client";

import { UserMenu } from "@/components/MaterialMenu";
import { RootState } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import Modal from "@/components/Modal";
import { MaterialCard } from "@/components/MaterialCard";
import NewMaterialForm from "@/components/NewMaterialForm";
import { addUnit } from "@/services/addMaterial";
import Link from "next/link";
import { fetchMaterial } from "@/services/fetchMaterial";
import { useQuery } from "@tanstack/react-query";
import { addCourseStore } from "@/redux/courses";
import MaterialSkeleton from "@/components/MaterialSkeleton";

export default function Home({
  params,
}: Readonly<{ params: { courseId: string } }>) {
  let courseState = useSelector(
    (state: RootState) => state.courses.value[params.courseId]
  );
  let user = useSelector((state: RootState) => state.user);
  let dispatch = useDispatch();
  const { isLoading, data } = useQuery(
    ["course"],
    async () => {
      if (courseState === undefined) {
        console.log("fetching course");
        let course = await fetchMaterial("/course/" + params.courseId);
        dispatch(addCourseStore(course));
        return course;
      } else {
        return courseState;
      }
    },
    {
      enabled: !!user.courses[params.courseId],
    }
  );

  async function add(name: string, emoji: string, description: string) {
    let userId = user.id;
    await addUnit(name, emoji, userId, params.courseId, description);
  }

  if (user.courses[params.courseId] === undefined) {
    //transistioning between deleting course and switching to home page
    return <>You don't have access to this course</>;
  }

  //if course dne, fetch course
  if (isLoading) {
    return <MaterialSkeleton text={user.courses[params.courseId].name} />;
  } else {
    let course = data;

    return (
      <div style={{ padding: "16px 20px", flex: "80%" }}>
        <div className="flex justify-between items-center">
          <p className="text-xl font-semibold pb-2">
            {course.name + " " + course.emoji}
          </p>
          <UserMenu
            ids={{ courseId: course.id, lessonId: "", unitId: "" }}
            type={"course"}
          />
        </div>
        <div className="pb-2">{course.description}</div>
        {/* <div className="flex justify-between items-center">
          <h3>Units</h3>
        </div> */}

        <div className="flex flex-wrap gap-4">
          {Object.keys(user.courses[params.courseId].units).map((unitID) => {
            let unit = user.courses[params.courseId].units[unitID];
            return (
              <div key={unitID}>
                <Link href={"/app/unit/" + unitID + "?course=" + course.id}>
                  <MaterialCard title={unit.name} />
                </Link>
              </div>
            );
          })}
          <Modal>
            <Modal.Trigger>
              <MaterialCard add={"Add Unit"}></MaterialCard>
            </Modal.Trigger>
            <Modal.Content triggerText="Add Unit">
              <NewMaterialForm add={add} lesson={false} />
            </Modal.Content>
          </Modal>
        </div>
      </div>
    );
  }
}
