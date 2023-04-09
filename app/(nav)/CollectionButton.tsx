import { ActionIcon, createStyles, Input, UnstyledButton } from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { context, courseMenu } from "../../context/appContext";
import { rem } from "../../util/rem";
import { ItemInput } from "./header";

const useStyles = createStyles((theme) => ({
  collectionLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${rem(8)} 7px`,
    textDecoration: "none",
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSizes.xs,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    lineHeight: 1,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  chevron: {
    transition: "transform 200ms ease",
  },

  control: {
    fontWeight: 500,
    display: "block",
    width: "100%",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  add: {
    opacity: 0,
    "&:hover": {
      opacity: 1,
    },
  },
}));

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
          Array<boolean>(Object.keys(lessons!).length).fill(false),
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
          lessonArr[idx] = Array<boolean>(lessonArr[idx].length).fill(value);
          setLessonOpened(lessonArr);
        }
        let unitItem: { name: string; id: string; emoji: string } = {
          name: unit.name!,
          emoji: unit.emoji!,
          id: unit.id!,
        };
        if (courseOpened && unit) {
          console.log(course.id + " " + unit.id);
          return (
            <div style={{ paddingLeft: "7px" }} key={unit.name}>
              <CollectionButton
                item={unitItem}
                opened={unitOpened[idx]}
                setOpened={handleUnitOpened}
                type={"lesson"}
                refId={course.id + " " + unit.id}
              />
              {Object.values(unit.lessons!).map((lesson, idx2) => {
                let lesssonItem: { name: string; id: string; emoji: string } = {
                  name: lesson.name!,
                  emoji: lesson.emoji!,
                  id: lesson.id!,
                };
                if (unitOpened && lessonOpened[idx][idx2]) {
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
  const { classes, theme } = useStyles();
  const [displayAdd, setDisplayAdd] = useState(false);
  const [addCourse, setAddCourse] = useState(false);
  const ChevronIcon = theme.dir === "ltr" ? IconChevronRight : IconChevronLeft;

  return (
    <div>
      <UnstyledButton className={classes.control}>
        <div
          // onClick={(event) => event.preventDefault()}
          key={item.id}
          className={classes.collectionLink}
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
                className={classes.chevron}
                size="1rem"
                stroke={1.5}
                style={{
                  transform: opened
                    ? `rotate(${theme.dir === "rtl" ? -90 : 90}deg)`
                    : "none",
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
      </UnstyledButton>
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
