import { updateLessonContent } from "@/redux/courses"
import { history, updateQuestionHistory } from "@/redux/questions"
import { store } from "@/redux/store"

export async function EditLessonContent(content: [], courseId: string, unitId: string, lessonId: string){
    store.dispatch(updateLessonContent({courseId, unitId, lessonId, content}))
    await fetch("/api/lesson/" + lessonId, {
        body: JSON.stringify({
            content
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        method: "PUT",
    })
}

export async function updateHistory(obj: history){
    store.dispatch(updateQuestionHistory(obj))
    let res = await(await fetch("/api/updateHistory", {
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
        },
        method: "PUT",
    })).json()
    console.log(res)
}