import { store } from "@/redux/store";
import { addCourseStore, addLessonStore, setCourses, unit } from "@/redux/courses";
import { Flashcard } from "@/app/flashcard/page";

export async function addCourse(
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
  store.dispatch(addCourseStore(newCourse))
}

export async function addUnit(
  label: string,
  emoji: string,
  userId: string,
  refId: string
) {
  let newUnit: unit = await (
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

  let courses = { ...store.getState().courses.value }
  courses[refId].units[newUnit.id] = newUnit
  store.dispatch(setCourses(courses))
}

export async function addLesson(
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

  store.dispatch(addLessonStore(newLesson))
}

export async function addFlashcard(
  userId: string,
  f: Flashcard
) {
  let newFlashcard = await (
    await fetch("/api/addFlashcards", {
      body: JSON.stringify({
        userId: userId,
        qusetion: f.question,
        answer: f.answer,
        difficulty: f.difficulty,
        lesson: f.lesson
      }),
      method: "POST",
    })
  ).json();

  store.dispatch(addLessonStore(newFlashcard))
}