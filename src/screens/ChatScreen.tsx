import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,
  KeyboardAvoidingView, Platform, SafeAreaView, StatusBar,
  ActivityIndicator, Alert, Animated, Share, PanResponder,
} from 'react-native';
import * as Haptics from 'expo-haptics';
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

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Fade-in + slide-up on mount, long-press to share
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
        <View style={[styles.avatar, { backgroundColor: philosopher.accentColor }]}>
          <Text style={{ fontSize: 14 }}>{philosopher.emoji}</Text>
        </View>
      )}
      <View style={{ maxWidth: '85%' }}>
        <TouchableOpacity onLongPress={handleLongPress} delayLongPress={400} activeOpacity={0.85}>
          <View style={[
            styles.bubble,
            isUser
              ? { backgroundColor: theme.userBubbleBg, borderBottomRightRadius: 4 }
              : { backgroundColor: theme.assistantBubbleBg, borderColor: philosopher.accentColor + '40', borderWidth: 1, borderBottomLeftRadius: 4 },
          ]}>
            <Text style={{ color: isUser ? theme.userBubbleText : theme.assistantBubbleText, fontSize: 15, lineHeight: 23 }}>
              {message.content}
            </Text>
          </View>
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

  useEffect(() => {
    const welcome = t.welcomeMessages[philosopher.id];
    if (welcome) setMessages([{ id: '0', role: 'assistant', content: welcome, timestamp: new Date() }]);
  }, [philosopher.id, language]);

  const animateSend = () => {
    Animated.sequence([
      Animated.spring(sendScale, { toValue: 0.82, useNativeDriver: true, speed: 50, bounciness: 0 }),
      Animated.spring(sendScale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 10 }),
    ]).start();
  };

  const sendMessage = useCallback(() => {
    const text = inputText.trim();
    if (!text || isLoading) return;

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
      if (fullText) setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: fullText, timestamp: new Date() }]);
      setStreamingText('');
      setIsLoading(false);
      xhrRef.current = null;
    };

    xhr.onerror = () => {
      setIsLoading(false); setStreamingText(''); xhrRef.current = null;
      Alert.alert(t.connectionError, `${t.backendHint}`);
    };

    xhr.ontimeout = () => {
      setIsLoading(false); setStreamingText(''); xhrRef.current = null;
      Alert.alert(t.connectionError, 'Request timed out.');
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
      { text: t.clear, style: 'destructive', onPress: () => { xhrRef.current?.abort(); setMessages([]); setStreamingText(''); setIsLoading(false); } },
    ]);
  }, [t]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }} {...panResponder.panHandlers}>
      <StatusBar barStyle={theme.statusBar} />

      <LinearGradient
        colors={theme.isDark ? [philosopher.accentColor + 'CC', theme.bg] : [philosopher.accentColor + '22', theme.bg]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onBack(); }} style={styles.headerBtn}>
              <Text style={{ color: theme.isDark ? 'rgba(255,255,255,0.9)' : philosopher.accentColor, fontSize: 15, fontWeight: '600' }}>
                {t.back}
              </Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <View style={[styles.headerAvatar, { backgroundColor: philosopher.accentColor }]}>
                <Text style={{ fontSize: 20 }}>{philosopher.emoji}</Text>
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

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.msgList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
          keyboardDismissMode="on-drag"
        >
          {messages.length === 0 && !isLoading && (
            <View style={styles.emptyState}>
              {/* Philosopher info card */}
              <View style={[styles.philoCard, { backgroundColor: theme.surface, borderColor: philosopher.accentColor + '35' }]}>
                <View style={[styles.philoCardAvatar, { backgroundColor: philosopher.accentColor }]}>
                  <Text style={{ fontSize: 34 }}>{philosopher.emoji}</Text>
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
              <View style={[styles.avatar, { backgroundColor: philosopher.accentColor }]}>
                <Text style={{ fontSize: 14 }}>{philosopher.emoji}</Text>
              </View>
              <View style={[styles.bubble, { backgroundColor: theme.assistantBubbleBg, borderColor: philosopher.accentColor + '40', borderWidth: 1, borderBottomLeftRadius: 4, flex: 1 }]}>
                <Text style={{ color: theme.assistantBubbleText, fontSize: 15, lineHeight: 23 }}>{streamingText}</Text>
                <View style={{ marginTop: 8 }}><TypingIndicator color={philosopher.accentColor} /></View>
              </View>
            </View>
          )}

          {isLoading && streamingText === '' && (
            <View style={[styles.msgRow, styles.assistantRow]}>
              <View style={[styles.avatar, { backgroundColor: philosopher.accentColor }]}>
                <Text style={{ fontSize: 14 }}>{philosopher.emoji}</Text>
              </View>
              <View style={[styles.bubble, { backgroundColor: theme.assistantBubbleBg, borderColor: philosopher.accentColor + '40', borderWidth: 1, borderBottomLeftRadius: 4, paddingVertical: 16 }]}>
                <TypingIndicator color={philosopher.accentColor} />
              </View>
            </View>
          )}

          <View style={{ height: 10 }} />
        </ScrollView>

        <View style={{ backgroundColor: theme.bg, borderTopWidth: 1, borderTopColor: theme.border, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8 }}>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
              value={inputText}
              onChangeText={setInputText}
              placeholder={t.askPhilosopher}
              placeholderTextColor={theme.textMuted}
              multiline
              maxLength={1000}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
              activeOpacity={1}
            >
              <Animated.View style={[styles.sendBtn, {
                backgroundColor: inputText.trim() && !isLoading ? philosopher.accentColor : theme.surface,
                transform: [{ scale: sendScale }],
              }]}>
                {isLoading
                  ? <ActivityIndicator size="small" color={philosopher.accentColor} />
                  : <Text style={{ fontSize: 22, fontWeight: '700', color: inputText.trim() ? '#FFF' : theme.textMuted }}>↑</Text>
                }
              </Animated.View>
            </TouchableOpacity>
          </View>
          <SafeAreaView />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

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
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  textInput: { flex: 1, borderWidth: 1, borderRadius: 22, paddingHorizontal: 18, paddingVertical: 12, fontSize: 15, maxHeight: 120 },
  sendBtn: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
});
