import { fetchProfile, updateProfileservice } from "../service";
import { getProfileById, updateProfile } from "./profileSlice";

export const getProfileThunk = (uuid: string) => async (dispatch: any) => {
    try {
        const res = await fetchProfile(uuid)
        console.log("api data in thunk: ", res)
        dispatch(getProfileById(res?.data))
        return res
    } catch (error) {
        console.log("get error in thunk: ", error)
    }
}

export const updateProfileThunk = (uuid: string, data: any) => async (dispatch: any) => {
    try {
        const res = await updateProfileservice(uuid, data)
        console.log("updated data:", res)
        dispatch(updateProfile(res))
    } catch (error) {
        console.log("get error in update error:", error)
    }
}
