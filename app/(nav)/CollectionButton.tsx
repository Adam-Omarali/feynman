"use client";

import { IconChevronRight, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { courseMenu } from "../../context/appContext";
import { rem } from "../../util/rem";
import { ItemInput } from "./header";

export function DisplayCourseGroup({ course }: { course: courseMenu }) {
  const [courseOpened, setCourseOpened] = useState(false);
  const [unitOpened, setUnitOpened] = useState<boolean[]>(
    Array<boolean>(Object.keys(course.units).length).fill(false)
  );
  const [lessonOpened, setLessonOpened] = useState<boolean[][]>([]);

  useEffect(() => {
    for (let unit in Object.keys(course.units)) {
      unit = Object.keys(course.units)[unit];
      let lessons = course.units[unit].lessons;
      if (lessons) {
        setLessonOpened([
          ...lessonOpened,
          Array<boolean>(Object.keys(lessons).length).fill(false),
        ]);
      } else {
        setLessonOpened([...lessonOpened, []]);
      }
    }
  }, []);

  return (
    <div>
      <CollectionButton
        item={course}
        opened={courseOpened}
        setOpened={setCourseOpened}
        type={"unit"}
        refId={course.id}
      />
      {Object.values(course.units).map((unit, idx) => {
        function handleUnitOpened(value: boolean) {
          let arr = [...unitOpened];
          arr[idx] = value;
          setUnitOpened(arr);

          let lessonArr = [...lessonOpened];
          if (lessonArr.length > idx) {
            lessonArr[idx] = Array<boolean>(lessonArr[idx].length).fill(value);
            setLessonOpened(lessonArr);
          }
        }
        let unitItem: { name: string; id: string; emoji: string } = {
          name: unit.name!,
          emoji: unit.emoji!,
          id: unit.id!,
        };
        if (courseOpened && unit) {
          return (
            <div style={{ paddingLeft: "7px" }} key={unit.name}>
              <CollectionButton
                item={unitItem}
                opened={unitOpened[idx]}
                setOpened={handleUnitOpened}
                type={"lesson"}
                refId={course.id + " " + unit.id}
              />
              {unit.lessons &&
                Object.values(unit.lessons).map((lesson, idx2) => {
                  let lesssonItem: { name: string; id: string; emoji: string } =
                    {
                      name: lesson.name!,
                      emoji: lesson.emoji!,
                      id: lesson.id!,
                    };
                  if (
                    unitOpened &&
                    lessonOpened.length > idx &&
                    lessonOpened[idx][idx2]
                  ) {
                    return (
                      <div style={{ paddingLeft: "20px" }} key={lesson.name}>
                        <CollectionButton
                          item={lesssonItem}
                          opened={undefined}
                          type={"none"}
                          setOpened={() => {}}
                          refId={course.id + " " + unit.id}
                        />
                      </div>
                    );
                  }
                })}
            </div>
          );
        }
      })}
    </div>
  );
}

export default function CollectionButton({
  item,
  opened,
  setOpened,
  type,
  refId,
}: {
  item: { name: string; id: string; emoji: string };
  opened: boolean | undefined;
  setOpened: Function;
  type?: string;
  refId?: string;
}) {
  const [displayAdd, setDisplayAdd] = useState(false);
  const [addCourse, setAddCourse] = useState(false);
  const ChevronIcon = IconChevronRight;

  return (
    <div>
      <button className="w-full">
        <div
          // onClick={(event) => event.preventDefault()}
          key={item.id}
          className="flex items-center justify-between px-2 py-2 rounded text-xs leading-none font-medium text-gray-500 hover:text-black hover:bg-gray-100"
          onMouseEnter={() => setDisplayAdd(true)}
          onMouseLeave={() => setDisplayAdd(false)}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {opened !== undefined ? (
              <ChevronIcon
                onClick={() => {
                  addCourse ? setAddCourse(false) : null;
                  opened !== undefined ? setOpened(!opened) : null;
                }}
                className="transition-transform duration-150 ease-linear"
                size="1rem"
                stroke={1.5}
                style={{
                  transform: opened ? `rotate(90deg)` : "none",
                }}
              />
            ) : null}
            <Link
              href={
                type == "unit"
                  ? "/course/" + item.id
                  : type == "lesson"
                  ? "/unit/" + item.id + "?course=" + refId
                  : "/lesson/" +
                    item.id +
                    "?course=" +
                    refId?.split(" ")[0] +
                    "&unit=" +
                    refId?.split(" ")[1]
              }
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span style={{ marginRight: rem(9), fontSize: rem(16) }}>
                {item.emoji}
              </span>{" "}
              {item.name}
            </Link>
          </div>
          {displayAdd && opened !== undefined ? (
            <IconPlus
              size="0.8rem"
              stroke={1.5}
              onClick={() => {
                setAddCourse(true);
                setOpened(true);
              }}
            />
          ) : null}
        </div>
      </button>
      {addCourse ? (
        <div style={{ padding: "5px 5px 0px 12px", margin: "0px" }}>
          <ItemInput
            display={addCourse}
            setDisplay={setAddCourse}
            type={type!}
            refId={refId}
          />
        </div>
      ) : null}
    </div>
  );
}
