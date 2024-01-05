import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user'
import courseReducer from './courses'
import lessonReducer from './lesson'
import unitReducer from './unit'
import loadingReducer from './loading'
import questionReducer from './questions'


export const store = configureStore({
  reducer: {
    user: userReducer,
    courses: courseReducer,
    lesson: lessonReducer,
    unit: unitReducer,
    loading: loadingReducer,
    questions: questionReducer
  },
})

store.subscribe(() => {
  // localStorage.setItem('courses', JSON.stringify(store.getState().courses.value))
  // localStorage.setItem('questions', JSON.stringify(store.getState().questions))
  localStorage.setItem('user', JSON.stringify(store.getState().user))
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch