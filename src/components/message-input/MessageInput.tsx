import React, { useState, useRef } from 'react';
import { View, TextInput, Pressable } from 'react-native';
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
import { useThemeColors } from '../../contexts/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { createStyles } from './message-input-styles';

export interface MessageInputProps {
  onSend: (text: string) => void;
  onAttachment?: () => void;
  onCamera?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onAttachment,
  onCamera,
  placeholder = 'Nhắn tin...',
  disabled = false,
}) => {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const sendScale = useSharedValue(0);
  const inputHeight = useSharedValue(44);

  React.useEffect(() => {
    sendScale.value = withSpring(text.length > 0 ? 1 : 0, { damping: 15, stiffness: 200 });
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
      <Animated.View style={attachButtonStyle}>
        <Pressable
          onPress={onAttachment}
          style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.7 }]}
          disabled={disabled}
          android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="add-circle" size={28} color={colors.primary} />
        </Pressable>
      </Animated.View>

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
        {text.length === 0 && onCamera && (
          <Pressable
            onPress={onCamera}
            style={({ pressed }) => [styles.cameraButton, pressed && { opacity: 0.7 }]}
            android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="camera" size={22} color={colors.textTertiary} />
          </Pressable>
        )}
      </Animated.View>

      <Animated.View style={[styles.sendContainer, sendButtonStyle]}>
        <Pressable
          onPress={handleSend}
          style={({ pressed }) => pressed && { opacity: 0.8 }}
          disabled={disabled || text.trim().length === 0}
          android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
        >
          <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.sendButton}>
            <Ionicons name="send" size={18} color={colors.white} />
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default MessageInput;
