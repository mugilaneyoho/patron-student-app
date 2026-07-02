import { createSlice } from "@reduxjs/toolkit"

const studentSlice = createSlice({
    name: "student",
    initialState: {
        data: []
    },
    reducers: {
        getAllstudent: (state: any, action: any) => {
            state.data = action.payload
        },

    },
})

export const { getAllstudent } = studentSlice.actions
export default studentSlice.reducer