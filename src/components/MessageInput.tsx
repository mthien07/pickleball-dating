/**
 * MessageInput Component
 *
 * Chat input bar with attachment support
 */

import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Platform, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, typography } from '../theme/tokens';

// ============================================
// TYPES
// ============================================

export interface MessageInputProps {
  onSend: (text: string) => void;
  onAttachment?: () => void;
  onCamera?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onAttachment,
  onCamera,
  placeholder = 'Nhắn tin...',
  disabled = false,
}) => {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  // Animation values
  const sendScale = useSharedValue(0);
  const inputHeight = useSharedValue(44);

  // Update send button visibility
  React.useEffect(() => {
    sendScale.value = withSpring(text.length > 0 ? 1 : 0, {
      damping: 15,
      stiffness: 200,
    });
  }, [text]);

  const sendButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sendScale.value }],
    opacity: sendScale.value,
  }));

  const attachButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(sendScale.value, [0, 1], [1, 0]) }],
    opacity: interpolate(sendScale.value, [0, 1], [1, 0]),
  }));

  const handleSend = () => {
    if (text.trim().length === 0) {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSend(text.trim());
    setText('');
    inputHeight.value = withTiming(44);
  };

  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    const newHeight = Math.min(Math.max(44, height + 12), 120);
    inputHeight.value = withTiming(newHeight, { duration: 100 });
  };

  const inputContainerStyle = useAnimatedStyle(() => ({
    minHeight: inputHeight.value,
  }));

  return (
    <View style={styles.container}>
      {/* Attachment Button */}
      <Animated.View style={attachButtonStyle}>
        <TouchableOpacity
          onPress={onAttachment}
          style={styles.iconButton}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle" size={28} color={colors.primary} />
        </TouchableOpacity>
      </Animated.View>

      {/* Input Container */}
      <Animated.View style={[styles.inputContainer, inputContainerStyle]}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          multiline
          maxLength={1000}
          editable={!disabled}
          onContentSizeChange={handleContentSizeChange}
          returnKeyType="default"
          blurOnSubmit={false}
        />

        {/* Camera Button (inside input) */}
        {text.length === 0 && onCamera && (
          <TouchableOpacity onPress={onCamera} style={styles.cameraButton} activeOpacity={0.7}>
            <Ionicons name="camera" size={22} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Send Button */}
      <Animated.View style={[styles.sendContainer, sendButtonStyle]}>
        <TouchableOpacity
          onPress={handleSend}
          activeOpacity={0.8}
          disabled={disabled || text.trim().length === 0}
        >
          <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.sendButton}>
            <Ionicons name="send" size={18} color={colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.xs,
  },

  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
  },

  input: {
    flex: 1,
    ...typography.body,
    fontSize: 16,
    color: colors.textPrimary,
    maxHeight: 100,
    paddingTop: 0,
    paddingBottom: 0,
  },

  cameraButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },

  sendContainer: {
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.sm,
  },

  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessageInput;
