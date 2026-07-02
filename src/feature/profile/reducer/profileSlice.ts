import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    data: null,
}

const profileslice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        getProfileById: (state, action) => {
            state.data = action.payload
        },
        updateProfile: (state, action) => {
            state.data = action.payload
        }
    }
})

export const {getProfileById,updateProfile} = profileslice.actions

export default profileslice.reducer