import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { GetNotificationThunks } from '../feature/notification/redux/thunks';
import { useAuth } from '../contexts/AuthUseContext';
import { Bell, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function InAppNotificationListener() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  
  const notifications = useSelector((state: RootState) => state.notification.data) as any[];
  const [currentNotification, setCurrentNotification] = useState<any>(null);
  
  const knownIdsRef = useRef<Set<string>>(new Set());
  const isFirstLoadRef = useRef(true);
  const slideAnim = useRef(new Animated.Value(-150)).current;
  const timeoutRef = useRef<any>(null);

  // Poll notifications when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      knownIdsRef.current.clear();
      isFirstLoadRef.current = true;
      setCurrentNotification(null);
      return;
    }

    // Initial fetch
    dispatch(GetNotificationThunks());

    const interval = setInterval(() => {
      dispatch(GetNotificationThunks());
    }, 10000); // check for new notifications every 10 seconds

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAuthenticated, dispatch]);

  // Handle detection of new notifications
  useEffect(() => {
    if (!isAuthenticated || !notifications || notifications.length === 0) {
      return;
    }

    const newNotifications: any[] = [];
    
    notifications.forEach((item) => {
      const id = item.uuid || item.id;
      if (id && !knownIdsRef.current.has(id)) {
        if (!isFirstLoadRef.current) {
          newNotifications.push(item);
        }
        knownIdsRef.current.add(id);
      }
    });

    isFirstLoadRef.current = false;

    // If new notifications arrived, show the latest one
    if (newNotifications.length > 0) {
      const latest = newNotifications[newNotifications.length - 1];
      showBanner(latest);
    }
  }, [notifications, isAuthenticated]);

  const showBanner = (notification: any) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setCurrentNotification(notification);

    const targetTop = insets.top > 0 ? insets.top + 10 : (Platform.OS === 'ios' ? 50 : 20);

    // Slide down spring animation
    Animated.spring(slideAnim, {
      toValue: targetTop,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();

    // Automatically dismiss banner after 4.5 seconds
    timeoutRef.current = setTimeout(() => {
      dismissBanner();
    }, 4500);
  };

  const dismissBanner = () => {
    Animated.timing(slideAnim, {
      toValue: -150,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setCurrentNotification(null);
    });
  };

  const handleBannerPress = () => {
    dismissBanner();
    navigation.navigate('Notification');
  };

  if (!currentNotification) return null;

  return (
    <Animated.View
      style={[
        styles.bannerContainer,
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      <TouchableOpacity
        style={styles.bannerTouch}
        onPress={handleBannerPress}
        activeOpacity={0.9}
      >
        <View style={styles.bellIconContainer}>
          <Bell size={20} color="#2563eb" />
          <View style={styles.unreadDot} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.titleText} numberOfLines={1}>
            {currentNotification.title || 'New Notification'}
          </Text>
          <Text style={styles.messageText} numberOfLines={2}>
            {currentNotification.message || ''}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={(e) => {
            e.stopPropagation();
            dismissBanner();
          }}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <X size={16} color="#94a3b8" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    zIndex: 9999,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    // Premium drop shadow
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  bannerTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    width: '100%',
  },
  bellIconContainer: {
    position: 'relative',
    backgroundColor: '#eff6ff',
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 14,
    fontWeight: '500',
  },
  closeButton: {
    padding: 4,
  },
});
