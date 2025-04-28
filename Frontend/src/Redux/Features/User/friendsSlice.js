import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: [],
}

export const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
   setFriends:(state,action)=>{
    state.value=[...state.value,action.payload]
   }
  },
})

// Action creators are generated for each case reducer function
export const { setFriends } = friendsSlice.actions

export default friendsSlice.reducer