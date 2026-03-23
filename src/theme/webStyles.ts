/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Web-Specific Styles
 *
 * Reusable styles for web platform, following Hinge's editorial desktop design
 */

import { StyleSheet, ViewStyle } from 'react-native';
import { MAX_CONTENT_WIDTH } from './breakpoints';

export const webStyles = StyleSheet.create({
  // Centered container
  centeredContainer: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH.desktop,
  } as ViewStyle,

  // Full height container
  fullHeightContainer: {
    minHeight: '100vh' as any,
  } as ViewStyle,

  // Card container for desktop
  desktopCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  } as ViewStyle,

  // Sidebar layout
  sidebarLayout: {
    flexDirection: 'row' as const,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  } as ViewStyle,

  // Main content area (with sidebar)
  mainContent: {
    flex: 1,
    maxWidth: MAX_CONTENT_WIDTH.desktop,
  } as ViewStyle,

  // Hover utilities — subtle, editorial
  hoverScale: {
    transform: [{ scale: 1.01 }],
  } as ViewStyle,

  hoverOpacity: {
    opacity: 0.85,
  } as ViewStyle,

  // Transition utilities (web-only CSS properties)
  transitionFast: {
    transition: 'all 0.15s ease' as any,
  } as ViewStyle,

  transitionMedium: {
    transition: 'all 0.25s ease' as any,
  } as ViewStyle,

  // Cursor utility
  cursorPointer: {
    cursor: 'pointer' as any,
  } as ViewStyle,

  // Sidebar
  sidebar: {
    width: 300,
    paddingHorizontal: 24,
  } as ViewStyle,

  // Smooth scroll behavior (web only)
  smoothScroll: {
    scrollBehavior: 'smooth' as any,
  } as ViewStyle,

  // Hover effect — subtle 200ms ease, no bounce
  hoverable: {
    cursor: 'pointer' as any,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease' as any,
  } as ViewStyle,

  // Prevent text selection (for interactive elements)
  noSelect: {
    userSelect: 'none' as any,
    WebkitUserSelect: 'none' as any,
  } as ViewStyle,
});

/**
 * Generate responsive container style
 */
export const getResponsiveContainer = (
  maxWidth: number | string = MAX_CONTENT_WIDTH.desktop,
  padding: number = 0
): ViewStyle =>
  ({
    alignSelf: 'center',
    width: '100%',
    maxWidth: typeof maxWidth === 'number' ? maxWidth : undefined,
    paddingHorizontal: padding,
  }) as ViewStyle;
