import client from '../../api/index'

export const DashBoardService=async()=>{
    const res = await client.dashboard.get()
    return res
}