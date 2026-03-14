import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,
  KeyboardAvoidingView, Platform, SafeAreaView, StatusBar,
  ActivityIndicator, Alert, Animated, Share, PanResponder,
} from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import * as FileSystem from 'expo-file-system';
import * as StoreReview from 'expo-store-review';
import { LinearGradient } from 'expo-linear-gradient';
import { Philosopher } from '../constants/philosophers';
import { ENDPOINTS } from '../constants/api';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Props {
  philosopher: Philosopher;
  onBack: () => void;
}

const chatFilePath = (id: string) =>
  FileSystem.documentDirectory + `chat_history_${id}.json`;

const REVIEW_FILE = FileSystem.documentDirectory + 'msg_count.txt';

async function maybeRequestReview() {
  try {
    const canReview = await StoreReview.isAvailableAsync();
    if (!canReview) return;
    const raw = await FileSystem.readAsStringAsync(REVIEW_FILE).catch(() => '0');
    const count = parseInt(raw, 10) + 1;
    await FileSystem.writeAsStringAsync(REVIEW_FILE, String(count));
    if (count === 8) {
      await StoreReview.requestReview();
    }
  } catch (_) {}
}

// Philosopher avatar — photo with gradient fallback
function PhilosopherAvatar({ philosopher, size }: { philosopher: Philosopher; size: number }) {
  const [imgError, setImgError] = useState(false);
  const r = size / 2;
  return (
    <View style={{ width: size, height: size, borderRadius: r, overflow: 'hidden' }}>
      {!imgError ? (
        <Image
          source={{ uri: philosopher.image }}
          style={{ width: size, height: size, borderRadius: r }}
          contentFit="cover"
          cachePolicy="disk"
          onError={() => setImgError(true)}
        />
      ) : (
        <LinearGradient colors={[philosopher.accentColor, philosopher.secondaryColor]} style={{ width: size, height: size, borderRadius: r, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: size * 0.4 }}>{philosopher.emoji}</Text>
        </LinearGradient>
      )}
    </View>
  );
}

// Pulsing online indicator
function OnlineIndicator() {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.8, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <View style={{ width: 10, height: 10, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{
        position: 'absolute', width: 10, height: 10, borderRadius: 5,
        backgroundColor: '#2ECC71', opacity: 0.35, transform: [{ scale: pulse }],
      }} />
      <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#2ECC71' }} />
    </View>
  );
}

// Typing dots
function TypingIndicator({ color }: { color: string }) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const makeAnim = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -7, duration: 280, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 280, useNativeDriver: true }),
          Animated.delay(500),
        ])
      );
    const a1 = makeAnim(dot1, 0);
    const a2 = makeAnim(dot2, 160);
    const a3 = makeAnim(dot3, 320);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, []);

  return (
    <View style={styles.typingRow}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View
          key={i}
          style={[styles.typingDot, { backgroundColor: color, transform: [{ translateY: dot }] }]}
        />
      ))}
    </View>
  );
}

