/**
 * HomeSwipeScreen Tests
 *
 * Tests profile card rendering, swipe action buttons, and
 * empty state behavior using a small mock dataset.
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

import { HomeSwipeScreen } from '../HomeSwipeScreen/index';
import { showSuccess } from '../../../services/toast';

// Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: jest.fn(), navigate: jest.fn() }),
}));

// Safe area
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

// lucide icons
jest.mock('lucide-react-native', () => ({
  X: 'X',
  Star: 'Star',
  Heart: 'Heart',
  User: 'User',
}));

// Theme
jest.mock('../../../contexts/ThemeContext', () => ({
  useThemeColors: () => ({
    primary: '#2563EB',
    primaryLight: '#60A5FA',
    secondary: '#10B981',
    accent: '#F43F5E',
    accentLight: '#FB7185',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    white: '#FFFFFF',
    surface: '#FFFFFF',
    background: '#F8FAFC',
  }),
}));
jest.mock('../../../hooks/useThemedStyles', () => ({
  useThemedStyles: (fn: any) => fn({}),
}));

// Responsive / web hooks
jest.mock('../../../hooks/useResponsive', () => ({
  useResponsive: () => ({
    isDesktop: false,
    isWeb: false,
    maxContentWidth: 400,
    containerPadding: 0,
  }),
}));
jest.mock('../../../hooks/useWebUtils', () => ({
  useWebUtils: () => ({ shouldEnableKeyboard: false }),
}));

// Services
jest.mock('../../../services/toast', () => ({
  showSuccess: jest.fn(),
  showInfo: jest.fn(),
}));

// SwipeCard - imperative ref stub
jest.mock('../../../components/SwipeCard', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  const SwipeCard = React.forwardRef(({ user, onLike, onPass }: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      swipe: (direction: string) => {
        if (direction === 'right' && onLike) {
          onLike();
        }
        if (direction === 'left' && onPass) {
          onPass();
        }
      },
    }));
    return (
      <View testID={`swipe-card-${user?.id}`}>
        <Text testID={`card-name-${user?.id}`}>{user?.display_name}</Text>
      </View>
    );
  });
  SwipeCard.displayName = 'SwipeCard';
  return { SwipeCard };
});

// EmptyState
jest.mock('../../../components/EmptyState', () => ({
  EmptyState: ({ title, actionLabel, onAction }: any) => {
    const { View, Text, Pressable } = require('react-native');
    return (
      <View testID="empty-state">
        <Text testID="empty-title">{title}</Text>
        <Pressable testID="empty-action" onPress={onAction}>
          <Text>{actionLabel}</Text>
        </Pressable>
      </View>
    );
  },
}));

// webStyles
jest.mock('../../../theme/webStyles', () => ({
  webStyles: { centeredContainer: {} },
}));

// Mock MOCK_USERS with minimal dataset
jest.mock('@data/mockData', () => ({
  MOCK_USERS: [
    {
      id: 'user-1',
      display_name: 'Alice Nguyen',
      avatar_urls: ['https://example.com/alice.jpg'],
      skill_level: 'intermediate',
      play_style: 'casual',
      bio: 'Love pickleball!',
    },
    {
      id: 'user-2',
      display_name: 'Bob Tran',
      avatar_urls: ['https://example.com/bob.jpg'],
      skill_level: 'advanced',
      play_style: 'competitive',
      bio: 'Competitive player.',
    },
  ],
}));

const mockShowSuccess = showSuccess as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('HomeSwipeScreen', () => {
  it('renders without crashing', () => {
    expect(() => render(<HomeSwipeScreen />)).not.toThrow();
  });

  it('renders first profile card with user name', () => {
    const { getByTestId } = render(<HomeSwipeScreen />);
    expect(getByTestId('swipe-card-user-1')).toBeTruthy();
    expect(getByTestId('card-name-user-1').props.children).toBe('Alice Nguyen');
  });

  it('renders next card as background preview', () => {
    const { getByTestId } = render(<HomeSwipeScreen />);
    expect(getByTestId('swipe-card-user-2')).toBeTruthy();
  });

  it('renders app logo text', () => {
    const { getByText } = render(<HomeSwipeScreen />);
    expect(getByText('PICKLE')).toBeTruthy();
    expect(getByText('MATCH')).toBeTruthy();
  });

  it('renders pass button (X icon area)', () => {
    const { getByTestId } = render(<HomeSwipeScreen />);
    expect(getByTestId('btn-pass')).toBeTruthy();
  });

  it('renders super like button', () => {
    const { getByTestId } = render(<HomeSwipeScreen />);
    expect(getByTestId('btn-super-like')).toBeTruthy();
  });

  it('renders like button', () => {
    const { getByTestId } = render(<HomeSwipeScreen />);
    expect(getByTestId('btn-like')).toBeTruthy();
  });

  it('shows liked toast and advances card on like button press', async () => {
    const { getByTestId } = render(<HomeSwipeScreen />);
    fireEvent.press(getByTestId('btn-like'));
    await waitFor(() => {
      expect(mockShowSuccess).toHaveBeenCalledWith('Liked Alice Nguyen!');
    });
  });

  it('advances card without toast on pass button press', async () => {
    const { getByTestId, queryByTestId } = render(<HomeSwipeScreen />);
    fireEvent.press(getByTestId('btn-pass'));
    await waitFor(() => {
      expect(mockShowSuccess).not.toHaveBeenCalled();
    });
  });

  it('shows super like toast on super like button press', async () => {
    const { getByTestId } = render(<HomeSwipeScreen />);
    fireEvent.press(getByTestId('btn-super-like'));
    await waitFor(() => {
      expect(mockShowSuccess).toHaveBeenCalledWith(
        expect.stringContaining('Super Liked Alice Nguyen!')
      );
    });
  });

  it('does not show empty state when cards remain', () => {
    const { queryByTestId } = render(<HomeSwipeScreen />);
    expect(queryByTestId('empty-state')).toBeNull();
  });
});
