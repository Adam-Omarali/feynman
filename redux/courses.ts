import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { produce } from 'immer'

export interface unit {
    name: string,
    emoji: string,
    id: string
    userId: string,
    questions: {}[],
    lastTest: {},
    lessons: lessons,
    courseId: string,
    description: string
}

export interface units {
  [key: string]: unit
}

export interface lesson {
  name: string
  id: string
  courseId: string
  unitId: string
  emoji: string
  content?: string
}

interface lessons {
  [key: string]: lesson
}

export interface courseMenu {
  name: string,
  emoji: string,
  description: string,
  userId: string,
  questions: {}[],
  lastTest: {},
  id: string,
  units: units
}

export interface CourseState {
  value: {[key: string]: courseMenu}
}

const initialState: CourseState = {
  value: {}
}

export const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCourses: (state, action: PayloadAction<{[key: string]: courseMenu}>) => {
      state.value = action.payload
    },
    addCourseStore: (state, action: PayloadAction<courseMenu>) => {
      state.value[action.payload.id] = action.payload
    },
    addUnitStore: (state, action: PayloadAction<unit>) => {
      return produce(state, draft => {
        let courseId = action.payload.courseId
        draft.value[courseId].units[action.payload.id] = action.payload
      })
    },
    addLessonStore: (state, action: PayloadAction<lesson>) => {
      return produce(state, draft => {
        let courseId = action.payload.courseId
        let unitId = action.payload.unitId
        draft.value[courseId].units[unitId].lessons[action.payload.id] = action.payload
      })
    },
    deleteCourseStore: (state, action: PayloadAction<string>) => {
      delete state.value[action.payload]
    },
    deleteUnitStore: (state, action: PayloadAction<{unitId:string, courseId: string}>) => {
      return produce(state, draft => {
        delete draft.value[action.payload.courseId].units[action.payload.unitId]
      })    
    },
    deleteLessonStore: (state, action: PayloadAction<{courseId: string, unitId:string, lessonId:string}>) => {
      return produce(state, draft => {
        delete draft.value[action.payload.courseId].units[action.payload.unitId].lessons[action.payload.lessonId]
      })
    },
    updateLessonContent: (state, action: PayloadAction<{courseId: string, unitId:string, lessonId:string, content: string}>) => {
      return produce(state, draft => {
        draft.value[action.payload.courseId].units[action.payload.unitId].lessons[action.payload.lessonId].content = action.payload.content
      })
    }
  },
})

// Action creators are generated for each case reducer function
export const { setCourses, addCourseStore, addLessonStore, addUnitStore, deleteCourseStore, deleteUnitStore, deleteLessonStore, updateLessonContent } = courseSlice.actions

export default courseSlice.reducer