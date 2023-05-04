"use client";

import {
  createStyles,
  Navbar,
  Text,
  Group,
  ActionIcon,
  Tooltip,
  Input,
  Button,
  HoverCard,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import { rem } from "../../util/rem";
import { DisplayCourseGroup } from "./CollectionButton";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientConfig";
import { UserButton } from "./UserButton";
import {
  appContext,
  contextInterface,
  courseMenu,
} from "../../context/appContext";
import EmojiPicker from "emoji-picker-react";

const useStyles = createStyles((theme) => ({
  navbar: {
    paddingTop: 0,
  },

  section: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    marginBottom: theme.spacing.md,

    "&:not(:last-of-type)": {
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[3]
      }`,
    },
  },

  searchCode: {
    fontWeight: 700,
    fontSize: rem(10),
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[2]
    }`,
  },

  mainLinks: {
    paddingLeft: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
    paddingRight: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
    paddingBottom: theme.spacing.md,
  },

  mainLink: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    fontSize: theme.fontSizes.xs,
    padding: `${rem(8)} ${theme.spacing.xs}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  mainLinkInner: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },

  mainLinkIcon: {
    marginRight: theme.spacing.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
  },

  mainLinkBadge: {
    padding: 0,
    width: rem(20),
    height: rem(20),
    pointerEvents: "none",
  },

  collections: {
    paddingLeft: `calc(${theme.spacing.md} - ${rem(6)})`,
    paddingRight: `calc(${theme.spacing.md} - ${rem(6)})`,
    paddingBottom: theme.spacing.md,
  },

  collectionsHeader: {
    padding: `${rem(8)} ${theme.spacing.xs}px`,
    marginBottom: rem(5),
  },

  collectionLink: {
    display: "flex",
    alignItems: "center",
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
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
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
}));

export const blankCourse = {
  emoji: "",
  label: "",
  link: "/",
  units: [],
  id: "",
};

async function addCourse(
  context: contextInterface,
  label: string,
  emoji: string,
  userId: string
) {
  let newCourse = await (
    await fetch("/api/addCourse", {
      body: JSON.stringify({
        name: label,
        userId: userId,
        emoji: emoji,
      }),
      method: "POST",
    })
  ).json();
  newCourse["units"] = [];
  let newContext = context;
  if (context.value && context.set) {
    newContext.value!.courses[newCourse.id] = newCourse;
    context.set(newContext);
  }
}

async function addUnit(
  context: contextInterface,
  label: string,
  emoji: string,
  userId: string,
  refId: string
) {
  let newUnit = await (
    await fetch("/api/addUnit", {
      body: JSON.stringify({
        name: label,
        emoji: emoji,
        userId: userId,
        ref: refId,
      }),
      method: "POST",
    })
  ).json();
  let newContext = context;
  let units = newContext.value?.courses[refId].units;
  if (units) {
    units[newUnit.id] = newUnit;
    newContext.value!.courses[refId].units = units;
  }
  if (context.set) {
    context.set(newContext);
  }
}

async function addLesson(
  context: contextInterface,
  label: string,
  emoji: string,
  userId: string,
  refId: string
) {
  let courseId = refId.split(" ")[0];
  let unitId = refId.split(" ")[1];
  let newLesson = await (
    await fetch("/api/addLesson", {
      body: JSON.stringify({
        name: label,
        emoji: emoji,
        userId: userId,
        courseId: courseId,
        unitId: unitId,
      }),
      method: "POST",
    })
  ).json();
  let newContext = context;
  let units = newContext.value?.courses[courseId].units;
  if (units) {
    units[unitId]["lessons"]![newLesson.id] = newLesson;
    newContext.value!.courses[refId].units = units;
  }
  if (context.set) {
    context.set(newContext);
  }
}

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
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <p onMouseOver={() => setPickEmoji(true)}>{emoji}</p>
        <Input
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
        ></Input>
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

export function NavbarSimple() {
  const { classes } = useStyles();
  const [addCourse, setAddCourse] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [courses, setCourses] = useState({});

  let context: contextInterface = useContext(appContext);

  useEffect(() => {
    async function getMaterials() {
      if (!loading) {
        let materials = await (
          await fetch("/api/getMaterials", {
            body: JSON.stringify({ id: user?.uid }),
            method: "POST",
          })
        ).json();
        setCourses(materials);
      }
    }
    getMaterials();
  }, []);

  return (
    <Navbar height={700} width={{ sm: 230 }} p="md" className={classes.navbar}>
      <Navbar.Section className={classes.section}>
        {user != null ? (
          <UserButton
            image={user.photoURL!}
            name={user.displayName!}
            email={user.email!}
          />
        ) : null}
      </Navbar.Section>

      <Navbar.Section className={classes.section}>
        <Group className={classes.collectionsHeader} position="apart">
          <Text size="xs" weight={500} color="dimmed">
            Courses
          </Text>
          <Tooltip label="Create course" withArrow position="right">
            <ActionIcon
              variant="default"
              size={18}
              onClick={() => setAddCourse(true)}
            >
              <IconPlus size="0.8rem" stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Group>
        {addCourse ? (
          <ItemInput
            display={addCourse}
            setDisplay={setAddCourse}
            type={"course"}
          />
        ) : null}
        <div className={classes.collections}>
          {context.value?.courses
            ? Object.values(context.value.courses).map((course: any) => (
                <div key={course.id}>
                  <DisplayCourseGroup course={course} />
                </div>
              ))
            : Object.values(courses).map((course: any) => (
                <div key={course.id}>
                  <DisplayCourseGroup course={course} />
                </div>
              ))}
        </div>
      </Navbar.Section>
    </Navbar>
  );
}
