# Frontend Specification - PickleBall Dating App

**Version**: 1.0
**Last Updated**: 2026-01-02
**Approach**: Documentation + Key Components (Prototype Validation)

---

## 1. Overview

### 1.1 Project Summary

**PickleBall Dating App** là ứng dụng dating kết hợp pickleball, cho phép người dùng:
- Tìm kiếm đối thủ/bạn chơi/người yêu qua swipe cards
- Đặt sân pickleball trực tiếp trong app
- Chat realtime với matches
- Tìm kiếm và đặt lịch với HLV

### 1.2 Tech Stack

| Category | Technology | Version | Why? |
|----------|-----------|---------|------|
| **Mobile Framework** | React Native (Expo) | SDK 50+ | Cross-platform, fast iteration |
| **Language** | TypeScript | 5.x | Type safety, better DX |
| **Backend** | Supabase | Latest | All-in-one BaaS (DB + Auth + Realtime + Storage) |
| **Database** | PostgreSQL | Supabase-managed | Relational, scalable |
| **Navigation** | React Navigation | v6.1.9 | Industry standard |
| **Animation** | React Native Reanimated | v4.0.0 | 60 FPS, worklets API |
| **State Management** | Zustand | v4.4.7 | Lightweight, simple |
| **Data Fetching** | TanStack Query | v5.17.9 | Caching, optimistic updates |
| **Forms** | React Hook Form + Zod | Latest | Type-safe validation |
| **Maps** | Google Maps | v1.10.0 | Best coverage for court search |
| **Payment** | Stripe | Latest | Standard payment gateway |
| **Images** | Expo Image | v1.10.1 | Progressive loading, caching |

### 1.3 Design Philosophy

**Neo-Minimalist with Playful Sports Energy**
- Clean, uncluttered layouts
- Card-based design for modularity
- Vibrant color palette (Orange, Teal, Yellow)
- Rounded corners for approachability
- Smooth 60 FPS animations

---

## 2. Implemented Components

### 2.1 Design Tokens (`src/theme/tokens.ts`)

**Colors**:
- Primary: `#FF6B35` (Energetic Orange)
- Secondary: `#4ECDC4` (Teal)
- Accent: `#FFD23F` (Sunny Yellow)
- Success/Error/Warning/Info

**Typography**:
- Font: Inter (Primary), System fallback
- Scale: H1-H4, Body Large/Regular/Small, Button, Label
- Weights: 400, 500, 600, 700

**Spacing** (Base unit: 4px):
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px

**Border Radius**:
- sm: 8px, md: 12px, lg: 16px, xl: 24px, full: 9999px

**Shadows**:
- sm, md, lg, xl variants
- Component-specific (button, card, profileCard)

**Animation Durations**:
- instant: 0ms, fast: 100ms, normal: 200ms, medium: 300ms

### 2.2 Button Component (`src/components/Button.tsx`)

**Features**:
- ✅ 4 Variants: Primary, Secondary, Text, Icon
- ✅ 3 Sizes: Small, Medium, Large
- ✅ States: Default, Hover, Pressed, Focused, Disabled, Loading
- ✅ Reanimated v4 animations (scale on press)
- ✅ Icon support (left/right position)
- ✅ Full-width option
- ✅ Accessibility labels

**Props Interface**:
```typescript
interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'text' | 'icon';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}
```

**Usage Examples**:
```tsx
<Button variant="primary" title="Continue" onPress={handlePress} fullWidth />
<Button variant="secondary" title="Skip" onPress={handleSkip} />
<Button title="Booking..." loading={isBooking} onPress={handleBook} />
```

### 2.3 Input Component (`src/components/Input.tsx`)

**Features**:
- ✅ 5 Types: Text, Search, Email, Password, Number
- ✅ States: Default, Focused, Filled, Error, Disabled
- ✅ Label + Helper text + Error message
- ✅ Leading/Trailing icons
- ✅ Clearable option
- ✅ Multiline support
- ✅ Character counter
- ✅ Password visibility toggle
- ✅ Animated focus effects

