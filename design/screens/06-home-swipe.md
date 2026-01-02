# Home - Swipe Matching Screen

## Screen Overview
Core screen của app - cho phép user duyệt qua profile cards của các players khác và swipe left (skip) hoặc right (like) để tìm matches. Card-based UI với smooth animations, gesture support, và "It's a Match!" celebration khi cả hai like nhau. User có thể adjust filters để tìm partners phù hợp hơn.

## Mục đích
- Hiển thị profile cards của các potential matches theo priority ranking
- Cho phép user swipe left (skip) hoặc right (like) với mỗi profile
- Cung cấp action buttons cho users không muốn swipe
- Hiển thị full profile modal khi user tap vào card
- Show celebration animation khi match thành công
- Cho phép undo last swipe (1 lần)
- Hỗ trợ adjust discovery filters để expand/narrow search

---

## Các Section/Components Chính

### 1. Top Navigation Bar

**Mô tả**: Header với branding và action buttons

**Components**:

#### A. App Logo/Title
- **Position**: Center
- **Content**: "PickleBall Dating" logo hoặc icon
- **Style**: Brand colors, minimalist

#### B. Filter Button
- **Position**: Top-left
- **Icon**: Sliders icon (⚙️ hoặc filters icon)
- **Badge**: Red dot nếu có filters active (non-default)

#### C. Undo Button
- **Position**: Top-right
- **Icon**: Undo arrow icon (↶)
- **State**:
  - Enabled: Brand color, tappable
  - Disabled: Gray, không tappable (no recent swipe)

**Tương tác**:
- **Tap Filter button** → Open Filter Bottom Sheet (see Section 7)
- **Tap Undo button** (nếu enabled) → Restore last swiped card (see Flow 3)

**Animations**:
- Filter button: Ripple effect on tap
- Badge: Pulse animation nếu filters active
- Undo button: Rotate 180° when tap, scale down 0.95

---

### 2. Profile Card Stack

**Mô tả**: Stack of profile cards (chỉ hiển thị top card, nhưng có next card preview phía sau)

**Components**:

#### A. Card Stack Layout
- **Stack depth**: 3 cards visible
  - Card 1 (front): Full size, z-index highest
  - Card 2 (behind): 95% scale, slightly offset down/back
  - Card 3 (back): 90% scale, slightly offset down/back
- **Purpose**: Tạo depth cue, user thấy có next cards

#### B. Profile Card (Main Component)
**Layout**: Full-screen card với image background và info overlay

##### Top Section
- **Photo Carousel**: Full-screen background image
  - Swipe/Tap indicators (dots) nếu có multiple photos
  - Left/Right tap zones để navigate photos (không visible, chỉ functional)
  - **Tap left 1/3 screen** → Previous photo
  - **Tap right 1/3 screen** → Next photo
  - Photo pagination dots (top, small): e.g., "●○○○" (4 photos)

##### Bottom Overlay Section
- **Gradient overlay**: Linear gradient từ transparent → black (bottom 30% của card)
- **Info Container** (overlay bottom):

  **Row 1: Name & Age**
  - **Name**: Bold, large font (24-28px), white
  - **Age**: Regular font (20px), white
  - **Example**: "Sarah, 28"

  **Row 2: Skill & Distance**
  - **Skill Level Badge**:
    - Colored pill (green/yellow/orange/red based on level)
    - Icon + Text: e.g., "🟡 Intermediate"
  - **Distance Indicator**:
    - Text: "2.3 km away"
    - Icon: Location pin

  **Row 3: Play Style & Looking For** (chips)
  - **Play Style**: Chip với icon
    - Example: "🏆 Competitive"
  - **Looking For**: Chips (có thể nhiều)
    - Example: "⚔️ Opponent" + "❤️ Dating"

  **Row 4: Bio Preview** (nếu có)
  - **Text**: First 2 lines của bio (truncated)
  - **Style**: Italic, smaller font (14px), white with transparency
  - **Example**: "Love playing doubles on weekends. Always up for..."

**Tương tác**:

