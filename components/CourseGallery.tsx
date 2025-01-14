"use client";

import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { MaterialCard } from "./MaterialCard";
import Modal from "./Modal";
import NewMaterialForm from "./NewMaterialForm";
import { addCourse } from "@/services/addMaterial";
import Link from "next/link";
import LoadingCircle from "./LoadingCircle";

function CourseGallery() {
  let user = useSelector((state: RootState) => state.user);
  let loading = useSelector((state: RootState) => state.loading.value);

  async function add(name: string, emoji: string, description: string) {
    await addCourse(name, emoji, user.id, description);
  }

  if (loading) {
    return <LoadingCircle />;
  }
  return (
    <div className="flex flex-wrap gap-4">
      {Object.values(user.courses).map((course, idx) => {
        const courseId = Object.keys(user.courses)[idx];
        return (
          <div key={courseId}>
            <Link href={"/course/" + courseId}>
              <MaterialCard title={course.emoji + " " + course.name} />
            </Link>
          </div>
        );
      })}
      <Modal>
        <Modal.Trigger>
          <MaterialCard add={"Add Course"}></MaterialCard>
        </Modal.Trigger>
        <Modal.Content triggerText="Add Course">
          <NewMaterialForm add={add} lesson={false} />
        </Modal.Content>
      </Modal>
    </div>
  );
}

export default CourseGallery;
