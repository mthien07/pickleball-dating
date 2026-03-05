/** Types for AuthContext */
import type { User, Session } from '@supabase/supabase-js';
import type { UserProfile } from '../services/api/profile.service';

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  profileLoading: boolean;
  profileError: Error | null;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}
