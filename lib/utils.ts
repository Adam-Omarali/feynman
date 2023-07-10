import { store } from "@/redux/store"
import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLessonList(){
  let courses = store.getState().courses.value
  let ret: {[key: string]: {id: string, courseId: string, unitId: string}} = {}
  Object.values(courses).map(course => {
    Object.values(course.units).map(unit => {
      Object.values(unit.lessons).map(lesson => {
        ret[lesson.name] = {id: lesson.id, courseId: course.id, unitId: unit.id}
      })
    })
  })
  return ret
}