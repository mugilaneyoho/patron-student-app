import Client from '../../../api/index'

export const fetchProfile = async(uuid:string)=>{
    const response = await Client.profile.getById(uuid)
    console.log("Profile",response)
    return response
}

export const updateProfileservice = async(uuid:string, data: any)=>{
    const response = await Client.profile.update(uuid, data)
    return response
}

export const updateStudentLocationService = async(uuid: string, locations: string[])=>{
    const response = await Client.student.updateLocation(uuid, locations)
    return response
}
