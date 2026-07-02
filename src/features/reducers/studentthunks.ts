import { feeService } from "../services/index"
import { getAllstudent } from "../reducers/studentslice"

export const getUserThunk = (uuid: string ) => async (dispatch: any) => {
    try {
        const data = await feeService(uuid)
        console.log("api data: ", data)
        dispatch(getAllstudent(data as any))
        return data
    } catch (error) {
        console.log("get error in thunks :", error)
    }
}
