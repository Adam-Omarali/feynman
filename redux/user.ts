import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  id: string,
  name: string,
  email: string,
  photo: string
}

const initialState: UserState = {
  id: "",
  name: "",
  email: "",
  photo: ""
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
    },
    logout: (state) => {
        state = initialState
    }
  },
})

// Action creators are generated for each case reducer function
export const { login, logout } = userSlice.actions

export default userSlice.reducer