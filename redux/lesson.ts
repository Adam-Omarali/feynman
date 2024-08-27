import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { content } from "./questions"

export interface lesson {
    name: string
    id: string
    courseId: string
    unitId: string
    emoji: string
    content?: content | []
    // questions: string[]
  }
  

export interface LessonState {
    value: {[key: string]: lesson}
}

const initialState: LessonState = {
    value: {}
}
  
  export const lessonSlice = createSlice({
    name: 'lessons',
    initialState,
    reducers: {
      setLessons: (state, action: PayloadAction<{[key: string]: lesson}>) => {
        state.value = action.payload
      },
      addLessonStore: (state, action: PayloadAction<lesson>) => {
        state.value[action.payload.id] = action.payload
      },
      deleteLessonStore: (state, action: PayloadAction<string>) => {
        if(Object.keys(state.value).includes(action.payload)){
            delete state.value[action.payload]
        }
      },
      //add question
      // addQuestionLesson: (state, action: PayloadAction<{lessonId: string, questionId: string}>) => {
      //   state.value[action.payload.lessonId].questions.push(action.payload.questionId)
      // },
      //update content
      updateLessonContent: (state, action: PayloadAction<{lessonId: string, content: content | []}>) => {
        state.value[action.payload.lessonId].content = action.payload.content
      }
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { setLessons, addLessonStore, deleteLessonStore, updateLessonContent } = lessonSlice.actions
  
  export default lessonSlice.reducer