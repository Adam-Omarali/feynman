import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface unit {
    name: string,
    emoji: string,
    id: string
    userId: string,
    courseId: string,
    description: string,
    lessonOrder: string[]
}

export interface UnitState {
    value: {[key: string]: unit}
  }

const initialState: UnitState = {
    value: {}
  }
  
  export const unitSlice = createSlice({
    name: 'units',
    initialState,
    reducers: {
      setUnit: (state, action: PayloadAction<{[key: string]: unit}>) => {
        state.value = action.payload
      },
      addUnitStore: (state, action: PayloadAction<unit>) => {
        state.value[action.payload.id] = action.payload
      },
      deleteUnitStore: (state, action: PayloadAction<string>) => {
        if (Object.keys(state.value).includes(action.payload)){
            delete state.value[action.payload]
        }
      },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { setUnit, addUnitStore, deleteUnitStore } = unitSlice.actions
  
  export default unitSlice.reducer