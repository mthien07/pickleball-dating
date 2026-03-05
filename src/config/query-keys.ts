/**
 * Centralized query key factory for React Query
 */

export const queryKeys = {
  user: {
    all: ['users'] as const,
    detail: (id: string) => ['users', id] as const,
    profile: () => ['users', 'profile'] as const,
  },
  matches: {
    all: ['matches'] as const,
    list: () => ['matches', 'list'] as const,
    detail: (id: string) => ['matches', id] as const,
  },
  courts: {
    all: ['courts'] as const,
    list: (filters?: Record<string, any>) => ['courts', 'list', filters] as const,
    detail: (id: string) => ['courts', id] as const,
    nearby: (location: { latitude: number; longitude: number }) =>
      ['courts', 'nearby', location] as const,
  },
  bookings: {
    all: ['bookings'] as const,
    list: () => ['bookings', 'list'] as const,
    detail: (id: string) => ['bookings', id] as const,
    history: () => ['bookings', 'history'] as const,
  },
  messages: {
    all: ['messages'] as const,
    conversation: (conversationId: string) => ['messages', conversationId] as const,
  },
  coaches: {
    all: ['coaches'] as const,
    list: (filters?: Record<string, any>) => ['coaches', 'list', filters] as const,
    detail: (id: string) => ['coaches', id] as const,
  },
};
