import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface units {
  [key: string]: {
      name?: string,
      emoji?: string,
      id?: string
      userId?: string,
      questions?: {}[],
      lastTest?: {},
      lessons?: lessons
  }
}

export interface lesson {
  name: string
  id: string
  courseId: string
  unitId: string
  emoji?: string
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
    deleteCourseStore: (state, action: PayloadAction<string>) => {
      delete state.value[action.payload]
    }
  },
})

// Action creators are generated for each case reducer function
export const { setCourses, addCourseStore, deleteCourseStore } = courseSlice.actions

export default courseSlice.reducer