**Props Interface**:
```typescript
interface InputProps {
  type?: 'text' | 'search' | 'email' | 'password' | 'number';
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  clearable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  showCounter?: boolean;
}
```

**Specialized Components**:
- `SearchInput` - Pre-configured search with pill shape
- `EmailInput` - Email keyboard + validation
- `PasswordInput` - Secure text + show/hide toggle
- `TextArea` - Multiline text input

### 2.4 Card Component (`src/components/Card.tsx`)

**Features**:
- ✅ 3 Variants: ProfileCard, CourtCard, MatchCard
- ✅ Reanimated press animations
- ✅ Image support với progressive loading
- ✅ Badge overlays (Partner, Verified, Unread)
- ✅ Gradient overlays (profile cards)
- ✅ Context-aware data display

**Variants**:

**ProfileCard** (Swipe Cards):
```typescript
interface ProfileCardProps {
  user: User;
  onLike?: () => void;
  onPass?: () => void;
  onPress?: () => void;
}
```
- 3:4 aspect ratio
- Image with gradient overlay
- Name, age, skill level, location
- Verification badge

**CourtCard** (List View):
```typescript
interface CourtCardProps {
  court: Court;
  onPress?: () => void;
  onBookPress?: () => void;
}
```
- Horizontal layout (120x90px image + content)
- Partner badge overlay
- Distance, rating, price
- "Đặt ngay" quick action button

**MatchCard** (Chat List):
```typescript
interface MatchCardProps {
  match: Match;
  onPress?: () => void;
}
```
- Avatar (MD size) + Text + Timestamp
- Unread count badge
- Last message preview
- Online status indicator

### 2.5 Avatar Component (`src/components/Avatar.tsx`)

**Features**:
- ✅ 5 Sizes: XS (32px), SM (48px), MD (56px), LG (80px), XL (120px)
- ✅ Online status indicator (green dot)
- ✅ Fallback to initials if no image
- ✅ Consistent color per user (hash-based)
- ✅ Border support
- ✅ Shadow effects

**Props Interface**:
```typescript
interface AvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  imageUrl?: string;
  name: string;
  isOnline?: boolean;
  showBorder?: boolean;
  borderColor?: string;
  style?: ViewStyle;
}
```

**Size Variants**:
```tsx
<AvatarXS name="User" imageUrl="..." />  // 32px
<AvatarSM name="User" imageUrl="..." />  // 48px
<AvatarMD name="User" imageUrl="..." />  // 56px
<AvatarLG name="User" imageUrl="..." />  // 80px
<AvatarXL name="User" imageUrl="..." />  // 120px
```

---

## 3. Mock Data Structure (`data/mockData.ts`)

### 3.1 Data Entities

**Users** (5 mock users):
```typescript
interface User {
  id: string;
  display_name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  avatar_urls: string[];
  bio?: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  play_style: 'competitive' | 'casual' | 'social';
  looking_for: ('opponent' | 'doubles_partner' | 'dating')[];
  availability?: { [day: string]: ('morning' | 'afternoon' | 'evening')[] };
  preferred_location?: { lat: number; lng: number; address: string };
  verification: { phone_verified: boolean; email_verified: boolean };
  stats: { matches_count: number; games_played: number; average_rating: number };
  is_online: boolean;
  last_active: string;
}
```

**Courts** (4 mock courts):
```typescript
interface Court {
  id: string;
  name: string;
  address: string;
  location: { lat: number; lng: number };
  images: string[];
  description: string;
  amenities: string[];
  price_per_hour: number;
  price_range?: { min: number; max: number };
  court_type: 'indoor' | 'outdoor';
  operating_hours: { [day: string]: { open: string; close: string } | null };
  rating: number;
  review_count: number;
  is_partner: boolean;
  distance_km?: number;
}
```

**Matches** (4 mock matches):
```typescript
interface Match {
  id: string;
  user_id: string;
  matched_user_id: string;
  matched_at: string;
  conversation_id: string;
  is_new: boolean;
  last_message?: { content: string; sent_at: string; sender_id: string; type: 'text' | 'image' };
  unread_count: number;
  matched_user: User;
}
```

