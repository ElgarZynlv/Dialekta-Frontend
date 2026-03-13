import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Animated, StatusBar, SafeAreaView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { PHILOSOPHERS, Philosopher } from '../constants/philosophers';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface Props {
  onSelectPhilosopher: (philosopher: Philosopher) => void;
  onOpenSettings: () => void;
}

// Rich portrait for each philosopher
function PhilosopherPortrait({ philosopher }: { philosopher: Philosopher }) {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={portrait.wrapper}>
      {/* Outer glow ring */}
      <Animated.View
        style={[portrait.outerRing, { borderColor: philosopher.accentColor + '40', transform: [{ scale: pulse }] }]}
      />
      {/* Inner ring */}
      <View style={[portrait.innerRing, { borderColor: philosopher.accentColor + '70' }]} />
      {/* Center circle */}
      <LinearGradient
        colors={[philosopher.accentColor + 'EE', philosopher.secondaryColor]}
        style={portrait.circle}
      >
        <Text style={portrait.emoji}>{philosopher.emoji}</Text>
      </LinearGradient>
      {/* Initial letter watermark */}
      <Text style={[portrait.initial, { color: philosopher.accentColor + '20' }]}>
        {philosopher.name[0]}
      </Text>
    </View>
  );
}

function PhilosopherCard({
  philosopher, onPress, index,
}: { philosopher: Philosopher; onPress: () => void; index: number }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, delay: index * 80, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 400, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  const loc = t.philosophers[philosopher.id as keyof typeof t.philosophers];

  return (
    <Animated.View style={[styles.cardWrapper, { opacity, transform: [{ translateY }, { scale }] }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 30, bounciness: 0 }).start(); }}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 4 }).start()}
      >
        <LinearGradient
          colors={theme.isDark
            ? [philosopher.accentColor + 'CC', philosopher.secondaryColor, '#111111']
            : [philosopher.accentColor + '22', philosopher.accentColor + '11', theme.card]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, { borderColor: philosopher.accentColor + (theme.isDark ? '30' : '40'), borderWidth: 1 }]}
        >
          <View style={styles.cardTop}>
            <PhilosopherPortrait philosopher={philosopher} />
            <View style={styles.cardTopRight}>
              <View style={[styles.eraBadge, { backgroundColor: philosopher.accentColor + '25' }]}>
                <Text style={[styles.eraText, { color: philosopher.accentColor }]}>{philosopher.era}</Text>
              </View>
              <Text style={[styles.originText, { color: theme.textSub }]}>{philosopher.origin}</Text>
            </View>
          </View>

          <Text style={[styles.philosopherName, { color: theme.text }]}>{philosopher.name}</Text>
          <Text style={[styles.tagline, { color: philosopher.accentColor + 'EE' }]}>
            {loc?.tagline ?? philosopher.tagline}
          </Text>

          <View style={[styles.quoteContainer, { backgroundColor: theme.isDark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.04)' }]}>
            <Text style={[styles.quoteMark, { color: philosopher.accentColor + '50' }]}>"</Text>
            <Text style={[styles.quote, { color: theme.isDark ? 'rgba(255,255,255,0.75)' : theme.textSub, fontFamily: 'Georgia' }]}>
              {loc?.quote ?? philosopher.quote}
            </Text>
          </View>

          <View style={styles.topicsRow}>
            {(loc?.topics ?? philosopher.topics).slice(0, 3).map((topic) => (
              <View key={topic} style={[styles.topicBadge, { borderColor: philosopher.accentColor + '60' }]}>
                <Text style={[styles.topicText, { color: philosopher.accentColor }]}>{topic}</Text>
              </View>
            ))}
          </View>

          <LinearGradient
            colors={[philosopher.accentColor, philosopher.secondaryColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.chatButton}
          >
            <Text style={styles.chatButtonText}>{t.beginConversation}</Text>
          </LinearGradient>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen({ onSelectPhilosopher, onOpenSettings }: Props) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(headerY, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.bg} />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Top bar */}
        <Animated.View style={[styles.topBar, { opacity: headerOpacity, borderBottomColor: theme.border }]}>
          <View style={{ width: 44 }} />
          <Text style={[styles.topBarTitle, { color: theme.text }]}>🏛️ PhilosopherChat</Text>
          <TouchableOpacity style={[styles.settingsBtn, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onOpenSettings(); }}>
            <Text style={styles.settingsBtnText}>⚙️</Text>
          </TouchableOpacity>
        </Animated.View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View style={[styles.header, { opacity: headerOpacity, transform: [{ translateY: headerY }] }]}>
            <Text style={[styles.headerSubtitle, { color: theme.textSub }]}>{t.appSubtitle}</Text>
          </Animated.View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.dividerText, { color: theme.textMuted }]}>{t.choosePhilosopher}</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </View>

          {/* Cards */}
          {PHILOSOPHERS.map((p, i) => (
            <PhilosopherCard
              key={p.id}
              philosopher={p}
              index={i}
              onPress={() => onSelectPhilosopher(p)}
            />
          ))}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textMuted }]}>{t.createdBy}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const portrait = StyleSheet.create({
  wrapper: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center' },
  outerRing: {
    position: 'absolute', width: 72, height: 72,
    borderRadius: 36, borderWidth: 1.5,
  },
  innerRing: {
    position: 'absolute', width: 62, height: 62,
    borderRadius: 31, borderWidth: 1,
  },
  circle: {
    width: 54, height: 54, borderRadius: 27,
    alignItems: 'center', justifyContent: 'center',
  },
  emoji: { fontSize: 26 },
  initial: {
    position: 'absolute', fontSize: 52, fontWeight: '900',
    right: -4, bottom: -8, zIndex: -1,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1,
  },
  topBarTitle: { fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  settingsBtn: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  settingsBtnText: { fontSize: 20 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 10 },

  header: { alignItems: 'center', paddingTop: 16, paddingBottom: 20 },
  headerSubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 21 },

  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, gap: 10 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5 },

  cardWrapper: {
    marginBottom: 14, borderRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 14, elevation: 10,
  },
  card: { borderRadius: 20, padding: 20, overflow: 'hidden' },
  cardTop: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: 14,
  },
  cardTopRight: { alignItems: 'flex-end', gap: 6 },
  eraBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  eraText: { fontSize: 12, fontWeight: '600' },
  originText: { fontSize: 12 },

  philosopherName: { fontSize: 22, fontWeight: '800', marginBottom: 3, letterSpacing: 0.2 },
  tagline: { fontSize: 12, fontWeight: '700', letterSpacing: 0.8, marginBottom: 14, textTransform: 'uppercase' },

  quoteContainer: { borderRadius: 12, padding: 14, marginBottom: 14 },
  quoteMark: { fontSize: 28, lineHeight: 22, marginBottom: -8 },
  quote: { fontSize: 13, lineHeight: 20, fontStyle: 'italic' },

  topicsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 16 },
  topicBadge: {
    borderWidth: 1, borderRadius: 20, paddingHorizontal: 10,
    paddingVertical: 4, backgroundColor: 'rgba(0,0,0,0.1)',
  },
  topicText: { fontSize: 11, fontWeight: '600' },

  chatButton: { borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  chatButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', letterSpacing: 0.3 },

  footer: { alignItems: 'center', paddingVertical: 24 },
  footerText: { fontSize: 12, fontStyle: 'italic' },
});
