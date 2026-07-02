import type { AppDispatch } from "../../../store/store";
import { DashBoardService } from "../service";
import { getDashBoard } from "./slice";

export const DashBoardThunks = ()=>async(dispatch:AppDispatch)=>{
    const res = await DashBoardService()
    dispatch(getDashBoard(res?.data))
}