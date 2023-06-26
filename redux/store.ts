import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user'
import courseReducer from './courses'
import loadingReducer from './loading'


export const store = configureStore({
  reducer: {
    user: userReducer,
    courses: courseReducer,
    loading: loadingReducer
  },
})

store.subscribe(() => {
  localStorage.setItem('courses', JSON.stringify(store.getState().courses.value))
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch