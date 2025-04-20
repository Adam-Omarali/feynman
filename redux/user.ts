import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  id: string,
  name: string,
  email: string,
  photo: string,
  courses: courseObj,
  storageUsed: number,
  subscription?: string,
  maxStorage?: number
}

export type simplifiedLesson = {
  [lessonId:string]: {
    name: string,
    emoji: string
  }
}

export type simplifiedUnit = {
  [unitId: string] : {
    name: string,
    emoji: string,
    lessons: simplifiedLesson
  }
}

export type simplifiedCourse = 
  {
    name: string,
    emoji: string,
    units: simplifiedUnit
  }


export type courseObj = {
  [courseId: string] : simplifiedCourse
}

const initialState: UserState = {
  id: "",
  name: "",
  email: "",
  photo: "",
  courses: {},
  storageUsed: 0,
  subscription: "",
  maxStorage: 20*1024*1024
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState>) => {
        state.id = action.payload.id
        state.name = action.payload.name
        state.photo = action.payload.photo
        state.email = action.payload.email
        state.courses = action.payload.courses
        state.storageUsed = action.payload.storageUsed
        state.subscription = action.payload.subscription
        state.maxStorage = action.payload.maxStorage
    },
    logout: (state) => {
        state = initialState
    },
    addCourseUser: (state, action: PayloadAction<{courseId: string, name: string, emoji: string}>) => {
      state.courses[action.payload.courseId] = {
        name: action.payload.name,
        emoji: action.payload.emoji,
        units: {}
      }
    },
    addUnitUser: (state, action: PayloadAction<{courseId: string, unitId: string, name: string, emoji: string}>) => {
      state.courses[action.payload.courseId].units[action.payload.unitId] = {
        name: action.payload.name,
        emoji: action.payload.emoji,
        lessons: {}
      }
    },
    addLessonUser: (state, action: PayloadAction<{courseId: string, unitId: string, lessonId: string, name: string, emoji: string}>) => {
      state.courses[action.payload.courseId].units[action.payload.unitId].lessons[action.payload.lessonId] = {
        name: action.payload.name,
        emoji: action.payload.emoji
      }
    },
    deleteCourseUser: (state, action: PayloadAction<string>) => {
      delete state.courses[action.payload]
    },
    deleteUnitUser: (state, action: PayloadAction<{courseId: string, unitId: string}>) => {
      delete state.courses[action.payload.courseId].units[action.payload.unitId]
    },
    deleteLessonUser: (state, action: PayloadAction<{courseId: string, unitId: string, lessonId: string}>) => {
      delete state.courses[action.payload.courseId].units[action.payload.unitId].lessons[action.payload.lessonId]
    }
  },
})

// Action creators are generated for each case reducer function
export const { login, logout, addCourseUser, addUnitUser, addLessonUser, deleteCourseUser, deleteUnitUser, deleteLessonUser } = userSlice.actions

export default userSlice.reducer