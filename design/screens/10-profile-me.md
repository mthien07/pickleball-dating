# Profile Me Screen

## Screen Overview
Screen hiển thị profile của chính user, cho phép xem, chỉnh sửa và preview profile như người khác sẽ thấy. Đây là tab chính trong bottom navigation, cung cấp quick access đến settings, edit profile, và hiển thị stats/achievements của user.

## Mục đích
- Hiển thị đầy đủ profile information của user
- Cho phép user edit profile với quick access button
- Hiển thị stats và achievements (matches count, games played, rating)
- Preview profile như người khác thấy (validation before others see)
- Hiển thị profile completion progress nếu chưa đầy đủ
- Quick access đến Settings

---

## Các Section/Components Chính

### 1. Header Section
**Mô tả**: Fixed header với navigation và action buttons

**Components**:

#### A. Header Bar
- **Background**: Transparent over photo, gradient overlay từ top (dark fade)
- **Height**: 56px + status bar
- **Layout**: Left action | Title | Right actions

#### B. Settings Icon (Top Left)
- **Icon**: Gear/Settings icon
- **Size**: 24×24px
- **Style**: White với subtle shadow (để visible trên photo)
- **Touch Target**: 44×44pt

**Tương tác**:
- **Tap icon** → Navigate to **20-settings.md**

**Animations**:
- Icon ripple effect on tap
- Haptic feedback

#### C. Title (Center)
- **Text**: "My Profile" hoặc "Profile"
- **Style**: Medium weight, 17px, white color
- **Visibility**: Only visible khi scroll down (fade-in after hero photo)

#### D. Edit Button (Top Right)
- **Text**: "Edit" hoặc Edit icon (pencil)
- **Style**: White text/icon với subtle shadow
- **Touch Target**: 44×44pt

**Tương tác**:
- **Tap button** → Navigate to **21-edit-profile.md**

**Animations**:
- Button ripple effect on tap
- Haptic feedback

---

### 2. Hero Photo Section
**Mô tả**: Full-width hero image với user's main photo và gradient overlay

**Components**:

#### A. Main Photo Display
- **Layout**: Full-width, 16:9 aspect ratio (hoặc square tùy design choice)
- **Height**: ~300px (responsive)
- **Image**: User's main photo (avatar_urls[0])
- **Overlay**: Gradient overlay bottom (dark → transparent) để text readable

#### B. Photo Indicator Dots (nếu có nhiều ảnh)
- **Position**: Bottom-center của hero section
- **Dots**: Tối đa 6 dots (1 dot = 1 photo)
- **Active Dot**: Larger/filled (current photo)
- **Inactive Dots**: Smaller/outline
- **Spacing**: 8px gap

**Tương tác**:
- **Swipe left/right** → Navigate qua các photos
- **Tap photo** → Open full-screen photo gallery (optional)

**Animations**:
- Photo swipe smooth transition (carousel)
- Dot indicator animate khi change photo
- Parallax scroll effect khi scroll page (photo scroll slower than content)

**States**:
- **1 photo**: No dots, no swipe
- **2-6 photos**: Show dots, swipeable
- **No photo** (edge case): Placeholder avatar với "Add Photo" prompt

---

### 3. Basic Info Section
**Mô tả**: Display name, age, location và verification badge

**Components**:

#### A. Name and Age
- **Layout**: Horizontal
- **Name**: Display name (bold, 28px)
- **Age**: Calculated từ DOB (regular, 24px, muted color)
- **Format**: "John, 28" hoặc "John Doe, 28"
- **Spacing**: 8px gap giữa name và age

#### B. Verification Badge
- **Icon**: Checkmark shield icon (hoặc verified badge)
- **Color**: Blue/green (verified color)
- **Position**: Next to name (inline)
- **Tooltip**: "Phone Verified" hoặc "Email Verified"

**Tương tác**:
- **Tap badge** → Show tooltip "Verified via [Phone/Email]"

**Animations**:
- Badge fade-in khi load
- Tooltip appear with scale animation

#### C. Location
- **Icon**: Pin/location icon (16px)
- **Text**: City/District (e.g., "District 1, HCMC")
- **Style**: Regular, 14px, muted color
- **Layout**: Icon + text horizontal

**Tương tác**:
- Static display (no interaction)

---

### 4. Photo Gallery Section
**Mô tả**: Horizontal scrollable grid hiển thị 1-6 photos

**Components**:

#### A. Section Header
- **Title**: "Photos" hoặc "Gallery"
- **Style**: Semibold, 18px
- **Count**: "4/6" (số ảnh hiện tại / max)
- **Spacing**: 16px top margin

#### B. Photo Grid
- **Layout**: Horizontal scrollable grid
- **Columns**: 3 photos visible, scroll để xem thêm
- **Photo Size**: Square, ~100px × 100px
- **Gap**: 8px spacing giữa photos
- **Border Radius**: 8px

**Tương tác**:
- **Swipe left/right** → Scroll through photos
- **Tap photo** → Open full-screen gallery viewer
- **If < 6 photos**: Hiển thị "Add Photo" slot (dashed border, + icon)
- **Tap "Add Photo"** → Navigate to **21-edit-profile.md** (Photos section)

**Animations**:
- Scroll smooth with momentum
- Photo tap scale animation → full-screen

**States**:
- **1 photo**: Only main photo, show "Add Photo" slots
- **2-5 photos**: Some empty slots với "+" icon
- **6 photos**: Full gallery, no empty slots

---

### 5. Pickleball Info Section
**Mô tả**: Skill level, play style, looking for, bio

**Components**:

#### A. Section Header
- **Title**: "About Me" hoặc "Pickleball Info"
- **Style**: Semibold, 18px
- **Spacing**: 24px top margin

#### B. Skill Level Badge
- **Layout**: Visual badge/chip
- **Icon**: Skill level icon (beginner/intermediate/advanced/pro)
- **Text**: "Intermediate" (example)
- **Color**: Color-coded theo level
  - Beginner: Green
  - Intermediate: Yellow
  - Advanced: Orange
  - Pro: Red
- **Style**: Badge với icon + text

**Tương tác**:
- Static display (no interaction in view mode)

**Animations**:
- Badge fade-in on load

#### C. Play Style Chip
- **Layout**: Chip với icon
- **Icon**: Trophy/Sunglasses/Handshake (tùy style)
- **Text**: "Competitive" / "Casual" / "Social"
- **Style**: Outline chip, brand color border

**Tương tác**:
- Static display

#### D. Looking For Tags
- **Layout**: Wrap layout, multiple chips
- **Tags**: Opponent / Doubles Partner / Dating / All
- **Icon**: Icon cho mỗi tag
  - Opponent: Swords icon
  - Doubles Partner: Team icon
  - Dating: Heart icon
  - All: Star icon
- **Style**: Filled chips, subtle background color

**Tương tác**:
- Static display (no interaction)

#### E. Bio Text
- **Label**: "Bio" hoặc "About"
- **Text**: User's bio (max 500 chars)
- **Style**: Regular, 15px, line-height 1.5
- **Color**: Primary text color

**Tương tác**:
- **If bio > 3 lines**: Truncate với "...Read more"
- **Tap "Read more"** → Expand full bio
- **Tap "Show less"** → Collapse

**Animations**:
- Expand/collapse smooth height transition

**States**:
- **No bio**: Show placeholder "Tell people about yourself" với link to Edit
- **Bio exists**: Display text

---

### 6. Availability Section
**Mô tả**: Display days và time slots user is available

**Components**:

#### A. Section Header
- **Title**: "When I'm Free"
- **Style**: Semibold, 18px
- **Spacing**: 24px top margin

#### B. Availability Display (nếu đã set)
- **Layout**: Visual calendar grid hoặc text list
- **Option 1**: Week grid
  - 7 columns (Mon-Sun)
  - Highlight active days với color
  - Show time slots below each day (Morning/Afternoon/Evening icons)
- **Option 2**: Text list
  - "Mon, Wed, Fri - Morning, Evening"
  - "Tue, Thu - Afternoon"
  - Grouped by days

**Tương tác**:
- Static display (no interaction in view mode)
- **If not set**: Show "Not set" với link "Add availability" → **21-edit-profile.md**

**Animations**:
- Fade-in on load
- Highlight animation cho selected days

**States**:
- **Availability set**: Display grid/list
- **Not set**: Placeholder với CTA "Add your availability"

---

### 7. Stats Section
**Mô tả**: User stats (matches, games played, rating)

**Components**:

