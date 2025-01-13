import { getUnitIdFromLessonId } from "@/lib/utils";
import { lesson } from "@/redux/lesson";
import { addQuestion, fetchUnit, question, updateQuestionHistory } from "@/redux/questions";
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
  let ret: { [key: string]: question } = {}
  if (questionState.fetchedUnits.includes(unitId)) {
    console.log(questionState.questions)
    for (let id of Object.keys(questionState.questions)) {
      let lessonId = getUnitIdFromLessonId(questionState.questions[id].lessonId)
      if (lessonId == unitId) {
        ret[id] = questionState.questions[id]
      }
    }
  } else {
    console.log("fetching questions by unitId")
    let temp = await fetchMaterial("/user/"+userId+"/"+unitId)
    if (!temp.hasOwnProperty("questions")){
      return {}
    }
    let data: { [key: string]: question } = temp.questions
    for (let questionId of Object.keys(data)){
      store.dispatch(addQuestion({question: data[questionId], qId: questionId}))
    }
    store.dispatch(fetchUnit(unitId))
    ret = data
  }
  return ret
}

export async function updateQuestion(userId: string, unitId: string, questionsMap: {
  [key: string]: {
    id: string;
    question: any;
    answer: any;
    history: {
      confidence: number;
      attempts: number;
      correct: boolean;
      date: number;
    }[];
    // ... other question fields
  }
}) {

  const response = await fetch(`/api/updateQuestion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      unitId,
      questions: questionsMap
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update questions');
  }

  return response.json();
}