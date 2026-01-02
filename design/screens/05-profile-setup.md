# Profile Setup Screen

## Screen Overview
Màn hình onboarding 4-step để user tạo profile lần đầu sau khi đăng ký thành công. Flow được thiết kế để thu thập đầy đủ thông tin cần thiết cho matching algorithm với UX mượt mà, có progress indicator và validation realtime.

## Mục đích
- Hướng dẫn user tạo profile đầy đủ để tối ưu match quality
- Thu thập thông tin cơ bản (tên, tuổi, giới tính), ảnh, skill level, play style, và availability
- Đảm bảo user hiểu rõ từng bước với clear instructions
- Cho phép preview profile trước khi hoàn thành
- Lưu draft tự động để user có thể quay lại sau nếu cần

---

## Step 1: Basic Info

### 1. Header Section
**Mô tả**: Navigation, progress và title

**Components**:
- **Progress Indicator**: "1/4" hoặc progress bar (25% filled)
- **Title**: "Let's Get Started" hoặc "Thông Tin Cơ Bản"
- **Subtitle**: "Tell us about yourself"
- **Skip Button** (top-right): Không có ở step này (required)

**Tương tác**:
- Không có back button (không thể quay về auth screen)
- Progress indicator static (chỉ hiển thị, không interactive)

**Animations**:
- Slide-in from right khi vào step
- Progress bar fill animation smooth transition

### 2. Display Name Section
**Mô tả**: Input field cho tên hiển thị

**Components**:

#### A. Input Field
- **Label**: "Display Name" với asterisk đỏ (required)
- **Placeholder**: "What should we call you?"
- **Input Type**: Text (capitalize first letter)
- **Character Counter**: "0/30" (bottom-right của field)
- **Max Length**: 30 characters

**Tương tác**:
- **Focus input** → Highlight border, show keyboard
- **Type text** → Update character counter realtime
- **Realtime validation**:
  - Min 2 characters
  - Max 30 characters
  - No leading/trailing spaces (auto-trim)
  - Allow Unicode (Vietnamese, emojis)
  - Show green checkmark khi valid
  - Show red X khi invalid

**Validations**:
- **Format**: 2-30 chars
- **Error messages**:
  - "Name must be at least 2 characters"
  - "Name cannot exceed 30 characters"

**Animations**:
- Input focus: Border color transition + slight scale
- Character counter update smooth
- Checkmark/X icon fade-in

### 3. Date of Birth Section
**Mô tả**: Date picker để chọn ngày sinh

**Components**:

#### A. Date Picker Button
- **Label**: "Date of Birth" với asterisk đỏ
- **Display**: Placeholder "Select your birthday" hoặc formatted date "Jan 15, 1995"
- **Icon**: Calendar icon (right side)

**Tương tác**:
- **Tap button** → Mở Date Picker Modal:
  - **iOS**: Native iOS date picker wheel
  - **Android**: Native Android date picker dialog
  - **Max Date**: Today - 18 years (enforce 18+ age)
  - **Min Date**: Today - 80 years (reasonable limit)
  - **Default**: Today - 25 years (starting position)
- **Select date** → Close modal, update display
- **Realtime validation**:
  - Check age >= 18
  - Show green checkmark khi valid
  - Show error khi < 18

**Validations**:
- **Age requirement**: Must be 18+ years old
- **Error messages**:
  - "You must be at least 18 years old to use this app"

**Animations**:
- Date picker slide-up from bottom (modal)
- Date update smooth transition
- Error shake animation nếu < 18

### 4. Gender Section
**Mô tả**: Radio buttons cho giới tính

**Components**:

#### A. Gender Options
- **Label**: "Gender" với asterisk đỏ
- **Options**: 3 radio buttons
  1. Male (Nam)
  2. Female (Nữ)
  3. Other (Khác)

**Tương tác**:
- **Tap option** → Select với animation
- **Only one selected** (radio button behavior)
- **Default**: None selected (user phải chọn)

**Animations**:
- Radio button fill animation (scale + color transition)
- Haptic feedback on selection

### 5. Next Button Section
**Mô tả**: Button để sang Step 2

