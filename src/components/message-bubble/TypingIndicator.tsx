import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { styles } from './message-bubble-styles';

/** Animated typing indicator dots shown when other user is typing */
export const TypingIndicator: React.FC = () => (
  <Animated.View entering={FadeInUp.duration(200)} style={styles.typingContainer}>
    <View style={styles.typingBubble}>
      <View style={styles.typingDots}>
        <Animated.View style={[styles.typingDot, styles.typingDot1]} />
        <Animated.View style={[styles.typingDot, styles.typingDot2]} />
        <Animated.View style={[styles.typingDot, styles.typingDot3]} />
      </View>
    </View>
  </Animated.View>
);
