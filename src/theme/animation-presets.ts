/**
 * Spring animation presets for Hinge-style elegant micro-interactions.
 * Use with Reanimated's withSpring(): withSpring(target, springPresets.gentle)
 */

export const springPresets = {
  /** Smooth, elegant transitions (modals, page transitions) */
  gentle: { damping: 20, stiffness: 150, mass: 1 },
  /** Quick responsive feedback (button presses, toggles) */
  snappy: { damping: 15, stiffness: 300, mass: 0.8 },
  /** Playful bounce (match celebrations, like animations) */
  bouncy: { damping: 12, stiffness: 200, mass: 1 },
  /** Deliberate, weighted motion (card reveals, profile scroll) */
  slow: { damping: 25, stiffness: 100, mass: 1.2 },
} as const;

/** Fade-in timing for editorial content appearing on scroll */
export const fadePresets = {
  /** Quick content fade (list items) */
  fast: { duration: 150 },
  /** Standard content reveal */
  normal: { duration: 250 },
  /** Dramatic editorial reveal */
  slow: { duration: 400 },
} as const;

export type SpringPreset = keyof typeof springPresets;
export type FadePreset = keyof typeof fadePresets;