**Components**:
- **Primary Button**: "Next" hoặc "Tiếp Theo"
- **Full-width button** với prominent styling

**Tương tác**:
- **Enabled when**: All fields valid (name, DOB 18+, gender selected)
- **Tap button** → Validate all fields:
  - Nếu invalid → Highlight error fields, shake animation
  - Nếu valid → Transition to Step 2

**States**:
- **Disabled**: Grayed out (any field invalid)
- **Enabled**: Brand color, ready to tap
- **Loading**: Không có (local validation, no API call yet)

**Animations**:
- Button press: Scale down 0.98 + haptic feedback
- Transition to Step 2: Slide-left current screen, slide-in Step 2 from right

---

## Step 2: Photos

### 1. Header Section
**Mô tả**: Navigation, progress và title

**Components**:
- **Back Button**: Arrow left icon (top-left)
- **Progress Indicator**: "2/4" hoặc progress bar (50% filled)
- **Title**: "Add Your Photos" hoặc "Thêm Ảnh"
- **Subtitle**: "Upload at least 1 photo (up to 6)"

**Tương tác**:
- **Tap Back button** → Navigate về Step 1 (giữ data đã nhập)

**Animations**:
- Back button ripple effect on tap
- Progress bar animate from 25% → 50%

### 2. Photo Grid Section
**Mô tả**: 2x3 grid để hiển thị và upload ảnh

**Components**:

#### A. Photo Grid (6 Slots)
- **Layout**: 2 columns × 3 rows
- **Slot 1** (top-left): Main photo (avatar) - labeled "Main"
- **Slots 2-6**: Additional photos
- **Empty Slot**: Dashed border, "+" icon, "Add Photo" text

**Tương tác**:

##### Upload Photo Flow
1. **Tap empty slot** → Show Action Sheet:
   - **Camera**: "Take Photo"
   - **Gallery**: "Choose from Library"
   - **Cancel**

2. **Select Camera**:
   - Request camera permission (nếu chưa grant)
   - **Permission granted** → Open camera
   - **Permission denied** → Show permission guide modal
   - Chụp ảnh → Preview + Crop screen

3. **Select Gallery**:
   - Request photo library permission (nếu chưa grant)
   - **Permission granted** → Open photo picker
   - **Permission denied** → Show permission guide modal
   - Chọn ảnh → Preview + Crop screen

4. **Crop Screen**:
   - Hiển thị ảnh với crop overlay (1:1 aspect ratio)
   - User có thể zoom, pan, rotate
   - **Buttons**: "Cancel" | "Done"
   - **Tap Done** → Compress image → Upload to Supabase Storage

5. **Upload Process**:
   - Show loading spinner overlay on slot
   - Upload to Supabase Storage
   - **Success** → Display ảnh trong slot, show checkmark animation
   - **Failed** → Show error toast, clear slot, offer retry

##### Manage Photos
- **Tap filled slot** → Show options:
  - "Set as Main" (nếu không phải slot 1)
  - "Delete Photo"
  - "Cancel"

- **Set as Main**:
  - Swap photo với slot 1
  - Smooth swap animation

- **Delete Photo**:
  - Nếu là ảnh cuối cùng → Show warning "You must have at least 1 photo"
  - Nếu không → Show confirm dialog
  - **Confirm** → Delete from storage, remove from grid
  - Fade-out animation

- **Drag to Reorder** (optional advanced feature):
  - Long-press photo → Enter drag mode
  - Drag photo to reorder
  - Drop to finalize position

**Validations**:
- **Min photos**: 1 (required)
- **Max photos**: 6
- **File size**: Max 5MB per image
- **Format**: JPG, PNG, HEIC
- **Error messages**:
  - "File is too large. Max 5MB per photo."
  - "Unsupported format. Please use JPG or PNG."
  - "You need at least 1 photo to continue."

**Animations**:
- Photo upload: Spinner rotation + fade-in ảnh khi done
- Delete: Fade-out + scale down
- Reorder: Smooth position transitions
- Checkmark success: Scale from 0 → 1 với bounce

### 3. Photo Tips Section (Optional)
**Mô tả**: Tips để user chọn ảnh tốt

