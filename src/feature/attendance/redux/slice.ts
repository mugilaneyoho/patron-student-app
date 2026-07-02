import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    data:{},
}

const attendanceSlice = createSlice({
    name:"attendance",
    initialState,
    reducers:{
        getAttendance:(state,action)=>{
            state.data = action.payload
        }
    }
})

export const {
    getAttendance
} = attendanceSlice.actions

export default attendanceSlice.reducer;