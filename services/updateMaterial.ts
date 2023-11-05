import { updateLessonContent } from "@/redux/courses"
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