**Components**:
- **Collapsible Tips** (icon "i" hoặc "Tips"):
  - "Use clear, recent photos"
  - "Show your face in the main photo"
  - "Action shots on the court work great!"
  - "Smile and be yourself"

**Tương tác**:
- **Tap icon** → Expand/collapse tips

**Animations**:
- Tips expand/collapse với smooth height transition

### 4. Next Button Section
**Mô tả**: Button để sang Step 3

**Components**:
- **Primary Button**: "Next"
- **Full-width button**

**Tương tác**:
- **Enabled when**: Có ít nhất 1 ảnh uploaded successfully
- **Tap button** → Transition to Step 3

**States**:
- **Disabled**: Grayed out (no photos)
- **Enabled**: Ready to continue

**Animations**:
- Button press: Scale + haptic feedback
- Transition to Step 3: Slide-left animation

---

## Step 3: Pickleball Info

### 1. Header Section
**Mô tả**: Navigation, progress và title

**Components**:
- **Back Button**: Arrow left (top-left)
- **Progress Indicator**: "3/4" (75% filled)
- **Title**: "Your Pickleball Profile" hoặc "Thông Tin Pickleball"
- **Subtitle**: "Help us find your perfect match"

**Tương tác**:
- **Tap Back button** → Navigate về Step 2 (giữ data)

**Animations**:
- Progress bar animate from 50% → 75%

### 2. Skill Level Section
**Mô tả**: Selection cards cho skill level

**Components**:

#### A. Skill Level Cards (4 options)
- **Label**: "Skill Level" với asterisk đỏ
- **Options**: 4 cards (horizontal scroll nếu cần)
  1. **Beginner** 🟢
     - Icon: Beginner badge
     - Description: "New to pickleball"
  2. **Intermediate** 🟡
     - Icon: Intermediate badge
     - Description: "Consistent player"
  3. **Advanced** 🟠
     - Icon: Advanced badge
     - Description: "Competitive player"
  4. **Pro** 🔴
     - Icon: Pro badge
     - Description: "Tournament level"

**Tương tác**:
- **Tap card** → Select với highlight animation
- **Only one selected** (radio behavior)
- **Default**: None selected

**Animations**:
- Card selection: Border color + scale 1.02
- Checkmark icon appear in top-right corner
- Deselect previous card smooth transition

### 3. Play Style Section
**Mô tả**: Selection cards cho play style

**Components**:

#### A. Play Style Cards (3 options)
- **Label**: "Play Style" với asterisk đỏ
- **Options**: 3 cards (grid layout)
  1. **Competitive** 🏆
     - Icon: Trophy icon
     - Description: "I play to win"
  2. **Casual** 😎
     - Icon: Sunglasses icon
     - Description: "For fun and fitness"
  3. **Social** 🤝
     - Icon: Handshake icon
     - Description: "Meet new people"

**Tương tác**:
- **Tap card** → Select (radio behavior)
- **Only one selected**
- **Default**: None selected

**Animations**:
- Same as Skill Level cards

### 4. Looking For Section
**Mô tả**: Multi-select chips cho looking_for

**Components**:

#### A. Looking For Chips (4 options)
- **Label**: "I'm Looking For" với asterisk đỏ (ít nhất 1)
- **Options**: 4 chips (wrap layout)
  1. **Opponent** ⚔️ - "Someone to compete with"
  2. **Doubles Partner** 🤝 - "Team player"
  3. **Dating** ❤️ - "Romantic connection"
  4. **All of the Above** ⭐ - "Open to everything"

**Tương tác**:
- **Tap chip** → Toggle selected/unselected (multi-select)
- **Multiple selections allowed**
- **"All of the Above"**: Nếu select → Auto-select tất cả other chips (disable individual taps)
- **Deselect "All"**: User có thể tap lại individual chips
- **Min selection**: 1

**Validations**:
- **Min**: 1 option selected
- **Error**: "Please select at least one option"

**Animations**:
- Chip selection: Background color fill + checkmark icon
- Multi-select smooth transitions

### 5. Bio Section (Optional)
**Mô tả**: Text area cho bio

**Components**:

