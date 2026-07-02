import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    data:[],
}

const NotificationSlice = createSlice({
    name:"notification",
    initialState,
    reducers:{
        getNotificatkion:(state,action)=>{
            state.data = action.payload
        }
    }
})

export const {
    getNotificatkion
} = NotificationSlice.actions

export default NotificationSlice.reducer;