/**
 * KeyboardView Component
 *
 * Wrapper for KeyboardAvoidingView that handles iOS/Android differences
 *
 * Usage:
 * ```tsx
 * <KeyboardView>
 *   <Input placeholder="Type here..." />
 * </KeyboardView>
 * ```
 */

import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

// ============================================
// TYPES
// ============================================

export interface KeyboardViewProps {
  /**
   * Children components
   */
  children: React.ReactNode;

  /**
   * Keyboard vertical offset
   * @default 0
   */
  offset?: number;

  /**
   * Enable scrolling
   * @default false
   */
  scrollEnabled?: boolean;

  /**
   * Dismiss keyboard on tap
   * @default true
   */
  dismissOnTap?: boolean;

  /**
   * Custom container style
   */
  style?: ViewStyle;

  /**
   * Content container style (when scrollEnabled)
   */
  contentContainerStyle?: ViewStyle;
}

// ============================================
// COMPONENT
// ============================================

export const KeyboardView: React.FC<KeyboardViewProps> = ({
  children,
  offset = 0,
  scrollEnabled = false,
  dismissOnTap = true,
  style,
  contentContainerStyle,
}) => {
  const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : 'height';

  const content = (
    <KeyboardAvoidingView
      behavior={keyboardBehavior}
      keyboardVerticalOffset={offset}
      style={[{ flex: 1 }, style]}
    >
      {scrollEnabled ? (
        <ScrollView
          contentContainerStyle={contentContainerStyle}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </KeyboardAvoidingView>
  );

  if (dismissOnTap) {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {content}
      </TouchableWithoutFeedback>
    );
  }

  return content;
};

// ============================================
// PRESET VARIANTS
// ============================================

/**
 * Form View - For forms with multiple inputs
 */
export const FormView: React.FC<Omit<KeyboardViewProps, 'scrollEnabled' | 'dismissOnTap'>> = (props) => (
  <KeyboardView
    {...props}
    scrollEnabled={true}
    dismissOnTap={true}
  />
);

/**
 * Chat View - For chat screens
 */
export const ChatView: React.FC<Omit<KeyboardViewProps, 'offset'>> = (props) => (
  <KeyboardView
    {...props}
    offset={Platform.OS === 'ios' ? 90 : 0}
    dismissOnTap={false}
  />
);

// Default export
export default KeyboardView;

// ============================================
// USAGE EXAMPLES
// ============================================

/*
// Basic usage
<KeyboardView>
  <View style={{ padding: 20 }}>
    <Input placeholder="Email" />
    <Input placeholder="Password" />
  </View>
</KeyboardView>

// With scroll
<KeyboardView scrollEnabled>
  <View>
    <Input placeholder="Name" />
    <Input placeholder="Email" />
    <Input placeholder="Phone" />
    <Input placeholder="Bio" multiline />
  </View>
</KeyboardView>

// Custom offset (e.g., with tab bar)
<KeyboardView offset={80}>
  <Input placeholder="Message" />
</KeyboardView>

// Without dismiss on tap (e.g., chat)
<KeyboardView dismissOnTap={false}>
  <ChatMessages />
  <ChatInput />
</KeyboardView>

// Form variant
<FormView>
  <ProfileForm />
</FormView>

// Chat variant
<ChatView>
  <MessageList />
  <MessageInput />
</ChatView>

// With custom style
<KeyboardView
  style={{ backgroundColor: '#fff' }}
  contentContainerStyle={{ padding: 20 }}
  scrollEnabled
>
  <LongForm />
</KeyboardView>
*/
