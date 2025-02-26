"use client";

import { IconChevronRight, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { rem } from "../../util/rem";
import { ItemInput } from "./course-list";
import { simplifiedCourse } from "@/redux/user";
import { Skeleton } from "@/components/ui/Skeleton";

export function DisplayCourseGroup({
  course,
  courseId,
}: Readonly<{
  course: simplifiedCourse;
  courseId: string;
}>) {
  const [courseOpened, setCourseOpened] = useState(false);
  const [unitOpened, setUnitOpened] = useState<boolean[]>([]);
  const [lessonOpened, setLessonOpened] = useState<boolean[][]>([]);

  useEffect(() => {
    let unitToAdd = Object.keys(course.units).length - unitOpened.length;
    let unitTemp = [...unitOpened];
    for (let index = 0; index < unitToAdd; index++) {
      unitTemp.push(false);
    }
    setUnitOpened(unitTemp);

    let lessonTemp: boolean[][] = [];

    let unitIds = Object.keys(course.units);
    for (let i = 0; i < unitIds.length; i++) {
      let unitId = unitIds[i];
      let lessons = course.units[unitId].lessons;
      if (lessons) {
        lessonTemp = [
          ...lessonTemp,
          Array<boolean>(Object.keys(lessons).length).fill(unitTemp[i]),
        ];
      } else {
        lessonTemp = [...lessonTemp, []];
      }
    }
    setLessonOpened(lessonTemp);
  }, [course]);

  return (
    <div>
      <CollectionButton
        item={course}
        itemId={courseId}
        opened={courseOpened}
        setOpened={setCourseOpened}
        dropdownOpens={"unit"} //dropdown opens units
        refId={courseId}
      />
      {Object.values(course.units).map((unit, idx) => {
        const unitId = Object.keys(course.units)[idx];
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

        if (courseOpened && unit) {
          return (
            <div style={{ paddingLeft: "7px" }} key={unitId}>
              <CollectionButton
                item={unit}
                itemId={unitId}
                opened={unitOpened[idx]}
                setOpened={handleUnitOpened}
                dropdownOpens={"lesson"} //dropdown opens units
                refId={courseId + " " + unitId} //have to have unit id at this level for adding lessons using + on a unit
              />
              {unit.lessons &&
                Object.values(unit.lessons).map((lesson, idx2) => {
                  const lessonId = Object.keys(unit.lessons)[idx2];
                  function handleLessonOpen() {
                    let lessonArr = [...lessonOpened];
                    lessonArr[idx][idx2] = true;
                    setLessonOpened(lessonArr);
                  }
                  if (
                    unitOpened && //the unit which constains the lesson is opened
                    lessonOpened.length > idx && //if the unit idx is smaller than the number of lessons (since can have a unit with no lesson)
                    lessonOpened[idx][idx2] // if the lesson (idx2) with the unit (idx) is opened
                  ) {
                    return (
                      <div style={{ paddingLeft: "20px" }} key={lessonId}>
                        <CollectionButton
                          item={lesson}
                          itemId={lessonId}
                          opened={undefined}
                          dropdownOpens={"none"}
                          setOpened={() => {}}
                          refId={courseId + " " + unitId}
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
  itemId,
  opened,
  setOpened,
  dropdownOpens,
  refId,
}: Readonly<{
  item: { name: string; emoji: string };
  itemId: string;
  opened: boolean | undefined;
  setOpened: Function;
  dropdownOpens?: string;
  refId?: string;
}>) {
  const [displayAdd, setDisplayAdd] = useState(false);
  const [addCourse, setAddCourse] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const ChevronIcon = IconChevronRight;

  return (
    <div>
      <button
        className="w-full"
        onMouseEnter={() => setDisplayAdd(true)}
        onMouseLeave={() => setDisplayAdd(false)}
      >
        <div
          // onClick={(event) => event.preventDefault()}
          key={itemId}
          className="flex items-center justify-between px-2 py-2 rounded text-xs leading-none font-medium text-gray-500 hover:text-black hover:bg-gray-100"
        >
          <div className="flex items-center">
            {opened !== undefined ? (
              <ChevronIcon
                onClick={() => {
                  addCourse ? setAddCourse(false) : () => {};
                  opened !== undefined ? setOpened(!opened) : () => {};
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
                dropdownOpens == "unit"
                  ? "/app/course/" + itemId
                  : dropdownOpens == "lesson"
                  ? "/app/unit/" + itemId + "?course=" + refId?.split(" ")[0]
                  : "/app/lesson/" +
                    itemId +
                    "?course=" +
                    refId?.split(" ")[0] +
                    "&unit=" +
                    refId?.split(" ")[1]
              }
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span style={{ marginRight: rem(9), fontSize: rem(16) }}>
                {item.emoji}
              </span>
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
            dropdownOpens={dropdownOpens!}
            refId={refId}
            setSubmitting={setSubmitting}
          />
        </div>
      ) : null}
      {submitting && dropdownOpens && (
        <div className="ml-4 -mt-2">
          <Skeleton className="h-10 w-[80%]">
            <p className="text-sm m-4">
              Adding{" "}
              {dropdownOpens.charAt(0).toUpperCase() + dropdownOpens.slice(1)}
            </p>
          </Skeleton>
        </div>
      )}
    </div>
  );
}
