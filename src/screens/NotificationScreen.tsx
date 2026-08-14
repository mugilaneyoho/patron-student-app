import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { GetNotificationThunks } from '../feature/notification/redux/thunks';
import { Bell, Calendar, Trash2, CheckCheck, Inbox } from 'lucide-react-native';

export default function NotificationScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector((state: RootState) => state.notification.data) as any[];

  const [refreshing, setRefreshing] = useState(false);
  const [localNotifications, setLocalNotifications] = useState<any[]>([]);

  const loadNotifications = async () => {
    setRefreshing(true);
    try {
      await dispatch(GetNotificationThunks());
    } catch (err) {
      console.log('Error fetching notifications:', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [dispatch]);

  // Sync Redux notifications with local state to allow clearing/marking as read interactively
  useEffect(() => {
    if (notifications) {
      setLocalNotifications(
        notifications.map((n, index) => ({
          ...n,
          id: n.uuid || n.id || String(index),
          isRead: false
        }))
      );
    }
  }, [notifications]);

  const handleMarkAllRead = () => {
    setLocalNotifications((prev) =>
      prev.map((item) => ({ ...item, isRead: true }))
    );
  };

  const handleClearAll = () => {
    setLocalNotifications([]);
  };

  const handleToggleRead = (id: string) => {
    setLocalNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: !item.isRead } : item))
    );
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        // Fallback for simple time string split
        const parts = dateStr.split('T');
        if (parts.length > 1) {
          return `${parts[0]} ${parts[1].slice(0, 5)}`;
        }
        return dateStr;
      }
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={[styles.notificationCard, item.isRead ? styles.readCard : styles.unreadCard]}
        onPress={() => handleToggleRead(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={styles.bellIconContainer}>
            <Bell size={18} color={item.isRead ? '#94a3b8' : '#2563eb'} />
            {!item.isRead && <View style={styles.unreadDot} />}
          </View>

          <View style={{ flex: 1 }}>
            <View style={styles.titleRow}>
              <Text style={[styles.titleText, item.isRead ? styles.readText : styles.unreadText]}>
                {item.title}
              </Text>
            </View>
            <Text style={styles.messageText}>{item.message}</Text>
            <View style={styles.timeRow}>
              <Calendar size={12} color="#94a3b8" style={{ marginRight: 4 }} />
              <Text style={styles.timeText}>{formatDateTime(item.CreateAt || item.createdAt)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.headerBar}>
        <Text style={styles.headerSubtitle}>
          Stay updated with your training, classes, and placements
        </Text>
      </View>

      {localNotifications.length > 0 && (
        <View style={styles.actionsBar}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleMarkAllRead}>
            <CheckCheck size={14} color="#2563eb" style={{ marginRight: 6 }} />
            <Text style={styles.actionBtnTextBlue}>Mark all read</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleClearAll}>
            <Trash2 size={14} color="#ef4444" style={{ marginRight: 6 }} />
            <Text style={styles.actionBtnTextRed}>Clear all</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={localNotifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadNotifications}
            colors={['#2563eb']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
              <Inbox size={40} color="#94a3b8" />
            </View>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySubtitle}>
              You have no notifications. Pull down to refresh.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  headerBar: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a'
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '500'
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4
  },
  actionBtnTextBlue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb'
  },
  actionBtnTextRed: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ef4444'
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32
  },
  notificationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.01,
    shadowRadius: 4,
    elevation: 1
  },
  unreadCard: {
    borderColor: '#dbeafe',
    backgroundColor: '#ffffff'
  },
  readCard: {
    borderColor: '#f1f5f9',
    backgroundColor: '#f8fafc',
    opacity: 0.8
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12
  },
  bellIconContainer: {
    position: 'relative',
    backgroundColor: '#eff6ff',
    padding: 8,
    borderRadius: 10
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 1,
    borderColor: '#ffffff'
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700'
  },
  unreadText: {
    color: '#0f172a'
  },
  readText: {
    color: '#64748b'
  },
  messageText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
    fontWeight: '500'
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  timeText: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600'
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80
  },
  emptyIconBg: {
    backgroundColor: '#f1f5f9',
    padding: 20,
    borderRadius: 24,
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a'
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 30,
    fontWeight: '500',
    lineHeight: 16
  }
});
