/** Types for profile service */

export interface CreateProfileParams {
  displayName: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: 'male' | 'female' | 'other';
  bio?: string;
  avatarUrls: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  playStyle: 'competitive' | 'casual' | 'social';
  lookingFor: ('opponent' | 'doubles_partner' | 'dating')[];
  availability?: Record<string, string[]>;
  preferredLat?: number;
  preferredLng?: number;
  preferredAddress?: string;
}

export interface UpdateProfileParams {
  displayName?: string;
  bio?: string;
  avatarUrls?: string[];
  skillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  playStyle?: 'competitive' | 'casual' | 'social';
  lookingFor?: ('opponent' | 'doubles_partner' | 'dating')[];
  availability?: Record<string, string[]>;
  preferredLat?: number;
  preferredLng?: number;
  preferredAddress?: string;
}

export interface UserProfile {
  id: string;
  created_at: string;
  updated_at: string;
  email?: string;
  phone?: string;
  display_name: string;
  date_of_birth: string;
  gender: string;
  bio?: string;
  avatar_urls: string[];
  skill_level: string;
  play_style: string;
  looking_for: string[];
  availability?: Record<string, string[]>;
  preferred_address?: string;
  phone_verified: boolean;
  email_verified: boolean;
  matches_count: number;
  games_played: number;
  average_rating: number;
  is_online: boolean;
  last_active: string;
  profile_complete: boolean;
  is_active: boolean;
}