##### Swipe Gestures
1. **Swipe Left** (Skip):
   - **Trigger**: Drag card left > 25% screen width, release
   - **Animation**:
     - Card rotates -15° while dragging
     - "NOPE" text appears top-left corner (red, bold, scaled up)
     - On release → Card flies off screen left với acceleration
     - Fade out
     - Next card scales up to 100%, moves to front
   - **Haptic**: Light impact
   - **Result**: Record skip, load next profile

2. **Swipe Right** (Like):
   - **Trigger**: Drag card right > 25% screen width, release
   - **Animation**:
     - Card rotates +15° while dragging
     - "LIKE" text appears top-right corner (green, bold, scaled up)
     - On release → Card flies off screen right với acceleration
     - Heart particles burst animation (optional)
     - Fade out
     - Next card scales up
   - **Haptic**: Medium impact
   - **Result**: Record like, check for match (see Section 4)

3. **Drag Cancel**:
   - **Trigger**: Drag < 25% threshold, release
   - **Animation**: Card springs back to center với elastic bounce
   - **Haptic**: None
   - **Result**: No action

##### Tap Interactions
- **Tap center of card** → Open Full Profile Modal (see Section 6)
- **Tap left edge** → Previous photo (carousel)
- **Tap right edge** → Next photo (carousel)

**Validations**:
- Swipe threshold: 25% of screen width
- Rotation angle: Max ±30° during drag
- Velocity sensitivity: Fast swipe triggers earlier

**Animations**:
- **Drag**: Card follows finger với spring physics
- **Rotation**: Proportional to drag distance (realistic physics)
- **"LIKE"/"NOPE" text**: Opacity 0 → 1 based on drag amount
- **Stack transition**: Next card animates from 95% → 100% scale smoothly
- **60 FPS**: React Native Reanimated worklets

---

### 3. Action Buttons (Alternative to Swipe)

**Mô tả**: Fixed buttons bottom-center của screen (overlay trên card)

**Components**:

#### A. Button Layout
- **Container**: Horizontal row, 3 buttons
- **Position**: Bottom center, 80-100px từ bottom edge
- **Spacing**: 16-20px gap giữa buttons

#### B. Skip Button (Left)
- **Shape**: Circle (56px diameter)
- **Icon**: Red X (✕) icon, white
- **Background**: White với red border, shadow
- **Style**: Minimalist, clear

**Tương tác**:
- **Tap** → Trigger swipe left animation programmatically
- **Same result** as swipe left gesture
- **Haptic**: Light impact

**Animations**:
- Tap: Scale down 0.9 → 1.1 (bounce)
- Icon pulse on press

#### C. Info Button (Center)
- **Shape**: Circle (48px diameter) - slightly smaller
- **Icon**: Info icon (ⓘ) or sparkle (✨), blue
- **Background**: White với blue border, shadow

**Tương tác**:
- **Tap** → Open Full Profile Modal (same as tap card center)

**Animations**:
- Tap: Scale + rotate 360°

#### D. Like Button (Right)
- **Shape**: Circle (56px diameter)
- **Icon**: Green heart (❤️) icon, white
- **Background**: White với green border, shadow

**Tương tác**:
- **Tap** → Trigger swipe right animation programmatically
- **Same result** as swipe right gesture
- **Haptic**: Medium impact

**Animations**:
- Tap: Scale down 0.9 → 1.2 (bounce)
- Heart beat animation (pulse twice)

**Accessibility**:
- All buttons: Min 44pt touch targets
- VoiceOver labels: "Skip", "View Profile", "Like"
- Haptic feedback for blind users

---

### 4. "It's a Match!" Modal

**Mô tả**: Full-screen celebration modal khi both users liked each other

**Trigger**: Swipe right → API check → Mutual like detected

**Components**:

#### A. Background
- **Overlay**: Gradient (brand colors) với blur backdrop
- **Animations**:
  - Confetti particles falling from top (colorful)
  - Floating hearts animation (subtle)
  - Sparkle/shine effects

#### B. Content Section (Center)

##### Header
- **Text**: "It's a Match!" hoặc "🎉 Match!"
- **Font**: Very large, bold (32-36px)
- **Color**: White
- **Animation**: Scale in from 0 → 1 với elastic bounce

