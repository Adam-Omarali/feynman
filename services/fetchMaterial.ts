import { getUnitIdFromLessonId } from "@/lib/utils";
import { lesson } from "@/redux/lesson";
import { addQuestion, fetchUnit, question } from "@/redux/questions";
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
  let ret = []
  console.log(questionState)
  if (questionState.fetchedUnits.includes(unitId)) {
    for (let question of Object.values(questionState.questions)) {
      if (getUnitIdFromLessonId(question.lessonId) == unitId) {
        ret.push(question);
      }
    }
  } else {
    console.log("fetching questions by unitId")
    let temp = await fetchMaterial("/user/"+userId+"/"+unitId)
    if (!temp.hasOwnProperty("questions")){
      return []
    }
    let data: question[] = temp.questions
    console.log(data)
    for (let question of data){
      store.dispatch(addQuestion(question))
    }
    store.dispatch(fetchUnit(unitId))
    ret = data
  }
  return ret
}



export async function getQuestionContent(contentId: string){
  let questionState = store.getState().questions
  if (questionState.fetchedContent.includes(contentId)){
    //get question from contentId
    return questionState.questions[contentId]
  }
  // let qContent = await fetchMaterial("/question/"+contentId)
  return await fetchMaterial("/question/"+contentId)
}