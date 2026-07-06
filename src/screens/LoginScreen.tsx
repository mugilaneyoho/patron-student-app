import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useAuth } from "../contexts/AuthUseContext";
import { LoginService, ResetPassword } from "../feature/auth/service";
import { SetLocalStorage } from "../utils/SecureStorage";
import { Eye, EyeOff } from "lucide-react-native";

export default function LoginScreen() {
  const { login } = useAuth();

  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset Password State
  const [changePass, setChangePass] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [matchError, setMatchError] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        "Validation Error",
        "Please enter email/roll number and password.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await LoginService({ email, password });
      console.log("change pass ", res);
      if (res?.changepass) {
        await SetLocalStorage("temp-tkn", res.token);
        setChangePass(true);
      } else if (res?.success) {
        await login(res.data);
      } else {
        Alert.alert("Login Failed", "Incorrect email or password.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "An error occurred during login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Validation Error", "Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMatchError(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await ResetPassword({ password: newPassword });
      if (res.success) {
        await login(res.data);
      } else {
        Alert.alert("Error", "Failed to reset password. Please try again.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Ambient Background glows */}
          <View style={[styles.glow, styles.glowTop]} />
          <View style={[styles.glow, styles.glowBottom]} />

          <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.welcomeText}>
                Welcome to <Text style={styles.brandText}>AeroFlow</Text>
              </Text>

              <View style={styles.logoContainer}>
                <Image
                  source={require("../assets/login-image-2.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.portalText}>Student Portal</Text>
            </View>

            {!changePass ? (
              /* Login Form */
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>User Name / Roll No</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="student@example.com"
                    placeholderTextColor="#94a3b8"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="••••••••"
                      placeholderTextColor="#94a3b8"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      {showPassword ? (
                        <Eye size={20} color="#94a3b8" />
                      ) : (
                        <EyeOff size={20} color="#94a3b8" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.button, isSubmitting && styles.buttonDisabled]}
                  onPress={handleLogin}
                  disabled={isSubmitting}
                >
                  <Text style={styles.buttonText}>
                    {isSubmitting ? "Logging in..." : "Login"}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Change Password Form */
              <View style={styles.form}>
                <Text style={styles.resetTitle}>Reset Required</Text>
                <Text style={styles.resetSubtitle}>
                  Please set a new password to secure your account.
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>New Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter at least 6 characters"
                    placeholderTextColor="#94a3b8"
                    value={newPassword}
                    onChangeText={(val) => {
                      setNewPassword(val);
                      setMatchError(false);
                    }}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your new password"
                    placeholderTextColor="#94a3b8"
                    value={confirmPassword}
                    onChangeText={(val) => {
                      setConfirmPassword(val);
                      if (newPassword && !newPassword.startsWith(val)) {
                        setMatchError(true);
                      } else {
                        setMatchError(false);
                      }
                    }}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                  {matchError && (
                    <Text style={styles.errorText}>Passwords do not match</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.button, isSubmitting && styles.buttonDisabled]}
                  onPress={handleResetPassword}
                  disabled={isSubmitting}
                >
                  <Text style={styles.buttonText}>
                    {isSubmitting ? "Resetting..." : "Reset & Login"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  glow: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.15,
  },
  glowTop: {
    top: -50,
    left: -50,
    backgroundColor: "#3b82f6",
  },
  glowBottom: {
    bottom: -50,
    right: -50,
    backgroundColor: "#6366f1",
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1e293b",
    textAlign: "center",
  },
  brandText: {
    color: "#2563eb",
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  logo: {
    width: 40,
    height: 40,
  },
  portalText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563eb",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    height: 46,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    backgroundColor: "#ffffff",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },
  passwordInput: {
    flex: 1,
    height: 46,
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    width: "100%",
    height: 48,
    backgroundColor: "#2563eb",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#94a3b8",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
  resetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 4,
  },
  resetSubtitle: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 16,
  },
  errorText: {
    fontSize: 10,
    color: "#ef4444",
    fontWeight: "600",
    marginTop: 4,
  },
});
