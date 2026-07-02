import Client from '../../../api/index'

export const fetchProfile = async(uuid:string)=>{
    const response = await Client.profile.getById(uuid)
    return response
}

export const updateProfileservice = async(uuid:string, data: any)=>{
    const response = await Client.profile.update(uuid, data)
    return response
}
