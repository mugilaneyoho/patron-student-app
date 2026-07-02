import { createSlice } from "@reduxjs/toolkit";
import type { PlacementState, PlacementInvite, PlacementInviteDetail } from "./types";

const initialState: PlacementState = {
  invites: [],
  selectedInvite: null,
  loading: false,
  selectedLoading: false,
  updateLoading: false,
  error: null,
};

const placementSlice = createSlice({
  name: "placement",
  initialState,
  reducers: {
    // getAllInvites
    setInvitesLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setInvites: (state, action: { payload: PlacementInvite[] }) => {
      state.invites = action.payload;
      state.loading = false;
    },
    setInvitesError: (state, action: { payload: string }) => {
      state.loading = false;
      state.error = action.payload;
    },

    // getInviteById
    setSelectedLoading: (state) => {
      state.selectedLoading = true;
      state.error = null;
    },
    setSelectedInvite: (state, action: { payload: PlacementInviteDetail }) => {
      state.selectedInvite = action.payload;
      state.selectedLoading = false;
    },
    setSelectedError: (state, action: { payload: string }) => {
      state.selectedLoading = false;
      state.error = action.payload;
    },
    clearSelectedInvite: (state) => {
      state.selectedInvite = null;
    },

    // accept / reject
    setUpdateLoading: (state) => {
      state.updateLoading = true;
      state.error = null;
    },
    updateInviteStatus: (
      state,
      action: { payload: { id: string; responseStatus: 'ACCEPTED' | 'REJECTED'; reason?: string } }
    ) => {
      state.updateLoading = false;
      const invite = state.invites.find((inv) => inv.id === action.payload.id);
      if (invite) {
        invite.response_status = action.payload.responseStatus;
        invite.reason = action.payload.reason;
      }
      if (state.selectedInvite?.id === action.payload.id) {
        state.selectedInvite.response_status = action.payload.responseStatus;
        state.selectedInvite.reason = action.payload.reason;
      }
    },
    setUpdateError: (state, action: { payload: string }) => {
      state.updateLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setInvitesLoading,
  setInvites,
  setInvitesError,
  setSelectedLoading,
  setSelectedInvite,
  setSelectedError,
  clearSelectedInvite,
  setUpdateLoading,
  updateInviteStatus,
  setUpdateError,
} = placementSlice.actions;

export default placementSlice.reducer;