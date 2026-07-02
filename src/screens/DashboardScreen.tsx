import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { DashBoardThunks } from '../feature/dashboard/redux/thunks';
import { GetAllClassThunks } from '../feature/classes/redux/thunks';
import { GetNotificationThunks } from '../feature/notification/redux/thunks';
import { getProfileThunk, updateProfileThunk } from '../feature/profile/reducer/thunk';
import { useAuth } from '../contexts/AuthUseContext';
import { GetLocalStorage } from '../utils/SecureStorage';

// Icons
import {
  Bell,
  Clock,
  MapPin,
  User,
  AlertTriangle,
  LogOut,
  User as UserIcon,
  X,
  Edit,
  Mail,
  Phone,
  GraduationCap
} from 'lucide-react-native';

const STUDENT_UUID_PROFILE = '63695211-33dd-11f1-b86c-825f1ffce71f';

export default function DashboardScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { logout } = useAuth();

  // Redux Selectors
  const dashboard = useSelector((state: RootState) => state.dashboard.data) as any;
  const classes = useSelector((state: RootState) => state.classes.data) as any[];
  const notifications = useSelector((state: RootState) => state.notification.data) as any[];
  const profile = useSelector((state: RootState) => state.profile.data) as any;

  // Local UI State
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    setIsRefreshing(true);
    await Promise.all([
      dispatch(DashBoardThunks()),
      dispatch(GetAllClassThunks('today')),
      dispatch(GetNotificationThunks()),
      dispatch(getProfileThunk(STUDENT_UUID_PROFILE))
    ]);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const handleJoinClass = async (classId: string) => {
    const token = await GetLocalStorage('t_s_tk');
    // Open the conference module via Webview
    const webviewUrl = `http://localhost:3000/confrence?classId=${classId}&token=${token}`; // will load on the device webview
    // Note: Since localhost points to device, we'll map localhost to the correct backend host IP.
    const resolvedUrl = webviewUrl.replace('http://localhost:3000', 'http://10.0.2.2:3000');
    navigation.navigate('WebView', { url: resolvedUrl, title: 'Video Conference' });
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    try {
      const timePart = timeStr.split('T')[1]?.split('.')[0];
      return timePart ? timePart.slice(0, 5) : '';
    } catch {
      return '';
    }
  };

  const progressPercentage = 65;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Greeting */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.nameText}>{profile?.name || 'Student'}</Text>
          </View>
          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Image
              source={require('../assets/navbar-image.png')}
              style={styles.avatar as any}
            />
            <View style={styles.onlineBadge} />
          </TouchableOpacity>
        </View>

        {/* Course Progress Card */}
        <View style={styles.card}>
          <View style={styles.courseHeader}>
            <View style={styles.iconContainer}>
              <Image source={require('../assets/course-image.png')} style={styles.courseIcon as any} />
            </View>
            <View style={styles.courseTitleContainer}>
              <Text style={styles.courseTitle} numberOfLines={1}>
                {dashboard?.course?.course_name || 'Aviation Operations Management'}
              </Text>
              <Text style={styles.studentId}>ID: {dashboard?.student_id || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.badgeRow}>
            <View style={styles.infoBadge}>
              <Image source={require('../assets/fswd.png')} style={styles.badgeIcon as any} />
              <Text style={styles.badgeText} numberOfLines={1}>
                {dashboard?.batch?.batchName || 'Batch A'}
              </Text>
            </View>
            <View style={styles.infoBadge}>
              <Image source={require('../assets/clock.png')} style={styles.badgeIcon as any} />
              <Text style={styles.badgeText}>
                {dashboard?.batch?.classStartTime?.split(' ')[1]?.split('.')[0]?.slice(0, 5) || '09:00'} - {dashboard?.batch?.classEndTime?.split(' ')[1]?.split('.')[0]?.slice(0, 5) || '13:00'}
              </Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabel}>Course Progress</Text>
              <Text style={styles.progressValue}>{progressPercentage}%</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
            </View>
          </View>
        </View>

        {/* Today's Classes */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Today's Classes</Text>
        </View>

        {classes && classes.length > 0 ? (
          classes.map((item) => (
            <View key={item.uuid || item.id} style={styles.classCard}>
              <View style={styles.classHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.classSubject}>{item.subject}</Text>
                  <Text style={styles.classBatch}>{item.batch_name || 'Aviation'}</Text>
                </View>
                <View
                  style={[
                    styles.modeBadge,
                    item.class_mode === 'online' ? styles.onlineMode : styles.offlineMode
                  ]}
                >
                  <Text
                    style={[
                      styles.modeBadgeText,
                      item.class_mode === 'online' ? styles.onlineModeText : styles.offlineModeText
                    ]}
                  >
                    {item.class_mode}
                  </Text>
                </View>
              </View>

              <View style={styles.classDetails}>
                <View style={styles.detailItem}>
                  <Clock size={14} color="#64748b" />
                  <Text style={styles.detailText}>
                    {formatTime(item.start_time)} - {formatTime(item.end_time)}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <User size={14} color="#64748b" />
                  <Text style={styles.detailText}>{item.staff?.staff_name || 'Trainer'}</Text>
                </View>
                <View style={styles.detailItem}>
                  <MapPin size={14} color="#3b82f6" />
                  <Text style={[styles.detailText, styles.locationText]}>
                    {item.class_mode === 'online' ? 'Virtual Session' : 'Institute Classroom'}
                  </Text>
                </View>
              </View>

              {item.class_mode === 'online' ? (
                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={() => handleJoinClass(item.uuid)}
                >
                  <Text style={styles.joinButtonText}>Join Class Now</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.offlineAlert}>
                  <Text style={styles.offlineAlertText}>Please attend at Classroom</Text>
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No classes scheduled for today.</Text>
          </View>
        )}

        {/* Fees Warning */}
        <View style={styles.alertCard}>
          <View style={styles.alertIconContainer}>
            <AlertTriangle size={20} color="#e11d48" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>Outstanding Balance Warning</Text>
            <Text style={styles.alertText}>
              You have pending fees. Please clear your dues to ensure uninterrupted access.
            </Text>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => navigation.navigate('Fees')}
            >
              <Text style={styles.alertButtonText}>Pay Fees</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        {notifications && notifications.length > 0 ? (
          notifications.slice(0, 3).map((item, index) => (
            <View key={item.uuid || index} style={styles.notifyCard}>
              <View style={styles.notifyIcon}>
                <Bell size={16} color="#4f46e5" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifyTitle}>{item.title}</Text>
                <Text style={styles.notifyDesc}>{item.message}</Text>
                <Text style={styles.notifyTime}>{formatTime(item.CreateAt) || '00:00'}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No new notifications.</Text>
          </View>
        )}
      </ScrollView>

      {/* Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={profileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Profile Details</Text>
              <TouchableOpacity
                onPress={() => setProfileModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent}>
              <View style={styles.profileMeta}>
                <Image
                  source={require('../assets/profile.png')}
                  style={styles.profileAvatar as any}
                />
                <Text style={styles.profileName}>{profile?.name || 'N/A'}</Text>
                <Text style={styles.profileEmail}>{profile?.email || 'N/A'}</Text>
              </View>

              <View style={styles.profileDetailsList}>
                <View style={styles.profileDetailRow}>
                  <Phone size={16} color="#64748b" />
                  <Text style={styles.profileDetailVal}>{profile?.phone || 'N/A'}</Text>
                </View>
                <View style={styles.profileDetailRow}>
                  <GraduationCap size={16} color="#64748b" />
                  <Text style={styles.profileDetailVal}>{profile?.qualification || 'N/A'}</Text>
                </View>
                <View style={styles.profileDetailRow}>
                  <MapPin size={16} color="#64748b" />
                  <Text style={styles.profileDetailVal}>
                    {profile?.address ? `${profile.address}, ${profile.city || ''}` : 'N/A'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={async () => {
                  setProfileModalVisible(false);
                  await logout();
                }}
              >
                <LogOut size={16} color="#ffffff" style={{ marginRight: 8 }} />
                <Text style={styles.logoutText}>Sign Out</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  nameText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    marginTop: 2,
  },
  avatarButton: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 24,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  courseIcon: {
    width: 24,
    height: 24,
  },
  courseTitleContainer: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  studentId: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    maxWidth: '50%',
  },
  badgeIcon: {
    width: 14,
    height: 14,
    marginRight: 6,
    opacity: 0.8,
  },
  badgeText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '700',
  },
  progressContainer: {
    marginTop: 4,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  progressValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2563eb',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 12,
  },
  classCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 14,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  classSubject: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  classBatch: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 2,
  },
  modeBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  onlineMode: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  offlineMode: {
    backgroundColor: '#fff1f2',
    borderColor: '#fecdd3',
  },
  modeBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  onlineModeText: {
    color: '#059669',
  },
  offlineModeText: {
    color: '#e11d48',
  },
  classDetails: {
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
    paddingTop: 12,
    marginBottom: 14,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  locationText: {
    color: '#2563eb',
  },
  joinButton: {
    backgroundColor: '#2563eb',
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  offlineAlert: {
    backgroundColor: '#f8fafc',
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  offlineAlertText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 20,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#fff5f5',
    borderColor: '#fee2e2',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  alertIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#991b1b',
    marginBottom: 2,
  },
  alertText: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '500',
    lineHeight: 16,
  },
  alertButton: {
    backgroundColor: '#e11d48',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  alertButtonText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  notifyCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 10,
    gap: 12,
  },
  notifyIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  notifyDesc: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
    lineHeight: 15,
  },
  notifyTime: {
    fontSize: 9,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
    alignItems: 'center',
  },
  profileMeta: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#f1f5f9',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  profileEmail: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
  },
  profileDetailsList: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 24,
  },
  profileDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileDetailVal: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#ef4444',
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 16,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
