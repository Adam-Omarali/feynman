import { store } from "@/redux/store";
import { addCourseStore } from "@/redux/courses";
import { Flashcard } from "@/components/FlashcardForm";
import { addQuestion } from "@/redux/questions";
import { addCourseUser, addLessonUser, addUnitUser, courseObj } from "@/redux/user";
import { addUnitStore, unit } from "@/redux/unit";
import { addLessonStore, addQuestionLesson, lesson } from "@/redux/lesson";

export interface ids {
  lessonId: string,
  unitId: string,
  courseId: string
}

export async function addCourse(
    label: string,
    emoji: string,
    userId: string,
    description?: string
    ) {
    let courseObj = store.getState().user.courses
    let newCourse = await (
        await fetch("/api/addCourse", {
        body: JSON.stringify({
            name: label,
            userId: userId,
            emoji: emoji,
            description: description ? description : "",
            courseObj
        }),
        method: "POST",
        })
    ).json();
    newCourse["units"] = [];
    store.dispatch(addCourseStore(newCourse))
    store.dispatch(addCourseUser({courseId: newCourse.id, name: label, emoji}))
    return `/course/${newCourse.id}`
}
  
export async function addUnit(
    label: string,
    emoji: string,
    userId: string,
    refId: string,
    description?: string
) {
    let courseObj = store.getState().user.courses
    let newUnit: unit = await (
      await fetch("/api/addUnit", {
        body: JSON.stringify({
          name: label,
          emoji: emoji,
          userId: userId,
          ref: refId.split(" ")[0],
          description: description ? description : "",
          courseObj
        }),
        method: "POST",
      })
    ).json();

    store.dispatch(addUnitUser({courseId: refId.split(" ")[0], unitId: newUnit.id, name: label, emoji}))
    store.dispatch(addUnitStore(newUnit))
    return `/unit/${newUnit.id}?course=${refId}`
}
  
export async function addLesson(
    label: string,
    emoji: string,
    userId: string,
    refId: string,
) {
    let courseObj = store.getState().user.courses
    let courseId = refId.split(" ")[0];
    let unitId = refId.split(" ")[1];
    let newLesson: lesson = await (
      await fetch("/api/addLesson", {
        body: JSON.stringify({
          name: label,
          emoji,
          userId,
          courseId,
          unitId,
          courseObj
        }),
        method: "POST",
      })
    ).json();

    store.dispatch(addLessonStore(newLesson));
    store.dispatch(addLessonUser({courseId, unitId, lessonId: newLesson.id, name: label, emoji}))
    return `/lesson/${newLesson.id}?course=${courseId}&unit=${unitId}`
}

export async function addFlashcard(
  userId: string,
  ids: ids,
  f: Flashcard
) {
  let newFlashcard = await (
    await fetch("/api/addFlashcard", {
      body: JSON.stringify({
        userId: userId,
        question: f.question,
        answer: f.answer,
        solution: f.solution,
        difficulty: f.difficulty,
        lessonId: ids.lessonId
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: "POST",
    })
  ).json();

  store.dispatch(addQuestion(newFlashcard))
  store.dispatch(addQuestionLesson({lessonId: ids.lessonId, questionId: newFlashcard.id}))
}