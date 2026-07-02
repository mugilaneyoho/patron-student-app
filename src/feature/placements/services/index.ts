import Client from "../../../api/index";
import { UpdateInvitePayload } from "../reducers/types";

export const fetchAllInvites = async () => {
    const response = await Client.placement.getAllInvite();
    return response;
};

export const fetchInviteById = async (id: string) => {
    const response = await Client.placement.getInviteById(id);
    return response;
};

export const updateInvite = async (id: string, data: UpdateInvitePayload) => {
    const response = await Client.placement.update(id, data);
    return response;
};