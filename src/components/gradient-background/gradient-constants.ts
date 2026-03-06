import type { ThemeColors } from '../../contexts/theme-colors';

/** Creates theme-aware gradient color presets */
export const createGradientColors = (colors: ThemeColors) => ({
  primary: [colors.primaryGradientStart, colors.primaryGradientEnd] as const,
  primaryReverse: [colors.primaryGradientEnd, colors.primaryGradientStart] as const,
  primarySubtle: [`${colors.primary}14`, `${colors.primaryLight}14`] as const,
  primaryDark: [colors.primaryDark, '#1E40AF'] as const,
  primaryLight: ['#DBEAFE', '#EFF6FF'] as const,
  secondary: [colors.secondary, colors.secondaryDark] as const,
  secondarySubtle: [`${colors.secondary}14`, `${colors.sportGreen}14`] as const,
  accent: [colors.accent, colors.accentLight] as const,
  accentSubtle: [`${colors.accent}1A`, `${colors.accentLight}1A`] as const,
  sport: [colors.primary, colors.accent] as const,
  sportSubtle: [`${colors.primary}1A`, `${colors.accent}1A`] as const,
  sunset: [colors.primary, colors.primaryLight, colors.accent] as const,
  fresh: [colors.primaryLight, colors.primaryGradientEnd, '#DBEAFE'] as const,
  bgSubtle: [`${colors.primary}08`, `${colors.accent}08`, `${colors.primary}08`] as const,
  bgMedium: [`${colors.primary}1F`, `${colors.accent}1F`] as const,
  glass: [colors.surfaceGlass, `${colors.surface}99`] as const,
  glassDark: [`${colors.primaryDark}CC`, `${colors.primaryDark}99`] as const,
  bentoWarm: ['#FEE2E2', '#FEF2F2'] as const,
  bentoCool: ['#DBEAFE', '#EFF6FF'] as const,
  bentoNeutral: [colors.backgroundCircle, colors.background] as const,
});

export const GRADIENT_DIRECTIONS = {
  horizontal: { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  vertical: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  diagonal: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  diagonalReverse: { start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
  radial: { start: { x: 0.5, y: 0.5 }, end: { x: 1, y: 1 } },
};
