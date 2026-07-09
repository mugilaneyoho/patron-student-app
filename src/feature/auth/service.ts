import client from "../../api/index"
import { PassEncrypted } from "../../utils/jwt"
import { GetLocalStorage } from "../../utils/SecureStorage"

export const LoginService = async (data: { email: string, password: string }) => {
    const payload = PassEncrypted(data)
    const res = await client.student.login({payload})
    
    console.log("login response:", res)
    return res
}

export const ResetPassword = async (data: { password: string }) => {
    const token = await GetLocalStorage('temp-tkn') as string;
    const res = await client.student.restpass({ ...data, token })
    return res
}