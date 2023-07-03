import { store } from "@/redux/store";
import { fetchMaterial, getCourseIdFromUnitId, getIdFromLessonId } from "./fetchMaterial";
import { CourseState, deleteCourseStore, deleteLessonStore, deleteUnitStore, setCourses, units } from "@/redux/courses";

async function deleteLessonAPI(lessonId: string){
    await fetch("/api/deleteById", {
        body: JSON.stringify({
            id: lessonId,
            type: "lessons"
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        method: "POST",
    })
}

// async function deleteLessonContext(lessonId: string){
//     let {courseId, unitId} = await getIdFromLessonId(lessonId)
//     let newContext = {...context}
//     if(newContext.value?.courses[courseId].units[unitId].lessons){
//         delete newContext.value?.courses[courseId].units[unitId].lessons![lessonId]
//     }
//     if(context.set){
//         context.set(newContext)
//     }
// }

export async function deleteLesson(courseId:string, unitId: string, lessonId: string){
    await deleteLessonAPI(lessonId)
    store.dispatch(deleteLessonStore({courseId, unitId, lessonId}))
}

async function deleteUnitAPI(unitId: string, units: units){
    await fetch("/api/deleteById", {
        body: JSON.stringify({
            id: unitId,
            type: "units"
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        method: "POST",
    })
    if(units[unitId].lessons){
        let lessons = units[unitId].lessons
        for(let lessonId in lessons){
            deleteLessonAPI(lessonId)
        }
    }
}

export async function deleteUnit(unitId: string, courseId: string){
    let courses = {...store.getState().courses.value}
    let units = courses[courseId].units
    if(units){
        await deleteUnitAPI(unitId, units)
    }
    store.dispatch(deleteUnitStore({unitId, courseId}))
}

export async function deleteCourse(id: string){
    let courseStore:CourseState = store.getState().courses
    let courses = courseStore.value
    if(courses && courses[id]['units']){
        let units = courses[id].units
        for(let unitId in units){
            deleteUnitAPI(unitId, units)
        }
    }

    store.dispatch(deleteCourseStore(id))

    await fetch("/api/deleteById", {
        body: JSON.stringify({
            id: id,
            type: "courses"
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        method: "POST",
    })
}

export async function deleteMaterial(ids: {lessonId: string, unitId: string, courseId: string}, type: string){
    if(type == "course"){
        await deleteCourse(ids.courseId)
    }
    else if(type == "unit"){
        await deleteUnit(ids.unitId, ids.courseId)
    }
    else if (type == "lesson"){
        console.log(1)
        await deleteLesson(ids.courseId, ids.unitId, ids.lessonId)
    }
}