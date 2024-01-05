import { store } from "@/redux/store"
import { ClassValue, clsx } from "clsx"
import { id } from "date-fns/locale"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLessonList(){
  let courses = store.getState().user.courses
  let ret: {[key: string]: {id: string, courseId: string, unitId: string}} = {}

  for (const [courseId, course] of Object.entries(courses)) {
    for (const [unitId, unit] of Object.entries(course.units)){
      for (const [lessonId, lesson] of Object.entries(unit.lessons)){
        ret[lesson.name] = {id: lessonId, courseId: courseId, unitId: unitId}
      }
    }
  }
  return ret
}