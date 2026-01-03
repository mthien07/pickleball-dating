// Setup for @testing-library/react-native
import '@testing-library/react-native/extend-expect';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock Supabase (for tests that don't need real connection)
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => {
    const response = Promise.resolve({ data: [], error: null, count: 0, status: 200 });

    const createQueryBuilder = () => {
      const builder = {
        select: jest.fn(() => builder),
        insert: jest.fn(() => builder),
        update: jest.fn(() => builder),
        delete: jest.fn(() => builder),
        eq: jest.fn(() => builder),
        order: jest.fn(() => builder),
        range: jest.fn(() => response),
        limit: jest.fn(() => builder),
        single: jest.fn(() => response),
      };
      return builder;
    };

    const mockChannel = () => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn(),
      send: jest.fn(),
      track: jest.fn(),
      presenceState: jest.fn(() => ({})),
      unsubscribe: jest.fn(),
    });

    return {
      from: jest.fn(() => createQueryBuilder()),
      channel: jest.fn(() => mockChannel()),
      storage: {
        from: jest.fn(() => ({
          upload: jest.fn(() =>
            Promise.resolve({ data: { path: 'mock/path.jpg' }, error: null })
          ),
          getPublicUrl: jest.fn(() => ({
            data: { publicUrl: 'https://example.com/mock.jpg' },
            error: null,
          })),
          remove: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      },
      auth: {
        signUp: jest.fn(() =>
          Promise.resolve({ data: { user: { id: 'user-1' }, session: null }, error: null })
        ),
        signInWithPassword: jest.fn(() =>
          Promise.resolve({ data: { user: { id: 'user-1' }, session: null }, error: null })
        ),
        signInWithOtp: jest.fn(() => Promise.resolve({ data: {}, error: null })),
        verifyOtp: jest.fn(() =>
          Promise.resolve({ data: { user: { id: 'user-1' }, session: null }, error: null })
        ),
        signInWithOAuth: jest.fn(() =>
          Promise.resolve({ data: { url: 'https://example.com/oauth' }, error: null })
        ),
        signOut: jest.fn(() => Promise.resolve({ error: null })),
        getSession: jest.fn(() =>
          Promise.resolve({ data: { session: null }, error: null })
        ),
        getUser: jest.fn(() =>
          Promise.resolve({ data: { user: { id: 'user-1', email: 'user@test.com' } }, error: null })
        ),
        updateUser: jest.fn(() =>
          Promise.resolve({ data: { user: { id: 'user-1' } }, error: null })
        ),
        resetPasswordForEmail: jest.fn(() => Promise.resolve({ error: null })),
        onAuthStateChange: jest.fn((callback) => {
          const subscription = { unsubscribe: jest.fn() };
          callback?.('SIGNED_OUT', null);
          return { data: { subscription }, error: null };
        }),
      },
    };
  }),
}));

// Mock expo modules
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

jest.mock('expo-blur', () => ({
  BlurView: 'BlurView',
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
}));

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  requestMediaLibraryPermissionsAsync: jest.fn(),
  requestCameraPermissionsAsync: jest.fn(),
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  watchPositionAsync: jest.fn(),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));
