/**
 * ChatScreen Tests
 *
 * Tests message rendering, send message, AsyncStorage persistence, and Alert menu.
 */

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ChatScreen } from '../ChatScreen';

// Navigation mocks
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
  useRoute: () => ({ params: { matchId: 'match_001', userId: 'user_002' } }),
}));

jest.mock('../../../contexts/ThemeContext', () => ({
  useThemeColors: () => ({
    primary: '#2563EB',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    border: '#E2E8F0',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    white: '#FFFFFF',
    error: '#EF4444',
  }),
}));

jest.mock('../../../hooks/useThemedStyles', () => ({
  useThemedStyles: (createFn: (...args: unknown[]) => unknown) =>
    createFn({
      primary: '#2563EB',
      background: '#F8FAFC',
      border: '#E2E8F0',
      textPrimary: '#0F172A',
      textSecondary: '#64748B',
    }),
}));

jest.mock('../../../theme/shadows', () => ({
  shadows: { sm: {} },
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('../../../components/Avatar', () => ({
  Avatar: () => null,
}));

// MessageBubble renders text content so messages appear in tree
jest.mock('../../../components/MessageBubble', () => ({
  MessageBubble: ({ message }: { message: { content?: string } }) => {
    const { Text: RNText } = require('react-native');
    return message.content ? <RNText>{message.content}</RNText> : null;
  },
  TypingIndicator: () => null,
}));

// Store onSend so tests can call it directly
let capturedOnSend: ((t: string) => void) | null = null;

jest.mock('../../../components/MessageInput', () => ({
  MessageInput: ({ onSend }: { onSend: (t: string) => void }) => {
    const React = require('react');
    const { TextInput, Pressable, Text } = require('react-native');
    // Capture onSend for direct invocation in tests
    capturedOnSend = onSend;
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(TextInput, {
        testID: 'message-input',
        placeholder: 'Type a message',
      }),
      React.createElement(
        Pressable,
        {
          testID: 'send-button',
          onPress: () => onSend('Test message from mock'),
        },
        React.createElement(Text, null, 'Send')
      )
    );
  },
}));

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({ canceled: true, assets: [] })),
  launchCameraAsync: jest.fn(() => Promise.resolve({ canceled: true, assets: [] })),
  requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  MediaTypeOptions: { Images: 'Images' },
}));

jest.mock('@expo/vector-icons', () => ({ Ionicons: 'Ionicons' }));

const mockOtherUser = {
  id: 'user_002',
  display_name: 'Tran Thi Hong',
  date_of_birth: '1997-03-22',
  gender: 'female',
  avatar_urls: ['https://example.com/avatar.jpg'],
  bio: 'Hello!',
  skill_level: 'beginner',
  play_style: 'social',
  looking_for: ['dating'],
  verification: { phone_verified: false, email_verified: true },
  stats: { matches_count: 5, games_played: 3, average_rating: 4.0 },
  is_online: true,
  last_active: new Date().toISOString(),
  created_at: '2024-01-01T00:00:00Z',
};

jest.mock('@data/mockData', () => ({
  MOCK_MATCHES: [
    {
      id: 'match_001',
      matched_user_id: 'user_002',
      matched_user: mockOtherUser,
      conversation_id: 'conv_001',
      unread_count: 2,
      created_at: '2024-01-01T00:00:00Z',
    },
  ],
  MOCK_MESSAGES: [
    {
      id: 'msg_001',
      conversation_id: 'conv_001',
      content: 'Hello there!',
      type: 'text',
      sender_id: 'user_002',
      status: 'read',
      created_at: '2024-01-01T10:00:00Z',
    },
  ],
  getUserById: jest.fn((id: string) => (id === 'user_002' ? mockOtherUser : undefined)),
  CURRENT_USER_ID: 'current-user',
}));

describe('ChatScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('renders other user display name in header', async () => {
    const { getByText } = render(<ChatScreen />);
    await waitFor(() => {
      expect(getByText('Tran Thi Hong')).toBeTruthy();
    });
  });

  it('renders existing mock messages after load', async () => {
    const { getByText } = render(<ChatScreen />);
    await waitFor(() => {
      expect(getByText('Hello there!')).toBeTruthy();
    });
  });

  it('loads persisted messages from AsyncStorage on mount', async () => {
    const persisted = JSON.stringify([
      {
        id: 'msg_persisted',
        content: 'Persisted message',
        type: 'text',
        sender_id: 'current-user',
        status: 'sent',
        created_at: new Date().toISOString(),
      },
    ]);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(persisted);

    const { getByText } = render(<ChatScreen />);
    await waitFor(() => {
      expect(getByText('Persisted message')).toBeTruthy();
    });
  });

  it('persists user-sent messages to AsyncStorage on send', async () => {
    render(<ChatScreen />);
    await waitFor(() => expect(capturedOnSend).not.toBeNull());

    await act(async () => {
      capturedOnSend!('Hello async storage');
    });

    await waitFor(
      () => {
        expect(AsyncStorage.setItem).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );
  });

  it('sends a new message and shows it in the list', async () => {
    const { findByText } = render(<ChatScreen />);
    await waitFor(() => expect(capturedOnSend).not.toBeNull());

    await act(async () => {
      capturedOnSend!('My new message');
    });

    expect(await findByText('My new message')).toBeTruthy();
  });

  it('shows online status for online user', async () => {
    const { getByText } = render(<ChatScreen />);
    await waitFor(() => {
      expect(getByText('Online')).toBeTruthy();
    });
  });

  it('calls navigation.goBack when back button is pressed', async () => {
    const rendered = render(<ChatScreen />);
    await waitFor(() => rendered.getByText('Tran Thi Hong'));

    // Find all accessible Views (rendered from Pressable) and press the first (back button)
    const { View } = require('react-native');
    const accessibleViews = rendered
      .UNSAFE_getAllByType(View)
      .filter((v: any) => v.props.accessible === true);
    fireEvent.press(accessibleViews[0]);
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('shows Alert menu with block/report options when more button is pressed', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    const rendered = render(<ChatScreen />);
    await waitFor(() => rendered.getByText('Tran Thi Hong'));

    // More button is the 3rd accessible View in the header
    const { View } = require('react-native');
    const accessibleViews = rendered
      .UNSAFE_getAllByType(View)
      .filter((v: any) => v.props.accessible === true);
    // Header has: back button (0), profile area (1), more button (2)
    fireEvent.press(accessibleViews[2]);

    expect(alertSpy).toHaveBeenCalledWith(
      'Tran Thi Hong',
      undefined,
      expect.arrayContaining([
        expect.objectContaining({ text: 'Chặn người dùng' }),
        expect.objectContaining({ text: 'Báo cáo' }),
        expect.objectContaining({ text: 'Hủy' }),
      ])
    );
  });
});
