import client from "../../api/index"
import { GetLocalStorage } from "../../utils/SecureStorage"

export const LoginService = async (data: { email: string, password: string }) => {
    const res = await client.student.login(data)
    console.log("login response:", res)
    return res
}

export const ResetPassword = async (data: { password: string }) => {
    const token = await GetLocalStorage('temp-tkn') as string;
    const res = await client.student.restpass({ ...data, token })
    return res
}