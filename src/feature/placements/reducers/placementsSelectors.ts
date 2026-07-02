import type { RootState } from "../../../store/store";

export const selectInvites = (state: RootState) => state.placement?.invites ?? [];
export const selectPendingInvites = (state: RootState) => state.placement?.invites?.filter((inv) => inv.response_status === 'PENDING') ?? [];
export const selectHistoryInvites = (state: RootState) => state.placement?.invites?.filter((inv) => inv.response_status !== 'PENDING') ?? [];

export const selectSelectedInvite = (state: RootState) => state.placement?.selectedInvite ?? null;

export const selectInvitesLoading = (state: RootState) => state.placement?.loading ?? false;
export const selectSelectedLoading = (state: RootState) => state.placement?.selectedLoading ?? false;
export const selectUpdateLoading = (state: RootState) => state.placement?.updateLoading ?? false;

export const selectPlacementError = (state: RootState) => state.placement?.error ?? null;