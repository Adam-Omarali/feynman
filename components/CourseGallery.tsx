"use client";

import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { MaterialCard } from "./MaterialCard";
import Modal from "./Modal";
import NewMaterialForm from "./NewMaterialForm";
import { addCourse } from "@/services/addMaterial";
import Link from "next/link";

function CourseGallery() {
  let courses = useSelector((state: RootState) => state.courses.value);
  let loading = useSelector((state: RootState) => state.loading.value);

  async function add(name: string, emoji: string, description: string) {
    let userId = Object.values(courses)[0].userId;
    await addCourse(name, emoji, userId, description);
  }

  if (loading) {
    return <></>;
  }
  return (
    <div className="flex flex-wrap gap-4">
      {Object.values(courses).map((course) => {
        return (
          <div key={course.id}>
            <Link href={"/course/" + course.id}>
              <MaterialCard title={course.emoji + " " + course.name} />
            </Link>
          </div>
        );
      })}
      <Modal triggerText="Add Course">
        <NewMaterialForm add={add} lesson={false} />
      </Modal>
    </div>
  );
}

export default CourseGallery;
