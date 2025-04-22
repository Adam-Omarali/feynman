import { getUnitIdFromLessonId } from "@/lib/utils";
import { lesson } from "@/redux/lesson";
import { addQuestion, fetchUnit, Question } from "@/redux/questions";
import { store } from "@/redux/store";

export async function fetchMaterial(endpoint:string){
  console.log("firebase read")
  try{
    return await (
      await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api" + endpoint, {
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

export async function getUser(userId: string){
  let data = await fetchMaterial("/user/" + userId)
  return data
}

export async function getQuestions(userId: string, unitId: string){
  const questionState = store.getState().questions
  let ret: { [key: string]: Question } = {}
  if (questionState.fetchedUnits.includes(unitId)) {
    console.log("Using cached questions:", questionState.questions)
    for (let id of Object.keys(questionState.questions)) {
      let lessonId = getUnitIdFromLessonId(questionState.questions[id].lessonId)
      if (lessonId == unitId) {
        ret[id] = questionState.questions[id]
      }
    }
  } else {
    console.log("Fetching questions by unitId")
    let data = await fetchMaterial(`/getQuestions?userId=${userId}&unitId=${unitId}`)
    for (let questionId of Object.keys(data)){
      // Ensure history field exists and is properly initialized
      const question = data[questionId]
      store.dispatch(addQuestion({question, qId: questionId}))
    }
    store.dispatch(fetchUnit(unitId))
    ret = data
  }
  return ret
}