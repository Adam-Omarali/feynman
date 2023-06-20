import { lesson } from "../context/appContext";

export async function fetchMaterial(endpoint:string){
  try{
    return await (
      await fetch("http://localhost:3000/api/" + endpoint, {
        method: "GET",
      })
    ).json();
  }
  catch (e) {
    console.log(e)
    return undefined
  }
}

export async function getCourseIdFromUnitId(unitId: string){
  return (await fetchMaterial("/unit/" + unitId)).courseId
}

export async function getIdFromLessonId(lessonId: string){
  let data: lesson = await fetchMaterial("/lesson/" + lessonId) as lesson
  return {unitId: data.unitId, courseId: data.courseId}
}