##### Profile Photos
- **Layout**: Two circular avatars side-by-side (overlap slightly)
  - Left: Current user's avatar
  - Right: Matched user's avatar
- **Size**: ~120px diameter each
- **Border**: White glow border
- **Animation**:
  - Fly in from left & right → Meet center
  - Slight bounce on collision
  - Rotate 360° slowly (continuous)

##### Match Info
- **Text**: Matched user's name + age
- **Example**: "You matched with Sarah, 28"
- **Font**: Medium (18px), white

#### C. Action Buttons (Bottom)

##### Primary Button: "Send Message"
- **Style**: Full-width, prominent (brand color)
- **Icon**: Chat bubble icon
- **Text**: "Send Message" hoặc "Say Hi!"

**Tương tác**:
- **Tap** → Navigate to Chat Screen (08-chat-screen.md) với pre-filled match
- **Close modal** → Open chat

**Animations**:
- Button pulse animation (attention-grabbing)

##### Secondary Button: "Keep Swiping"
- **Style**: Text button (no background)
- **Text**: "Keep Swiping" hoặc "Later"
- **Color**: White với transparency

**Tương tác**:
- **Tap** → Close modal với fade-out, return to swipe screen
- **Load next card**

**Animations**:
- Fade in buttons with stagger (Primary first, then Secondary)

**Accessibility**:
- VoiceOver: Auto-announce "It's a match with [Name]"
- Reduce motion: Disable confetti, keep core animations

---

### 5. Empty State (No More Profiles)

**Mô tả**: Hiển thị khi hết profiles trong queue

**Trigger**: Queue empty (no profiles match current filters)

**Components**:

#### A. Illustration
- **Visual**: Friendly empty state graphic
  - Example: Character with telescope looking
  - Or: Empty pickleball court illustration
- **Position**: Center screen

#### B. Message Section

##### Primary Text
- **Text**: "You've seen everyone nearby!"
- **Font**: Large, bold (24px)
- **Color**: Dark gray

##### Subtitle
- **Text**: "Check back later for new players, or adjust your filters to expand your search."
- **Font**: Regular (16px)
- **Color**: Medium gray

#### C. Action Buttons

##### Primary: "Adjust Filters"
- **Style**: Full-width button, brand color
- **Icon**: Filter/Sliders icon

**Tương tác**:
- **Tap** → Open Filter Bottom Sheet (Section 7)

##### Secondary: "Come Back Later"
- **Style**: Text button
- **Text**: "I'll wait"

**Tương tác**:
- **Tap** → Navigate to different tab (e.g., Matches or Courts)

**Animations**:
- Illustration: Subtle floating animation
- Buttons: Fade in from bottom

---

### 6. Full Profile Modal

**Mô tả**: Slide-up modal hiển thị full profile details khi user tap card hoặc info button

**Trigger**: Tap center of card OR tap Info button

**Components**:

#### A. Modal Container
- **Animation**: Slide up from bottom (full-screen)
- **Background**: White (hoặc dark mode background)
- **Gesture**: Swipe down để close

#### B. Header Section

##### Photo Gallery
- **Layout**: Full-width horizontal scroll/carousel
- **Images**: All profile photos (swipeable)
- **Pagination**: Dots indicator bottom
- **Gesture**: Swipe left/right để navigate

##### Close Button
- **Position**: Top-left overlay
- **Icon**: Down arrow (↓) or X
- **Style**: Circle với semi-transparent background

**Tương tác**:
- **Tap Close** → Dismiss modal với slide-down animation
- **Swipe down** → Dismiss modal

#### C. Profile Info Section (Scrollable)

##### Name & Age Row
- **Text**: "Sarah, 28"
- **Font**: Large, bold (28px)

##### Verification Badge (nếu có)
- **Icon**: Checkmark badge
- **Text**: "Verified"

##### Distance
- **Icon**: Location pin
- **Text**: "2.3 km away"

##### Skill Level
- **Badge**: Colored pill với icon
- **Text**: "🟡 Intermediate"

##### Play Style
- **Chip**: Icon + text
- **Text**: "🏆 Competitive"

