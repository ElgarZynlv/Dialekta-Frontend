import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LanguageScreen from './src/screens/LanguageScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { LanguageProvider, useLanguage } from './src/context/LanguageContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { Philosopher } from './src/constants/philosophers';

type Screen = 'home' | 'chat' | 'settings';

// Fade wrapper — fades in on mount
function FadeScreen({ children }: { children: React.ReactNode }) {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 280, useNativeDriver: true }).start();
  }, []);
  return <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>{children}</Animated.View>;
}

function AppContent() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<Philosopher | null>(null);
  const [showLanguageScreen, setShowLanguageScreen] = useState(false);
  const { hasChosen, isLoaded, hasSeenOnboarding, markOnboardingSeen } = useLanguage();
  const { theme } = useTheme();

  if (!isLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#080810' }} />;
  }

  if (!hasSeenOnboarding) {
    return (
      <FadeScreen>
        <OnboardingScreen onDone={() => markOnboardingSeen()} />
      </FadeScreen>
    );
  }

  if (!hasChosen || showLanguageScreen) {
    return (
      <FadeScreen>
        <LanguageScreen onDone={() => setShowLanguageScreen(false)} />
      </FadeScreen>
    );
  }

  if (screen === 'settings') {
    return (
      <FadeScreen>
        <SettingsScreen
          onBack={() => setScreen('home')}
          onChangeLanguage={() => { setScreen('home'); setShowLanguageScreen(true); }}
        />
      </FadeScreen>
    );
  }

  if (screen === 'chat' && selectedPhilosopher) {
    return (
      <FadeScreen>
        <ChatScreen
          philosopher={selectedPhilosopher}
          onBack={() => setScreen('home')}
        />
      </FadeScreen>
    );
  }

  return (
    <FadeScreen>
      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <HomeScreen
          onSelectPhilosopher={(p) => { setSelectedPhilosopher(p); setScreen('chat'); }}
          onOpenSettings={() => setScreen('settings')}
        />
      </View>
    </FadeScreen>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </LanguageProvider>
  );
}
