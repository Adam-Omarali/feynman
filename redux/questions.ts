import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { produce } from 'immer'


export type content = {
  content: any,
  type: string
}

export type editorContent = {
    content: content,
    type: string
} 

export const defaultDoc = {
  type: "doc",
  content: [],
};


export type question  = {
  id: string,
  userId: string,
  difficulty: number,
  history?: history[],
  question: content,
  answer?: content,
  solution?: content,
  lessonId: string,
  created: boolean
}

export type history = {confidence: number, attempts: number, correct: boolean, date: number}

const initialState: {questions: {[key: string]: question}, fetchedUnits: string[]} = {questions: {}, fetchedUnits: []}


export const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    addQuestion: (state, action: PayloadAction<{question: question, qId: string}>) => {
      console.log("adding question", action.payload)
        return produce(state, draft => {
            draft.questions[action.payload.qId] = action.payload.question
        })   
    },
    fetchUnit: (state, action: PayloadAction<string>) => {
      return produce(state, draft => {
        draft.fetchedUnits.push(action.payload)
      })
    },
    updateQuestionHistory: (state, action: PayloadAction<{history: history[], qId: string}>) => {
      return produce(state, draft => {
        if(draft.questions[action.payload.qId].history){
          draft.questions[action.payload.qId].history!.push(...action.payload.history)
        }
        else{
          draft.questions[action.payload.qId].history = action.payload.history
        }
      })
    }
  },
})

// Action creators are generated for each case reducer function
export const { addQuestion, fetchUnit, updateQuestionHistory } = questionSlice.actions

export default questionSlice.reducer