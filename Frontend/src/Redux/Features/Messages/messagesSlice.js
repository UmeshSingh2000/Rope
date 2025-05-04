import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: {},
}

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      const { id, message } = action.payload
      if(state.value[id]){
        // state.value[id].push(message)
        state.value[id].push(message)
      }
      else{
        state.value[id] = [...message]
      }
      return state
    },
    addMessage: (state, action) => {
      state.value.push(action.payload)
    },
    
  },
})

export const { setMessages, addMessage } = messagesSlice.actions
export default messagesSlice.reducer