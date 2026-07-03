import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch } from "../../../store/store"
import { GetClassesService, GetZoomMeetingService } from "../service"
import { getAllClasses } from "./slice"

export const GetAllClassThunks = (classtype: string) => async (dispatch: AppDispatch) => {
    const res = await GetClassesService(classtype)
    dispatch(getAllClasses(res?.data))
}

export const GetZoomMeetingThunk = createAsyncThunk(
    'classes/getZoomMeeting',
    async (classId: string, thunkAPI) => {
        console.log("GetZoomMeetingThunk called with classId:", classId);
        const res = await GetZoomMeetingService(classId);
        console.log("GetZoomMeetingService response:", JSON.stringify(res));
        if (!res) {
            return thunkAPI.rejectWithValue("Unable to fetch meeting link, please try again");
        }
        return res;
    }
);