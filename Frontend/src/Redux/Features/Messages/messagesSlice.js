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
    deleteMessages : (state,action)=>{
      const { id,selectedChat } = action.payload
      if(state.value[selectedChat]){
        state.value[selectedChat] = state.value[selectedChat].filter((message)=>
          message._id!==id
        )
      }
      return state
    }
    
  },
})

export const { setMessages,deleteMessages } = messagesSlice.actions
export default messagesSlice.reducer