import { store } from "@/redux/store";
import { addCourseStore, addLessonStore, addUnitStore, setCourses, unit } from "@/redux/courses";

export async function addCourse(
    label: string,
    emoji: string,
    userId: string,
    description?: string
    ) {
    let newCourse = await (
        await fetch("/api/addCourse", {
        body: JSON.stringify({
            name: label,
            userId: userId,
            emoji: emoji,
            description: description ? description : ""
        }),
        method: "POST",
        })
    ).json();
    newCourse["units"] = [];
    store.dispatch(addCourseStore(newCourse))
    return `/course/${newCourse.id}`
}
  
export async function addUnit(
    label: string,
    emoji: string,
    userId: string,
    refId: string,
    description?: string
) {
    let newUnit: unit = await (
      await fetch("/api/addUnit", {
        body: JSON.stringify({
          name: label,
          emoji: emoji,
          userId: userId,
          ref: refId,
          description: description ? description : ""
        }),
        method: "POST",
      })
    ).json();

    store.dispatch(addUnitStore(newUnit))
    return `/unit/${newUnit.id}?course=${refId}`
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

    store.dispatch(addLessonStore(newLesson));
    return `/lesson/${newLesson.id}?course=${courseId}&unit=${unitId}`
}