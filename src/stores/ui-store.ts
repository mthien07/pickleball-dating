/** UI Store - Client-only state for filters, onboarding, preferences. Persists to AsyncStorage. */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CourtFilters {
  courtType?: string;
  maxDistance?: number;
}

interface OnboardingState {
  completedSteps: string[];
  isComplete: boolean;
}

interface UIState {
  courtFilters: CourtFilters;
  onboarding: OnboardingState;
  hasSeenTour: boolean;
}

interface UIActions {
  setCourtFilters: (filters: CourtFilters) => void;
  markOnboardingStep: (step: string) => void;
  completeOnboarding: () => void;
  setHasSeenTour: (seen: boolean) => void;
  resetUI: () => void;
}

const initialState: UIState = {
  courtFilters: {},
  onboarding: { completedSteps: [], isComplete: false },
  hasSeenTour: false,
};

export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set) => ({
      ...initialState,

      setCourtFilters: (filters) => set({ courtFilters: filters }),

      markOnboardingStep: (step) =>
        set((state) => ({
          onboarding: {
            ...state.onboarding,
            completedSteps: state.onboarding.completedSteps.includes(step)
              ? state.onboarding.completedSteps
              : [...state.onboarding.completedSteps, step],
          },
        })),

      completeOnboarding: () =>
        set((state) => ({
          onboarding: { ...state.onboarding, isComplete: true },
        })),

      setHasSeenTour: (seen) => set({ hasSeenTour: seen }),

      resetUI: () => set(initialState),
    }),
    {
      name: 'ui-store',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useCourtFilters = () => useUIStore((s) => s.courtFilters);
export const useOnboardingStatus = () => useUIStore((s) => s.onboarding);
