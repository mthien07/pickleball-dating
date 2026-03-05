import { colors } from '../../theme/tokens';

/** All gradient color presets for the Vibrant Sport design system */
export const GRADIENT_COLORS = {
  primary: [colors.primaryGradientStart, colors.primaryGradientEnd] as const,
  primaryReverse: [colors.primaryGradientEnd, colors.primaryGradientStart] as const,
  primarySubtle: ['rgba(37, 99, 235, 0.08)', 'rgba(96, 165, 250, 0.08)'] as const,
  primaryDark: [colors.primaryDark, '#1E40AF'] as const,
  primaryLight: ['#DBEAFE', '#EFF6FF'] as const,
  secondary: [colors.secondary, colors.secondaryLight] as const,
  secondarySubtle: ['rgba(16, 185, 129, 0.08)', 'rgba(52, 211, 153, 0.08)'] as const,
  accent: [colors.accent, colors.accentLight] as const,
  accentSubtle: ['rgba(244, 63, 94, 0.1)', 'rgba(251, 113, 133, 0.1)'] as const,
  sport: ['#2563EB', '#F43F5E'] as const,
  sportSubtle: ['rgba(37, 99, 235, 0.1)', 'rgba(244, 63, 94, 0.1)'] as const,
  sunset: ['#2563EB', '#8B5CF6', '#F43F5E'] as const,
  fresh: ['#60A5FA', '#34D399', '#10B981'] as const,
  bgSubtle: [
    'rgba(37, 99, 235, 0.03)',
    'rgba(16, 185, 129, 0.03)',
    'rgba(244, 63, 94, 0.03)',
  ] as const,
  bgMedium: ['rgba(37, 99, 235, 0.12)', 'rgba(244, 63, 94, 0.12)'] as const,
  glass: ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.6)'] as const,
  glassDark: ['rgba(29, 78, 216, 0.8)', 'rgba(29, 78, 216, 0.6)'] as const,
  bentoWarm: ['#FEE2E2', '#FEF2F2'] as const,
  bentoCool: ['#DBEAFE', '#EFF6FF'] as const,
  bentoNeutral: ['#D1FAE5', '#ECFDF5'] as const,
};

export const GRADIENT_DIRECTIONS = {
  horizontal: { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  vertical: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  diagonal: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  diagonalReverse: { start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
  radial: { start: { x: 0.5, y: 0.5 }, end: { x: 1, y: 1 } },
};
