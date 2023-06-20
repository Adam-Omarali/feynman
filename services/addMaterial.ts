import { context2, contextInterface } from "../context/appContext";

export async function addCourse(
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
  
export async function addUnit(
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
  
export async function addLesson(
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
    let newContext = {...context};
    let units = context.value?.courses[courseId].units;
    if(units && units[unitId].lessons){
        units[unitId].lessons![newLesson.id] = newLesson
        if(newContext.value?.courses[refId].units){
            newContext.value.courses[refId].units = units
        }
    }
    if (context.set) {
      context.set(newContext);
    }
}