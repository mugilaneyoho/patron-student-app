import client from "../../api/index"

export const GetClassesService = async (classtype: string) => {
    const res = await client.classes.get(classtype)
    return res
}