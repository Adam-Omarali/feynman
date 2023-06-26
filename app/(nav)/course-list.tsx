"use client";

import { IconPlus } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import { DisplayCourseGroup } from "./CollectionButton";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientConfig";
import EmojiPicker from "emoji-picker-react";
import { addCourse, addLesson, addUnit } from "../../services/addMaterial";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

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
  type,
}: {
  display: boolean;
  setDisplay: Function;
  refId?: string;
  type: string;
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

  const ref = useDetectClickOutside({ onTriggered: close });
  return (
    <div ref={ref}>
      <div className="flex items-center gap-5 px-4">
        <p onMouseOver={() => setPickEmoji(true)}>{emoji}</p>
        <input
          className="input w-9/12 input-xs border-transparent max-w-xs"
          placeholder={type.charAt(0).toUpperCase() + type.slice(1) + " Name"}
          autoFocus
          onKeyUp={async (e) => {
            if (e.key == "Enter" && user) {
              setDisplay(false);
              if (type == "course") {
                await addCourse(e.currentTarget.value, emoji, user.id);
              } else if (type == "unit") {
                await addUnit(e.currentTarget.value, emoji, user.id, refId!);
              } else if (type == "lesson") {
                await addLesson(e.currentTarget.value, emoji, user.id, refId!);
              }
            }
          }}
        />
      </div>
      {pickEmoji ? (
        <div style={{ position: "absolute" }}>
          <EmojiPicker
            onEmojiClick={(emoji) => {
              setEmoji(emoji.emoji);
            }}
            width={280}
            height={350}
          />
        </div>
      ) : null}
    </div>
  );
}

export function CourseList() {
  const [addCourse, setAddCourse] = useState(false);
  let courses = useSelector((state: RootState) => state.courses.value);

  return (
    <div>
      <li className="py-2">
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
      </li>
      {addCourse ? (
        <ItemInput
          display={addCourse}
          setDisplay={setAddCourse}
          type={"course"}
        />
      ) : null}
      <li>
        {Object.keys(courses).length === 0 ? (
          <div className="space-y-2 flex flex-col gap-3 p-3">
            {[0, 1, 2].map((_) => (
              <Skeleton className="h-4 w-40 bg-slate-300" key={_} />
            ))}
          </div>
        ) : (
          Object.values(courses).map((course: any) => (
            <div key={course.id}>
              <DisplayCourseGroup course={course} />
            </div>
          ))
        )}
      </li>
    </div>
  );
}