##### Looking For
- **Chips**: Multiple tags
- **Text**: "⚔️ Opponent", "❤️ Dating"

##### Bio
- **Label**: "About"
- **Text**: Full bio (not truncated)
- **Font**: Regular (16px)

##### Availability (nếu có)
- **Label**: "When I'm Free"
- **Display**: List hoặc calendar-style view
- **Example**:
  - "Mon, Wed, Fri - Morning, Evening"
  - Calendar view với colored dots

##### Preferred Location (nếu có)
- **Label**: "Preferred Areas"
- **Text**: "District 1, HCMC"

#### D. Action Buttons (Bottom, sticky)

##### Primary: "Like" Button
- **Style**: Full-width, brand green color
- **Icon**: Heart icon
- **Text**: "Like"

**Tương tác**:
- **Tap** → Trigger like action (same as swipe right)
- **Close modal** → Show match modal if mutual like

##### Secondary: "Skip" Button
- **Style**: Full-width, outline red
- **Icon**: X icon
- **Text**: "Skip"

**Tương tác**:
- **Tap** → Trigger skip action (same as swipe left)
- **Close modal** → Load next card

**Animations**:
- Modal slide-up: 300ms ease-out
- Photo gallery: Smooth swipe transitions
- Buttons: Sticky at bottom, always visible

**Accessibility**:
- VoiceOver: Read full profile info
- Scroll support: All content accessible
- Gesture hints: "Swipe down to close"

---

### 7. Filter Bottom Sheet

**Mô tả**: Bottom sheet modal để adjust discovery filters

**Trigger**: Tap Filter button (top-left navigation)

**Components**:

#### A. Sheet Container
- **Height**: ~70% screen height (not full-screen)
- **Animation**: Slide up from bottom
- **Backdrop**: Semi-transparent dark overlay
- **Gesture**: Swipe down to dismiss

#### B. Header Section

##### Title
- **Text**: "Discovery Filters"
- **Font**: Bold (20px)

##### Close Button
- **Position**: Top-right
- **Icon**: X icon

##### Reset Button
- **Position**: Top-right (before Close)
- **Text**: "Reset" (text button)
- **Color**: Brand color

**Tương tác**:
- **Tap Reset** → Reset all filters to default values
- **Tap Close** → Dismiss sheet without saving

#### C. Filter Options (Scrollable Content)

##### 1. Distance Slider
- **Label**: "Maximum Distance"
- **Control**: Slider (1-50 km)
- **Current Value**: Display below slider (e.g., "25 km")
- **Default**: 25 km

##### 2. Age Range Slider
- **Label**: "Age Range"
- **Control**: Dual-handle range slider (18-60)
- **Current Value**: Display below (e.g., "22-35 years")
- **Default**: 18-60

##### 3. Skill Level Checkboxes
- **Label**: "Skill Levels"
- **Options**: Multi-select checkboxes
  - ☐ Beginner
  - ☐ Intermediate
  - ☐ Advanced
  - ☐ Pro
- **Default**: All checked

##### 4. Play Style Checkboxes (Optional)
- **Label**: "Play Styles"
- **Options**: Multi-select
  - ☐ Competitive
  - ☐ Casual
  - ☐ Social
- **Default**: All checked

##### 5. Looking For Checkboxes (Optional)
- **Label**: "Looking For"
- **Options**: Multi-select
  - ☐ Opponent
  - ☐ Doubles Partner
  - ☐ Dating
- **Default**: All checked

#### D. Preview Section
- **Label**: "Estimated Matches"
- **Display**: "~X profiles match your filters"
- **Update**: Real-time as user adjusts filters
- **API**: Quick count query

#### E. Apply Button (Bottom, sticky)
- **Style**: Full-width, brand color
- **Text**: "Apply Filters" hoặc "Show Matches"

**Tương tác**:
- **Tap Apply** → Save filter settings:
  - Store in user settings (persistent)
  - Refresh profile queue với new filters
  - Close sheet
  - Load new profiles
  - Show loading state briefly

**Validations**:
- Min distance: 1 km
- Max distance: 50 km
- Age range: 18-60
- At least 1 skill level selected

