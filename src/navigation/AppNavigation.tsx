import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../contexts/AuthUseContext";
import { ActivityIndicator, View, TouchableOpacity } from "react-native";

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

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        tabBarActiveTintColor: "#2563eb", // primary blue
        tabBarInactiveTintColor: "#94a3b8", // slate 400
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#f1f5f9",
          backgroundColor: "#ffffff",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: "#2563eb",
          height: 90,
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitle: "",
        headerRight: () => (
          <View style={{ flexDirection: "row", alignItems: "center", marginRight: 16, gap: 16 }}>
            <TouchableOpacity
              onPress={() => (navigation as any).navigate("Notification")}
            >
              <Bell color="#ffffff" size={22} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => (navigation as any).navigate("Placement")}
            >
              <Briefcase color="#ffffff" size={22} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => (navigation as any).navigate("Profile")}
            >
              <User color="#ffffff" size={22} />
            </TouchableOpacity>
          </View>
        ),
        // headerShown: false,
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

export default function AppNavigation() {
  // const { isAuthenticated, isLoading } = useAuth();

  // if (isLoading) {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         justifyContent: "center",
  //         alignItems: "center",
  //         backgroundColor: "#f8fafc",
  //       }}
  //     >
  //       <ActivityIndicator size="large" color="#2563eb" />
  //     </View>
  //   );
  // }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen
              name="WebView"
              component={WebViewScreen}
              options={({ route }) => ({
                headerShown: true,
                title: route.params?.title || "Web View",
                headerStyle: { backgroundColor: "#2563eb" },
                headerTintColor: "#ffffff",
                headerTitleStyle: { fontWeight: "bold" },
              })}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                headerShown: true,
                title: "Student Profile",
                headerStyle: { backgroundColor: "#2563eb" },
                headerTintColor: "#ffffff",
                headerTitleStyle: { fontWeight: "bold" },
              }}
            />
            <Stack.Screen
              name="Placement"
              component={PlacementScreen}
              options={{
                headerShown: true,
                title: "Placement Hub",
                headerStyle: { backgroundColor: "#2563eb" },
                headerTintColor: "#ffffff",
                headerTitleStyle: { fontWeight: "bold" },
              }}
            />
            <Stack.Screen
              name="Notification"
              component={NotificationScreen}
              options={{
                headerShown: true,
                title: "Notifications",
                headerStyle: { backgroundColor: "#2563eb" },
                headerTintColor: "#ffffff",
                headerTitleStyle: { fontWeight: "bold" },
              }}
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )} */}

        <>
  <Stack.Screen name="Main" component={TabNavigator} />
  <Stack.Screen
    name="WebView"
    component={WebViewScreen}
    options={{
      headerShown: true,
      title: "Web View",
      headerStyle: { backgroundColor: "#2563eb" },
      headerTintColor: "#ffffff",
      headerTitleStyle: { fontWeight: "bold" },
    }}
  />
  <Stack.Screen
    name="Profile"
    component={ProfileScreen}
    options={{
      headerShown: true,
      title: "Student Profile",
      headerStyle: { backgroundColor: "#2563eb" },
      headerTintColor: "#ffffff",
      headerTitleStyle: { fontWeight: "bold" },
    }}
  />
  <Stack.Screen
    name="Placement"
    component={PlacementScreen}
    options={{
      headerShown: true,
      title: "Placement Hub",
      headerStyle: { backgroundColor: "#2563eb" },
      headerTintColor: "#ffffff",
      headerTitleStyle: { fontWeight: "bold" },
    }}
  />
  <Stack.Screen
    name="Notification"
    component={NotificationScreen}
    options={{
      headerShown: true,
      title: "Notifications",
      headerStyle: { backgroundColor: "#2563eb" },
      headerTintColor: "#ffffff",
      headerTitleStyle: { fontWeight: "bold" },
    }}
  />
</>
      </Stack.Navigator>
      <InAppNotificationListener />
    </View>
  );
}
