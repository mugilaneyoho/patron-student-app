import { createSlice } from "@reduxjs/toolkit";
import { GetZoomMeetingThunk } from "./thunks";

const initialState = {
    data: [],
    zoomMeeting: {
        loadingClassId: null as string | null,
        error: null as string | null,
    }
}

const ClassSlice = createSlice({
    name:"classes",
    initialState,
    reducers:{
        getAllClasses:(state,action)=>{
            state.data = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(GetZoomMeetingThunk.pending, (state, action) => {
            state.zoomMeeting.loadingClassId = action.meta.arg;
            state.zoomMeeting.error = null;
        });
        builder.addCase(GetZoomMeetingThunk.fulfilled, (state) => {
            state.zoomMeeting.loadingClassId = null;
            state.zoomMeeting.error = null;
        });
        builder.addCase(GetZoomMeetingThunk.rejected, (state, action) => {
            state.zoomMeeting.loadingClassId = null;
            state.zoomMeeting.error = action.payload as string || "Failed";
        });
    }
})

export const {
    getAllClasses,
} = ClassSlice.actions;

export default ClassSlice.reducer;