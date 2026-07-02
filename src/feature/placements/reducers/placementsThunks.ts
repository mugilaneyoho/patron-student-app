import type { AppDispatch } from "../../../store/store";
import {
    fetchAllInvites,
    fetchInviteById,
    updateInvite,
} from "../services";
import {
    setInvitesLoading,
    setInvites,
    setInvitesError,
    setSelectedLoading,
    setSelectedInvite,
    setSelectedError,
    setUpdateLoading,
    updateInviteStatus,
    setUpdateError,
} from "./placementSlice";
import type { UpdateInvitePayload } from "./types";

export const getAllInvitesThunk = () => async (dispatch: AppDispatch) => {
    dispatch(setInvitesLoading());
    try {
        const response = await fetchAllInvites();
        // Backend: { success: true, data: PlacementInvite[], pagination: {...} }
        // console.log("Thunk get all", response.data)
        dispatch(setInvites(response.data));
    } catch (error: any) {
        dispatch(setInvitesError(error?.message ?? "Failed to fetch invites"));
    }
};

export const getInviteByIdThunk = (id: string) => async (dispatch: AppDispatch) => {
    dispatch(setSelectedLoading());
    try {
        const response = await fetchInviteById(id);
        // Backend: { success: true, data: PlacementInvite }
        // console.log("Thunk getbyId", response.data)
        dispatch(setSelectedInvite(response.data));
    } catch (error: any) {
        dispatch(setSelectedError(error?.message ?? "Failed to fetch invite"));
    }
};

export const respondToInviteThunk =
    (id: string, payload: UpdateInvitePayload) =>
        async (dispatch: AppDispatch) => {
            dispatch(setUpdateLoading());
            try {
                const response = await updateInvite(id, payload);
                // response.data = { success: true, message: '...' }
                // Optimistically update local state
                // console.log("Thunk respond", response)
                dispatch(
                    updateInviteStatus({
                        id,
                        responseStatus: payload.responseStatus,
                        reason: payload.reason,
                    })
                );
                // Return the whole response so caller can get the message
                return response;
            } catch (error: any) {
                dispatch(setUpdateError(error?.message ?? "Failed to update invite"));
                throw error; // re-throw to let the component catch
            }
        };