export interface PlacementInvite {
    id: string;
    placement_id: string;
    student_id: string;
    invited_by?: string;
    invited_at: string;
    response_status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
    response_date?: string;
    reason?: string;
    is_active: boolean;
    is_deleted: boolean;
    placement?: {
        id: string;
        placement_code: string;
        job_title: string;
        company_id: string;
        location: string[];
        salary_package: string;
        job_description: string;
        job_type: string;
        eligibility_criteria: string;
        placement_status: string;
        openings: number;
    };

}

export interface PlacementInviteDetail extends PlacementInvite {
    // getInviteById returns same shape — extend here if backend joins placement data later
}

export interface UpdateInvitePayload {
    responseStatus: 'ACCEPTED' | 'REJECTED';
    reason?: string;
}

export interface PlacementState {
    invites: PlacementInvite[];
    selectedInvite: PlacementInviteDetail | null;
    loading: boolean;
    selectedLoading: boolean;
    updateLoading: boolean;
    error: string | null;
}