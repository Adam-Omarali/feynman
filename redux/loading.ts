import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: true
}

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    fetched: (state) => {
        state.value = false
    }
  },
})

// Action creators are generated for each case reducer function
export const { fetched } = loadingSlice.actions

export default loadingSlice.reducer