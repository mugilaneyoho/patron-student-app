import { Alert } from "react-native";
import type { AppDispatch } from "../../../store/store";
import { GetAttendanceService } from "../service";
import { getAttendance } from "./slice";

export const GetAttendaceThunks = (date: string) => async (dispatch: AppDispatch) => {
    try {
        const res = await GetAttendanceService(date);

        if (!res?.data) {
            Alert.alert("Notice", "Failed to retrieve attendance logs. Please try again.");
        }

        dispatch(getAttendance(res?.data))
    } catch (error) {
        console.log(error)
    }
}