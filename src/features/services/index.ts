import type { FeeSummary } from "../../types/feeInterface";
import Client from "../../api/index"

export const feeService = async (uuid: string): Promise<FeeSummary> => {
    const response = await Client.fees.GetAll(uuid)
    console.log("get fees response :", response)
    return response
}
