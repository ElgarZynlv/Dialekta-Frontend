import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, StatusBar, Switch,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { LANGUAGE_FLAGS, LANGUAGE_NAMES, Language } from '../constants/translations';

interface Props {
  onBack: () => void;
  onChangeLanguage: () => void;
}

export default function SettingsScreen({ onBack, onChangeLanguage }: Props) {
  const { t, language } = useLanguage();
  const { theme, isDark, toggleTheme } = useTheme();

  const S = section(theme);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.statusBar} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
              <Text style={[styles.backText, { color: theme.textSub }]}>{t.back}</Text>
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.text }]}>{t.settings}</Text>
          </View>

          {/* Theme */}
          <View style={[S.section]}>
            <Text style={[S.sectionTitle]}>{t.themeSection}</Text>
            <Text style={[S.sectionDesc]}>{t.themeDesc}</Text>
            <View style={[styles.themeRow, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
              <Text style={styles.themeIcon}>{isDark ? '🌙' : '☀️'}</Text>
              <Text style={[styles.themeName, { color: theme.text }]}>
                {isDark ? t.darkMode : t.lightMode}
              </Text>
              <Switch
                value={!isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#333', true: '#C8B89A' }}
                thumbColor={isDark ? '#888' : '#8B6914'}
              />
            </View>
          </View>

          {/* Language */}
          <View style={[S.section]}>
            <Text style={[S.sectionTitle]}>{t.languageSection}</Text>
            <Text style={[S.sectionDesc]}>{t.languageDesc}</Text>
            <TouchableOpacity
              style={[styles.langBtn, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}
              onPress={onChangeLanguage}
              activeOpacity={0.8}
            >
              <Text style={styles.langFlag}>{LANGUAGE_FLAGS[language as Language]}</Text>
              <Text style={[styles.langName, { color: theme.text }]}>{LANGUAGE_NAMES[language as Language]}</Text>
              <Text style={[styles.arrow, { color: theme.textMuted }]}>›</Text>
            </TouchableOpacity>
          </View>

          {/* About */}
          <View style={[S.section]}>
            <Text style={[S.sectionTitle]}>{t.aboutSection}</Text>
            <Text style={[S.sectionDesc]}>{t.aboutDesc}</Text>
            <Text style={[S.sectionDesc, { color: theme.textMuted, marginBottom: 0 }]}>{t.philosophersList}</Text>
            <View style={[styles.creditRow, { borderTopColor: theme.border }]}>
              <Text style={[styles.creditText, { color: theme.textMuted }]}>{t.createdBy}</Text>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// Dynamic section styles helper
function section(theme: any) {
  return {
    section: {
      marginBottom: 20,
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 18,
      borderWidth: 1,
      borderColor: theme.border,
    },
    sectionTitle: { color: theme.text, fontSize: 16, fontWeight: '700' as const, marginBottom: 6 },
    sectionDesc: { color: theme.textSub, fontSize: 13, lineHeight: 20, marginBottom: 12 },
  };
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 28, gap: 16 },
  backBtn: { padding: 4 },
  backText: { fontSize: 15 },
  title: { fontSize: 24, fontWeight: '700' },

  themeRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, borderWidth: 1, paddingVertical: 12, paddingHorizontal: 14,
  },
  themeIcon: { fontSize: 20, marginRight: 12 },
  themeName: { flex: 1, fontSize: 15, fontWeight: '600' },

  langBtn: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, borderWidth: 1, paddingVertical: 14, paddingHorizontal: 16,
  },
  langFlag: { fontSize: 22, marginRight: 12 },
  langName: { flex: 1, fontSize: 15, fontWeight: '600' },
  arrow: { fontSize: 20, fontWeight: '300' },

  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 10, borderWidth: 1, marginBottom: 12,
  },
  input: { flex: 1, fontSize: 14, paddingHorizontal: 14, paddingVertical: 12, fontFamily: 'monospace' },
  eyeBtn: { padding: 12 },
  eyeText: { fontSize: 16 },
  saveBtn: { backgroundColor: '#2E86C1', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontSize: 15, fontWeight: '600' },

  codeBlock: { backgroundColor: '#000', borderRadius: 8, padding: 14, marginBottom: 10, gap: 6 },
  code: { color: '#00FF88', fontFamily: 'monospace', fontSize: 13 },

  creditRow: { borderTopWidth: 1, marginTop: 12, paddingTop: 12, alignItems: 'center' },
  creditText: { fontSize: 12, fontStyle: 'italic' },
});
