import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import {
  getProfileThunk,
  updateProfileThunk,
} from "../feature/profile/reducer/thunk";
import { useAuth } from "../contexts/AuthUseContext";
import FlightLoader from "../components/FlightLoader";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  Camera,
  Edit2,
  Check,
  X,
  LogOut,
  BookOpen,
} from "lucide-react-native";

export default function ProfileScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { logout, studentUuid } = useAuth();

  // Selectors
  const profile = useSelector((state: RootState) => state.profile.data) as any;
  console.log("===>",profile, "profile");
  const dashboard = useSelector(
    (state: RootState) => state.dashboard.data,
  ) as any;

  // Local State
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [qualification, setQualification] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  // Sync profile data with local form state
  useEffect(() => {
    if (profile) {
      setName(profile.student_name || "");
      setPhone(profile.phone_number || "");
      setQualification(profile.qualification || "");
      setAddress(profile.currentAddress || "");
      setCity(profile.permantAddress || "");
    }
  }, [profile]);

  // Load profile if not already present
  useEffect(() => {
    if (!profile && studentUuid) {
      dispatch(getProfileThunk(studentUuid));
    }
  }, [dispatch, profile, studentUuid]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        student_name: name,
        phone_number: phone,
        qualification,
        currentAddress: address,
        permantAddress: city,
        email: profile?.email, // keep existing email
      };

      if (studentUuid) {
        await dispatch(updateProfileThunk(studentUuid, updateData));
      }
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setName(profile.student_name || "");
      setPhone(profile.phone_number || "");
      setQualification(profile.qualification || "");
      setAddress(profile.currentAddress || "");
      setCity(profile.permantAddress || "");
    }
    setIsEditing(false);
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: () => logout() },
    ]);
  };

  if (!profile) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['bottom']}>
        <FlightLoader size="large" message="Loading Profile..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, backgroundColor: "#f8fafc" }}
      >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header/Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("../assets/profile.png")}
              style={styles.avatar as any}
            />
            <TouchableOpacity style={styles.cameraBadge}>
              <Camera size={14} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.heroName}>{profile.student_name}</Text>
          <Text style={styles.heroEmail}>{profile.email}</Text>

          <View style={styles.batchTag}>
            <Text style={styles.batchTagText}>
              {dashboard?.batch?.batchName || "Batch A"} •{" "}
              {dashboard?.student_id || "Student"}
            </Text>
          </View>
        </View>

        {/* Action Button (Edit/Save) */}
        <View style={styles.actionRow}>
          {!isEditing ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Edit2 size={16} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editingButtonsRow}>
              <TouchableOpacity
                style={[styles.saveButton, loading && styles.disabledButton]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Check
                      size={16}
                      color="#ffffff"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.buttonText}>Save</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                disabled={loading}
              >
                <X size={16} color="#475569" style={{ marginRight: 6 }} />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Academic Course Card */}
        {dashboard?.course && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Academic Details</Text>
            <View style={styles.infoRow}>
              <BookOpen size={18} color="#2563eb" style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Enrolled Course</Text>
                <Text style={styles.infoValue}>
                  {dashboard.course.course_name}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Contact/Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>

          {/* Full Name Field */}
          <View style={styles.infoRow}>
            <User size={18} color="#64748b" style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter full name"
                />
              ) : (
                <Text style={styles.infoValue}>{profile.student_name}</Text>
              )}
            </View>
          </View>

          {/* Email Field (Non-editable) */}
          <View style={styles.infoRow}>
            <Mail size={18} color="#64748b" style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={[styles.infoValue, { color: "#94a3b8" }]}>
                {profile.email}
              </Text>
            </View>
          </View>

          {/* Phone Field */}
          <View style={styles.infoRow}>
            <Phone size={18} color="#64748b" style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoValue}>{profile.phone_number || "N/A"}</Text>
              )}
            </View>
          </View>

          {/* Qualification Field */}
          <View style={styles.infoRow}>
            <GraduationCap size={18} color="#64748b" style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Highest Qualification</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={qualification}
                  onChangeText={setQualification}
                  placeholder="Enter qualification (e.g. B.Tech, Graduate)"
                />
              ) : (
                <Text style={styles.infoValue}>
                  {profile.qualification || "N/A"}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Address Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Address Details</Text>

          {/* Address Line */}
          <View style={styles.infoRow}>
            <MapPin size={18} color="#64748b" style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Current Address</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter current address"
                />
              ) : (
                <Text style={styles.infoValue}>{profile.currentAddress || "N/A"}</Text>
              )}
            </View>
          </View>

          {/* City Line */}
          <View style={styles.infoRow}>
            <MapPin size={18} color="#64748b" style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Permanent Address</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                  placeholder="Enter permanent address"
                />
              ) : (
                <Text style={styles.infoValue}>{profile.permantAddress || "N/A"}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={18} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.signOutText}>Sign Out Account</Text>
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#e2e8f0",
  },
  cameraBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "#2563eb",
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
    elevation: 2,
  },
  heroName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1e293b",
    textAlign: "center",
  },
  heroEmail: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
  },
  batchTag: {
    backgroundColor: "#eff6ff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  batchTagText: {
    fontSize: 11,
    color: "#2563eb",
    fontWeight: "700",
  },
  actionRow: {
    marginBottom: 20,
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  editingButtonsRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  saveButton: {
    flex: 1.5,
    flexDirection: "row",
    backgroundColor: "#10b981",
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: "#a7f3d0",
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  cancelButtonText: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.01,
    shadowRadius: 6,
    elevation: 1,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 14,
    color: "#334155",
    backgroundColor: "#f8fafc",
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: "row",
    backgroundColor: "#ef4444",
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 8,
  },
  signOutText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
