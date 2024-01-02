"use client";

import { UserMenu } from "@/components/MaterialMenu";
import { RootState } from "@/redux/store";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSelector } from "react-redux";
import Modal from "@/components/Modal";
import { MaterialCard } from "@/components/MaterialCard";
import NewMaterialForm from "@/components/NewMaterialForm";
import { addUnit } from "@/services/addMaterial";
import Link from "next/link";
import AddFlashcard from "@/components/AddFlashcard";

export default function Home({ params }: { params: { courseId: string } }) {
  let course = useSelector(
    (state: RootState) => state.courses.value[params.courseId]
  );

  async function add(name: string, emoji: string, description: string) {
    let userId = course.userId;
    await addUnit(name, emoji, userId, params.courseId, description);
  }

  if (course === undefined) {
    return <Skeleton></Skeleton>;
  }
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
        {Object.keys(course.units).map((unitID) => {
          let unit = course.units[unitID];
          return (
            <div key={unitID}>
              <Link href={"/unit/" + unitID + "?course=" + course.id}>
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