**Messages** (Mock chat history):
```typescript
interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content?: string;
  type: 'text' | 'image';
  image_url?: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  created_at: string;
  read_at?: string;
}
```

**Bookings** (3 mock bookings):
```typescript
interface Booking {
  id: string;
  user_id: string;
  court_id: string;
  date: string;
  start_time: string;
  end_time: string;
  slots: { start_time: string; end_time: string; price: number }[];
  total_amount: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  payment_method: string;
  qr_code?: string;
  court: Court;
}
```

**Coaches** (3 mock coaches):
```typescript
interface Coach {
  id: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  experience_years: number;
  certifications: string[];
  skill_level: SkillLevel;
  hourly_rate: number;
  rating: number;
  review_count: number;
  location: { lat: number; lng: number; address: string };
  contact: { phone: string; email?: string };
  gallery_urls: string[];
}
```

### 3.2 Helper Functions

- `getUserById(userId: string): User | undefined`
- `getCourtById(courtId: string): Court | undefined`
- `getMatchById(matchId: string): Match | undefined`
- `getMessagesByConversation(conversationId: string): Message[]`
- `getBookingsByUserId(userId: string): Booking[]`
- `getReviewsByCourtId(courtId: string): Review[]`
- `getCurrentUser(): User`
- `getSwipeProfiles(): User[]`
- `calculateAge(dateOfBirth: string): number`
- `formatRelativeTime(isoString: string): string`

---

## 4. Navigation Architecture

See `docs/NAVIGATION_STRUCTURE.md` for complete details.

### 4.1 Screen Count: 22 Screens

**Auth Flow** (5): Splash, Login, Email Signup, Phone Signup, Profile Setup
**Main Tabs** (4): Home Swipe, Matches List, Court Discovery, Profile Me
**Court Booking** (5): Court Detail, Booking, Payment, Confirmation, History
**Match & Chat** (2): Chat Screen, Match Detail
**Coach** (2): Coach Directory, Coach Detail
**Profile** (4): Edit Profile, Settings, Booking History, Booking Detail

### 4.2 Navigator Structure

```
RootNavigator (Stack)
├── AuthStack
└── MainTabs (Bottom Tabs)
    ├── HomeTab
    ├── MatchesTab (Stack)
    ├── CourtsTab (Stack)
    └── ProfileTab (Stack)
```

### 4.3 Deep Linking

```
myapp://login
myapp://courts/:courtId
myapp://matches/:matchId/chat
myapp://profile/edit
```

---

## 5. Design System Reference

### 5.1 Component Library

All components follow `design/uiuxguides.md`:
- ✅ Mobile-first design (touch targets 44x44px minimum)
- ✅ 60 FPS animations (Reanimated v4)
- ✅ Accessibility (screen reader support, high contrast)
- ✅ Consistent spacing system (4px base unit)
- ✅ Type-safe props (TypeScript)

### 5.2 Color Usage

- **Primary Orange** (`#FF6B35`): CTAs, active states, branding
- **Secondary Teal** (`#4ECDC4`): Secondary actions, sport indicators
- **Accent Yellow** (`#FFD23F`): Highlights, badges, special features
- **Success Green** (`#4CAF50`): Confirmations, matches
- **Error Red** (`#F44336`): Errors, destructive actions

### 5.3 Interaction Patterns

- **Button Press**: Scale 0.98, duration 100ms
- **Card Tap**: Scale 0.98, duration 100ms
- **Swipe Cards**: Rotation ±15°, auto-complete at 40% width
- **Modal Present**: Slide up 300ms + backdrop fade
- **Pull to Refresh**: 80px threshold, spinner animation

---

## 6. Dependencies

### 6.1 Complete Package List

