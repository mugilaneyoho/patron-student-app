import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    data:[],
}

const DashBoardSlice = createSlice({
    name:"dashboard",
    initialState,
    reducers:{
        getDashBoard:(state,action)=>{
            state.data = action.payload
        }
    }
})

export const {
    getDashBoard
} = DashBoardSlice.actions

export default DashBoardSlice.reducer;