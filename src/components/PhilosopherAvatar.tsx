import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Philosopher } from '../constants/philosophers';

interface Props {
  philosopher: Philosopher;
  size?: number;
}

export default function PhilosopherAvatar({ philosopher, size = 56 }: Props) {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: philosopher.accentColor,
          borderColor: philosopher.accentColor + '60',
        },
      ]}
    >
      <Text style={{ fontSize: size * 0.45 }}>{philosopher.emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
});
