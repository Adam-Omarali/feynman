import { updateLessonContent } from "@/redux/courses"
import { store } from "@/redux/store"

export async function EditLessonContent(content: string, courseId: string, unitId: string, lessonId: string){
    await fetch("/api/lesson/" + lessonId, {
        body: JSON.stringify({
            content
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        method: "PUT",
    })
    store.dispatch(updateLessonContent({courseId, unitId, lessonId, content}))
}