// Network error banner
function NetworkErrorBanner({ message, onDismiss, theme }: {
  message: string; onDismiss: () => void; theme: any;
}) {
  const slideY = useRef(new Animated.Value(-40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideY, { toValue: 0, useNativeDriver: true, bounciness: 5, speed: 16 }),
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
  }, []);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(slideY, { toValue: -40, duration: 180, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(() => onDismiss());
  };

  return (
    <Animated.View style={[
      bannerStyles.container,
      { backgroundColor: theme.surface, borderColor: '#E74C3C33', transform: [{ translateY: slideY }], opacity },
    ]}>
      <View style={bannerStyles.redDot} />
      <Text style={[bannerStyles.text, { color: theme.textSub }]}>{message}</Text>
      <TouchableOpacity onPress={dismiss} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={{ color: theme.textMuted, fontSize: 15, fontWeight: '600' }}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Message bubble — fade-in + slide-up, long-press to share
function MessageBubble({ message, philosopher, theme }: {
  message: Message; philosopher: Philosopher; theme: any;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start();
  }, []);

  const isUser = message.role === 'user';

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Share.share({ message: message.content });
  };

  return (
    <Animated.View
      style={[
        styles.msgRow,
        isUser ? styles.userRow : styles.assistantRow,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      {!isUser && (
        <View style={[styles.avatar, { borderColor: philosopher.accentColor + '50', borderWidth: 1.5 }]}>
          <PhilosopherAvatar philosopher={philosopher} size={28} />
        </View>
      )}
      <View style={{ maxWidth: '85%' }}>
        <TouchableOpacity onLongPress={handleLongPress} delayLongPress={400} activeOpacity={0.85}>
          {isUser ? (
            <LinearGradient
              colors={theme.isDark ? ['#FFFFFF', '#F0EEF8'] : ['#2C1F0E', '#1A0A05']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={[styles.bubble, { borderBottomRightRadius: 4 }]}
            >
              <Text style={{ color: theme.userBubbleText, fontSize: 15, lineHeight: 23 }}>
                {message.content}
              </Text>
            </LinearGradient>
          ) : (
            <View style={[
              styles.bubble,
              {
                backgroundColor: theme.assistantBubbleBg,
                borderColor: philosopher.accentColor + '30',
                borderWidth: 1,
                borderBottomLeftRadius: 4,
              },
            ]}>
              <Text style={{ color: theme.assistantBubbleText, fontSize: 15, lineHeight: 23 }}>
                {message.content}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={[styles.timestamp, { alignSelf: isUser ? 'flex-end' : 'flex-start', color: theme.textMuted }]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function ChatScreen({ philosopher, onBack }: Props) {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [networkError, setNetworkError] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const sendScale = useRef(new Animated.Value(1)).current;

  // Swipe right to go back
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) => gs.dx > 12 && Math.abs(gs.dy) < 60,
      onPanResponderRelease: (_, gs) => {
        if (gs.dx > 80) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onBack();
        }
      },
    })
  ).current;

  const scrollToBottom = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, streamingText]);

  // Load chat history from file, fall back to welcome message
  useEffect(() => {
    setMessages([]);
    setNetworkError(false);
    FileSystem.readAsStringAsync(chatFilePath(philosopher.id))
      .then(data => {
        const saved: any[] = JSON.parse(data);
        if (saved.length > 0) {
          setMessages(saved.map(m => ({ ...m, timestamp: new Date(m.timestamp) })));
        } else {
          throw new Error('empty');
        }
      })
      .catch(() => {
        const welcome = t.welcomeMessages[philosopher.id];
        if (welcome) {
          setMessages([{ id: '0', role: 'assistant', content: welcome, timestamp: new Date() }]);
        }
      });
  }, [philosopher.id]);

  // Save chat history on every message change
  useEffect(() => {
    if (messages.length === 0) return;
    FileSystem.writeAsStringAsync(chatFilePath(philosopher.id), JSON.stringify(messages)).catch(() => {});
  }, [messages, philosopher.id]);

  const animateSend = () => {
    Animated.sequence([
      Animated.spring(sendScale, { toValue: 0.82, useNativeDriver: true, speed: 50, bounciness: 0 }),
      Animated.spring(sendScale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 10 }),
    ]).start();
  };

  const sendMessage = useCallback(() => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    setNetworkError(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    animateSend();

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    setInputText('');
    setIsLoading(true);
    setStreamingText('');

    const updated = [...messages, userMsg];
    setMessages(updated);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    let fullText = '';
    let buffer = '';

    xhr.open('POST', ENDPOINTS.chat, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.timeout = 60000;

    xhr.onprogress = () => {
      const chunk = xhr.responseText.slice(buffer.length);
      buffer = xhr.responseText;
      for (const line of chunk.split('\n')) {
        if (!line.startsWith('data: ')) continue;
        try {
          const data = JSON.parse(line.slice(6));
          if (data.type === 'text') { fullText += data.text; setStreamingText(fullText); }
        } catch (_) {}
      }
    };

    xhr.onload = () => {
      if (fullText) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: fullText, timestamp: new Date() }]);
        setNetworkError(false);
        maybeRequestReview();
      }
      setStreamingText('');
      setIsLoading(false);
      xhrRef.current = null;
    };

    xhr.onerror = () => {
      setIsLoading(false); setStreamingText(''); xhrRef.current = null;
      setNetworkError(true);
    };

    xhr.ontimeout = () => {
      setIsLoading(false); setStreamingText(''); xhrRef.current = null;
      setNetworkError(true);
    };

    xhr.send(JSON.stringify({
      philosopherId: philosopher.id,
      messages: updated.map(m => ({ role: m.role, content: m.content })),
      language,
    }));
  }, [inputText, isLoading, messages, philosopher.id, language, t]);

  const clearChat = useCallback(() => {
    Alert.alert(t.clearChatTitle, t.clearChatMessage, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.clear, style: 'destructive', onPress: () => {
          xhrRef.current?.abort();
          setStreamingText('');
          setIsLoading(false);
          setNetworkError(false);
          FileSystem.deleteAsync(chatFilePath(philosopher.id), { idempotent: true }).catch(() => {});
          const welcome = t.welcomeMessages[philosopher.id];
          setMessages(welcome ? [{ id: Date.now().toString(), role: 'assistant', content: welcome, timestamp: new Date() }] : []);
        },
      },
    ]);
  }, [t, philosopher.id]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }} {...panResponder.panHandlers}>
      <StatusBar barStyle={theme.statusBar} />

      <LinearGradient
        colors={theme.isDark
          ? [philosopher.accentColor + 'BB', philosopher.secondaryColor + '55', theme.bg]
          : [philosopher.accentColor + '28', philosopher.accentColor + '0A', theme.bg]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onBack(); }}
              style={styles.headerBtn}
            >
              <Text style={{ color: theme.isDark ? 'rgba(255,255,255,0.85)' : philosopher.accentColor, fontSize: 15, fontWeight: '600' }}>
                {t.back}
              </Text>
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <View style={[styles.headerAvatar, { borderColor: philosopher.accentColor + '60', borderWidth: 2, overflow: 'hidden' }]}>
                <PhilosopherAvatar philosopher={philosopher} size={40} />
              </View>
              <View>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>{philosopher.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 }}>
                  <OnlineIndicator />
                  <Text style={{ color: theme.textSub, fontSize: 11 }}>{philosopher.era} · {philosopher.origin}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={clearChat} style={[styles.headerBtn, { alignItems: 'flex-end' }]}>
              <Text style={{ color: theme.textSub, fontSize: 14 }}>{t.newChat}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Thin accent separator */}
      <View style={{ height: 1, backgroundColor: philosopher.accentColor + '25' }} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 0}>
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.msgList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
          keyboardDismissMode="on-drag"
        >
          {networkError && (
            <NetworkErrorBanner
              message={t.noConnection}
              onDismiss={() => setNetworkError(false)}
              theme={theme}
            />
          )}

          {messages.length === 0 && !isLoading && (
            <View style={styles.emptyState}>
              <View style={[styles.philoCard, { backgroundColor: theme.surface, borderColor: philosopher.accentColor + '35' }]}>
                <View style={[styles.philoCardAvatar, { borderColor: philosopher.accentColor + '60', borderWidth: 2.5, overflow: 'hidden' }]}>
                  <PhilosopherAvatar philosopher={philosopher} size={76} />
                </View>
                <Text style={{ color: theme.text, fontSize: 19, fontWeight: '800', marginTop: 12, marginBottom: 3 }}>{philosopher.name}</Text>
                <Text style={{ color: theme.textSub, fontSize: 12 }}>{philosopher.era} · {philosopher.origin}</Text>
                <View style={[styles.philoQuoteBox, { borderLeftColor: philosopher.accentColor + '60' }]}>
                  <Text style={{ color: philosopher.accentColor, fontSize: 24, lineHeight: 16, marginBottom: 4 }}>"</Text>
                  <Text style={{ color: theme.textSub, fontSize: 13, lineHeight: 21, fontStyle: 'italic', fontFamily: 'Georgia' }}>
                    {philosopher.quote}
                  </Text>
                </View>
              </View>

              <Text style={{ color: theme.textMuted, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
                {t.askPhilosopher}
              </Text>
              {[t.suggestedQuestion1, t.suggestedQuestion2, t.suggestedQuestion3, t.suggestedQuestion4].map(q => (
                <TouchableOpacity
                  key={q}
                  style={[styles.suggestionChip, { borderColor: philosopher.accentColor + '60', backgroundColor: theme.surface }]}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setInputText(q); }}
                >
                  <Text style={{ color: philosopher.accentColor, fontSize: 14, fontWeight: '500' }}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} philosopher={philosopher} theme={theme} />
          ))}

          {isLoading && streamingText !== '' && (
            <View style={[styles.msgRow, styles.assistantRow]}>
              <View style={[styles.avatar, { borderColor: philosopher.accentColor + '50', borderWidth: 1.5, overflow: 'hidden' }]}>
                <PhilosopherAvatar philosopher={philosopher} size={28} />
              </View>
              <View style={[styles.bubble, { backgroundColor: theme.assistantBubbleBg, borderColor: philosopher.accentColor + '30', borderWidth: 1, borderBottomLeftRadius: 4, flex: 1 }]}>
                <Text style={{ color: theme.assistantBubbleText, fontSize: 15, lineHeight: 23 }}>{streamingText}</Text>
                <View style={{ marginTop: 8 }}><TypingIndicator color={philosopher.accentColor} /></View>
              </View>
            </View>
          )}

          {isLoading && streamingText === '' && (
            <View style={[styles.msgRow, styles.assistantRow]}>
              <View style={[styles.avatar, { borderColor: philosopher.accentColor + '50', borderWidth: 1.5, overflow: 'hidden' }]}>
                <PhilosopherAvatar philosopher={philosopher} size={28} />
              </View>
              <View style={[styles.bubble, { backgroundColor: theme.assistantBubbleBg, borderColor: philosopher.accentColor + '30', borderWidth: 1, borderBottomLeftRadius: 4, paddingVertical: 16 }]}>
                <TypingIndicator color={philosopher.accentColor} />
              </View>
            </View>
          )}

          <View style={{ height: 10 }} />
        </ScrollView>

        {/* Input bar */}
        <BlurView
          intensity={theme.isDark ? 60 : 40}
          tint={theme.isDark ? 'dark' : 'light'}
          style={[
            styles.inputBar,
            {
              borderTopColor: inputFocused ? philosopher.accentColor + '60' : theme.border,
            },
          ]}
        >
          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: inputFocused ? philosopher.accentColor + '70' : theme.inputBorder,
                  color: theme.text,
                },
              ]}
              value={inputText}
              onChangeText={setInputText}
              placeholder={t.askPhilosopher}
              placeholderTextColor={theme.textMuted}
              multiline
              maxLength={1000}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              editable={!isLoading}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
            />
            <TouchableOpacity onPress={sendMessage} disabled={!inputText.trim() || isLoading} activeOpacity={1}>
              <Animated.View style={[styles.sendBtn, {
                transform: [{ scale: sendScale }],
              }]}>
                <LinearGradient
                  colors={inputText.trim() && !isLoading
                    ? [philosopher.accentColor, philosopher.secondaryColor]
                    : [theme.surface, theme.surface]}
                  style={[styles.sendBtnInner]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                >
                  {isLoading
                    ? <ActivityIndicator size="small" color={philosopher.accentColor} />
                    : <Text style={{ fontSize: 22, fontWeight: '700', color: inputText.trim() ? '#FFF' : theme.textMuted }}>↑</Text>
                  }
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
          </View>
          <SafeAreaView />
        </BlurView>
      </KeyboardAvoidingView>
    </View>
  );
}

const bannerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderRadius: 14, borderWidth: 1, padding: 12,
    marginHorizontal: 16, marginBottom: 10,
    shadowColor: '#E74C3C', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12, shadowRadius: 10, elevation: 5,
  },
  redDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E74C3C' },
  text: { flex: 1, fontSize: 13, lineHeight: 18 },
});

const styles = StyleSheet.create({
  header: { paddingBottom: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, justifyContent: 'space-between' },
  headerBtn: { padding: 8, width: 70 },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, justifyContent: 'center' },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  msgList: { paddingHorizontal: 16, paddingTop: 12 },

  emptyState: { marginVertical: 16, alignItems: 'center', gap: 10 },
  philoCard: { width: '100%', borderRadius: 20, borderWidth: 1, padding: 22, alignItems: 'center', marginBottom: 10 },
  philoCardAvatar: { width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center' },
  philoQuoteBox: { borderLeftWidth: 2, paddingLeft: 14, marginTop: 16, alignSelf: 'stretch' },

  suggestionChip: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10 },
  msgRow: { marginBottom: 2, maxWidth: '85%' },
  userRow: { alignSelf: 'flex-end' },
  assistantRow: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'flex-end', gap: 8, maxWidth: '90%' },
  avatar: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bubble: { borderRadius: 18, padding: 14, maxWidth: '100%' },
  timestamp: { fontSize: 10, marginTop: 3, marginBottom: 8, marginHorizontal: 6 },
  typingRow: { flexDirection: 'row', gap: 5, alignItems: 'center', height: 14 },
  typingDot: { width: 7, height: 7, borderRadius: 3.5 },

  inputBar: { borderTopWidth: 1, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  textInput: { flex: 1, borderWidth: 1.5, borderRadius: 24, paddingHorizontal: 18, paddingVertical: 12, fontSize: 15, maxHeight: 120 },
  sendBtn: { width: 46, height: 46 },
  sendBtnInner: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
});