#### A. Section Header
- **Title**: "My Stats" hoặc "Activity"
- **Style**: Semibold, 18px
- **Spacing**: 24px top margin

#### B. Stats Cards (Grid Layout)
- **Layout**: 3 cards horizontal (or 2×2 grid)
- **Cards**:
  1. **Matches**
     - Icon: Heart/Match icon
     - Number: "24" (example)
     - Label: "Matches"
  2. **Games Played**
     - Icon: Court/Ball icon
     - Number: "12" (from booking history)
     - Label: "Games Played"
  3. **Rating**
     - Icon: Star icon
     - Number: "4.8" (average rating received từ F09)
     - Label: "Rating"

**Tương tác**:
- **Tap "Matches" card** → Navigate to **07-matches-list.md**
- **Tap "Games Played" card** → Navigate to **16-booking-history.md**
- **Tap "Rating" card** → Show ratings received modal (optional)

**Animations**:
- Cards fade-in staggered (sequential)
- Tap card scale animation

**States**:
- **No data**: Show "0" hoặc "-" với grayed out
- **Data exists**: Display numbers

---

### 8. Profile Completion Section (Conditional)
**Mô tả**: Chỉ hiển thị nếu profile chưa đầy đủ

**Components**:

#### A. Completion Card
- **Layout**: Card với border, subtle background color (yellow/orange tint)
- **Progress Bar**: Visual bar "80% complete" (example)
- **Icon**: Info/warning icon
- **Title**: "Complete Your Profile"
- **Suggestions List**:
  - "Add a bio" (nếu chưa có)
  - "Set your availability" (nếu chưa set)
  - "Add more photos" (nếu < 3 photos)
- **CTA Button**: "Complete Now" → **21-edit-profile.md**

**Tương tác**:
- **Tap card** → Navigate to **21-edit-profile.md**
- **Tap "Complete Now" button** → Navigate to **21-edit-profile.md**
- **Dismiss icon** (X) → Hide card (lưu preference)

**Animations**:
- Card slide-in from bottom on load
- Progress bar fill animation

**Visibility**:
- **Profile 100% complete**: Không hiển thị section này
- **Profile incomplete**: Show ở bottom của screen

---

### 9. Preview Mode Toggle (Optional)
**Mô tả**: Button để toggle preview mode (xem profile như người khác thấy)

**Components**:

#### A. Preview Button
- **Position**: Floating button bottom-right (hoặc trong header menu)
- **Text**: "Preview" hoặc "Preview as Others See It"
- **Icon**: Eye icon
- **Style**: Secondary button, outline

