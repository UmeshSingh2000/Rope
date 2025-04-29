import { configureStore } from '@reduxjs/toolkit'
import friendsReducer from './Features/User/friendsSlice'
import messagesReducer from './Features/Messages/messagesSlice'

export const store = configureStore({
  reducer: {
    friends:friendsReducer,
    messages:messagesReducer,
  },
})