// import api from "./api";
// import type { Payment } from "../types/feeInterface";

// export interface FeeSummary {

//     paymentHistory: Payment[];
//     totalFees: number;
//     paidAmount: number;
//     pendingAmount: number;
//     admissionFees: number;
// }

// export const feeService = {
//     getAllFees: async (): Promise<FeeSummary> => {
//         const { data } = await api.get<FeeSummary>(`/api/fees`);
//         return data;
//     }
// };