**Tương tác**:
- **Tap button** → Toggle Preview Mode
  - **Preview ON**:
    - Hide Edit button, Settings icon
    - Disable all edit interactions
    - Show banner "Preview Mode" ở top
    - Hiển thị profile exactly như ở **15-match-detail.md** (other user's profile)
  - **Exit Preview**: Tap "Exit Preview" button → Back to normal mode

**Animations**:
- Mode transition fade
- Banner slide-down from top

---

### 10. Action Buttons Section
**Mô tả**: Quick actions ở bottom của screen

**Components**:

#### A. Edit Profile Button
- **Type**: Primary button (nếu không có floating Edit ở header)
- **Text**: "Edit Profile"
- **Icon**: Pencil icon
- **Full-width**: Yes (nếu dùng bottom button approach)

**Tương tác**:
- **Tap button** → Navigate to **21-edit-profile.md**

**Animations**:
- Button press scale animation
- Haptic feedback

---

## Navigation

**Đến screen này từ**:
- **Bottom Tab Navigation** - Profile Tab (F02 main access)
- **06-home-swipe.md** - Tap Profile tab
- **07-matches-list.md** - Tap Profile tab
- **20-settings.md** - Back from settings
- **21-edit-profile.md** - Back after editing

**Từ screen này đến**:
- **21-edit-profile.md** - Via "Edit" button hoặc "Edit Profile" button
- **20-settings.md** - Via Settings icon
- **07-matches-list.md** - Via "Matches" stat card
- **16-booking-history.md** - Via "Games Played" stat card
- **Full-screen Photo Gallery** (modal) - Via tap photo

---

## States

### Default State
- All sections populated với user data
- Header transparent over hero photo
- Scroll position: Top
- Preview Mode: OFF

### Loading State
- Hero photo: Skeleton shimmer
- Name, Age: Skeleton text
- Stats cards: Skeleton với pulse animation
- Photos: Skeleton grid
- Other sections: Skeleton blocks

### Error State
- **Failed to load profile**:
  - Error message: "Could not load profile"
  - Retry button
  - Placeholder avatar
- **Failed to load photos**:
  - Placeholder images với broken icon
  - "Tap to retry" text

### Empty States
- **No photos**: Placeholder + "Add your first photo" CTA
- **No bio**: "Tell people about yourself" với link to Edit
- **No availability**: "Set your availability" với link to Edit
- **No stats**: Show "0" hoặc "-" với grayed style

### Scroll States
- **Scroll down**: Header title fade-in, hero photo parallax
- **Scroll up**: Header title fade-out, back to transparent header
- **At top**: Full hero photo visible, transparent header
- **Scrolled**: Header opaque background, title visible

### Profile Incomplete State
- Completion card visible ở bottom
- Progress bar < 100%
- Suggestions list populated
- Yellow/orange accent color

### Preview Mode State
- Edit button hidden
- Settings icon hidden
- "Preview Mode" banner ở top
- All interactions disabled (except Exit Preview)
- Exact layout như **15-match-detail.md**

---

## Ghi chú

### UX Considerations

1. **Profile Ownership**:
   - User luôn biết đây là profile của chính họ (via "My Profile" title)
   - Edit button prominent để easy access

2. **Visual Hierarchy**:
   - Hero photo first impression (biggest visual)
   - Name và key info prominent
   - Stats và details ở middle/bottom
   - Completion prompt ở bottom (không quá intrusive)

3. **Edit Access**:
   - Multiple paths to Edit: header button, bottom button, completion card
   - Quick edit suggestions trong completion card

4. **Preview Validation**:
   - User có thể validate profile trước khi others see
   - Preview mode exactly như **15-match-detail.md** để accurate

5. **Stats Motivation**:
   - Hiển thị stats để gamify và motivate user engage more
   - Tap stats cards link to relevant screens (matches, bookings)

6. **Completion Incentive**:
   - Progress bar visual feedback
   - Clear suggestions what to add
   - Non-intrusive (có thể dismiss)

### Validations

- **Profile data**: Always pull from server (fresh data)
- **Cache**: Cache 5 phút để reduce load, pull-to-refresh để force update
- **Age calculation**: Realtime từ DOB (not stored age)
- **Stats**: Fetch real counts từ database
- **Photos**: Handle missing/broken images gracefully

### Edge Cases

1. **Profile incomplete** → Show completion card
2. **No photos** → Placeholder avatar, "Add Photo" CTA
3. **No bio** → Empty state với suggestion
4. **New user** (no stats) → Show "0" hoặc "-"
5. **Very long bio** → Truncate với "Read more"
6. **Very long name** → Ellipsis, max 2 lines
7. **Rating not set** (no reviews) → Show "-" hoặc "No ratings yet"
8. **Old photo URLs broken** → Fallback placeholder, prompt re-upload
9. **Slow network** → Show loading skeletons, timeout after 10s
10. **User in Preview Mode kills app** → Exit preview on reload (reset to default)

### Technical Notes

#### Data Source
- **Endpoint**: `GET /api/profile/me`
- **Response**:
  ```json
  {
    "user_id": "uuid",
    "display_name": "John Doe",
    "date_of_birth": "1995-01-15",
    "gender": "male",
    "avatar_urls": ["url1", "url2", "url3"],
    "bio": "Love playing pickleball!",
    "skill_level": "intermediate",
    "play_style": "casual",
    "looking_for": ["opponent", "dating"],
    "availability": {
      "monday": ["morning", "evening"],
      "wednesday": ["afternoon"]
    },
    "preferred_location": {
      "lat": 10.762622,
      "lng": 106.660172,
      "address": "District 1, HCMC"
    },
    "verification": {
      "phone_verified": true,
      "email_verified": true
    },
    "stats": {
      "matches_count": 24,
      "games_played": 12,
      "average_rating": 4.8
    },
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
  ```

#### Caching Strategy
- Cache duration: 5 minutes
- Pull-to-refresh: Force refetch
- Invalidate cache: After edit profile success

#### Profile Completion Calculation
```typescript
const calculateCompletion = (profile) => {
  let score = 0;
  const weights = {
    photos: 20, // 1 photo = 20%, full 6 photos = 100% of this weight
    bio: 15,
    availability: 15,
    basic_info: 50 // Always 100% (required)
  };

  score += weights.basic_info; // Always complete
  score += (profile.avatar_urls.length / 6) * weights.photos;
  if (profile.bio) score += weights.bio;
  if (profile.availability) score += weights.availability;

  return Math.round(score);
};
```

#### Image Loading
- **Progressive loading**: Low-res placeholder → Full-res image
- **Lazy load**: Photos grid load on scroll
- **Error handling**: Retry 3 times, fallback placeholder

#### Analytics Events
Track:
- `screen_view`: Profile Me
- `profile_edit_tapped`: User tap Edit button
- `profile_preview_toggled`: User toggle preview mode
- `profile_photo_viewed`: User view full-screen photo
- `profile_stat_tapped`: User tap stat card (which stat)
- `profile_completion_tapped`: User tap completion card/suggestions

### Design Specs

#### Layout
- **Content Width**: Full-width với horizontal padding 16px (except hero photo)
- **Section Spacing**: 24px vertical gap giữa sections
- **Card Padding**: 16px internal padding

#### Hero Photo
- **Aspect Ratio**: 3:4 hoặc 1:1 (tùy design choice)
- **Height**: 300-400px (responsive)
- **Gradient Overlay**: Linear gradient từ transparent (top 60%) → rgba(0,0,0,0.6) (bottom)

#### Typography
- **Name**: Bold, 28px, primary color
- **Age**: Regular, 24px, muted
- **Section Headers**: Semibold, 18px, primary
- **Body Text**: Regular, 15px, primary
- **Labels**: Regular, 14px, muted

#### Stats Cards
- **Card Size**: Square hoặc 16:9
- **Spacing**: 12px gap giữa cards
- **Border Radius**: 12px
- **Background**: Subtle fill color

#### Badges & Chips
- **Skill Badge**: Height 32px, border-radius 16px
- **Play Style Chip**: Height 28px, border-radius 14px
- **Looking For Tags**: Height 24px, border-radius 12px

#### Colors
- **Verified Badge**: Blue #3B82F6
- **Skill Levels**:
  - Beginner: Green #10B981
  - Intermediate: Yellow #F59E0B
  - Advanced: Orange #F97316
  - Pro: Red #EF4444
- **Completion Card**: Background #FEF3C7 (light yellow)

#### Animations
- **Hero Parallax**: Scroll speed 0.5× content
- **Photo Swipe**: 300ms ease-out
- **Expand Bio**: 200ms ease-in-out
- **Stats Fade-In**: Staggered 100ms delay each
- **Preview Toggle**: 300ms fade transition

### Accessibility

- **Hero Photo**: Alt text "Profile photo of [Name]"
- **Edit Button**: Label "Edit profile"
- **Settings Icon**: Label "Settings"
- **Stats Cards**: Announce numbers "24 matches", "12 games played", "4.8 rating"
- **Preview Mode**: Announce "Preview mode active" khi toggle on
- **Completion Card**: Announce progress "Profile 80% complete"
- **All interactive elements**: Min 44×44pt touch targets

### Performance

- **Image Optimization**: WebP format, max 1080px, lazy load
- **Skeleton Loading**: Show immediately (không wait API)
- **Cache**: Use cached data while fetching fresh
- **Debounce**: Pull-to-refresh debounce 2s
- **Animations**: 60 FPS với Reanimated

### Security

- **Data Privacy**: Profile me chỉ fetch user's own data (server validate auth)
- **Photo URLs**: Signed URLs từ Supabase Storage (expire 1 hour)
- **Rate Limiting**: Max 10 profile fetch/minute

### Future Enhancements

- **Badges/Achievements**: Display earned badges (tournament winner, active player, etc.)
- **Activity Feed**: Recent matches, games played
- **QR Code**: Share profile via QR code
- **Social Links**: Link Instagram, Facebook
- **Video Profile**: Support 1 video (15s)
- **Profile Strength Meter**: Visual meter "Strong profile", "Good profile", etc.
- **Edit Quick Actions**: Floating quick edit buttons on each section
- **Dark Mode**: Support dark theme
- **Profile Sharing**: Share profile link outside app
- **Custom Themes**: User chọn theme/color scheme cho profile

---

*Document End*
