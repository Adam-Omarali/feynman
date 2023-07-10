import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { produce } from 'immer'

export interface question {
    id: string,
    userId: string,
    question: string,
    answer: string,
    difficulty: number,
    lesson: string,
    history: {}
}

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
    }
  },
})

// Action creators are generated for each case reducer function
export const { setQuestions, addQuestion } = questionSlice.actions

export default questionSlice.reducer