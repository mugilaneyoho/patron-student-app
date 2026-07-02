import type { AppDispatch } from "../../../store/store"
import { GetClassesService } from "../service"
import { getAllClasses } from "./slice"

export const GetAllClassThunks = (classtype: string) => async (dispatch: AppDispatch) => {
    const res = await GetClassesService(classtype)
    dispatch(getAllClasses(res?.data))
}