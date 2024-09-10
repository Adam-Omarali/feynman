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

export type history = {qId: string, confidence: number, attempts: number, correct: boolean, date: number}

const initialState: {questions: {[key: string]: question}, fetchedUnits: string[], fetchedContent: string[]} = {questions: {}, fetchedUnits: [], fetchedContent: []}

export const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    addQuestion: (state, action: PayloadAction<question>) => {
      console.log("adding question", action.payload)
        return produce(state, draft => {
            draft.questions[action.payload.id] = action.payload
        })   
    },
    updateQuestionHistory: (state, action: PayloadAction<history>) => {
      return produce(state, draft => {
        if(draft.questions[action.payload.qId].history){
          draft.questions[action.payload.qId].history!.push(action.payload)
        }
        else{
          draft.questions[action.payload.qId].history = [action.payload]
        }
      })
    },
    fetchUnit: (state, action: PayloadAction<string>) => {
      return produce(state, draft => {
        draft.fetchedUnits.push(action.payload)
      })
    },
    fetchQuestionContent: (state, action: PayloadAction<string>) => {
      return produce(state, draft => {
        draft.fetchedContent.push(action.payload)
      })
    }
  },
})

// Action creators are generated for each case reducer function
export const { addQuestion, updateQuestionHistory, fetchUnit, fetchQuestionContent } = questionSlice.actions

export default questionSlice.reducer