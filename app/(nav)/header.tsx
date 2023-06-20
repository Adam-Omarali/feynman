"use client";

import { IconPlus } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import { DisplayCourseGroup } from "./CollectionButton";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientConfig";
import { appContext, contextInterface } from "../../context/appContext";
import EmojiPicker from "emoji-picker-react";
import { addCourse, addLesson, addUnit } from "../../services/addMaterial";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/Skeleton";

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
  const [user, loading] = useAuthState(auth);
  let context: contextInterface = useContext(appContext);

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
              console.log(type);
              if (type == "course") {
                await addCourse(
                  context,
                  e.currentTarget.value,
                  emoji,
                  user?.uid
                );
              } else if (type == "unit") {
                await addUnit(
                  context,
                  e.currentTarget.value,
                  emoji,
                  user.uid,
                  refId!
                );
              } else if (type == "lesson") {
                await addLesson(
                  context,
                  e.currentTarget.value,
                  emoji,
                  user.uid,
                  refId!
                );
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
  const [user, loading] = useAuthState(auth);

  async function getMaterials() {
    if (!loading) {
      let materials = await (
        await fetch("/api/getMaterials", {
          body: JSON.stringify({ id: user?.uid }),
          method: "POST",
        })
      ).json();
      return materials;
    }
  }

  const result = useQuery({ queryKey: ["all courses"], queryFn: getMaterials });

  let context: contextInterface = useContext(appContext);

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
        {context.value?.courses ? (
          Object.values(context.value.courses).map((course: any) => (
            <div key={course.id}>
              <DisplayCourseGroup course={course} />
            </div>
          ))
        ) : result.isLoading ? (
          <Skeleton />
        ) : (
          Object.values(result.data).map((course: any) => (
            <div key={course.id}>
              <DisplayCourseGroup course={course} />
            </div>
          ))
        )}
      </li>
    </div>
  );
}
