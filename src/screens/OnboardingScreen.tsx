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
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { PHILOSOPHERS } from '../constants/philosophers';

const { width } = Dimensions.get('window');
const ORBIT_RADIUS = 135;

interface Props {
  onDone: () => void;
}

export default function OnboardingScreen({ onDone }: Props) {
  const { t } = useLanguage();
  const { theme } = useTheme();

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

  const floatAnims = useRef(
    PHILOSOPHERS.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(orbitRotation, { toValue: 1, duration: 22000, useNativeDriver: true })
    ).start();

    floatAnims.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 350),
          Animated.timing(anim, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 2000, useNativeDriver: true }),
        ])
      ).start();
    });

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

  const spin = orbitRotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const counterSpin = orbitRotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-360deg'] });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background glow blobs */}
      <View style={[styles.blob, { top: -80, left: -60, backgroundColor: '#4A3080' }]} />
      <View style={[styles.blob, { bottom: -60, right: -40, backgroundColor: '#1A5276', width: 220, height: 220 }]} />

      <SafeAreaView style={styles.safe}>

        {/* Orbit */}
        <View style={styles.orbitArea}>
          <Animated.View style={[styles.orbitRing, { transform: [{ rotate: spin }] }]}>
            {PHILOSOPHERS.map((p, i) => {
              const rad = ((i * 60) * Math.PI) / 180;
              const x = ORBIT_RADIUS * Math.cos(rad);
              const y = ORBIT_RADIUS * Math.sin(rad);
              const floatY = floatAnims[i].interpolate({ inputRange: [0, 1], outputRange: [0, -10] });
              return (
                <Animated.View
                  key={p.id}
                  style={[
                    styles.orbitItem,
                    {
                      borderColor: p.accentColor + '80',
                      transform: [
                        { translateX: x },
                        { translateY: y },
                        { rotate: counterSpin },
                        { translateY: floatY },
                      ],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={[p.accentColor + '40', p.secondaryColor + '20']}
                    style={styles.orbitItemBg}
                  >
                    <Image
                      source={p.localImage}
                      style={styles.orbitPhoto}
                      contentFit="cover"
                    />
                  </LinearGradient>
                </Animated.View>
              );
            })}
          </Animated.View>

          {/* Center logo */}
          <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }], opacity: logoOpacity }]}>
            <LinearGradient colors={['#6B42B0', '#3D1F8A', '#1A0A2E']} style={styles.logoBg}>
              <Text style={styles.logoEmoji}>🏛️</Text>
            </LinearGradient>
            <View style={styles.glowRing} />
            <View style={styles.glowRingOuter} />
          </Animated.View>
        </View>

        {/* Title */}
        <Animated.View style={[styles.titleArea, { opacity: titleOpacity, transform: [{ translateY: titleY }] }]}>
          <Text style={styles.appName}>Dialekta</Text>
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
              colors={['#8B5CF6', '#6B42B0', '#3D1F8A']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.beginButton}
            >
              <Text style={styles.beginText}>{t.onboardingBegin}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ opacity: buttonOpacity }}>
          <Text style={styles.credit}>{t.createdBy}</Text>
        </Animated.View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080812' },
  blob: {
    position: 'absolute', width: 260, height: 260, borderRadius: 130, opacity: 0.18,
  },
  safe: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },

  orbitArea: {
    width: ORBIT_RADIUS * 2 + 100,
    height: ORBIT_RADIUS * 2 + 100,
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
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  orbitItemBg: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitPhoto: { width: 52, height: 52, borderRadius: 26 },

  logoContainer: { alignItems: 'center', justifyContent: 'center' },
  logoBg: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9, shadowRadius: 24, elevation: 20,
  },
  logoEmoji: { fontSize: 48 },
  glowRing: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    borderWidth: 1.5, borderColor: 'rgba(139,92,246,0.5)',
  },
  glowRingOuter: {
    position: 'absolute', width: 144, height: 144, borderRadius: 72,
    borderWidth: 1, borderColor: 'rgba(139,92,246,0.2)',
  },

  titleArea: { alignItems: 'center', marginBottom: 10 },
  appName: { fontSize: 34, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5, marginBottom: 10 },
  tagline: { fontSize: 18, fontWeight: '600', color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 26 },

  descArea: { marginBottom: 24 },
  desc: { fontSize: 14, color: 'rgba(255,255,255,0.45)', textAlign: 'center', lineHeight: 22 },

  features: { flexDirection: 'row', gap: 10, marginBottom: 36, flexWrap: 'wrap', justifyContent: 'center' },
  featurePill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
  },
  featureIcon: { fontSize: 15 },
  featureLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },

  buttonWrapper: { width: '100%', marginBottom: 20 },
  beginButton: {
    paddingVertical: 18, borderRadius: 16, alignItems: 'center',
    shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6, shadowRadius: 16, elevation: 12,
  },
  beginText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },

  credit: { color: 'rgba(255,255,255,0.2)', fontSize: 11, fontStyle: 'italic', textAlign: 'center' },
});
