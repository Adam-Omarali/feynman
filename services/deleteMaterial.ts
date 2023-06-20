import { context2, units } from "../context/appContext";
import { fetchMaterial, getCourseIdFromUnitId, getIdFromLessonId } from "./fetchMaterial";

async function deleteLessonAPI(lessonId: string){
    await fetch("/api/deleteById", {
        body: JSON.stringify({
            id: lessonId,
            type: "lessons"
        }),
        method: "DELETE",
    })
}

async function deleteLessonContext(lessonId: string, context: context2){
    let {courseId, unitId} = await getIdFromLessonId(lessonId)
    let newContext = {...context}
    if(newContext.value?.courses[courseId].units[unitId].lessons){
        delete newContext.value?.courses[courseId].units[unitId].lessons![lessonId]
    }
    if(context.set){
        context.set(newContext)
    }
}

export async function deleteLesson(lessonId: string, context?: context2){
    await deleteLessonAPI(lessonId)
    if(context){
        await deleteLessonContext(lessonId, context)
    }
}

async function deleteUnitContext(unitId: string, context: context2, courseId?:string){
    if(!courseId){
        courseId = await getCourseIdFromUnitId(unitId)
    }

    let newContext = {...context}
    delete newContext.value?.courses[courseId!].units[unitId]
    if(context.set){
        context.set(newContext)
    }
}

async function deleteUnitAPI(unitId: string, units: units){
    await fetch("/api/deleteById", {
        body: JSON.stringify({
            id: unitId,
            type: "units"
        }),
        method: "DELETE",
    })
    if(units[unitId].lessons){
        let lessons = units[unitId].lessons
        for(let lessonId in lessons){
            deleteLessonAPI(lessonId)
        }
    }
}

export async function deleteUnit(unitId: string, context?: context2){
    if(context){
        let courseId = await getCourseIdFromUnitId(unitId)
        let units = context.value?.courses[courseId].units
        if(units){
            await deleteUnitAPI(unitId, units)
        }
        await deleteUnitContext(unitId, context, courseId)
    }
}

export async function deleteCourse(id: string, context: context2){
    let courses = context.value?.courses
    if(courses && courses[id]['units']){
        let units = courses[id].units
        for(let unitId in units){
            deleteUnitAPI(unitId, units)
        }
    }
    let newContext = {...context}
    delete newContext.value?.courses[id]
    if(context.set){
        context.set(newContext)
    }

    await fetch("/api/deleteById", {
        body: JSON.stringify({
          id: id,
          type: "courses"
        }),
        method: "DELETE",
    })
}

export async function deleteMaterial(id: string, context: context2, type: string){
    if(type == "course"){
        await deleteCourse(id, context)
    }
    else if(type == "unit"){
        await deleteUnit(id, context)
    }
    else if (type == "lesson"){
        await deleteLesson(id, context)
    }
}