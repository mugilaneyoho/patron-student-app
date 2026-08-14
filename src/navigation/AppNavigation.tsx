import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../contexts/AuthUseContext";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Import Screens
import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import ClassesScreen from "../screens/ClassesScreen";
import SyllabusScreen from "../screens/SyllabusScreen";
import AttendanceScreen from "../screens/AttendanceScreen";
import FeesScreen from "../screens/FeesScreen";
import WebViewScreen from "../screens/WebViewScreen";
import PlacementScreen from "../screens/PlacementScreen";
import ProfileScreen from "../screens/ProfileScreen";
import NotificationScreen from "../screens/NotificationScreen";
import InAppNotificationListener from "../components/InAppNotificationListener";
import { FullScreenLoader } from "../components/FlightLoader";

// Icons
import {
  LayoutDashboard,
  BookOpen,
  Book,
  Calendar,
  CreditCard,
  Briefcase,
  User,
  Bell,
  ArrowLeft,
} from "lucide-react-native";

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  WebView: { url: string; title: string };
  Profile: undefined;
  Placement: undefined;
  Notification: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  Classes: undefined;
  Syllabus: undefined;
  Attendance: undefined;
  Fees: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// ─── Custom Top Header ─────────────────────────────────────────────────────────
function AppHeader({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.headerOuter,
        { paddingTop: insets.top + 8, paddingBottom: 12 },
      ]}
    >
      {/* Left — Logo + Brand name */}
      <View style={styles.headerLeft}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>✈</Text>
        </View>
        <View>
          <Text style={styles.brandName}>Patron</Text>
          <Text style={styles.brandTagline}>Student Portal</Text>
        </View>
      </View>

      {/* Right — Action Icons */}
      <View style={styles.headerRight}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => navigation.navigate("Notification")}
          activeOpacity={0.75}
        >
          <Bell color="#ffffff" size={20} strokeWidth={2.2} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => navigation.navigate("Placement")}
          activeOpacity={0.75}
        >
          <Briefcase color="#ffffff" size={20} strokeWidth={2.2} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.headerIconBtn, styles.headerIconBtnLast]}
          onPress={() => navigation.navigate("Profile")}
          activeOpacity={0.75}
        >
          <User color="#ffffff" size={20} strokeWidth={2.2} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Custom Stack Header (with Back Button & Safe Area Top Space) ────────────
function CustomStackHeader({
  title,
  navigation,
}: {
  title: string;
  navigation: any;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.stackHeaderOuter,
        { paddingTop: insets.top + 8, paddingBottom: 12 },
      ]}
    >
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
        activeOpacity={0.75}
      >
        <ArrowLeft color="#ffffff" size={20} strokeWidth={2.2} />
      </TouchableOpacity>
      <Text style={styles.stackHeaderTitle}>{title}</Text>
    </View>
  );
}

// ─── Tab Navigator ─────────────────────────────────────────────────────────────
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#f1f5f9",
          backgroundColor: "#ffffff",
          height: Platform.OS === "ios" ? 80 : 62,
          paddingBottom: Platform.OS === "ios" ? 20 : 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: "#0f172a",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.04,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 0.2,
        },
        // Fully custom header rendered as a View (not native header)
        header: () => <AppHeader navigation={navigation} />,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Classes"
        component={ClassesScreen}
        options={{
          tabBarLabel: "Classes",
          tabBarIcon: ({ color, size }) => (
            <BookOpen color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Syllabus"
        component={SyllabusScreen}
        options={{
          tabBarLabel: "Syllabus",
          tabBarIcon: ({ color, size }) => <Book color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{
          tabBarLabel: "Attendance",
          tabBarIcon: ({ color, size }) => (
            <Calendar color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Fees"
        component={FeesScreen}
        options={{
          tabBarLabel: "Fees",
          tabBarIcon: ({ color, size }) => (
            <CreditCard color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ─── Root Navigator ────────────────────────────────────────────────────────────
export default function AppNavigation() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <FullScreenLoader message="Preparing your portal..." />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen
              name="WebView"
              component={WebViewScreen}
              options={({ route, navigation }) => ({
                headerShown: true,
                header: () => (
                  <CustomStackHeader
                    title={route.params?.title || "Web View"}
                    navigation={navigation}
                  />
                ),
              })}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={({ navigation }) => ({
                headerShown: true,
                header: () => (
                  <CustomStackHeader
                    title="Student Profile"
                    navigation={navigation}
                  />
                ),
              })}
            />
            <Stack.Screen
              name="Placement"
              component={PlacementScreen}
              options={({ navigation }) => ({
                headerShown: true,
                header: () => (
                  <CustomStackHeader
                    title="Placement Hub"
                    navigation={navigation}
                  />
                ),
              })}
            />
            <Stack.Screen
              name="Notification"
              component={NotificationScreen}
              options={({ navigation }) => ({
                headerShown: true,
                header: () => (
                  <CustomStackHeader
                    title="Notifications"
                    navigation={navigation}
                  />
                ),
              })}
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
      <InAppNotificationListener />
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  headerOuter: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  logoEmoji: {
    fontSize: 18,
    color: "#ffffff",
  },
  brandName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.3,
  },
  brandTagline: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 0.5,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  headerIconBtnLast: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderColor: "rgba(255,255,255,0.35)",
  },
  stackHeaderOuter: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    marginRight: 12,
  },
  stackHeaderTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.3,
  },
});
