"use client";

import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { DisplayCourseGroup } from "./CollectionButton";
import { addCourse, addLesson, addUnit } from "../../services/addMaterial";
import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import SelectEmoji from "@/components/SelectEmoji";
import { simplifiedCourse } from "@/redux/user";

export const blankCourse = {
  emoji: "",
  label: "",
  link: "/",
  units: [],
  id: "",
};

export function ItemInput({
  display,
  setDisplay,
  refId,
  dropdownOpens,
  setSubmitting,
}: {
  display: boolean;
  setDisplay: Function;
  refId?: string;
  dropdownOpens: string;
  setSubmitting: Function;
}) {
  function close() {
    if (display && !pickEmoji) {
      setDisplay(false);
    }
    if (pickEmoji) {
      setPickEmoji(false);
    }
  }

  const [emoji, setEmoji] = useState("🚀");
  const [pickEmoji, setPickEmoji] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center gap-5 p-4 z-10">
        <SelectEmoji
          emoji={emoji}
          setEmoji={setEmoji}
          selectEmoji={pickEmoji}
          setSelectEmoji={setPickEmoji}
          close={close}
        />
        <input
          className="input w-9/12 input-xs border-transparent max-w-xs rounded-sm"
          placeholder={
            dropdownOpens.charAt(0).toUpperCase() +
            dropdownOpens.slice(1) +
            " Name"
          }
          autoFocus
          onKeyUp={async (e) => {
            if (e.key == "Enter" && user) {
              setDisplay(false);
              setSubmitting(true);
              let url = "/";
              if (dropdownOpens == "course") {
                url = await addCourse(e.currentTarget.value, emoji, user.id);
              } else if (dropdownOpens == "unit") {
                url = await addUnit(
                  e.currentTarget.value,
                  emoji,
                  user.id,
                  refId!
                );
              } else if (dropdownOpens == "lesson") {
                url = await addLesson(
                  e.currentTarget.value,
                  emoji,
                  user.id,
                  refId!
                );
              }
              setSubmitting(false);
              // router.push(url);
            }
          }}
        />
      </div>
    </div>
  );
}

export function CourseList() {
  const [addCourse, setAddCourse] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  let courses = useSelector((state: RootState) => state.user.courses);
  let loading = useSelector((state: RootState) => state.loading.value);

  return (
    <div className="overflow-y-auto overflow-x-hidden w-full">
      <div className="mb-2 mt-4">
        <div className="flex justify-between items-center pl-3 pr-1.5">
          <Link href="/">
            <p className="text-sm">Courses</p>
          </Link>
          <div className="tooltip" data-tip="Create Course">
            <IconPlus
              size="0.8rem"
              stroke={1.5}
              onClick={() => setAddCourse(true)}
              className="border border-gray-800"
              style={{ borderRadius: 2 }}
            />
          </div>
        </div>
      </div>
      {addCourse ? (
        <ItemInput
          display={addCourse}
          setDisplay={setAddCourse}
          dropdownOpens={"course"}
          setSubmitting={setSubmitting}
        />
      ) : null}

      {submitting && (
        <div className="ml-4 -mt-2">
          <Skeleton className="h-6 w-[80%]">
            <p className="text-sm m-4">Adding Course</p>
          </Skeleton>
        </div>
      )}
      <>
        {loading ? (
          <div className="space-y-2 flex flex-col gap-3 p-3">
            {[0, 1, 2].map((_) => (
              <Skeleton className="h-4 w-40 bg-slate-300" key={_} />
            ))}
          </div>
        ) : (
          Object.values(courses).map(
            (course: simplifiedCourse, idx: number) => (
              <div key={idx}>
                <DisplayCourseGroup
                  course={course}
                  courseId={Object.keys(courses)[idx]}
                />
              </div>
            )
          )
        )}
      </>
    </div>
  );
}