**Animations**:
- Sheet slide-up: 300ms ease-out
- Preview count update: Smooth number transition
- Apply button: Pulse when filters changed
- Slider handles: Smooth drag physics

**Accessibility**:
- VoiceOver: Announce current values
- Slider: Adjustable with +/- buttons (accessible alternative)
- Checkboxes: Clear labels

---

## Navigation

**Đến screen này từ**:
- **05-profile-setup.md** - After completing profile setup (first time users)
- **01-splash-screen.md** - Returning users with complete profile
- **Tab Navigation** - Home tab trong bottom tab bar (main entry point)
- **"It's a Match!" modal** - Tap "Keep Swiping" button

**Từ screen này đến**:
- **08-chat-screen.md** - Tap "Send Message" trong Match modal
- **07-matches-list.md** - Navigate via Matches tab trong bottom tab bar
- **09-court-discovery.md** - Navigate via Courts tab trong bottom tab bar
- **10-profile-me.md** - Navigate via Profile tab trong bottom tab bar
- **06-home-swipe.md (Filter Sheet)** - Tap Filter button (modal overlay, same screen)

---

## States

### Default State
- Profile cards loaded và visible (stack of 3)
- Action buttons visible và enabled
- Undo button disabled (no recent swipe)
- Filter button shows badge nếu filters active
- Navigation bar visible

### Loading State (Initial Load)
- **Trigger**: First time loading profiles
- **UI**:
  - Skeleton card animation (pulsing gradient)
  - "Finding players near you..." text
  - Spinner (centered)
- **Duration**: Until API returns profiles

### Loading State (Background Refresh)
- **Trigger**: Queue < 10 cards remaining
- **UI**: Minimal (không block UI)
  - Small loading indicator top-right corner
  - Preload next batch of profiles silently
- **User**: Can continue swiping

### Swiping State
- **Trigger**: User dragging card
- **UI**:
  - Card follows finger với rotation
  - "LIKE"/"NOPE" text overlay fades in/out
  - Haptic feedback proportional to drag
- **Duration**: Until release

### Post-Swipe Animation State
- **Trigger**: Card released past threshold
- **UI**:
  - Current card flies off screen
  - Next card animates to front (scale up)
  - Action buttons briefly disabled (prevent double-tap)
- **Duration**: ~300ms

### Match Modal State
- **Trigger**: Mutual like detected
- **UI**:
  - Full-screen modal overlays
  - Confetti animation
  - Buttons visible
- **Blocker**: User must interact to dismiss (tap button)

### Empty State
- **Trigger**: No profiles available (queue empty)
- **UI**:
  - Empty state illustration
  - Message text
  - "Adjust Filters" button
  - No cards visible
- **Action**: User adjusts filters hoặc waits

### Filter Sheet Open State
- **Trigger**: Tap Filter button
- **UI**:
  - Bottom sheet overlay
  - Main screen dimmed (backdrop)
  - Sheet controls interactive
  - Main screen not scrollable

### Full Profile Modal State
- **Trigger**: Tap card center or Info button
- **UI**:
  - Full-screen modal overlay
  - Scrollable profile content
  - Action buttons sticky bottom
  - Main screen not interactive

### Undo Active State
- **Trigger**: Recent swipe exists
- **UI**:
  - Undo button enabled (brand color)
  - Last swiped card stored in memory
- **Duration**: Until next swipe OR undo triggered

### Error States

#### Network Error (Load Profiles)
- **Trigger**: No internet khi fetch profiles
- **UI**:
  - Toast: "No internet. Please check connection."
  - Show cached profiles nếu có
  - Pull-to-refresh gesture enabled
- **Action**: User retry via pull-to-refresh

#### API Error (Swipe Not Recorded)
- **Trigger**: Server error khi record swipe
- **UI**: Không block user (silent fail)
  - Queue swipe locally
  - Retry in background
  - User continues swiping
- **Fallback**: Eventual consistency

#### Match Creation Failed
- **Trigger**: Server error khi create match
- **UI**:
  - Still show Match modal (optimistic)
  - Log error background
  - Retry silently
- **Note**: Match may appear delayed trong Matches tab

---

## Edge Cases

