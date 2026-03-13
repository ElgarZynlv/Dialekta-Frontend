import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Language, LANGUAGE_NAMES, LANGUAGE_FLAGS, TRANSLATIONS } from '../constants/translations';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const LANGUAGES: Language[] = ['az', 'ru', 'tr', 'en'];

interface Props { onDone: () => void; }

export default function LanguageScreen({ onDone }: Props) {
  const { language, setLanguage } = useLanguage();
  const { theme } = useTheme();
  const [selected, setSelected] = useState<Language>(language);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const t = TRANSLATIONS[selected];

  const handleContinue = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await setLanguage(selected);
    onDone();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.statusBar} />
      <SafeAreaView style={styles.safe}>
        <Animated.View style={[styles.content, { opacity, transform: [{ translateY }] }]}>

          <Text style={styles.icon}>🌐</Text>
          <Text style={[styles.title, { color: theme.text }]}>{t.chooseLanguage}</Text>
          <Text style={[styles.subtitle, { color: theme.textSub }]}>{t.languageSubtitle}</Text>

          <View style={styles.options}>
            {LANGUAGES.map((lang) => {
              const isSelected = selected === lang;
              return (
                <TouchableOpacity
                  key={lang}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSelected(lang); }}
                  activeOpacity={0.8}
                  style={[
                    styles.option,
                    {
                      backgroundColor: isSelected ? 'transparent' : theme.surface,
                      borderColor: isSelected ? '#2E86C1' : theme.border,
                    },
                  ]}
                >
                  {isSelected ? (
                    <LinearGradient
                      colors={['#2E86C1CC', '#1A5276']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                      style={styles.optionInner}
                    >
                      <Text style={styles.flag}>{LANGUAGE_FLAGS[lang]}</Text>
                      <Text style={[styles.langName, { color: '#FFF' }]}>{LANGUAGE_NAMES[lang]}</Text>
                      <Text style={styles.check}>✓</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.optionInner}>
                      <Text style={styles.flag}>{LANGUAGE_FLAGS[lang]}</Text>
                      <Text style={[styles.langName, { color: theme.textSub }]}>{LANGUAGE_NAMES[lang]}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} activeOpacity={0.85}>
            <LinearGradient
              colors={['#2E86C1', '#1A5276']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.continueBtnInner}
            >
              <Text style={styles.continueBtnText}>{t.continue}</Text>
            </LinearGradient>
          </TouchableOpacity>

        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  icon: { fontSize: 52, marginBottom: 14 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, marginBottom: 32, textAlign: 'center' },
  options: { width: '100%', gap: 12, marginBottom: 32 },
  option: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  optionInner: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20 },
  flag: { fontSize: 26, marginRight: 14 },
  langName: { flex: 1, fontSize: 17, fontWeight: '600' },
  check: { fontSize: 18, color: '#FFF', fontWeight: '700' },
  continueBtn: { width: '100%', borderRadius: 14, overflow: 'hidden' },
  continueBtnInner: { paddingVertical: 16, alignItems: 'center' },
  continueBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },
});
