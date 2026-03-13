import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

const FLOATING_PHILOSOPHERS = [
  { emoji: '⚡', color: '#C0392B', angle: 0 },
  { emoji: '⚖️', color: '#1A5276', angle: 60 },
  { emoji: '🌾', color: '#1E8449', angle: 120 },
  { emoji: '🏛️', color: '#7D6608', angle: 180 },
  { emoji: '🦉', color: '#6C3483', angle: 240 },
  { emoji: '🔭', color: '#2E86C1', angle: 300 },
];

const ORBIT_RADIUS = 130;

interface Props {
  onDone: () => void;
}

export default function OnboardingScreen({ onDone }: Props) {
  const { t } = useLanguage();
  const { theme } = useTheme();

  // Animation values
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(20)).current;
  const descOpacity = useRef(new Animated.Value(0)).current;
  const descY = useRef(new Animated.Value(20)).current;
  const featuresOpacity = useRef(new Animated.Value(0)).current;
  const featuresY = useRef(new Animated.Value(30)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonY = useRef(new Animated.Value(40)).current;
  const orbitRotation = useRef(new Animated.Value(0)).current;

  // Per-philosopher float animations
  const floatAnims = useRef(
    FLOATING_PHILOSOPHERS.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Orbit rotation
    Animated.loop(
      Animated.timing(orbitRotation, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();

    // Float animations for each philosopher
    floatAnims.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 300),
          Animated.timing(anim, { toValue: 1, duration: 1800, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 1800, useNativeDriver: true }),
        ])
      ).start();
    });

    // Entrance sequence
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(titleY, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(descOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(descY, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(featuresOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(featuresY, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(buttonOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(buttonY, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const spin = orbitRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.isDark ? '#080810' : '#1A0A2E' }]}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe}>

        {/* Orbit ring */}
        <View style={styles.orbitArea}>
          <Animated.View style={[styles.orbitRing, { transform: [{ rotate: spin }] }]}>
            {FLOATING_PHILOSOPHERS.map((p, i) => {
              const rad = (p.angle * Math.PI) / 180;
              const x = ORBIT_RADIUS * Math.cos(rad);
              const y = ORBIT_RADIUS * Math.sin(rad);
              const floatY = floatAnims[i].interpolate({
                inputRange: [0, 1],
                outputRange: [0, -8],
              });
              // Counter-rotate so emojis stay upright
              const counterSpin = orbitRotation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '-360deg'],
              });
              return (
                <Animated.View
                  key={p.emoji}
                  style={[
                    styles.orbitItem,
                    {
                      transform: [
                        { translateX: x },
                        { translateY: y },
                        { rotate: counterSpin },
                        { translateY: floatY },
                      ],
                      backgroundColor: p.color + '30',
                      borderColor: p.color + '60',
                    },
                  ]}
                >
                  <Text style={styles.orbitEmoji}>{p.emoji}</Text>
                </Animated.View>
              );
            })}
          </Animated.View>

          {/* Center logo */}
          <Animated.View
            style={[
              styles.logoContainer,
              { transform: [{ scale: logoScale }], opacity: logoOpacity },
            ]}
          >
            <LinearGradient
              colors={['#4A3080', '#2E1B6B', '#1A0A2E']}
              style={styles.logoBg}
            >
              <Text style={styles.logoEmoji}>🏛️</Text>
            </LinearGradient>
            {/* Glow ring */}
            <View style={styles.glowRing} />
          </Animated.View>
        </View>

        {/* Title */}
        <Animated.View style={[styles.titleArea, { opacity: titleOpacity, transform: [{ translateY: titleY }] }]}>
          <Text style={styles.appName}>PhilosopherChat</Text>
          <Text style={styles.tagline}>{t.onboardingTagline}</Text>
        </Animated.View>

        {/* Description */}
        <Animated.View style={[styles.descArea, { opacity: descOpacity, transform: [{ translateY: descY }] }]}>
          <Text style={styles.desc}>{t.onboardingDesc}</Text>
        </Animated.View>

        {/* Feature pills */}
        <Animated.View style={[styles.features, { opacity: featuresOpacity, transform: [{ translateY: featuresY }] }]}>
          {[
            { icon: '🧠', label: t.onboardingFeature1 },
            { icon: '🌐', label: t.onboardingFeature2 },
            { icon: '💬', label: t.onboardingFeature3 },
          ].map((f) => (
            <View key={f.label} style={styles.featurePill}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Begin button */}
        <Animated.View style={[styles.buttonWrapper, { opacity: buttonOpacity, transform: [{ translateY: buttonY }] }]}>
          <TouchableOpacity onPress={onDone} activeOpacity={0.85}>
            <LinearGradient
              colors={['#7B52AB', '#4A3080', '#2E1B6B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.beginButton}
            >
              <Text style={styles.beginText}>{t.onboardingBegin}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Credit */}
        <Animated.View style={{ opacity: buttonOpacity }}>
          <Text style={styles.credit}>{t.createdBy}</Text>
        </Animated.View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },

  orbitArea: {
    width: ORBIT_RADIUS * 2 + 80,
    height: ORBIT_RADIUS * 2 + 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  orbitRing: {
    position: 'absolute',
    width: ORBIT_RADIUS * 2,
    height: ORBIT_RADIUS * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitItem: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitEmoji: { fontSize: 22 },

  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7B52AB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  logoEmoji: { fontSize: 46 },
  glowRing: {
    position: 'absolute',
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 1.5,
    borderColor: 'rgba(123,82,171,0.4)',
  },

  titleArea: { alignItems: 'center', marginBottom: 10 },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 26,
  },

  descArea: { marginBottom: 24 },
  desc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    lineHeight: 22,
  },

  features: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 36,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  featureIcon: { fontSize: 15 },
  featureLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },

  buttonWrapper: { width: '100%', marginBottom: 20 },
  beginButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#7B52AB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  beginText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', letterSpacing: 0.3 },

  credit: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
