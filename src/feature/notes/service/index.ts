import Client from "../../../api/index"

export const fetchNote = async(id:number)=>{
    const response = await Client.notes.getById(id)
    return response
}