#### A. Bio Text Area
- **Label**: "Bio (Optional)"
- **Placeholder**: "Tell us a bit about yourself..."
- **Input Type**: Multiline text
- **Max Length**: 500 characters
- **Character Counter**: "0/500" (bottom-right)

**Tương tác**:
- **Tap field** → Show keyboard, focus
- **Type text** → Update counter realtime
- **Trim spaces** on blur

**Validations**:
- **Max**: 500 chars
- **Error**: "Bio cannot exceed 500 characters"

**Animations**:
- Field expand on focus (slight height increase)
- Character counter update smooth

### 6. Next Button Section
**Mô tả**: Button để sang Step 4

**Components**:
- **Primary Button**: "Next"
- **Full-width button**

**Tương tác**:
- **Enabled when**: Skill level + Play style + Looking for (min 1) selected
- **Tap button** → Transition to Step 4

**States**:
- **Disabled**: Grayed out (missing required selections)
- **Enabled**: Ready

**Animations**:
- Transition to Step 4: Slide-left animation

---

## Step 4: Availability & Location

### 1. Header Section
**Mô tả**: Navigation, progress và title

**Components**:
- **Back Button**: Arrow left (top-left)
- **Progress Indicator**: "4/4" (100% filled)
- **Title**: "When Can You Play?" hoặc "Lịch Rảnh"
- **Subtitle**: "Optional - You can add this later"
- **Skip Button** (top-right): "Skip" text button

**Tương tác**:
- **Tap Back button** → Navigate về Step 3 (giữ data)
- **Tap Skip** → Submit profile without availability → Navigate to Home

**Animations**:
- Progress bar animate from 75% → 100%
- Skip button subtle hover animation

### 2. Availability Section
**Mô tả**: Day picker + time slots

**Components**:

#### A. Day Picker (Optional)
- **Label**: "Select Days You're Free"
- **Options**: 7 day buttons (horizontal scroll)
  - Mon, Tue, Wed, Thu, Fri, Sat, Sun
  - Multi-select (toggle on/off)

**Tương tác**:
- **Tap day button** → Toggle selected/unselected
- **Multiple days** can be selected
- **Default**: None selected

**Animations**:
- Day button selection: Background color + checkmark icon
- Smooth toggle animation

#### B. Time Slot Picker (Optional)
- **Label**: "Preferred Time Slots" (only show nếu ít nhất 1 day selected)
- **Options**: 3 chips
  1. ☀️ Morning (6AM - 12PM)
  2. 🌤️ Afternoon (12PM - 6PM)
  3. 🌙 Evening (6PM - 10PM)

**Tương tác**:
- **Tap chip** → Toggle (multi-select)
- **Multiple slots** can be selected
- **Only active** nếu có day selected

**Animations**:
- Chip selection: Background fill
- Smooth multi-select

#### C. Availability Summary (Optional)
- **Display**: Text summary of selections
  - Example: "Mon, Wed, Fri - Morning, Evening"
  - Shows below time slots
  - Only visible if selections made

### 3. Preferred Location Section (Optional)
**Mô tả**: Area selector hoặc map picker

**Components**:

#### A. Location Selector
- **Label**: "Preferred Location"
- **Button**: "Select Area" hoặc display selected area
- **Options**:
  - **Option 1**: Dropdown list of districts/areas
    - Example: "District 1, HCMC", "District 7, HCMC"
  - **Option 2**: Map picker modal
    - User tap location on map
    - Display address text

