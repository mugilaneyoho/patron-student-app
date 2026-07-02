import type { AppDispatch } from "../../../store/store";
import { getNotificaitionService } from "../service";
import { getNotificatkion } from "./slice";

export const GetNotificationThunks =()=>async(dispatch:AppDispatch)=>{
    const res = await getNotificaitionService()
    dispatch(getNotificatkion(res))
}