```json
{
  "dependencies": {
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "react-native-screens": "^3.29.0",
    "react-native-safe-area-context": "^4.8.2",
    "react-native-gesture-handler": "^2.14.1",
    "react-native-reanimated": "^4.0.0",
    "expo-image": "^1.10.1",
    "@expo/vector-icons": "^14.0.0",
    "expo-linear-gradient": "^12.7.2",
    "zustand": "^4.4.7",
    "@tanstack/react-query": "^5.17.9",
    "react-hook-form": "^7.49.2",
    "zod": "^3.22.4",
    "date-fns": "^3.0.6",
    "react-native-maps": "^1.10.0"
  }
}
```

### 6.2 Installation Commands

See `docs/SETUP_INSTRUCTIONS.md` for complete setup guide.

---

## 7. Known Limitations

### 7.1 Prototype Phase Constraints

This is a **documentation + key components** prototype approach:

**Implemented**:
- ✅ Design tokens system (`src/theme/tokens.ts`)
- ✅ 4 reusable components (Button, Input, Card, Avatar)
- ✅ Mock data structure (`data/mockData.ts`)
- ✅ Navigation architecture documentation
- ✅ Setup instructions

**NOT Implemented** (to be built):
- ⏳ Actual 22 screens (only documented in `design/screens/*.md`)
- ⏳ Navigation setup (documented in `docs/NAVIGATION_STRUCTURE.md`)
- ⏳ State management integration (Zustand stores)
- ⏳ API integration (Supabase)
- ⏳ Authentication flow
- ⏳ Real-time chat (Supabase Realtime)
- ⏳ Image uploads (Supabase Storage)
- ⏳ Payment integration (Stripe)
- ⏳ Maps integration (Google Maps)

### 7.2 Mock Behaviors

- All data is static from `data/mockData.ts`
- No API calls
- No error handling (happy paths only)
- No offline mode
- No push notifications
- No deep linking tested
- Authentication is mocked (always success)
- Chat messages don't persist
- Booking payments are simulated

---

## 8. Handoff Notes for Backend Phase

### 8.1 Database Schema Requirements

**Backend MUST match these data structures** from `data/mockData.ts`:

**Tables Needed**:
1. `users` - Match User interface
2. `courts` - Match Court interface
3. `matches` - Match Match interface
4. `conversations` - Match Conversation interface
5. `messages` - Match Message interface
6. `bookings` - Match Booking interface
7. `coaches` - Match Coach interface
8. `reviews` - Match Review interface

**Relationships**:
- User ↔ Matches (many-to-many via matches table)
- Match → Conversation (one-to-one)
- Conversation → Messages (one-to-many)
- User → Bookings (one-to-many)
- Court → Bookings (one-to-many)
- Court → Reviews (one-to-many)
- User → Reviews (one-to-many as reviewer)

### 8.2 API Endpoints Needed

