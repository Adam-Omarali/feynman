import { updateLessonContent } from "@/redux/lesson"
import { content } from "@/redux/questions"
import { store } from "@/redux/store"

export async function editLessonContent(content: content, courseId: string, unitId: string, lessonId: string){
    store.dispatch(updateLessonContent({lessonId, content}))
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