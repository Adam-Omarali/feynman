import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { produce } from 'immer'


export type content = {
  content: any,
  type: string
}

export const defaultDoc = {
  type: "doc",
  content: [],
};


export interface QuestionAttempt {
  timestamp: number;
  correct: boolean;
  confidence: number;
}

export interface Question {
  id: string;
  userId: string;
  unitId: string;
  lessonId: string;
  difficulty: number;
  question: {content: content[], type: string};
  answer: {content: content[], type: string};
  solution: {content: content[], type: string};
  history: QuestionAttempt[];
}

const initialState: {questions: {[key: string]: Question}, fetchedUnits: string[]} = {questions: {}, fetchedUnits: []}


export const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    addQuestion: (state, action: PayloadAction<{question: Question, qId: string}>) => {
      console.log("Adding question to Redux:", action.payload.question)
      return produce(state, draft => {
          draft.questions[action.payload.qId] = action.payload.question
      })   
    },
    fetchUnit: (state, action: PayloadAction<string>) => {
      return produce(state, draft => {
        draft.fetchedUnits.push(action.payload)
      })
    }
  },
})

// Action creators are generated for each case reducer function
export const { addQuestion, fetchUnit } = questionSlice.actions

export default questionSlice.reducer