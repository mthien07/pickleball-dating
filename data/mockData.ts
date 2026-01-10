/**
 * Centralized Mock Data for PickleBall Dating App
 *
 * This file contains all mock data used throughout the frontend prototype.
 * Data structure matches backend schema design for seamless integration later.
 *
 * Data Categories:
 * - Users (Players & Coaches)
 * - Courts
 * - Matches
 * - Messages/Conversations
 * - Bookings
 * - Reviews/Ratings
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'pro';
export type PlayStyle = 'competitive' | 'casual' | 'social';
export type LookingFor = 'opponent' | 'doubles_partner' | 'dating';
export type Gender = 'male' | 'female' | 'other';
export type CourtType = 'indoor' | 'outdoor';
export type BookingStatus = 'confirmed' | 'completed' | 'cancelled';
export type MessageType = 'text' | 'image';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';
export type TimeSlot = 'morning' | 'afternoon' | 'evening';

export interface User {
  id: string;
  display_name: string;
  date_of_birth: string; // YYYY-MM-DD
  gender: Gender;
  avatar_urls: string[];
  bio?: string;
  skill_level: SkillLevel;
  play_style: PlayStyle;
  looking_for: LookingFor[];
  availability?: {
    [key: string]: TimeSlot[]; // e.g., "monday": ["morning", "evening"]
  };
  preferred_location?: {
    lat: number;
    lng: number;
    address: string;
  };
  preferences?: {
    interests?: string[];
    age_range?: { min: number; max: number };
    distance_km?: number;
  };
  verification: {
    phone_verified: boolean;
    email_verified: boolean;
  };
  stats: {
    matches_count: number;
    games_played: number;
    average_rating: number;
  };
  is_online: boolean;
  last_active: string; // ISO datetime
  created_at: string;
}

export interface Coach {
  id: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  experience_years: number;
  certifications: string[];
  skill_level: SkillLevel;
  hourly_rate: number; // VND
  rating: number;
  review_count: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  contact: {
    phone: string;
    email?: string;
  };
  gallery_urls: string[];
}

export interface Court {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  images: string[];
  description: string;
  amenities: string[];
  price_per_hour: number; // VND
  price_range?: {
    min: number;
    max: number;
  };
  court_type: CourtType;
  operating_hours: {
    [key: string]: { open: string; close: string } | null; // e.g., "monday": { open: "06:00", close: "22:00" }
  };
  rating: number;
  review_count: number;
  is_partner: boolean;
  distance_km?: number; // Calculated based on user location
}

export interface Match {
  id: string;
  user_id: string;
  matched_user_id: string;
  matched_at: string; // ISO datetime
  conversation_id: string;
  is_new: boolean;
  last_message?: {
    content: string;
    sent_at: string;
    sender_id: string;
    type: MessageType;
  };
  unread_count: number;
  matched_user: User;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content?: string;
  type: MessageType;
  image_url?: string;
  status: MessageStatus;
  created_at: string; // ISO datetime
  read_at?: string;
}

export interface Conversation {
  id: string;
  match_id: string;
  participants: string[]; // user IDs
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  court_id: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  slots: {
    start_time: string;
    end_time: string;
    price: number;
  }[];
  total_amount: number; // VND
  status: BookingStatus;
  payment_method: string;
  qr_code?: string;
  created_at: string;
  court: Court;
}

export interface Review {
  id: string;
  reviewer_id: string;
  reviewee_id?: string; // For user reviews
  court_id?: string; // For court reviews
  rating: number; // 1-5
  skill_accuracy?: number; // User review only
  attitude?: number; // User review only
  punctuality?: number; // User review only
  court_quality?: number; // Court review only
  service?: number; // Court review only
  cleanliness?: number; // Court review only
  comment?: string;
  images?: string[];
  created_at: string;
  reviewer: {
    display_name: string;
    avatar_url: string;
  };
}

// ============================================
// MOCK DATA
// ============================================

// Current logged-in user
export const CURRENT_USER_ID = 'user_me_001';

// Users (Players)
export const MOCK_USERS: User[] = [
  {
    id: CURRENT_USER_ID,
    display_name: 'John Doe',
    date_of_birth: '1995-01-15',
    gender: 'male',
    avatar_urls: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    ],
    bio: 'Love playing pickleball! Always up for a competitive match or casual game. Looking to improve my skills and meet new friends.',
    skill_level: 'intermediate',
    play_style: 'competitive',
    looking_for: ['opponent', 'dating'],
    availability: {
      monday: ['morning', 'evening'],
      wednesday: ['afternoon', 'evening'],
      friday: ['morning'],
    },
    preferred_location: {
      lat: 10.762622,
      lng: 106.660172,
      address: 'District 1, HCMC',
    },
    verification: {
      phone_verified: true,
      email_verified: true,
    },
    stats: {
      matches_count: 24,
      games_played: 12,
      average_rating: 4.8,
    },
    is_online: true,
    last_active: new Date().toISOString(),
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user_002',
    display_name: 'Sarah Chen',
    date_of_birth: '1997-03-22',
    gender: 'female',
    avatar_urls: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    ],
    bio: 'Beginner looking to learn and have fun! Weekends are best for me.',
    skill_level: 'beginner',
    play_style: 'social',
    looking_for: ['doubles_partner', 'dating'],
    availability: {
      saturday: ['morning', 'afternoon'],
      sunday: ['afternoon'],
    },
    preferred_location: {
      lat: 10.8231,
      lng: 106.6297,
      address: 'District 2, HCMC',
    },
    verification: {
      phone_verified: true,
      email_verified: false,
    },
    stats: {
      matches_count: 8,
      games_played: 3,
      average_rating: 4.5,
    },
    is_online: true,
    last_active: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 mins ago
    created_at: '2024-02-15T00:00:00Z',
  },
  {
    id: 'user_003',
    display_name: 'Mike Johnson',
    date_of_birth: '1990-07-10',
    gender: 'male',
    avatar_urls: ['https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400'],
    bio: "Advanced player. Let's have some intense matches!",
    skill_level: 'advanced',
    play_style: 'competitive',
    looking_for: ['opponent'],
    availability: {
      monday: ['evening'],
      tuesday: ['evening'],
      thursday: ['evening'],
    },
    preferred_location: {
      lat: 10.7769,
      lng: 106.7009,
      address: 'District 7, HCMC',
    },
    verification: {
      phone_verified: true,
      email_verified: true,
    },
    stats: {
      matches_count: 45,
      games_played: 32,
      average_rating: 4.9,
    },
    is_online: false,
    last_active: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    created_at: '2023-11-20T00:00:00Z',
  },
  {
    id: 'user_004',
    display_name: 'Emily Nguyen',
    date_of_birth: '1998-11-05',
    gender: 'female',
    avatar_urls: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400',
    ],
    bio: 'Pro player. Looking for partners to train with for upcoming tournaments.',
    skill_level: 'pro',
    play_style: 'competitive',
    looking_for: ['opponent', 'doubles_partner'],
    availability: {
      monday: ['morning', 'afternoon'],
      wednesday: ['morning', 'afternoon'],
      friday: ['morning', 'afternoon'],
    },
    preferred_location: {
      lat: 10.8142,
      lng: 106.6438,
      address: 'Binh Thanh District, HCMC',
    },
    verification: {
      phone_verified: true,
      email_verified: true,
    },
    stats: {
      matches_count: 78,
      games_played: 56,
      average_rating: 5.0,
    },
    is_online: true,
    last_active: new Date().toISOString(),
    created_at: '2023-08-10T00:00:00Z',
  },
  {
    id: 'user_005',
    display_name: 'David Lee',
    date_of_birth: '1992-04-18',
    gender: 'male',
    avatar_urls: ['https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400'],
    bio: 'Casual player, just here to have fun and stay active!',
    skill_level: 'intermediate',
    play_style: 'casual',
    looking_for: ['doubles_partner', 'dating'],
    availability: {
      saturday: ['morning', 'afternoon', 'evening'],
      sunday: ['morning', 'afternoon'],
    },
    preferred_location: {
      lat: 10.7627,
      lng: 106.6822,
      address: 'District 3, HCMC',
    },
    verification: {
      phone_verified: false,
      email_verified: true,
    },
    stats: {
      matches_count: 15,
      games_played: 7,
      average_rating: 4.3,
    },
    is_online: false,
    last_active: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    created_at: '2024-03-05T00:00:00Z',
  },
];

// Coaches
export const MOCK_COACHES: Coach[] = [
  {
    id: 'coach_001',
    display_name: 'Coach Alex Tran',
    avatar_url: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400',
    bio: 'Professional pickleball coach with 10 years of experience. Specialized in beginner to advanced training.',
    experience_years: 10,
    certifications: ['IPTPA Certified', 'PPR Certified Pro'],
    skill_level: 'pro',
    hourly_rate: 500000,
    rating: 4.9,
    review_count: 34,
    location: {
      lat: 10.762622,
      lng: 106.660172,
      address: 'District 1, HCMC',
    },
    contact: {
      phone: '+84 901 234 567',
      email: 'alex.tran@example.com',
    },
    gallery_urls: [
      'https://images.unsplash.com/photo-uNPt0rRy8I0?w=600&h=400&fit=crop&q=85',
      'https://images.unsplash.com/photo-kQHa8YGDKag?w=600&h=400&fit=crop&q=85',
      'https://images.unsplash.com/photo-lXVavaDO0zU?w=600&h=400&fit=crop&q=85',
    ],
  },
  {
    id: 'coach_002',
    display_name: 'Coach Maria Santos',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    bio: 'Former national champion. Specializing in competitive play and tournament preparation.',
    experience_years: 8,
    certifications: ['PPR Certified Pro', 'USAPA Certified'],
    skill_level: 'pro',
    hourly_rate: 600000,
    rating: 5.0,
    review_count: 28,
    location: {
      lat: 10.7769,
      lng: 106.7009,
      address: 'District 7, HCMC',
    },
    contact: {
      phone: '+84 902 345 678',
    },
    gallery_urls: [
      'https://images.unsplash.com/photo-eBnKgT__Bsg?w=600&h=400&fit=crop&q=85',
      'https://images.unsplash.com/photo-Bt-oCv_YI3E?w=600&h=400&fit=crop&q=85',
      'https://images.unsplash.com/photo-4W-8AZbpLSY?w=600&h=400&fit=crop&q=85',
    ],
  },
  {
    id: 'coach_003',
    display_name: 'Coach Tom Wilson',
    avatar_url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400',
    bio: "Patient and friendly coach for beginners. Let's learn the basics together!",
    experience_years: 5,
    certifications: ['IPTPA Certified'],
    skill_level: 'advanced',
    hourly_rate: 350000,
    rating: 4.7,
    review_count: 19,
    location: {
      lat: 10.8231,
      lng: 106.6297,
      address: 'District 2, HCMC',
    },
    contact: {
      phone: '+84 903 456 789',
      email: 'tom.wilson@example.com',
    },
    gallery_urls: [],
  },
];

// Courts
export const MOCK_COURTS: Court[] = [
  {
    id: 'court_001',
    name: 'Premium Pickleball Center',
    address: '123 Nguyen Hue St, District 1, HCMC',
    location: {
      lat: 10.7763,
      lng: 106.7011,
    },
    images: [
      'https://images.unsplash.com/photo-uNPt0rRy8I0?w=800&h=600&fit=crop&q=85',
      'https://images.unsplash.com/photo-kQHa8YGDKag?w=800&h=600&fit=crop&q=85',
      'https://images.unsplash.com/photo-4W-8AZbpLSY?w=800&h=600&fit=crop&q=85',
    ],
    description:
      'Modern indoor facility with 6 professional courts. Air-conditioned, well-lit, and equipped with all amenities.',
    amenities: ['Parking', 'Locker', 'Canteen', 'Equipment Rental', 'Showers', 'Wi-Fi'],
    price_per_hour: 200000,
    price_range: {
      min: 150000,
      max: 300000,
    },
    court_type: 'indoor',
    operating_hours: {
      monday: { open: '06:00', close: '22:00' },
      tuesday: { open: '06:00', close: '22:00' },
      wednesday: { open: '06:00', close: '22:00' },
      thursday: { open: '06:00', close: '22:00' },
      friday: { open: '06:00', close: '22:00' },
      saturday: { open: '07:00', close: '23:00' },
      sunday: { open: '07:00', close: '23:00' },
    },
    rating: 4.8,
    review_count: 156,
    is_partner: true,
    distance_km: 2.3,
  },
  {
    id: 'court_002',
    name: 'Green Valley Outdoor Courts',
    address: '456 Le Van Viet, District 9, HCMC',
    location: {
      lat: 10.8431,
      lng: 106.8098,
    },
    images: [
      'https://images.unsplash.com/photo-eBnKgT__Bsg?w=800&h=600&fit=crop&q=85',
      'https://images.unsplash.com/photo-Bt-oCv_YI3E?w=800&h=600&fit=crop&q=85',
      'https://images.unsplash.com/photo-fZqOfwe7meU?w=800&h=600&fit=crop&q=85',
    ],
    description: 'Beautiful outdoor courts surrounded by nature. Perfect for weekend games.',
    amenities: ['Parking', 'Canteen', 'Equipment Rental'],
    price_per_hour: 120000,
    court_type: 'outdoor',
    operating_hours: {
      monday: { open: '06:00', close: '20:00' },
      tuesday: { open: '06:00', close: '20:00' },
      wednesday: { open: '06:00', close: '20:00' },
      thursday: { open: '06:00', close: '20:00' },
      friday: { open: '06:00', close: '20:00' },
      saturday: { open: '06:00', close: '21:00' },
      sunday: { open: '06:00', close: '21:00' },
    },
    rating: 4.5,
    review_count: 82,
    is_partner: false,
    distance_km: 8.7,
  },
  {
    id: 'court_003',
    name: 'Central Sports Complex',
    address: '789 Tran Hung Dao, District 5, HCMC',
    location: {
      lat: 10.7539,
      lng: 106.6673,
    },
    images: [
      'https://images.unsplash.com/photo-lXVavaDO0zU?w=800&h=600&fit=crop&q=85',
      'https://images.unsplash.com/photo-3sSbRisCnmE?w=800&h=600&fit=crop&q=85',
      'https://images.unsplash.com/photo-rjWfNR_AC5g?w=800&h=600&fit=crop&q=85',
    ],
    description:
      'Multi-sport complex with dedicated pickleball courts. Great facilities and central location.',
    amenities: ['Parking', 'Locker', 'Showers', 'Equipment Rental', 'Pro Shop'],
    price_per_hour: 180000,
    price_range: {
      min: 180000,
      max: 250000,
    },
    court_type: 'indoor',
    operating_hours: {
      monday: { open: '07:00', close: '22:00' },
      tuesday: { open: '07:00', close: '22:00' },
      wednesday: { open: '07:00', close: '22:00' },
      thursday: { open: '07:00', close: '22:00' },
      friday: { open: '07:00', close: '22:00' },
      saturday: { open: '08:00', close: '23:00' },
      sunday: { open: '08:00', close: '22:00' },
    },
    rating: 4.6,
    review_count: 94,
    is_partner: true,
    distance_km: 4.1,
  },
  {
    id: 'court_004',
    name: 'Sunrise Pickleball Club',
    address: '321 Vo Van Kiet, District 6, HCMC',
    location: {
      lat: 10.7489,
      lng: 106.6363,
    },
    images: [
      'https://images.unsplash.com/photo-IHYoOsWkufQ?w=800&h=600&fit=crop&q=85',
      'https://images.unsplash.com/photo-lwt4fWTErN8?w=800&h=600&fit=crop&q=85',
      'https://images.unsplash.com/photo-Zsr07Zr4tzM?w=800&h=600&fit=crop&q=85',
    ],
    description: 'Friendly community court. Open early for morning players.',
    amenities: ['Parking', 'Equipment Rental', 'Canteen'],
    price_per_hour: 100000,
    court_type: 'outdoor',
    operating_hours: {
      monday: { open: '05:30', close: '19:00' },
      tuesday: { open: '05:30', close: '19:00' },
      wednesday: { open: '05:30', close: '19:00' },
      thursday: { open: '05:30', close: '19:00' },
      friday: { open: '05:30', close: '19:00' },
      saturday: { open: '06:00', close: '20:00' },
      sunday: { open: '06:00', close: '20:00' },
    },
    rating: 4.3,
    review_count: 47,
    is_partner: false,
    distance_km: 5.8,
  },
];

// Matches
export const MOCK_MATCHES: Match[] = [
  {
    id: 'match_001',
    user_id: CURRENT_USER_ID,
    matched_user_id: 'user_002',
    matched_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    conversation_id: 'conv_001',
    is_new: false,
    last_message: {
      content: "Hey! Let's play this weekend?",
      sent_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      sender_id: 'user_002',
      type: 'text',
    },
    unread_count: 3,
    matched_user: MOCK_USERS.find((u) => u.id === 'user_002')!,
  },
  {
    id: 'match_002',
    user_id: CURRENT_USER_ID,
    matched_user_id: 'user_003',
    matched_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    conversation_id: 'conv_002',
    is_new: false,
    last_message: {
      content: 'Great match yesterday!',
      sent_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      sender_id: CURRENT_USER_ID,
      type: 'text',
    },
    unread_count: 0,
    matched_user: MOCK_USERS.find((u) => u.id === 'user_003')!,
  },
  {
    id: 'match_003',
    user_id: CURRENT_USER_ID,
    matched_user_id: 'user_004',
    matched_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    conversation_id: 'conv_003',
    is_new: true,
    unread_count: 0,
    matched_user: MOCK_USERS.find((u) => u.id === 'user_004')!,
  },
  {
    id: 'match_004',
    user_id: CURRENT_USER_ID,
    matched_user_id: 'user_005',
    matched_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    conversation_id: 'conv_004',
    is_new: false,
    last_message: {
      content: 'Thanks for the game!',
      sent_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      sender_id: 'user_005',
      type: 'text',
    },
    unread_count: 1,
    matched_user: MOCK_USERS.find((u) => u.id === 'user_005')!,
  },
];

// Conversations & Messages
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_001',
    match_id: 'match_001',
    participants: [CURRENT_USER_ID, 'user_002'],
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'conv_002',
    match_id: 'match_002',
    participants: [CURRENT_USER_ID, 'user_003'],
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'conv_003',
    match_id: 'match_003',
    participants: [CURRENT_USER_ID, 'user_004'],
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'conv_004',
    match_id: 'match_004',
    participants: [CURRENT_USER_ID, 'user_005'],
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_MESSAGES: Message[] = [
  // Conversation 1 (with Sarah)
  {
    id: 'msg_001',
    conversation_id: 'conv_001',
    sender_id: CURRENT_USER_ID,
    content: 'Hi Sarah! Nice to match with you 😊',
    type: 'text',
    status: 'read',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg_002',
    conversation_id: 'conv_001',
    sender_id: 'user_002',
    content: 'Hi John! Thanks, excited to play with you!',
    type: 'text',
    status: 'read',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString(),
    read_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg_003',
    conversation_id: 'conv_001',
    sender_id: CURRENT_USER_ID,
    content: 'What days work best for you?',
    type: 'text',
    status: 'read',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000).toISOString(),
    read_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg_004',
    conversation_id: 'conv_001',
    sender_id: 'user_002',
    content: "Hey! Let's play this weekend?",
    type: 'text',
    status: 'delivered',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  // Conversation 2 (with Mike)
  {
    id: 'msg_005',
    conversation_id: 'conv_002',
    sender_id: 'user_003',
    content: 'Ready for an intense match?',
    type: 'text',
    status: 'read',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    read_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg_006',
    conversation_id: 'conv_002',
    sender_id: CURRENT_USER_ID,
    content: 'Absolutely! When are you free?',
    type: 'text',
    status: 'read',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
    read_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg_007',
    conversation_id: 'conv_002',
    sender_id: CURRENT_USER_ID,
    content: 'Great match yesterday!',
    type: 'text',
    status: 'read',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read_at: new Date(Date.now() - 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
  },
];

// Bookings
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'booking_001',
    user_id: CURRENT_USER_ID,
    court_id: 'court_001',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
    start_time: '18:00',
    end_time: '20:00',
    slots: [
      { start_time: '18:00', end_time: '19:00', price: 250000 },
      { start_time: '19:00', end_time: '20:00', price: 250000 },
    ],
    total_amount: 500000,
    status: 'confirmed',
    payment_method: 'credit_card',
    qr_code: 'QR_CODE_DATA_PLACEHOLDER',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    court: MOCK_COURTS.find((c) => c.id === 'court_001')!,
  },
  {
    id: 'booking_002',
    user_id: CURRENT_USER_ID,
    court_id: 'court_002',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
    start_time: '08:00',
    end_time: '09:00',
    slots: [{ start_time: '08:00', end_time: '09:00', price: 120000 }],
    total_amount: 120000,
    status: 'completed',
    payment_method: 'momo',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    court: MOCK_COURTS.find((c) => c.id === 'court_002')!,
  },
  {
    id: 'booking_003',
    user_id: CURRENT_USER_ID,
    court_id: 'court_003',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days ago
    start_time: '10:00',
    end_time: '12:00',
    slots: [
      { start_time: '10:00', end_time: '11:00', price: 180000 },
      { start_time: '11:00', end_time: '12:00', price: 180000 },
    ],
    total_amount: 360000,
    status: 'completed',
    payment_method: 'zalopay',
    created_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    court: MOCK_COURTS.find((c) => c.id === 'court_003')!,
  },
];

// Reviews
export const MOCK_REVIEWS: Review[] = [
  // Court reviews
  {
    id: 'review_001',
    reviewer_id: CURRENT_USER_ID,
    court_id: 'court_001',
    rating: 5,
    court_quality: 5,
    service: 5,
    cleanliness: 4,
    comment: 'Excellent facility! Clean courts and friendly staff. Highly recommend!',
    images: [],
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    reviewer: {
      display_name: 'John Doe',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
  },
  {
    id: 'review_002',
    reviewer_id: 'user_002',
    court_id: 'court_001',
    rating: 4,
    court_quality: 4,
    service: 5,
    cleanliness: 4,
    comment: 'Great courts but can get crowded on weekends.',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    reviewer: {
      display_name: 'Sarah Chen',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    },
  },
  // User reviews
  {
    id: 'review_003',
    reviewer_id: 'user_003',
    reviewee_id: CURRENT_USER_ID,
    rating: 5,
    skill_accuracy: 5,
    attitude: 5,
    punctuality: 5,
    comment: 'Great player! Very skilled and friendly. Would play again!',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    reviewer: {
      display_name: 'Mike Johnson',
      avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400',
    },
  },
];

// Helper functions to get data
export const getUserById = (userId: string): User | undefined => {
  return MOCK_USERS.find((user) => user.id === userId);
};

export const getCourtById = (courtId: string): Court | undefined => {
  return MOCK_COURTS.find((court) => court.id === courtId);
};

export const getMatchById = (matchId: string): Match | undefined => {
  return MOCK_MATCHES.find((match) => match.id === matchId);
};

export const getMessagesByConversation = (conversationId: string): Message[] => {
  return MOCK_MESSAGES.filter((msg) => msg.conversation_id === conversationId);
};

export const getBookingsByUserId = (userId: string): Booking[] => {
  return MOCK_BOOKINGS.filter((booking) => booking.user_id === userId);
};

export const getReviewsByCourtId = (courtId: string): Review[] => {
  return MOCK_REVIEWS.filter((review) => review.court_id === courtId);
};

export const getCurrentUser = (): User => {
  return MOCK_USERS.find((user) => user.id === CURRENT_USER_ID)!;
};

// Generate swipe profiles (users that current user hasn't matched with yet)
export const getSwipeProfiles = (): User[] => {
  const matchedUserIds = MOCK_MATCHES.map((m) => m.matched_user_id);
  return MOCK_USERS.filter(
    (user) => user.id !== CURRENT_USER_ID && !matchedUserIds.includes(user.id)
  );
};

// Calculate age from date of birth
export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Format relative time
export const formatRelativeTime = (isoString: string): string => {
  const now = new Date();
  const date = new Date(isoString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Now';
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays === 1) {
    return 'Yesterday';
  }
  if (diffDays < 7) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  }
  return `${date.getMonth() + 1}/${date.getDate()}`;
};
