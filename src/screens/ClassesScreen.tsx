import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { GetAllClassThunks } from '../feature/classes/redux/thunks';
import { GetLocalStorage } from '../utils/SecureStorage';
import { Calendar, Clock, MapPin, User, Video, FileText } from 'lucide-react-native';

export default function ClassesScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'Today' | 'Upcoming' | 'Completed'>('Today');
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const classes = useSelector((state: RootState) => state.classes.data) as any[];

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      await dispatch(GetAllClassThunks(activeTab));
      setLoading(false);
    };
    fetchClasses();
  }, [activeTab, dispatch]);

  const handleJoinClass = async (classId: string) => {
    const token = await GetLocalStorage('t_s_tk');
    const resolvedUrl = `http://10.0.2.2:3000/confrence?classId=${classId}&token=${token}`;
    navigation.navigate('WebView', { url: resolvedUrl, title: 'Video Conference' });
  };

  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-IN');
    } catch {
      return 'N/A';
    }
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.tabContainer}>
        {(['Today', 'Upcoming', 'Completed'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {classes && classes.length > 0 ? (
            classes.map((item) => (
              <View key={item.uuid || item.id} style={styles.classCard}>
                <View style={styles.classHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.classSubject}>{item.subject}</Text>
                    <Text style={styles.classBatch}>{item.batch_name || 'Aviation Batch'}</Text>
                  </View>
                  <View style={styles.badgeRow}>
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
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusBadgeText}>{activeTab}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.classDetails}>
                  <View style={styles.detailItem}>
                    <Calendar size={14} color="#64748b" />
                    <Text style={styles.detailText}>{formatDate(item.start_date)}</Text>
                  </View>
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

                {activeTab === 'Today' && item.class_mode === 'online' && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleJoinClass(item.uuid)}
                  >
                    <Text style={styles.actionButtonText}>Join Online Class</Text>
                  </TouchableOpacity>
                )}

                {activeTab === 'Completed' && (
                  <View style={styles.completedActions}>
                    <TouchableOpacity
                      style={[styles.completedButton, styles.completedButtonPrimary]}
                      onPress={() => Alert.alert('Materials', 'Video recording link will open shortly.')}
                    >
                      <Video size={14} color="#2563eb" style={{ marginRight: 6 }} />
                      <Text style={styles.completedTextPrimary}>Video</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.completedButton, styles.completedButtonSecondary]}
                      onPress={() => Alert.alert('Materials', 'Loading study handouts.')}
                    >
                      <FileText size={14} color="#475569" style={{ marginRight: 6 }} />
                      <Text style={styles.completedTextSecondary}>Handouts</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No classes found for this category.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 14,
    padding: 4,
    margin: 16,
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#2563eb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 32,
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
  badgeRow: {
    alignItems: 'flex-end',
    gap: 4,
  },
  modeBadge: {
    paddingVertical: 3,
    paddingHorizontal: 6,
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
    fontSize: 8,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  onlineModeText: {
    color: '#059669',
  },
  offlineModeText: {
    color: '#e11d48',
  },
  statusBadge: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 8,
    color: '#2563eb',
    fontWeight: '700',
    textTransform: 'uppercase',
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
  actionButton: {
    backgroundColor: '#2563eb',
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  completedActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  completedButton: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
  },
  completedButtonPrimary: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  completedButtonSecondary: {
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
  },
  completedTextPrimary: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '700',
  },
  completedTextSecondary: {
    color: '#475569',
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
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
});
