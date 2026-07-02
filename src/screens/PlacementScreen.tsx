import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import {
  Briefcase,
  Clock,
  XCircle,
  ChevronRight,
  Info,
} from "lucide-react-native";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../store/store";
import {
  getAllInvitesThunk,
  getInviteByIdThunk,
  respondToInviteThunk,
} from "../feature/placements/reducers/placementsThunks";
import {
  selectPendingInvites,
  selectHistoryInvites,
  selectSelectedInvite,
  selectInvitesLoading,
  selectSelectedLoading,
  selectUpdateLoading,
} from "../feature/placements/reducers/placementsSelectors";
import { clearSelectedInvite } from "../feature/placements/reducers/placementSlice";
import type { PlacementInvite } from "../feature/placements/reducers/types";

// ─────────────────────────────────────────────────────────────────────────────

export default function PlacementScreen() {
  const dispatch = useDispatch<AppDispatch>();

  // ── Redux selectors ────────────────────────────────────────────────────
  const pendingInvites = useSelector(selectPendingInvites);
  const historyInvites = useSelector(selectHistoryInvites);
  const selectedInvite = useSelector(selectSelectedInvite);
  const invitesLoading = useSelector(selectInvitesLoading);
  const detailLoading = useSelector(selectSelectedLoading);
  const updateLoading = useSelector(selectUpdateLoading);

  // ── Airport tier data ──────────────────────────────────────────────────
  const airportTiers = {
    tier1: [
      { city: "Chennai", state: "Tamil Nadu" },
      { city: "Bengaluru", state: "Karnataka" },
      { city: "Hyderabad", state: "Telangana" },
      { city: "Mumbai", state: "Maharashtra" },
    ],
    tier2: [
      { city: "Coimbatore", state: "Tamil Nadu" },
      { city: "Mysuru", state: "Karnataka" },
      { city: "Warangal", state: "Telangana" },
      { city: "Pune", state: "Maharashtra" },
    ],
    tier3: [
      { city: "Madurai", state: "Tamil Nadu" },
      { city: "Hubballi", state: "Karnataka" },
      { city: "Nizamabad", state: "Telangana" },
      { city: "Nagpur", state: "Maharashtra" },
    ],
  };

  // ── Local state ────────────────────────────────────────────────────────
  const [tier1, setTier1] = useState<{ city: string; state: string } | null>(
    null,
  );
  const [tier2, setTier2] = useState<{ city: string; state: string } | null>(
    null,
  );
  const [tier3, setTier3] = useState<{ city: string; state: string } | null>(
    null,
  );
  const [savingPrefs, setSavingPrefs] = useState(false);

  // Filter tier3: if tier1 and tier2 are from same state, exclude that state from tier3
  const tier3Options =
    tier1 && tier2 && tier1.state === tier2.state
      ? airportTiers.tier3.filter((a) => a.state !== tier1.state)
      : airportTiers.tier3;

  const selectedCities = [tier1?.city, tier2?.city, tier3?.city].filter(
    Boolean,
  ) as string[];

  const [declineReason, setDeclineReason] = useState("");
  const [declineTarget, setDeclineTarget] = useState<{ id: string } | null>(
    null,
  );

  const [showAllHistory, setShowAllHistory] = useState(false);

  const displayedHistory = showAllHistory
    ? historyInvites
    : historyInvites.slice(0, 3);

  // ── Fetch on mount ─────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(getAllInvitesThunk());
  }, [dispatch]);

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleAccept = (invite: PlacementInvite) => {
    Alert.alert("Accept Invitation", `Accept this placement invitation?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Accept",
        onPress: () => {
          dispatch(
            respondToInviteThunk(invite.id, { responseStatus: "ACCEPTED" }),
          );
        },
      },
    ]);
  };

  const handleDeclinePress = (invite: PlacementInvite) => {
    setDeclineReason("");
    setDeclineTarget({ id: invite.id });
  };

  const confirmDecline = () => {
    if (!declineTarget) return;
    if (!declineReason.trim()) {
      Alert.alert("Reason required", "Please enter a reason for declining.");
      return;
    }
    dispatch(
      respondToInviteThunk(declineTarget.id, {
        responseStatus: "REJECTED",
        reason: declineReason.trim(),
      }),
    );
    setDeclineTarget(null);
    setDeclineReason("");
  };

  const handleViewDetail = (id: string) => {
    dispatch(getInviteByIdThunk(id));
  };

  const handleSavePreferences = () => {
    if (selectedCities.length === 0) {
      Alert.alert(
        "Validation Error",
        "Please select at least one preferred city.",
      );
      return;
    }
    setSavingPrefs(true);
    setTimeout(() => {
      setSavingPrefs(false);
      Alert.alert(
        "Preferences Saved",
        `Saved cities: ${selectedCities.join(", ")}`,
      );
    }, 1200);
  };

  // ── Helpers ────────────────────────────────────────────────────────────
  const renderInviteStatusBadge = (
    status: PlacementInvite["response_status"],
  ) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <View style={[styles.statusBadge, styles.statusSelected]}>
            <Text style={[styles.statusBadgeText, styles.statusSelectedText]}>
              ACCEPTED
            </Text>
          </View>
        );
      case "REJECTED":
        return (
          <View style={[styles.statusBadge, styles.statusRejected]}>
            <Text style={[styles.statusBadgeText, styles.statusRejectedText]}>
              REJECTED
            </Text>
          </View>
        );
      case "EXPIRED":
        return (
          <View style={[styles.statusBadge, styles.statusExpired]}>
            <Text style={[styles.statusBadgeText, styles.statusExpiredText]}>
              EXPIRED
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.headerBanner}>
        <View style={styles.headerTitleRow}>
          <Briefcase size={22} color="#ffffff" style={{ marginRight: 10 }} />
          <Text style={styles.headerTitle}>Student Placement Hub</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Manage your career trajectory, track applications, and respond to
          company invitations.
        </Text>
      </View>

      {/* Placement Preferences */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Placement Preferences</Text>
        </View>
        <Text style={styles.cardDescription}>
          Select your preferred airport cities by tier.
        </Text>

        {/* Tier 1 */}
        <Text style={styles.inputLabel}>Tier 1 City</Text>
        <View style={styles.tierRow}>
          {airportTiers.tier1.map((airport) => (
            <TouchableOpacity
              key={airport.city}
              style={[
                styles.tierBtn,
                tier1?.city === airport.city && styles.tierBtnActive,
              ]}
              onPress={() =>
                setTier1(tier1?.city === airport.city ? null : airport)
              }
            >
              <Text
                style={[
                  styles.tierBtnText,
                  tier1?.city === airport.city && styles.tierBtnTextActive,
                ]}
              >
                {airport.city}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tier 2 */}
        <Text style={[styles.inputLabel, { marginTop: 14 }]}>Tier 2 City</Text>
        <View style={styles.tierRow}>
          {airportTiers.tier2.map((airport) => (
            <TouchableOpacity
              key={airport.city}
              style={[
                styles.tierBtn,
                tier2?.city === airport.city && styles.tierBtnActive,
              ]}
              onPress={() =>
                setTier2(tier2?.city === airport.city ? null : airport)
              }
            >
              <Text
                style={[
                  styles.tierBtnText,
                  tier2?.city === airport.city && styles.tierBtnTextActive,
                ]}
              >
                {airport.city}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tier 3 */}
        <Text style={[styles.inputLabel, { marginTop: 14 }]}>Tier 3 City</Text>
        <View style={styles.tierRow}>
          {tier3Options.map((airport) => (
            <TouchableOpacity
              key={airport.city}
              style={[
                styles.tierBtn,
                tier3?.city === airport.city && styles.tierBtnActive,
              ]}
              onPress={() =>
                setTier3(tier3?.city === airport.city ? null : airport)
              }
            >
              <Text
                style={[
                  styles.tierBtnText,
                  tier3?.city === airport.city && styles.tierBtnTextActive,
                ]}
              >
                {airport.city}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected cities */}
        {selectedCities.length > 0 && (
          <>
            <Text style={[styles.inputLabel, { marginTop: 14 }]}>
              Selected Cities
            </Text>
            <View style={styles.tierRow}>
              {selectedCities.map((city) => (
                <View key={city} style={styles.selectedChip}>
                  <Text style={styles.selectedChipText}>{city}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <TouchableOpacity
          style={[
            styles.saveButton,
            { marginTop: 20 },
            savingPrefs && styles.saveButtonDisabled,
          ]}
          onPress={handleSavePreferences}
          disabled={savingPrefs}
        >
          {savingPrefs ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Preferences</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* ── ACTIVE INVITATIONS (PENDING only) ─────────────────────────── */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeading}>Active Invitations</Text>
        {pendingInvites.length > 0 && (
          <View style={styles.badgeNew}>
            <Text style={styles.badgeNewText}>{pendingInvites.length} NEW</Text>
          </View>
        )}
      </View>

      {invitesLoading ? (
        <ActivityIndicator
          size="small"
          color="#0f172a"
          style={{ marginBottom: 20 }}
        />
      ) : pendingInvites.length > 0 ? (
        pendingInvites.map((inv) => (
          <View key={inv.id} style={styles.invitationCard}>
            <View style={styles.invCardTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.invCompany}>
                  {inv.placement?.job_title || "Placement"}
                </Text>
                <Text style={styles.invRole} numberOfLines={1}>
                  {inv.placement?.placement_code || inv.placement_id}
                </Text>
                <Text style={styles.invMetaText}>
                  {inv.placement?.company_id || "N/A"} •{" "}
                  {inv.placement?.salary_package || "N/A"}
                </Text>
                <Text style={styles.invMetaText}>
                  {inv.placement?.location?.length
                    ? inv.placement.location[0]
                    : ""}{" "}
                  • Invited: {new Date(inv.invited_at).toDateString()}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleViewDetail(inv.id)}
                style={styles.detailChevron}
              >
                <ChevronRight size={18} color="#2563eb" />
              </TouchableOpacity>
            </View>
            <View style={styles.invActionRow}>
              <TouchableOpacity
                style={[styles.btnAccept, updateLoading && { opacity: 0.6 }]}
                onPress={() => handleAccept(inv)}
                disabled={updateLoading}
              >
                <Text style={styles.btnAcceptText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnDecline, updateLoading && { opacity: 0.6 }]}
                onPress={() => handleDeclinePress(inv)}
                disabled={updateLoading}
              >
                <Text style={styles.btnDeclineText}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            No active invitations at the moment.
          </Text>
        </View>
      )}

      {/* ── APPLICATION HISTORY (invite history: ACCEPTED / REJECTED / EXPIRED) ── */}
      <View style={[styles.sectionHeaderRow, { marginTop: 8 }]}>
        <Text style={styles.sectionHeading}>Application History</Text>
      </View>

      {invitesLoading ? (
        <ActivityIndicator
          size="small"
          color="#0f172a"
          style={{ marginBottom: 20 }}
        />
      ) : historyInvites.length > 0 ? (
        <View style={styles.historyCard}>
          {displayedHistory.map((inv, index) => (
            <View
              key={inv.id}
              style={[
                styles.historyRow,
                index === displayedHistory.length - 1 && {
                  borderBottomWidth: 0,
                },
              ]}
            >
              <View style={styles.historyInfo}>
                <Text style={styles.historyCompany} numberOfLines={1}>
                  {inv.placement?.placement_code || inv.placement_id}
                </Text>
                <Text style={styles.historyRole} numberOfLines={1}>
                  {inv.placement?.job_title || "Position"}
                </Text>
                <Text style={styles.historyDate}>
                  {inv.placement?.company_id || "N/A"} •{" "}
                  {inv.placement?.salary_package || "N/A"}
                </Text>
                <Text style={styles.historyDate}>
                  {inv.response_date
                    ? `Responded: ${new Date(inv.response_date).toDateString()}`
                    : `Invited: ${new Date(inv.invited_at).toDateString()}`}
                </Text>
                {inv.reason && inv.response_status !== "ACCEPTED" ? (
                  <Text style={styles.historyReason} numberOfLines={1}>
                    Reason: {inv.reason}
                  </Text>
                ) : null}
              </View>

              <View style={styles.historyStatusCol}>
                {renderInviteStatusBadge(inv.response_status)}
                <TouchableOpacity
                  style={styles.btnAction}
                  onPress={() => handleViewDetail(inv.id)}
                >
                  <Text style={styles.btnActionText}>Details</Text>
                  <ChevronRight
                    size={12}
                    color="#2563eb"
                    style={{ marginLeft: 2 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {historyInvites.length > 3 && (
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => setShowAllHistory(!showAllHistory)}
            >
              <Text style={styles.viewAllButtonText}>
                {showAllHistory
                  ? "Show Less"
                  : `View All ${historyInvites.length} History`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No invitation history yet.</Text>
        </View>
      )}

      {/* ── DECLINE REASON MODAL ──────────────────────────────────────── */}
      <Modal
        visible={declineTarget !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setDeclineTarget(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDeclineTarget(null)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reason for Declining</Text>
            </View>
            <TextInput
              style={[styles.textInput, { margin: 16, marginBottom: 8 }]}
              value={declineReason}
              onChangeText={setDeclineReason}
              placeholder="e.g. Location doesn't work for me"
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity
              style={[styles.saveButton, { margin: 16, marginTop: 8 }]}
              onPress={confirmDecline}
              disabled={updateLoading}
            >
              {updateLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Confirm Decline</Text>
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── INVITE DETAIL MODAL (getById) ─────────────────────────────── */}
      <Modal
        visible={selectedInvite !== null}
        transparent
        animationType="slide"
        onRequestClose={() => dispatch(clearSelectedInvite())}
      >
        <View style={styles.detailOverlay}>
          <View style={styles.detailContainer}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailCompany}>Invitation Details</Text>
              <TouchableOpacity onPress={() => dispatch(clearSelectedInvite())}>
                <XCircle size={22} color="#64748b" />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.detailScrollContent}>
              {detailLoading ? (
                <ActivityIndicator
                  size="large"
                  color="#0f172a"
                  style={{ marginTop: 24 }}
                />
              ) : selectedInvite ? (
                <>
                  <View style={styles.detailStatusRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    {renderInviteStatusBadge(selectedInvite.response_status)}
                    {selectedInvite.response_status === "PENDING" && (
                      <View style={[styles.statusBadge, styles.statusProgress]}>
                        <Text
                          style={[
                            styles.statusBadgeText,
                            styles.statusProgressText,
                          ]}
                        >
                          PENDING
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.detailDateRow}>
                    <Clock
                      size={14}
                      color="#64748b"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.detailDateVal}>
                      Invited:{" "}
                      {new Date(selectedInvite.invited_at).toLocaleString()}
                    </Text>
                  </View>

                  {selectedInvite.response_date && (
                    <View style={[styles.detailDateRow, { marginTop: 8 }]}>
                      <Clock
                        size={14}
                        color="#64748b"
                        style={{ marginRight: 6 }}
                      />
                      <Text style={styles.detailDateVal}>
                        Responded:{" "}
                        {new Date(
                          selectedInvite.response_date,
                        ).toLocaleString()}
                      </Text>
                    </View>
                  )}

                  <View style={styles.detailSection}>
                    <View style={styles.detailSectionHeader}>
                      <Info
                        size={14}
                        color="#2563eb"
                        style={{ marginRight: 6 }}
                      />
                      <Text style={styles.detailSectionTitle}>
                        Placement Information
                      </Text>
                    </View>

                    <Text style={styles.detailBodyText}>
                      Code:{" "}
                      {selectedInvite.placement?.placement_code ||
                        selectedInvite.placement_id}
                    </Text>
                    <Text style={[styles.detailBodyText, { marginTop: 8 }]}>
                      Title: {selectedInvite.placement?.job_title || "N/A"}
                    </Text>
                    <Text style={[styles.detailBodyText, { marginTop: 8 }]}>
                      Company: {selectedInvite.placement?.company_id || "N/A"}
                    </Text>
                    <Text style={[styles.detailBodyText, { marginTop: 8 }]}>
                      Salary:{" "}
                      {selectedInvite.placement?.salary_package || "N/A"}
                    </Text>
                    <Text style={[styles.detailBodyText, { marginTop: 8 }]}>
                      Job Type: {selectedInvite.placement?.job_type || "N/A"}
                    </Text>
                    <Text style={[styles.detailBodyText, { marginTop: 8 }]}>
                      Status:{" "}
                      {selectedInvite.placement?.placement_status || "N/A"}
                    </Text>
                    <Text style={[styles.detailBodyText, { marginTop: 8 }]}>
                      Openings: {selectedInvite.placement?.openings ?? "N/A"}
                    </Text>
                    <Text style={[styles.detailBodyText, { marginTop: 8 }]}>
                      Eligibility:{" "}
                      {selectedInvite.placement?.eligibility_criteria || "N/A"}
                    </Text>

                    {selectedInvite.placement?.location?.length ? (
                      <Text style={[styles.detailBodyText, { marginTop: 8 }]}>
                        Locations:{" "}
                        {selectedInvite.placement.location.join(", ")}
                      </Text>
                    ) : null}

                    {selectedInvite.placement?.job_description ? (
                      <Text
                        style={[
                          styles.detailBodyText,
                          { marginTop: 8, fontStyle: "italic" },
                        ]}
                      >
                        Description: {selectedInvite.placement.job_description}
                      </Text>
                    ) : null}

                    {selectedInvite.reason ? (
                      <Text
                        style={[
                          styles.detailBodyText,
                          { marginTop: 12, color: "#dc2626" },
                        ]}
                      >
                        Decline Reason: {selectedInvite.reason}
                      </Text>
                    ) : null}
                  </View>
                </>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  contentContainer: { padding: 16, paddingBottom: 40 },
  headerBanner: {
    backgroundColor: "#0f172a",
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#ffffff" },
  headerSubtitle: {
    fontSize: 12,
    color: "#94a3b8",
    lineHeight: 16,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 10,
    marginBottom: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "#0f172a" },
  cardDescription: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 16,
    fontWeight: "500",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#0f172a",
    backgroundColor: "#f8fafc",
    marginBottom: 4,
  },
  inputHelp: {
    fontSize: 10,
    fontStyle: "italic",
    color: "#64748b",
    marginBottom: 16,
  },
  checkboxRow: { flexDirection: "row", gap: 24, marginBottom: 18 },
  checkboxItem: { flexDirection: "row", alignItems: "center" },
  checkboxText: { fontSize: 13, fontWeight: "600", color: "#334155" },
  dropdownTrigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#f8fafc",
    marginBottom: 20,
  },
  dropdownValue: { fontSize: 14, color: "#0f172a", fontWeight: "600" },
  tierRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 4 },
  tierBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
  },
  tierBtnActive: { backgroundColor: "#0f172a" },
  tierBtnText: { fontSize: 13, fontWeight: "600", color: "#475569" },
  tierBtnTextActive: { color: "#ffffff" },
  selectedChip: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#e0e7ff",
  },
  selectedChipText: { fontSize: 12, fontWeight: "600", color: "#4338ca" },
  saveButton: {
    backgroundColor: "#0f172a",
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  saveButtonDisabled: { opacity: 0.7 },
  saveButtonText: { color: "#ffffff", fontSize: 13, fontWeight: "700" },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 12,
  },
  badgeNew: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fca5a5",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: "center",
    marginBottom: 10,
  },
  badgeNewText: { fontSize: 9, fontWeight: "800", color: "#ef4444" },
  invitationCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.01,
    shadowRadius: 6,
    elevation: 1,
    marginBottom: 14,
  },
  invCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  invCompany: { fontSize: 13, color: "#64748b", fontWeight: "700" },
  invRole: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    marginTop: 2,
    marginBottom: 4,
  },
  invMetaText: { fontSize: 12, color: "#475569", fontWeight: "500" },
  detailChevron: { padding: 4 },
  invActionRow: {
    flexDirection: "row",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#f8fafc",
    paddingTop: 14,
  },
  btnAccept: {
    flex: 1,
    backgroundColor: "#0f172a",
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnAcceptText: { color: "#ffffff", fontSize: 12, fontWeight: "700" },
  btnDecline: {
    flex: 1,
    backgroundColor: "#ffffff",
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
  },
  btnDeclineText: { color: "#475569", fontSize: 12, fontWeight: "700" },
  emptyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    marginBottom: 20,
  },
  emptyText: { color: "#94a3b8", fontSize: 12, fontWeight: "600" },
  historyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    padding: 16,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  historyInfo: { flex: 1, marginRight: 12 },
  historyCompany: { fontSize: 14, fontWeight: "800", color: "#0f172a" },
  historyRole: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
    marginTop: 2,
  },
  historyDate: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: "500",
    marginTop: 4,
  },
  historyReason: {
    fontSize: 10,
    color: "#64748b",
    fontStyle: "italic",
    marginTop: 2,
  },
  historyStatusCol: { alignItems: "flex-end", gap: 8 },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  statusBadgeText: { fontSize: 8, fontWeight: "800" },
  statusSelected: { backgroundColor: "#ecfdf5" },
  statusSelectedText: { color: "#059669" },
  statusProgress: { backgroundColor: "#fffbeb" },
  statusProgressText: { color: "#d97706" },
  statusRejected: { backgroundColor: "#fef2f2" },
  statusRejectedText: { color: "#dc2626" },
  statusExpired: { backgroundColor: "#f1f5f9" },
  statusExpiredText: { color: "#64748b" },
  btnAction: { flexDirection: "row", alignItems: "center", paddingVertical: 2 },
  btnActionText: { fontSize: 11, color: "#2563eb", fontWeight: "700" },
  viewAllButton: {
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 14,
    marginTop: 8,
  },
  viewAllButtonText: { color: "#2563eb", fontSize: 12, fontWeight: "700" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    width: "100%",
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  modalTitle: { fontSize: 14, fontWeight: "800", color: "#0f172a" },
  optionItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  optionText: { fontSize: 14, color: "#475569", fontWeight: "600" },
  detailOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  detailContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    paddingBottom: 24,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  detailCompany: { fontSize: 16, fontWeight: "800", color: "#0f172a" },
  detailRole: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
    marginTop: 2,
  },
  detailScrollContent: { padding: 20 },
  detailStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
    marginRight: 8,
  },
  detailDateRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  detailDateVal: { fontSize: 11, color: "#475569", fontWeight: "600" },
  detailSection: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 24,
    marginTop: 16,
  },
  detailSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailSectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0f172a",
    textTransform: "uppercase",
  },
  detailBodyText: {
    fontSize: 13,
    color: "#334155",
    lineHeight: 18,
    fontWeight: "500",
  },
  primaryActionButton: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryActionText: { color: "#ffffff", fontSize: 13, fontWeight: "700" },
});
