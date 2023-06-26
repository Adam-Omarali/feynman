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
    courseId: string
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
    deleteUnitStore: (state, action: PayloadAction<{units: units, courseId: string}>) => {
      state.value[action.payload.courseId].units = action.payload.units
    }
  },
})

// Action creators are generated for each case reducer function
export const { setCourses, addCourseStore, addLessonStore, deleteCourseStore, deleteUnitStore } = courseSlice.actions

export default courseSlice.reducer