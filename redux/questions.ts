import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { produce } from 'immer'


export type content = {
  content: content[],
  type: "paragraph"
} | {
  text: string, 
  type: "text"
}

export type editorContent = {
    content: content,
    type: string
  } 

export interface question {
    id: string,
    userId: string,
    question: content,
    answer?: content,
    solution?: content,
    difficulty: number,
    lesson: string,
    history: history[]
}

export type history = {qId: string, confidence: number, attempts: number, correct: boolean, date: number}

const initialState: {[key: string]: question} = {}

export const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<{[key: string]: question}>) => {
        return action.payload
    },
    addQuestion: (state, action: PayloadAction<question>) => {
        return produce(state, draft => {
            draft[action.payload.id] = action.payload
        })   
    },
    updateQuestionHistory: (state, action: PayloadAction<history>) => {
      return produce(state, draft => {
        draft[action.payload.qId].history.push(action.payload)
      })
    }
  },
})

// Action creators are generated for each case reducer function
export const { setQuestions, addQuestion, updateQuestionHistory } = questionSlice.actions

export default questionSlice.reducer