import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: [],
}

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
   setMessages:(state,action)=>{
    state.value=action.payload
   },
   addMessage:(state,action)=>{
    state.value.push(action.payload)
   }
  },
})

export const { setMessages, addMessage } = messagesSlice.actions

export default messagesSlice.reducer