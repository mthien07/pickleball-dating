/**
 * Theme Token Tests
 *
 * Tests theme color token availability and consistency across light and dark modes.
 * Verifies that all required theme tokens are present and accessible.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';
import { ThemeProvider, useTheme, useThemeColors } from '../src/contexts/ThemeContext';

// Test component that uses theme hooks
const ThemeTestComponent: React.FC<{
  onThemeReceived?: (themeMode: any, isDark: any, colors: any) => void;
}> = ({ onThemeReceived }) => {
  const { themeMode, isDark } = useTheme();
  const colors = useThemeColors();

  React.useEffect(() => {
    if (onThemeReceived) {
      onThemeReceived(themeMode, isDark, colors);
    }
  }, [themeMode, isDark, colors, onThemeReceived]);

  return (
    <View>
      <Text testID="theme-mode">{themeMode}</Text>
      <Text testID="is-dark">{isDark ? 'dark' : 'light'}</Text>
    </View>
  );
};

describe('Theme System Tests', () => {
  describe('Theme Provider Initialization', () => {
    it('initializes with light mode when specified', () => {
      const { getByTestId } = render(
        <ThemeProvider initialMode="light">
          <ThemeTestComponent />
        </ThemeProvider>
      );

      expect(getByTestId('theme-mode').props.children).toBe('light');
      expect(getByTestId('is-dark').props.children).toBe('light');
    });

    it('initializes with dark mode when specified', () => {
      const { getByTestId } = render(
        <ThemeProvider initialMode="dark">
          <ThemeTestComponent />
        </ThemeProvider>
      );

      expect(getByTestId('theme-mode').props.children).toBe('dark');
      expect(getByTestId('is-dark').props.children).toBe('dark');
    });
  });

  describe('Light Theme Color Tokens', () => {
    it('has all required color tokens', () => {
      let capturedColors: any = null;

      render(
        <ThemeProvider initialMode="light">
          <ThemeTestComponent
            onThemeReceived={(_, __, colors) => {
              capturedColors = colors;
            }}
          />
        </ThemeProvider>
      );

      expect(capturedColors).toBeTruthy();

      // Core colors - Vibrant Sport theme (Blue/Emerald)
      expect(capturedColors.primary).toBe('#2563EB');
      expect(capturedColors.secondary).toBe('#10B981');
      expect(capturedColors.background).toBe('#F8FAFC');
      expect(capturedColors.surface).toBe('#FFFFFF');
      expect(capturedColors.textPrimary).toBe('#0F172A');
      expect(capturedColors.textSecondary).toBe('#475569');

      // New theme tokens - Vibrant Sport
      expect(capturedColors.starColor).toBe('#F59E0B');
      expect(capturedColors.goldAccent).toBe('#FCD34D');
      expect(capturedColors.redAccent).toBe('#F43F5E');
      expect(capturedColors.backgroundCircle).toBe('#EFF6FF');
      expect(capturedColors.searchBackground).toBe('#F1F5F9');
      expect(capturedColors.disabledBackground).toBe('#F8FAFC');

      // Gradient colors - Blue/Emerald theme
      expect(capturedColors.overlayGradientStart).toBe('rgba(37, 99, 235, 0.2)');
      expect(capturedColors.overlayGradientEnd).toBe('rgba(16, 185, 129, 0.2)');
      expect(capturedColors.disabledGradientStart).toBe('#CBD5E1');
      expect(capturedColors.disabledGradientEnd).toBe('#94A3B8');
      expect(capturedColors.onboardingOverlay).toBe('rgba(255, 255, 255, 0.15)');
    });
  });

  describe('Dark Theme Color Tokens', () => {
    it('has all required color tokens', () => {
      let capturedColors: any = null;

      render(
        <ThemeProvider initialMode="dark">
          <ThemeTestComponent
            onThemeReceived={(_, __, colors) => {
              capturedColors = colors;
            }}
          />
        </ThemeProvider>
      );

      expect(capturedColors).toBeTruthy();

      // Core colors - Vibrant Sport theme (Blue/Emerald dark variants)
      expect(capturedColors.primary).toBe('#60A5FA');
      expect(capturedColors.secondary).toBe('#34D399');
      expect(capturedColors.background).toBe('#0F172A');
      expect(capturedColors.surface).toBe('#1E293B');
      expect(capturedColors.textPrimary).toBe('#F8FAFC');
      expect(capturedColors.textSecondary).toBe('#CBD5E1');

      // New theme tokens - Vibrant Sport dark
      expect(capturedColors.starColor).toBe('#FCD34D');
      expect(capturedColors.goldAccent).toBe('#FDE68A');
      expect(capturedColors.redAccent).toBe('#FB7185');
      expect(capturedColors.backgroundCircle).toBe('#1E293B');
      expect(capturedColors.searchBackground).toBe('#1E293B');
      expect(capturedColors.disabledBackground).toBe('#1E293B');

      // Gradient colors - Blue/Emerald dark theme
      expect(capturedColors.overlayGradientStart).toBe('rgba(96, 165, 250, 0.25)');
      expect(capturedColors.overlayGradientEnd).toBe('rgba(52, 211, 153, 0.25)');
      expect(capturedColors.disabledGradientStart).toBe('#475569');
      expect(capturedColors.disabledGradientEnd).toBe('#334155');
      expect(capturedColors.onboardingOverlay).toBe('rgba(0, 0, 0, 0.4)');
    });
  });

  describe('Theme Switching', () => {
    it('provides different color values for light and dark modes', () => {
      let lightColors: any = null;
      let darkColors: any = null;

      // Render light mode
      const { unmount } = render(
        <ThemeProvider initialMode="light">
          <ThemeTestComponent
            onThemeReceived={(_, __, colors) => {
              lightColors = colors;
            }}
          />
        </ThemeProvider>
      );
      unmount();

      // Render dark mode in a separate instance
      render(
        <ThemeProvider initialMode="dark">
          <ThemeTestComponent
            onThemeReceived={(_, __, colors) => {
              darkColors = colors;
            }}
          />
        </ThemeProvider>
      );

      expect(lightColors).toBeTruthy();
      expect(darkColors).toBeTruthy();

      // Verify colors are different between themes
      expect(lightColors.background).not.toBe(darkColors.background);
      expect(lightColors.textPrimary).not.toBe(darkColors.textPrimary);
      expect(lightColors.primary).not.toBe(darkColors.primary);
      expect(lightColors.starColor).not.toBe(darkColors.starColor);
      expect(lightColors.overlayGradientStart).not.toBe(darkColors.overlayGradientStart);
    });
  });

  describe('Theme Hook Integration', () => {
    it('useTheme hook provides theme data', () => {
      let capturedMode: any = null;
      let capturedIsDark: any = null;

      render(
        <ThemeProvider initialMode="light">
          <ThemeTestComponent
            onThemeReceived={(themeMode, isDark) => {
              capturedMode = themeMode;
              capturedIsDark = isDark;
            }}
          />
        </ThemeProvider>
      );

      expect(capturedMode).toBeTruthy();
      expect(capturedMode).toBe('light');
      expect(capturedIsDark).toBe(false);
    });

    it('useThemeColors hook provides colors directly', () => {
      let capturedColors: any = null;

      render(
        <ThemeProvider initialMode="dark">
          <ThemeTestComponent
            onThemeReceived={(_, __, colors) => {
              capturedColors = colors;
            }}
          />
        </ThemeProvider>
      );

      expect(capturedColors).toBeTruthy();
      expect(typeof capturedColors.primary).toBe('string');
      expect(typeof capturedColors.background).toBe('string');
    });
  });
});

/**
 * TO ENABLE FULL SCREENSHOT TESTING:
 *
 * 1. Install dependencies:
 *    npm install --save-dev jest-image-snapshot react-native-view-shot
 *
 * 2. Update jest.setup.js with:
 *    import { toMatchImageSnapshot } from 'jest-image-snapshot';
 *    expect.extend({ toMatchImageSnapshot });
 *
 * 3. Replace toBeTruthy() checks with actual screenshot capture:
 *    import { captureScreen } from 'react-native-view-shot';
 *    const screenshot = await captureScreen(container);
 *    expect(screenshot).toMatchImageSnapshot();
 */
