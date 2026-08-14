import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Text,
  Easing,
  ViewStyle,
} from 'react-native';

interface FlightLoaderProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  style?: ViewStyle;
}

// ─── Canvas dimensions ─────────────────────────────────────────────────────────
const BASE = { W: 137, H: 29 };
const SCALE = { small: 0.46, medium: 0.72, large: 1.0 };

// ─── Cloud configuration ───────────────────────────────────────────────────────
// All start off-screen right (startXR > 1.0) → travel left → exit off-screen left
const CLOUDS = [
  { startXR: 1.05, yR: 0.14, wR: 0.32, hR: 0.11, color: '#BFDBFE', ms: 3000 },
  { startXR: 1.50, yR: 0.10, wR: 0.20, hR: 0.09, color: '#93C5FD', ms: 2400 },
  { startXR: 1.30, yR: 0.76, wR: 0.18, hR: 0.09, color: '#BFDBFE', ms: 3600 },
  { startXR: 1.75, yR: 0.20, wR: 0.14, hR: 0.07, color: '#DBEAFE', ms: 2800 },
  { startXR: 1.90, yR: 0.80, wR: 0.24, hR: 0.08, color: '#93C5FD', ms: 4000 },
  { startXR: 1.60, yR: 0.50, wR: 0.15, hR: 0.07, color: '#BFDBFE', ms: 3300 },
];

// ─── Simple vector airplane — 4 clean geometric shapes ────────────────────────
// Plane sits in a W×H canvas. All positions are proportional.
function Airplane({ W, H }: { W: number; H: number }) {
  return (
    <View style={{ width: W, height: H }}>

      {/* ── 1. Vertical tail fin ──────────────────────────────────────── */}
      <View
        style={{
          position: 'absolute',
          left: W * 0.06,
          top: 0,
          width: W * 0.11,
          height: H * 0.48,
          backgroundColor: '#1D4ED8',
          borderTopLeftRadius: W * 0.055,
          borderTopRightRadius: W * 0.025,
        }}
      />

      {/* ── 2. Horizontal stabilizer (small rear wing) ───────────────── */}
      <View
        style={{
          position: 'absolute',
          left: W * 0.03,
          top: H * 0.46,
          width: W * 0.18,
          height: H * 0.14,
          backgroundColor: '#2563EB',
          borderRadius: 3,
          transform: [{ skewX: '-10deg' }],
        }}
      />

      {/* ── 3. Main fuselage body ─────────────────────────────────────── */}
      {/*    Pointed nose on right, flat join on left where tail meets     */}
      <View
        style={{
          position: 'absolute',
          left: W * 0.10,
          top: H * 0.27,
          width: W * 0.84,
          height: H * 0.44,
          backgroundColor: '#2563EB',
          borderTopLeftRadius: H * 0.05,
          borderBottomLeftRadius: H * 0.05,
          borderTopRightRadius: H * 0.22,
          borderBottomRightRadius: H * 0.22,
        }}
      />

      {/* ── 4. Main swept wing ────────────────────────────────────────── */}
      <View
        style={{
          position: 'absolute',
          left: W * 0.34,
          top: H * 0.62,
          width: W * 0.30,
          height: H * 0.36,
          backgroundColor: '#1D4ED8',
          borderBottomLeftRadius: 3,
          borderBottomRightRadius: W * 0.03,
          transform: [{ skewX: '-22deg' }],
        }}
      />

      {/* ── Wing-tip cap (small vertical accent) ─────────────────────── */}
      <View
        style={{
          position: 'absolute',
          left: W * 0.34,
          top: H * 0.57,
          width: W * 0.035,
          height: H * 0.10,
          backgroundColor: '#1E40AF',
          borderRadius: 2,
        }}
      />
    </View>
  );
}

// ─── Main FlightLoader ─────────────────────────────────────────────────────────
export default function FlightLoader({
  size = 'medium',
  message,
  style,
}: FlightLoaderProps) {
  const sc     = SCALE[size];
  const W      = BASE.W * sc;
  const H      = BASE.H * sc;
  const PLANE_W = W * 0.74;
  const PLANE_H = H * 0.64;
  const TRAVEL  = W * 2.8; // distance each cloud travels before loop resets

  const bobAnim    = useRef(new Animated.Value(0)).current;
  const cloudAnims = useRef(CLOUDS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // ── Gentle bob + nose tilt ─────────────────────────────────────────
    Animated.loop(
      Animated.sequence([
        Animated.timing(bobAnim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bobAnim, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // ── Cloud parallax ─────────────────────────────────────────────────
    CLOUDS.forEach((cloud, i) => {
      Animated.loop(
        Animated.timing(cloudAnims[i], {
          toValue: 1,
          duration: cloud.ms,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    });

    return () => {
      bobAnim.stopAnimation();
      cloudAnims.forEach(a => a.stopAnimation());
    };
  }, []);

  const bobY = bobAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -(4 * sc)],
  });
  const bobR = bobAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-1.5deg'],
  });

  return (
    <View style={[styles.wrapper, style]}>
      {/* ── Transparent scene — clouds are clipped to this boundary ──── */}
      <View
        style={{
          width: W,
          height: H,
          overflow: 'hidden',
        }}
      >
        {/* ── Cloud shapes ─────────────────────────────────────────────── */}
        {CLOUDS.map((cloud, i) => {
          const cloudW = cloud.wR * W;
          const cloudH = cloud.hR * H;
          const startX  = cloud.startXR * W;
          const cloudY  = cloud.yR * H - cloudH / 2;

          const cloudX = cloudAnims[i].interpolate({
            inputRange: [0, 1],
            outputRange: [startX, startX - TRAVEL],
          });

          return (
            <Animated.View
              key={i}
              style={{
                position: 'absolute',
                width: cloudW,
                height: cloudH,
                borderRadius: cloudH / 2,
                backgroundColor: cloud.color,
                top: cloudY,
                opacity: 0.9,
                transform: [{ translateX: cloudX }],
              }}
            />
          );
        })}

        {/* ── Airplane ─────────────────────────────────────────────────── */}
        <Animated.View
          style={{
            position: 'absolute',
            left: (W - PLANE_W) / 2,
            top: (H - PLANE_H) / 2,
            transform: [{ translateY: bobY }, { rotate: bobR }],
          }}
        >
          <Airplane W={PLANE_W} H={PLANE_H} />
        </Animated.View>
      </View>

      {/* ── Optional message ─────────────────────────────────────────── */}
      {message ? (
        <Text
          style={[
            styles.message,
            { fontSize: size === 'small' ? 9 : size === 'medium' ? 11 : 13 },
          ]}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
}

// ─── Mini inline loader (no scene box, just plane icon bouncing) ───────────────
export function MiniLoader({ color = '#2563EB' }: { color?: string }) {
  const bobAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bobAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bobAnim, {
          toValue: 0,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
    return () => bobAnim.stopAnimation();
  }, []);

  const translateY = bobAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5],
  });

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      <Airplane W={52} H={22} />
    </Animated.View>
  );
}

// ─── Full-screen overlay loader ────────────────────────────────────────────────
export function FullScreenLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <View style={styles.fullscreen}>
      <View style={styles.loaderCard}>
        <FlightLoader size="large" message={message} />
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontWeight: '700',
    color: '#1D4ED8',
    marginTop: 12,
    letterSpacing: 0.4,
  },
  fullscreen: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 36,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 8,
  },
});
