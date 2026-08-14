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
import { SafeAreaView } from "react-native-safe-area-context";
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
import { selectprofile } from "../feature/profile/reducer/selector";
import {
  getProfileThunk,
  updateStudentLocationThunk,
} from "../feature/profile/reducer/thunk";
import Client from "../api/index";
import { useAuth } from "../contexts/AuthUseContext";

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
  interface AirportOption {
    code: string;
    name: string;
    city: string;
    state: string;
    type: "Major" | "Minor";
  }

  const airportsData: AirportOption[] = [
    {
      code: "DEL",
      name: "Indira Gandhi International Airport",
      city: "New Delhi",
      state: "Delhi",
      type: "Major",
    },
    {
      code: "BOM",
      name: "Chhatrapati Shivaji Maharaj International Airport",
      city: "Mumbai",
      state: "Maharashtra",
      type: "Major",
    },
    {
      code: "BLR",
      name: "Kempegowda International Airport",
      city: "Bengaluru",
      state: "Karnataka",
      type: "Major",
    },
    {
      code: "MAA",
      name: "Chennai International Airport",
      city: "Chennai",
      state: "Tamil Nadu",
      type: "Major",
    },
    {
      code: "HYD",
      name: "Rajiv Gandhi International Airport",
      city: "Hyderabad",
      state: "Telangana",
      type: "Major",
    },
    {
      code: "CCU",
      name: "Netaji Subhas Chandra Bose International Airport",
      city: "Kolkata",
      state: "West Bengal",
      type: "Major",
    },
    {
      code: "AMD",
      name: "Sardar Vallabhbhai Patel International Airport",
      city: "Ahmedabad",
      state: "Gujarat",
      type: "Major",
    },
    {
      code: "PNQ",
      name: "Pune Airport",
      city: "Pune",
      state: "Maharashtra",
      type: "Major",
    },
    {
      code: "GOI",
      name: "Goa International Airport (Dabolim)",
      city: "Goa",
      state: "Goa",
      type: "Major",
    },
    {
      code: "GOX",
      name: "Manohar International Airport (Mopa)",
      city: "Goa",
      state: "Goa",
      type: "Major",
    },
    {
      code: "COK",
      name: "Cochin International Airport",
      city: "Kochi",
      state: "Kerala",
      type: "Major",
    },
    {
      code: "TRV",
      name: "Trivandrum International Airport",
      city: "Thiruvananthapuram",
      state: "Kerala",
      type: "Major",
    },
    {
      code: "CJB",
      name: "Coimbatore International Airport",
      city: "Coimbatore",
      state: "Tamil Nadu",
      type: "Minor",
    },
    {
      code: "IXM",
      name: "Madurai Airport",
      city: "Madurai",
      state: "Tamil Nadu",
      type: "Minor",
    },
    {
      code: "TRZ",
      name: "Tiruchirappalli International Airport",
      city: "Tiruchirappalli",
      state: "Tamil Nadu",
      type: "Minor",
    },
    {
      code: "TIR",
      name: "Tirupati Airport",
      city: "Tirupati",
      state: "Andhra Pradesh",
      type: "Minor",
    },
    {
      code: "SXV",
      name: "Salem Airport",
      city: "Salem",
      state: "Tamil Nadu",
      type: "Minor",
    },
    {
      code: "TCR",
      name: "Tuticorin Airport",
      city: "Tuticorin",
      state: "Tamil Nadu",
      type: "Minor",
    },
    {
      code: "NVY",
      name: "Neyveli Airport",
      city: "Neyveli",
      state: "Tamil Nadu",
      type: "Minor",
    },
    {
      code: "VGA",
      name: "Vijayawada Airport",
      city: "Vijayawada",
      state: "Andhra Pradesh",
      type: "Minor",
    },
    {
      code: "VTZ",
      name: "Visakhapatnam Airport",
      city: "Visakhapatnam",
      state: "Andhra Pradesh",
      type: "Major",
    },
    {
      code: "JAI",
      name: "Jaipur International Airport",
      city: "Jaipur",
      state: "Rajasthan",
      type: "Major",
    },
    {
      code: "JDH",
      name: "Jodhpur Airport",
      city: "Jodhpur",
      state: "Rajasthan",
      type: "Minor",
    },
    {
      code: "UDR",
      name: "Maharana Pratap Airport",
      city: "Udaipur",
      state: "Rajasthan",
      type: "Minor",
    },
    {
      code: "LKO",
      name: "Chaudhary Charan Singh International Airport",
      city: "Lucknow",
      state: "Uttar Pradesh",
      type: "Major",
    },
    {
      code: "VNS",
      name: "Lal Bahadur Shastri International Airport",
      city: "Varanasi",
      state: "Uttar Pradesh",
      type: "Major",
    },
    {
      code: "PAT",
      name: "Jay Prakash Narayan International Airport",
      city: "Patna",
      state: "Bihar",
      type: "Major",
    },
    {
      code: "BHO",
      name: "Raja Bhoj Airport",
      city: "Bhopal",
      state: "Madhya Pradesh",
      type: "Minor",
    },
    {
      code: "IDR",
      name: "Devi Ahilyabai Holkar Airport",
      city: "Indore",
      state: "Madhya Pradesh",
      type: "Minor",
    },
    {
      code: "NAG",
      name: "Dr. Babasaheb Ambedkar International Airport",
      city: "Nagpur",
      state: "Maharashtra",
      type: "Minor",
    },
    {
      code: "STV",
      name: "Surat Airport",
      city: "Surat",
      state: "Gujarat",
      type: "Minor",
    },
    {
      code: "GAU",
      name: "Lokpriya Gopinath Bordoloi International Airport",
      city: "Guwahati",
      state: "Assam",
      type: "Major",
    },
    {
      code: "BBI",
      name: "Biju Patnaik International Airport",
      city: "Bhubaneswar",
      state: "Odisha",
      type: "Major",
    },
    {
      code: "ATQ",
      name: "Sri Guru Ram Dass Jee International Airport",
      city: "Amritsar",
      state: "Punjab",
      type: "Major",
    },
    {
      code: "IXC",
      name: "Chandigarh International Airport",
      city: "Chandigarh",
      state: "Chandigarh",
      type: "Major",
    },
    {
      code: "DED",
      name: "Jolly Grant Airport",
      city: "Dehradun",
      state: "Uttarakhand",
      type: "Minor",
    },
    {
      code: "IXR",
      name: "Birsa Munda Airport",
      city: "Ranchi",
      state: "Jharkhand",
      type: "Minor",
    },
    {
      code: "RPR",
      name: "Swami Vivekananda Airport",
      city: "Raipur",
      state: "Chhattisgarh",
      type: "Minor",
    },
    {
      code: "SXR",
      name: "Sheikh ul-Alam International Airport",
      city: "Srinagar",
      state: "Jammu and Kashmir",
      type: "Major",
    },
    {
      code: "IXJ",
      name: "Jammu Airport",
      city: "Jammu",
      state: "Jammu and Kashmir",
      type: "Minor",
    },
    {
      code: "IXL",
      name: "Kushok Bakula Rimpochee Airport",
      city: "Leh",
      state: "Ladakh",
      type: "Minor",
    },
    {
      code: "IXA",
      name: "Agartala Airport",
      city: "Agartala",
      state: "Tripura",
      type: "Minor",
    },
    {
      code: "IMF",
      name: "Imphal Airport",
      city: "Imphal",
      state: "Manipur",
      type: "Minor",
    },
    {
      code: "SHL",
      name: "Shillong Airport",
      city: "Shillong",
      state: "Meghalaya",
      type: "Minor",
    },
    {
      code: "AJL",
      name: "Lengpui Airport",
      city: "Aizawl",
      state: "Mizoram",
      type: "Minor",
    },
    {
      code: "DMU",
      name: "Dimapur Airport",
      city: "Kohima",
      state: "Nagaland",
      type: "Minor",
    },
    {
      code: "IXI",
      name: "Itanagar Airport (Donyi Polo)",
      city: "Itanagar",
      state: "Arunachal Pradesh",
      type: "Minor",
    },
    {
      code: "PYG",
      name: "Pakyong Airport",
      city: "Gangtok",
      state: "Sikkim",
      type: "Minor",
    },
    {
      code: "IXZ",
      name: "Veer Savarkar International Airport",
      city: "Port Blair",
      state: "Andaman and Nicobar Islands",
      type: "Minor",
    },
    {
      code: "PNY",
      name: "Puducherry Airport",
      city: "Puducherry",
      state: "Puducherry",
      type: "Minor",
    },
    {
      code: "IXE",
      name: "Mangaluru International Airport",
      city: "Mangaluru",
      state: "Karnataka",
      type: "Minor",
    },
    {
      code: "HBX",
      name: "Hubballi Airport",
      city: "Hubballi",
      state: "Karnataka",
      type: "Minor",
    },
    {
      code: "IXG",
      name: "Belagavi Airport",
      city: "Belagavi",
      state: "Karnataka",
      type: "Minor",
    },
  ];

  const tier1Codes = ["DEL", "BOM", "BLR", "MAA", "HYD", "CCU"];

  const airportTiers = {
    tier1: airportsData.filter((a) => tier1Codes.includes(a.code)),
    tier2: airportsData.filter(
      (a) => a.type === "Major" && !tier1Codes.includes(a.code),
    ),
    tier3: airportsData.filter((a) => a.type === "Minor"),
  };

  // ── Local state ────────────────────────────────────────────────────────
  const { studentUuid } = useAuth();
  const studentProfile = useSelector(selectprofile) as any;
  console.log("student",studentProfile)

  const [tier1, setTier1] = useState<AirportOption | null>(null);
  const [tier2, setTier2] = useState<AirportOption | null>(null);
  const [tier3, setTier3] = useState<AirportOption | null>(null);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [activePicker, setActivePicker] = useState<
    "tier1" | "tier2" | "tier3" | null
  >(null);

  // Filter conditions for state exclusion
  const selectedT1 = airportsData.find((a) => a.city === tier1?.city) || null;
  const selectedT2 = airportsData.find((a) => a.city === tier2?.city) || null;
  const selectedT3 = airportsData.find((a) => a.city === tier3?.city) || null;

  const isTier1AndTier2SameState =
    selectedT1 && selectedT2 && selectedT1.state === selectedT2.state;
  const isTier1AndTier3SameState =
    selectedT1 && selectedT3 && selectedT1.state === selectedT3.state;
  const isTier2AndTier3SameState =
    selectedT2 && selectedT3 && selectedT2.state === selectedT3.state;

  const tier1Options = isTier2AndTier3SameState
    ? airportTiers.tier1.filter((a) => a.state !== selectedT2.state)
    : airportTiers.tier1;

  const tier2Options = isTier1AndTier3SameState
    ? airportTiers.tier2.filter((a) => a.state !== selectedT1.state)
    : airportTiers.tier2;

  const tier3Options = isTier1AndTier2SameState
    ? airportTiers.tier3.filter((a) => a.state !== selectedT1.state)
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
    if (studentUuid) {
      dispatch(getProfileThunk(studentUuid));
    }
  }, [dispatch, studentUuid]);

  // Load saved preferences from profile
  useEffect(() => {
    if (
      studentProfile?.preferredLocations &&
      studentProfile.preferredLocations.length > 0
    ) {
      const locs = studentProfile.preferredLocations;
      if (locs[0]) {
        const found = airportsData.find((a) => a.city === locs[0]) || null;
        setTier1(found);
      } else {
        setTier1(null);
      }
      if (locs[1]) {
        const found = airportsData.find((a) => a.city === locs[1]) || null;
        setTier2(found);
      } else {
        setTier2(null);
      }
      if (locs[2]) {
        const found = airportsData.find((a) => a.city === locs[2]) || null;
        setTier3(found);
      } else {
        setTier3(null);
      }
    }
  }, [studentProfile]);

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

  const handleSavePreferences = async () => {
    if (selectedCities.length === 0) {
      Alert.alert(
        "Validation Error",
        "Please select at least one preferred city.",
      );
      return;
    }
    setSavingPrefs(true);
    try {
      if (!studentUuid) {
        Alert.alert("Error", "User not logged in.");
        return;
      }
      const res = await dispatch(
        updateStudentLocationThunk(studentUuid, selectedCities),
      );
      if (res && res.success) {
        Alert.alert(
          "Preferences Saved",
          `Saved cities: ${selectedCities.join(", ")}`,
        );
      } else {
        Alert.alert("Error", "Failed to save preferences. Please try again.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save preferences. Please try again.");
    } finally {
      setSavingPrefs(false);
    }
  };

  const getOptionsForActivePicker = () => {
    if (activePicker === "tier1") return tier1Options;
    if (activePicker === "tier2") return tier2Options;
    if (activePicker === "tier3") return tier3Options;
    return [];
  };

  const handleSelectAirport = (airport: AirportOption) => {
    if (activePicker === "tier1") setTier1(airport);
    if (activePicker === "tier2") setTier2(airport);
    if (activePicker === "tier3") setTier3(airport);
    setActivePicker(null);
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
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
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

        {/* Tier 1 Select trigger */}
        <Text style={styles.inputLabel}>Tier 1 City</Text>
        <TouchableOpacity
          style={styles.dropdownTrigger}
          onPress={() => setActivePicker("tier1")}
        >
          <Text
            style={tier1 ? styles.dropdownValue : styles.dropdownPlaceholder}
          >
            {tier1 ? `${tier1.city} (${tier1.code})` : "Select Tier 1 Airport"}
          </Text>
          <ChevronRight size={18} color="#64748b" />
        </TouchableOpacity>

        {/* Tier 2 Select trigger */}
        <Text style={[styles.inputLabel, { marginTop: 14 }]}>Tier 2 City</Text>
        <TouchableOpacity
          style={styles.dropdownTrigger}
          onPress={() => setActivePicker("tier2")}
        >
          <Text
            style={tier2 ? styles.dropdownValue : styles.dropdownPlaceholder}
          >
            {tier2 ? `${tier2.city} (${tier2.code})` : "Select Tier 2 Airport"}
          </Text>
          <ChevronRight size={18} color="#64748b" />
        </TouchableOpacity>

        {/* Tier 3 Select trigger */}
        <Text style={[styles.inputLabel, { marginTop: 14 }]}>Tier 3 City</Text>
        <TouchableOpacity
          style={styles.dropdownTrigger}
          onPress={() => setActivePicker("tier3")}
        >
          <Text
            style={tier3 ? styles.dropdownValue : styles.dropdownPlaceholder}
          >
            {tier3 ? `${tier3.city} (${tier3.code})` : "Select Tier 3 Airport"}
          </Text>
          <ChevronRight size={18} color="#64748b" />
        </TouchableOpacity>

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

      {/* ── AIRPORT SELECT MODAL ─────────────────────────────────────── */}
      <Modal
        visible={activePicker !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setActivePicker(null)}
      >
        <View style={styles.pickerModalOverlay}>
          <View style={styles.pickerModalContent}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerModalTitle}>
                Select Preferred{" "}
                {activePicker === "tier1"
                  ? "Tier 1"
                  : activePicker === "tier2"
                    ? "Tier 2"
                    : "Tier 3"}{" "}
                Airport
              </Text>
              <TouchableOpacity onPress={() => setActivePicker(null)}>
                <XCircle size={22} color="#64748b" />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.pickerModalScroll}>
              <TouchableOpacity
                style={styles.pickerOptionItem}
                onPress={() => {
                  if (activePicker === "tier1") setTier1(null);
                  if (activePicker === "tier2") setTier2(null);
                  if (activePicker === "tier3") setTier3(null);
                  setActivePicker(null);
                }}
              >
                <Text style={[styles.pickerOptionText, { color: "#dc2626" }]}>
                  Clear Selection (None)
                </Text>
              </TouchableOpacity>
              {getOptionsForActivePicker().map((airport) => (
                <TouchableOpacity
                  key={airport.code}
                  style={styles.pickerOptionItem}
                  onPress={() => handleSelectAirport(airport)}
                >
                  <Text style={styles.pickerOptionText}>
                    {airport.city} ({airport.state}) - {airport.code}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
    </SafeAreaView>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8fafc" },
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
  dropdownPlaceholder: { fontSize: 14, color: "#94a3b8", fontWeight: "500" },
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  pickerModalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "60%",
    paddingBottom: 24,
  },
  pickerModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  pickerModalTitle: { fontSize: 16, fontWeight: "800", color: "#0f172a" },
  pickerModalScroll: { paddingVertical: 10 },
  pickerOptionItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f8fafc",
  },
  pickerOptionText: { fontSize: 14, color: "#334155", fontWeight: "600" },
});