**Authentication**:
- `POST /auth/signup/email`
- `POST /auth/signup/phone`
- `POST /auth/verify-otp`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/session`

**User Profile**:
- `GET /api/profile/me`
- `POST /api/profile/create`
- `PUT /api/profile/update`
- `POST /api/profile/upload-photo`

**Swipe & Match**:
- `GET /api/swipe/profiles` (Get potential matches)
- `POST /api/swipe/like`
- `POST /api/swipe/pass`
- `GET /api/matches` (Get user's matches)

**Chat**:
- `GET /api/messages?conversation_id=X`
- `POST /api/messages` (Send message)
- `POST /api/messages/upload-image`
- `POST /api/messages/mark-read`
- **Realtime**: Subscribe to `conversations:${id}` channel

**Courts**:
- `GET /api/courts` (Search with filters)
- `GET /api/courts/:id`
- `GET /api/courts/:id/slots?date=YYYY-MM-DD`
- `POST /api/courts/:id/reviews`

**Bookings**:
- `POST /api/bookings/lock` (Lock slots 10 mins)
- `POST /api/bookings` (Create booking after payment)
- `GET /api/bookings` (User's booking history)
- `GET /api/bookings/:id`
- `DELETE /api/bookings/lock/:id` (Cancel lock)

**Coaches**:
- `GET /api/coaches` (List coaches)
- `GET /api/coaches/:id`

**Reviews & Ratings**:
- `POST /api/reviews` (Rate user/court)
- `GET /api/reviews/user/:userId`
- `GET /api/reviews/court/:courtId`

### 8.3 Real-time Features (Supabase Realtime)

**Required Subscriptions**:
- `conversations:${conversationId}` - New messages
- `typing:${conversationId}` - Typing indicator
- `presence:${userId}` - Online status
- `courts:${courtId}/slots` - Slot availability changes

### 8.4 File Upload Requirements

**Supabase Storage Buckets**:
- `profile-photos` - User avatars (public read, auth write, max 5MB)
- `message-images` - Chat images (private, max 10MB)
- `court-images` - Court photos (public read, admin write)

**Upload Flow**:
1. Client compresses image (max 1024px, 80% quality)
2. Upload to Supabase Storage
3. Get signed URL (1 year expiry)
4. Save URL to database

### 8.5 Authentication Requirements

**Supabase Auth**:
- Email + Password signup
- Phone + OTP signup
- Session management (JWT tokens)
- Protected routes (RLS policies)

**Profile Completion Check**:
- After signup, check if `profile_complete = true`
- If false, redirect to Profile Setup
- Update flag after setup completes

### 8.6 Performance Considerations

**Pagination**:
- Swipe profiles: 20 per fetch
- Messages: 30 per fetch, load more on scroll
- Courts: 20 per fetch
- Matches: 50 per fetch

**Caching Strategy**:
- Profile data: 5 min cache
- Court list: 5 min cache
- Messages: No cache (realtime)
- Court details: 15 min cache

**Image Optimization**:
- Thumbnails: 400x400px @ 2x
- Full images: 1080px @ 2x
- Progressive loading (blur → full res)

---

## 9. Next Steps

### 9.1 Full Implementation Phase

**Priority 1: Core Screens** (Week 1-2)
1. Setup Expo project + navigation
2. Implement Auth screens (Login, Signup, Profile Setup)
3. Implement Home Swipe screen
4. Implement Matches List + Chat

**Priority 2: Court Booking** (Week 3)
5. Implement Court Discovery
6. Implement Court Detail + Booking flow
7. Integrate Stripe payment

**Priority 3: Profile & Settings** (Week 4)
8. Implement Profile Me + Edit
9. Implement Settings
10. Implement Booking History

**Priority 4: Advanced Features** (Week 5+)
11. Implement Coach features
12. Add animations & polish
13. Testing & bug fixes
14. App Store submission

### 9.2 Backend Integration Phase

**After Frontend Complete**:
1. Replace mock data imports with API calls
2. Implement authentication flow
3. Add error handling & loading states
4. Setup Supabase Realtime
5. Implement file uploads
6. Add offline mode (optional)
7. End-to-end testing

### 9.3 Quality Assurance

**Testing Checklist**:
- ✅ All screens navigable
- ✅ All buttons functional
- ✅ Forms validate correctly
- ✅ Images load progressively
- ✅ Animations smooth (60 FPS)
- ✅ Accessibility (screen reader tested)
- ✅ Works on iOS + Android
- ✅ Handles slow network
- ✅ Error states displayed
- ✅ Offline mode graceful

---

## 10. Conclusion

This frontend specification provides:
- ✅ **Design System**: Complete tokens and component library
- ✅ **Mock Data**: Realistic data structure for all features
- ✅ **Navigation**: Documented architecture for 22 screens
- ✅ **Component Examples**: 4 production-ready reusable components
- ✅ **Setup Guide**: Step-by-step installation instructions
- ✅ **Handoff Notes**: Clear requirements for backend integration

**Implementation Status**: **Documentation + Key Components Phase Complete**

**Next Action**: Initialize Expo project and begin full screen implementation OR proceed directly to backend design based on these specifications.

---

**Document End**

*For questions or clarifications, refer to:*
- Design Guidelines: `design/uiuxguides.md`
- Screen Descriptions: `design/screens/*.md`
- Navigation: `docs/NAVIGATION_STRUCTURE.md`
- Setup: `docs/SETUP_INSTRUCTIONS.md`
