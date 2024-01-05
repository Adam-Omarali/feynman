import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface courseMenu {
  name: string,
  emoji: string,
  description: string,
  userId: string,
  id: string,
  unitOrder: string[]
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
      if (Object.keys(state.value).includes(action.payload)){
        delete state.value[action.payload]
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { setCourses, addCourseStore, deleteCourseStore } = courseSlice.actions

export default courseSlice.reducer