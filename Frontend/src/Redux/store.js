import { configureStore } from '@reduxjs/toolkit'
import friendsReducer from './Features/User/friendsSlice'

export const store = configureStore({
  reducer: {
    friends:friendsReducer
  },
})