**Tương tác**:
- **Tap button** → Show picker modal
- **Select area** → Update display, close modal
- **Default**: None (user's current GPS location used if skipped)

**Animations**:
- Modal slide-up from bottom
- Selection confirm animation

### 4. Preview Profile Button (Optional)
**Mô tả**: Button để xem preview profile

**Components**:
- **Secondary Button**: "Preview Profile"
- **Outline style** (không quá prominent)
- **Icon**: Eye icon

**Tương tác**:
- **Tap button** → Show Preview Modal:
  - Full-screen modal
  - Display profile như người khác sẽ thấy (swipe card style)
  - Buttons: "Back to Editing" | "Looks Good, Finish"

**Preview Modal Layout**:
- Photo carousel (swipeable)
- Name, age, gender
- Skill level badge
- Play style
- Looking for tags
- Bio (nếu có)
- Availability (nếu có)
- "This is how others will see you" text

**Animations**:
- Modal slide-up full-screen
- Photo swipe smooth transitions

### 5. Finish Button Section
**Mô tả**: Button để hoàn tất profile setup

**Components**:
- **Primary Button**: "Finish" hoặc "Hoàn Thành"
- **Full-width button**

**Tương tác**:
- **Tap button** → Submit profile to API:
  - Show loading spinner on button
  - Call API: `POST /api/profile` với all data
  - **Success** → Show success animation → Navigate to Home
  - **Error** → Show error toast, retry option

**States**:
- **Default**: Enabled (step 4 is optional, always can finish)
- **Loading**: Spinner on button, disabled
- **Error**: Show error state, re-enable

**Animations**:
- Button press: Scale + haptic
- Loading spinner rotation
- Success: Confetti animation (optional) + checkmark
- Transition to Home: Fade-out onboarding, fade-in Home

---

## Navigation

**Đến screen này từ**:
- **04-phone-signup.md** - After successful OTP verification
- **03-email-signup.md** - After successful email signup
- **01-splash-screen.md** - Nếu user đã auth nhưng chưa complete profile (returning user)

**Từ screen này đến**:
- **Step 1 → Step 2** - Via "Next" button
- **Step 2 → Step 1** - Via "Back" button
- **Step 2 → Step 3** - Via "Next" button
- **Step 3 → Step 2** - Via "Back" button
- **Step 3 → Step 4** - Via "Next" button
- **Step 4 → Step 3** - Via "Back" button
- **Step 4 → 06-home-swipe.md** - Via "Finish" hoặc "Skip" button

---

## States Summary

### Overall Screen States

#### Default State (Step 1)
- Progress: 1/4 (25%)
- All fields empty
- Next button disabled
- No validation errors

#### Step Transition States
- Smooth slide-left/right animations
- Back button always available (except Step 1)
- Progress bar animates
- Data persisted across steps

#### Draft Save State
- Auto-save data locally every 5 seconds
- Nếu user kill app giữa onboarding:
  - **Splash screen** check draft exists
  - Prompt: "Continue setting up your profile?" (Yes/No)
  - Yes → Resume từ step đã dừng
  - No → Start over (clear draft)

#### Loading State (Step 4 Finish)
- Button shows spinner
- Disable all inputs
- Cannot navigate back
- Text: "Creating your profile..."

#### Success State (Profile Created)
- Checkmark animation
- Success message: "Profile created! Let's find your match"
- Auto-transition to Home screen (1 giây delay)

#### Error States

##### Network Error
- **Trigger**: No internet when submit
- **UI**: Toast "No internet. Please check connection."
- **Action**: Re-enable Finish button, user can retry

##### Server Error
- **Trigger**: API returns 500
- **UI**: Toast "Something went wrong. Please try again."
- **Action**: Re-enable Finish button, retry

##### Validation Error (API-side)
- **Trigger**: Backend validation fails
- **UI**: Show error messages on specific fields
- **Action**: Navigate back to step có lỗi, highlight field

##### Upload Error (Photos)
- **Trigger**: Image upload failed (timeout, storage error)
- **UI**: Toast "Upload failed. Please try again."
- **Action**: Clear failed slot, user can retry upload

---

## Edge Cases

1. **User navigates back từ Step 4 → Step 1**: Tất cả data giữ nguyên (không clear)
2. **App killed giữa upload photo**: Draft lưu URLs của photos đã upload, resume nếu user quay lại
3. **Permission denied (Camera/Photos)**: Show guide modal với instructions cách bật permission trong Settings
4. **Upload ảnh quá lớn** (>5MB): Compress client-side trước khi upload (target <1MB)
5. **Slow network**: Show upload progress (0-100%) cho photo upload
6. **User chọn "All of the Above"** trong Looking For: Backend treat như đã chọn tất cả 3 options khác
7. **Duplicate display name**: Backend không enforce unique (allow duplicate names)
8. **Age exactly 18**: Valid (18.0 years or more)
9. **Bio với emojis/special chars**: Allow tất cả Unicode characters
10. **User skip Step 4**: Profile vẫn valid, availability = null (match algorithm sẽ ưu tiên thấp hơn)
11. **Preview Profile khi chưa finish**: User có thể xem bất kỳ lúc nào ở Step 4
12. **User tap Skip nhiều lần**: Debounce, accept 1 tap trong 2 giây

---

## Ghi chú

### UX Considerations
- **Progress visibility**: User luôn thấy mình đang ở bước nào (1/4, 2/4, ...)
- **Back navigation**: User có thể quay về edit bất kỳ lúc nào (trừ Step 1)
- **Draft auto-save**: Không bắt buộc hoàn thành 1 lượt, có thể quay lại sau
- **Clear instructions**: Mỗi step có subtitle giải thích
- **Visual feedback**: Checkmarks, animations, validations realtime
- **Optional fields clearly marked**: "Optional" label, Skip button
- **Preview before finish**: User tự tin về profile trước khi publish
- **Celebrate completion**: Success animation tạo positive feeling

### Validations & Error Handling
- **Client-side validation**: Instant feedback cho user (no waiting)
- **Server-side validation**: Final check trước khi save
- **Field-level errors**: Highlight specific field có lỗi, scroll to view
- **Toast notifications**: Transient errors (network, upload)
- **Retry mechanisms**: User có thể retry khi có lỗi
- **Validation rules**:
  - Display name: 2-30 chars, trim spaces
  - DOB: Must be 18+ (calculated from today)
  - Photos: Min 1, max 6, max 5MB each
  - Skill level, Play style: Required (1 selection)
  - Looking for: Required (min 1, max 4)
  - Bio: Optional, max 500 chars
  - Availability: Optional
  - Location: Optional

### Technical Notes

#### API Endpoint
- **POST /api/profile/create**
  - **Request Body**:
    ```json
    {
      "display_name": "John Doe",
      "date_of_birth": "1995-01-15",
      "gender": "male",
      "avatar_urls": ["url1", "url2"],
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
      }
    }
    ```
  - **Response Success** (201):
    ```json
    {
      "success": true,
      "profile": { ... },
      "message": "Profile created successfully"
    }
    ```
  - **Response Error** (400):
    ```json
    {
      "success": false,
      "errors": {
        "display_name": "Name is required",
        "date_of_birth": "Must be 18 or older"
      }
    }
    ```

#### Supabase Implementation
- **Storage Bucket**: `profile-photos`
  - Public read access
  - Authenticated write
  - File size limit: 5MB
  - Path structure: `{user_id}/{timestamp}_{random}.jpg`

- **Database Table**: `profiles`
  - `user_id` (FK to auth.users)
  - `display_name`, `date_of_birth`, `gender`
  - `avatar_urls` (TEXT[] array)
  - `bio` (TEXT nullable)
  - `skill_level`, `play_style` (ENUM)
  - `looking_for` (TEXT[] array)
  - `availability` (JSONB nullable)
  - `preferred_location` (JSONB nullable)
  - `created_at`, `updated_at`

- **Draft Storage**: Use AsyncStorage (local)
  - Key: `profile_draft_{user_id}`
  - Clear after successful submit

#### Image Processing
- **Compression**:
  - Use `react-native-image-resizer` hoặc `expo-image-manipulator`
  - Target: 1080px max dimension, 80% quality, <1MB file size
- **Crop**:
  - Use `react-native-image-crop-picker` hoặc `expo-image-picker`
  - Aspect ratio: 1:1 (square)
- **Upload**:
  - Show progress (0-100%)
  - Retry logic: 3 attempts với exponential backoff
  - Cancel upload nếu user navigates away

#### Session Handling
- User đã authenticated (có session) khi vào screen này
- Lưu profile data vào Supabase với `user_id` từ session
- Sau khi profile created → Update user metadata: `profile_complete: true`

### Design Specs

#### Step 1: Basic Info
- **Input height**: 56px
- **Font size**: 16px (input), 12px (label)
- **Spacing**: 24px vertical gap giữa sections
- **Date picker**: Native platform pickers
- **Radio buttons**: 48px touch target

#### Step 2: Photos
- **Grid spacing**: 8px gap giữa slots
- **Slot size**: Square, ~110px width (2 columns fit screen với margins)
- **Empty slot**: Dashed border, gray background
- **Filled slot**: Image cover entire slot
- **Delete icon**: X button top-right corner của slot
- **Loading**: Spinner centered trong slot

#### Step 3: Pickleball Info
- **Card width**: Full-width cho skill/play style (stacked), wrap cho chips
- **Card height**: ~80px (fit icon + title + description)
- **Card spacing**: 12px gap giữa cards
- **Chip height**: 40px
- **Chip spacing**: 8px gap (wrap layout)
- **Bio text area**: Min 100px height, auto-expand đến max 200px

#### Step 4: Availability
- **Day button size**: 48px × 48px (round)
- **Day button spacing**: 8px gap (horizontal scroll)
- **Time slot chip**: 48px height
- **Location button**: 56px height

#### General
- **Progress bar**: 4px height, full-width
- **Progress filled**: Brand primary color
- **Progress unfilled**: Light gray
- **Button height**: 48px
- **Button radius**: 8px
- **Font weights**: Regular (400), Medium (500), Bold (700)

#### Colors
- **Primary**: Brand color (buttons, progress, selections)
- **Success**: #38A169 (green checkmarks)
- **Error**: #E53E3E (red errors)
- **Border default**: #E2E8F0
- **Border focus**: Brand primary
- **Border error**: #E53E3E
- **Disabled**: #A0AEC0

#### Animations
- **Step transitions**: Slide 300ms ease-out
- **Progress bar fill**: 200ms ease-in-out
- **Button press**: Scale 0.98, 100ms
- **Photo upload**: Fade-in 300ms
- **Success confetti**: 1000ms (optional)
- **All animations**: 60 FPS với Reanimated

### Accessibility
- **Labels**: All inputs có clear labels với required indicators
- **Touch targets**: Min 44×44pt cho all interactive elements
- **Screen readers**: Announce step number, progress, errors
- **Focus order**: Logical top-to-bottom flow
- **Error announcements**: Auto-announce khi validation fails
- **Image alt text**: Descriptive labels cho uploaded photos
- **Keyboard navigation**: Support cho external keyboards

### Performance
- **Image optimization**: Compress trước khi upload
- **Lazy loading**: Chỉ load step hiện tại (không pre-render all 4 steps)
- **Debounce inputs**: Character counter, validations (300ms)
- **Cancel API calls**: Cancel pending upload nếu user navigates away
- **Draft save throttle**: Lưu draft mỗi 5 giây (không mỗi keystroke)

### Analytics Tracking
Track events:
- `screen_view`: Profile Setup Step [1-4]
- `step_1_complete`: Basic info submitted
- `step_2_photo_uploaded`: Photo upload success (count)
- `step_2_photo_failed`: Photo upload failed (error type)
- `step_2_complete`: Photos submitted
- `step_3_complete`: Pickleball info submitted
- `step_4_skipped`: User skip availability
- `profile_setup_complete`: Profile created successfully
- `profile_setup_error`: Profile creation failed (error type)
- `profile_preview_opened`: User tap Preview
- `profile_draft_saved`: Draft auto-saved
- `profile_draft_resumed`: User resume từ draft
- `back_pressed_step_[N]`: User navigate back

### Security Considerations
- **Photo upload**: Validate file type server-side (prevent malicious files)
- **Age verification**: Backend validate DOB (không trust client)
- **Input sanitization**: Clean all text inputs (XSS prevention)
- **Rate limiting**: Max 3 profile create attempts per user per hour
- **Storage permissions**: Private uploads (user owns their photos)

### Future Enhancements
- **Video upload**: Allow 1 video trong profile (15s max)
- **Verification badges**: Verify skill level qua tournament records
- **Multi-language**: Support Vietnamese + English toggle
- **Smart suggestions**: Auto-suggest bio based on skill/style
- **Social proof**: "X players in your area" message
- **Gamification**: "Profile strength: 80%" meter
- **Advanced location**: Support multiple preferred areas
- **Availability templates**: "Weekday mornings" quick select
