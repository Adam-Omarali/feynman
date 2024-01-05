import { store } from "@/redux/store";
import { fetchMaterial, getCourseIdFromUnitId, getIdFromLessonId } from "./fetchMaterial";
import { CourseState, deleteCourseStore, setCourses } from "@/redux/courses";
import { deleteLessonStore } from "@/redux/lesson";
import { deleteUnitStore, unit } from "@/redux/unit";
import { courseObj, deleteCourseUser, deleteLessonUser, deleteUnitUser, simplifiedUnit } from "@/redux/user";
import { produce } from "immer";

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
    //delete lesson from database
    await deleteLessonAPI(lessonId)

    let courseObj = {...store.getState().user.courses}

    //if unit already deleted, no need to delete lesson
    if(courseObj[courseId].units[unitId]){
        courseObj = produce(courseObj, draft => {
            delete draft[courseId].units[unitId].lessons[lessonId]
        })
        //delete lesson from database user object
        await fetch("/api/updateUserCourses", {
            body: JSON.stringify({
                courseObj,
                userId: store.getState().user.id
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: "POST",
        })

        //remove lesson from User Object for navigation
        store.dispatch(deleteLessonUser({courseId, unitId, lessonId}))
    }

    //remove lesson from state stored lessons
    store.dispatch(deleteLessonStore(lessonId))
}

async function deleteUnitAPI(unitId: string, courseId: string, unit: simplifiedUnit){
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

    let courseObj = {...store.getState().user.courses}

    //if already deleted course, no need to delete unit
    if (courseObj[courseId]) {
        courseObj = produce(courseObj, draft => {
            delete draft[courseId].units[unitId]
        })
        deleteUnitUser({courseId, unitId})
        await fetch("/api/updateUserCourses", {
            body: JSON.stringify({
                courseObj,
                userId: store.getState().user.id
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: "POST",
        })
    }

    deleteUnitStore(unitId)

    if(unit[unitId].lessons){
        let lessons = unit[unitId].lessons
        for(let lessonId in lessons){
            await deleteLessonAPI(lessonId)
            deleteLessonUser({courseId, unitId, lessonId})
            deleteLessonStore(lessonId)
        }
    }
}

export async function deleteUnit(unitId: string, courseId: string){
    //delete first, so lesson knows not to delete
    store.dispatch(deleteUnitStore(unitId))
    store.dispatch(deleteUnitUser({courseId, unitId}))

    let courses = {...store.getState().user.courses}
    let units = courses[courseId].units
    if(units){
        await deleteUnitAPI(unitId, courseId, units)
    }
}

export async function deleteCourse(id: string){
    let courses:courseObj = store.getState().user.courses

    let courseObj = {...courses}

    courseObj = produce(courseObj, draft => {
        delete draft[id]
    })

    await fetch("/api/updateUserCourses", {
        body: JSON.stringify({
            courseObj,
            userId: store.getState().user.id
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        method: "POST",
    })

    store.dispatch(deleteCourseStore(id))
    store.dispatch(deleteCourseUser(id))

    if(courses && courses[id]['units']){
        let units = courses[id].units
        for(let unitId in units){
            deleteUnitAPI(unitId, id, units)
        }
    }

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
        await deleteLesson(ids.courseId, ids.unitId, ids.lessonId)
    }
}