1. **User swipes chính mình**: Backend filter out trong query (shouldn't appear)
2. **Mutual block**: Both users không thấy nhau trong queue
3. **Profile bị delete mid-session**: Skip profile, load next (no error shown)
4. **Rapid swiping** (spam): Debounce API calls, batch swipes mỗi 5 swipes hoặc 30s
5. **User offline**:
   - Show cached cards (read-only)
   - Queue swipes locally
   - Sync khi reconnect
   - Toast: "You're offline. Swipes will sync later."
6. **Queue exhausted mid-session**: Background fetch more profiles
7. **User changes filters while swiping**: Refresh queue, discard current stack, load new profiles
8. **Undo after match created**: NOT ALLOWED (undo button disabled after match)
9. **Same person appears twice** (different sessions): Remember position trong queue via local storage
10. **User rapid tap like button**: Debounce, accept 1 tap per 500ms
11. **Profile photo failed to load**: Show placeholder avatar, profile still swipeable
12. **Match modal dismissed accidentally**: User can still access match trong Matches tab
13. **Filter preview count very slow**: Show "Calculating..." nếu > 2s
14. **Age exactly 18 in filters**: Valid, inclusive (>= 18)
15. **All filters unchecked**: Require at least 1 option selected (validation)

---

## Ghi chú

### UX Considerations
- **Swipe threshold (25%)**: Balance giữa easy swipe và accidental swipes
- **Card rotation physics**: Realistic feel increases engagement
- **"LIKE"/"NOPE" visual feedback**: Clear feedback prevents confusion
- **Action buttons**: Alternative cho users không quen swipe gestures
- **Match celebration**: Dopamine hit, positive reinforcement
- **Undo feature**: Safety net cho accidental swipes (limited to 1 để prevent abuse)
- **Preview next cards**: User thấy "có nhiều options", encouraged to continue
- **Empty state positivity**: "Come back later" thay vì "No one likes you"
- **Filter preview count**: Transparency về how filters affect results

### Animations & Performance
- **Target**: 60 FPS constant (no jank)
- **React Native Reanimated v4**: Use worklets cho card drag/swipe
  - Run animations on UI thread (không block JS thread)
  - Spring physics cho card bounce-back
  - Gesture Handler integration
- **Image optimization**:
  - Use thumbnails for cards (~400x600px)
  - Full resolution chỉ trong Full Profile Modal
  - Progressive/lazy loading
  - Cache images aggressively
- **Preloading**:
  - Preload next 5 cards' data
  - Preload next 3 cards' images
  - Background fetch khi queue < 10
- **Batch API calls**:
  - Fetch 50 profiles at once
  - Sync swipes mỗi 5 actions OR 30s interval
- **Animation durations**:
  - Swipe off-screen: 300ms
  - Next card scale-up: 200ms
  - Match modal appear: 400ms với stagger
  - Filter sheet slide: 300ms

### Validations & Error Handling
- **Swipe validation**: Check API connectivity, queue swipes if offline
- **Filter validation**: At least 1 option selected trong multi-selects
- **Profile data validation**: Skip cards với missing critical fields
- **Retry logic**: 3 attempts for swipe recording, exponential backoff
- **Optimistic UI**: Show match modal immediately, sync in background
- **Graceful degradation**: Show cached cards khi offline
- **User feedback**: Toasts cho errors, không block swiping flow

### Technical Notes

#### API Endpoints

##### GET /api/swipe/profiles
- **Purpose**: Fetch candidate profiles
- **Query Params**:
  ```json
  {
    "limit": 50,
    "filters": {
      "max_distance": 25,
      "min_age": 22,
      "max_age": 35,
      "skill_levels": ["intermediate", "advanced"],
      "play_styles": ["competitive", "casual"]
    }
  }
  ```
- **Response** (200):
  ```json
  {
    "profiles": [
      {
        "id": "uuid",
        "display_name": "Sarah",
        "age": 28,
        "avatar_urls": ["url1", "url2"],
        "skill_level": "intermediate",
        "play_style": "competitive",
        "looking_for": ["opponent", "dating"],
        "bio": "Love playing...",
        "distance_km": 2.3,
        "availability": {...}
      }
    ],
    "has_more": true
  }
  ```

##### POST /api/swipe/action
- **Purpose**: Record swipe action
- **Body**:
  ```json
  {
    "target_user_id": "uuid",
    "action": "like", // or "skip"
    "timestamp": "2025-12-30T12:00:00Z"
  }
  ```
- **Response** (200):
  ```json
  {
    "success": true,
    "matched": false // or true if mutual like
  }
  ```
- **Response if Match** (200):
  ```json
  {
    "success": true,
    "matched": true,
    "conversation_id": "uuid",
    "match": {
      "id": "uuid",
      "user": {
        "id": "uuid",
        "display_name": "Sarah",
        "avatar_url": "url"
      },
      "matched_at": "2025-12-30T12:00:00Z"
    }
  }
  ```

##### POST /api/swipe/undo
- **Purpose**: Undo last swipe
- **Body**:
  ```json
  {
    "swipe_id": "uuid"
  }
  ```
- **Response** (200):
  ```json
  {
    "success": true,
    "restored_profile": {...}
  }
  ```

##### GET /api/filters/count
- **Purpose**: Preview count for filter settings
- **Query Params**: Same as /profiles
- **Response** (200):
  ```json
  {
    "count": 47
  }
  ```

#### State Management
- **Global State** (Zustand/Redux):
  - `currentProfileQueue`: Array of profiles
  - `currentCardIndex`: 0
  - `lastSwipe`: { swipeId, profileId, action, timestamp }
  - `filters`: { maxDistance, ageRange, skillLevels, ... }
  - `matchModal`: { visible, matchData }
- **Local State** (React):
  - `isDragging`: boolean
  - `dragOffset`: { x, y }
  - `cardRotation`: number
  - `filterSheetOpen`: boolean
  - `fullProfileOpen`: boolean
- **Persistence** (AsyncStorage):
  - `swipe_filters`: JSON of filter settings
  - `swipe_queue_position`: Remember position for returning users

#### Image Handling
- **Thumbnail generation**: Backend resizes to ~400x600px, 80% quality
- **CDN**: Supabase Storage với CDN caching
- **Progressive loading**: Show blurred placeholder → full image
- **Image caching**: react-native-fast-image (aggressive cache policy)
- **Fallback**: Default avatar nếu image failed

#### Matching Algorithm Integration
- **Backend scoring**: Profiles pre-scored và sorted by priority (see F03 activity diagram)
- **Client**: Chỉ hiển thị, không logic scoring
- **Ranking weights**:
  - W1 (35%): Availability overlap
  - W2 (30%): Distance
  - W3 (20%): Skill level match
  - W4 (15%): Activity score
- **Hard filters applied first**: Distance, age, already swiped, blocked

#### Push Notifications Integration
- When match created → Send push to both users (via F08)
- Notification deep link → Open Chat Screen (08-chat-screen.md)
- In-app: Match modal appears immediately

### Design Specs

#### Card Stack Layout
- **Card 1 (front)**: 100% size, z-index 3
- **Card 2**: 95% size, z-index 2, offset Y +8px
- **Card 3**: 90% size, z-index 1, offset Y +16px
- **Corner radius**: 16px
- **Shadow**: elevation 8 (Android), shadowRadius 12 (iOS)

#### Profile Card
- **Dimensions**: Full screen width - 32px margins (16px each side), height ~70% viewport
- **Image aspect ratio**: 3:4 (portrait)
- **Gradient overlay**: Linear gradient 0% opacity (top) → 80% opacity black (bottom)
- **Info padding**: 20px từ bottom & sides

#### Typography
- **Name**: 28px, Bold, White
- **Age**: 20px, Regular, White
- **Skill badge**: 14px, Medium
- **Distance**: 14px, Regular, White opacity 90%
- **Play style/Looking for**: 12px, Medium
- **Bio preview**: 14px, Italic, White opacity 80%

#### Action Buttons
- **Skip button**: 56px diameter, Red #E53E3E
- **Info button**: 48px diameter, Blue #3B82F6
- **Like button**: 56px diameter, Green #38A169
- **Shadow**: elevation 4, shadowRadius 8
- **Icon size**: 24px (Skip/Like), 20px (Info)

#### Match Modal
- **Backdrop**: rgba(0,0,0,0.6) với blur 10px
- **Avatar size**: 120px diameter
- **Avatar overlap**: -20px (slight overlap)
- **Title font**: 36px, Bold
- **Button height**: 48px
- **Confetti particles**: ~50 particles, random colors

#### Filter Sheet
- **Height**: 70% viewport (max-height)
- **Border radius**: 20px (top corners only)
- **Backdrop**: rgba(0,0,0,0.4)
- **Slider track height**: 4px
- **Slider thumb**: 24px diameter
- **Checkbox size**: 20px

#### Colors
- **Brand Primary**: #FF6B35 (orange)
- **Success/Like**: #38A169 (green)
- **Error/Skip**: #E53E3E (red)
- **Info**: #3B82F6 (blue)
- **Background**: #FFFFFF (light mode), #1A202C (dark mode)
- **Text Primary**: #2D3748
- **Text Secondary**: #718096

#### Animations
- **Swipe threshold**: 25% screen width OR velocity > 800px/s
- **Rotation range**: -30° to +30°
- **Fly-off speed**: 400px/s
- **Spring config**: { damping: 15, stiffness: 150 }
- **Gesture responsiveness**: 16ms (60fps)

### Accessibility
- **VoiceOver/TalkBack**:
  - Announce profile info: "Sarah, 28, Intermediate player, 2.3 km away"
  - Announce actions: "Liked Sarah", "Skipped profile"
  - Match announcement: "It's a match with Sarah!"
- **Touch targets**: All buttons min 44×44pt
- **Color contrast**: WCAG AA compliant (4.5:1 for text)
- **Reduce motion**: Option to disable animations (keep essential transitions)
- **Keyboard navigation**: Support for external keyboards (rare on mobile)
- **Haptic feedback**: Light/medium impacts for tactile feedback (accessibility aid)

### Performance Benchmarks
- **Card swipe animation**: Maintain 60 FPS (no frame drops)
- **Image load time**: < 1s per card (with fast connection)
- **API response**: < 500ms (P95 for profile fetch)
- **Filter count query**: < 1s
- **Memory usage**: < 200MB for queue of 50 profiles
- **Battery impact**: Minimal (animations on UI thread, efficient rendering)

### Analytics Tracking
Track events:
- `screen_view`: Home Swipe Screen
- `swipe_left`: target_user_id, position_in_queue
- `swipe_right`: target_user_id, position_in_queue
- `swipe_undo`: swipe_id
- `match_created`: match_id, matched_user_id
- `match_message_tap`: match_id (navigate to chat)
- `match_keep_swiping_tap`: match_id
- `full_profile_opened`: target_user_id
- `full_profile_like`: target_user_id (from modal)
- `full_profile_skip`: target_user_id (from modal)
- `filter_opened`: current_filters
- `filter_applied`: new_filters, estimated_count
- `filter_reset`: previous_filters
- `empty_state_shown`: filters_active
- `empty_state_adjust_filters`: action

### Security Considerations
- **Profile data**: Only show profiles user has permission to see (backend enforced)
- **Rate limiting**: Max 100 swipes per user per hour (prevent spam/bots)
- **Block/Report**: User không thấy blocked profiles trong queue
- **Privacy**: Distance rounded to 1 decimal (e.g., 2.3 km) để prevent exact location tracking
- **Image URLs**: Signed URLs với expiry (Supabase Storage security)
- **API authentication**: All endpoints require valid JWT token

### Future Enhancements
- **Super Like**: Swipe up gesture, limited to 1/day (premium feature)
- **Rewind**: Unlimited undo với premium subscription
- **Passport**: Change location to swipe in other cities
- **Boost**: Appear at top of other users' queues for 30 min
- **Smart Photos**: Auto-reorder photos based on engagement
- **Filters for premium**: More granular filters (e.g., "Only weekday players")
- **Profile prompts**: Answer questions like "My ideal match is..."
- **Video profiles**: 15s video clips trong profile
- **Looping animations**: Subtle animations on photos (Boomerang style)
