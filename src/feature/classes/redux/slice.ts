import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
}

const ClassSlice = createSlice({
    name:"classes",
    initialState,
    reducers:{
        getAllClasses:(state,action)=>{
            state.data = action.payload
        },
    }
})

export const {
    getAllClasses,
} = ClassSlice.actions;

export default ClassSlice.reducer;