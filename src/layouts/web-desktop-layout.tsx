/**
 * WebDesktopLayout
 *
 * Wraps content in a centered container on desktop web.
 * On mobile/tablet: passthrough (renders children directly).
 * On desktop web: centers content with configurable maxWidth + horizontal padding.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';
import { MAX_CONTENT_WIDTH } from '../theme/breakpoints';

interface WebDesktopLayoutProps {
  children: React.ReactNode;
  /** Override default desktop max-width (defaults to MAX_CONTENT_WIDTH.desktop) */
  maxWidth?: number;
}

export const WebDesktopLayout: React.FC<WebDesktopLayoutProps> = ({
  children,
  maxWidth = MAX_CONTENT_WIDTH.desktop,
}) => {
  const { isDesktop, isWeb } = useResponsive();

  // On mobile or non-web: passthrough
  if (!isWeb || !isDesktop) {
    return <>{children}</>;
  }

  return (
    <View style={styles.wrapper}>
      <View style={[styles.content, { maxWidth }]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 24,
  },
});
