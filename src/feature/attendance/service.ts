import client from "../../api/index"

export const GetAttendanceService =async(date:string)=>{
    const res = await client.attendance.get({date})
    return res
}   