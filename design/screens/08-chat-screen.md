# Chat Screen

## Screen Overview
1-on-1 messaging interface giữa 2 matched users. Full-featured chat với text messages, images, emoji, realtime delivery, typing indicator, và message status. Support image upload từ camera/gallery, load more messages (pagination), và options menu (view profile, unmatch, report, block). Focused trên real-time communication trải nghiệm.

## Mục đích
- Cho phép 2 matched users nhắn tin trực tiếp với nhau
- Trao đổi thông tin để lên kế hoạch chơi pickleball cùng nhau
- Chia sẻ ảnh (courts, events, moments)
- Xây dựng connection trước khi gặp mặt IRL
- Hỗ trợ realtime delivery để trải nghiệm chat mượt mà
- Cung cấp tools để manage conversation (unmatch, block, report)

---

## Các Section/Components Chính

### 1. Top Navigation Bar (Header)

**Mô tả**: Header với avatar, name, status và navigation/action buttons

**Components**:

#### A. Back Button
- **Position**: Top-left
- **Icon**: Left chevron (<) icon
- **Size**: 24px icon, 44×44pt touch target
- **Color**: Text primary

**Tương tác**:
- **Tap** → Navigate back to Matches List (07-matches-list.md)
- **Before navigation**: Mark all messages as read
- **Haptic**: Light impact

#### B. Match Info Section (Center)

**Layout**: Vertical stack, tappable

##### Avatar
- **Size**: 40px diameter (circle)
- **Content**: Match user's avatar image
- **Border**: 1px white border
- **Online indicator**: Green dot (6px) bottom-right corner nếu online
  - **Green** (#38A169): Online now
  - **Gray** (#CBD5E0): Offline

##### Name & Status (Below Avatar)
- **Name**: Bold, 16px, text primary
- **Format**: "Sarah"
- **Online Status** (below name):
  - **If online**: "Active now" (green text, 12px)
  - **If offline**: "Active 2h ago" (gray text, 12px)
  - **Format**: Relative time (minutes, hours, days)

**Tương tác**:
- **Tap avatar/name** → Navigate to Match Detail Screen (15-match-detail.md)
- **Haptic**: Light impact
- **Visual feedback**: Slight scale (0.98)

#### C. Options Menu Button (Right)

- **Position**: Top-right
- **Icon**: Three dots (•••) vertical or horizontal
- **Size**: 24px icon, 44×44pt touch target
- **Color**: Text primary

**Tương tác**:
- **Tap** → Open Action Sheet (see Section 5)
- **Haptic**: Light impact

**Animations**:
- Button ripple effect on tap
- Action sheet slide up

---

### 2. Message List (Main Content)

**Mô tả**: Scrollable list của messages, displayed in chronological order (oldest → newest), inverted scroll (newest at bottom)

**Components**:

#### A. List Container
- **Layout**: FlatList, inverted (scroll from bottom)
- **Scroll direction**: Vertical
- **Default position**: Bottom (latest message visible)
- **Scroll indicator**: Standard scrollbar (auto-hide)
- **Background**: Light gray (#F7FAFC) light mode, Dark gray (#1A202C) dark mode

#### B. Message Items

**Layout**: Messages grouped by sender, với timestamp headers

##### Timestamp Header (Grouped by Date)
- **Show**: Once per date group (Today, Yesterday, Dec 25, etc.)
- **Position**: Centered horizontally
- **Style**: Small pill chip
- **Background**: Semi-transparent gray (rgba(0,0,0,0.1))
- **Text**: Bold, 12px, text secondary
- **Format**:
  - "Today" (if today)
  - "Yesterday" (if yesterday)
  - "Monday" (2-6 days ago)
  - "Dec 25" (> 7 days ago)
- **Padding**: 4px vertical, 8px horizontal
- **Border radius**: 12px

##### Message Bubble

**Two types**: Sent (by me) vs Received (from match)

###### Sent Message Bubble (Right side)

**Layout**:
```
                         [Message Content]
                         [Status + Time]
```

**Bubble Style**:
- **Background**: Brand primary (#FF6B35 orange)
- **Text color**: White
- **Border radius**: 16px (rounded corners)
  - Top-right: 4px (less rounded - tail effect)
  - Other corners: 16px
- **Max width**: 70% screen width
- **Padding**: 12px horizontal, 10px vertical
- **Alignment**: Right side
- **Shadow**: Subtle shadow (0px 2px 4px rgba(0,0,0,0.1))

**Content**:
- **Text**: Font 16px, regular, white
- **Word wrap**: Yes
- **Link detection**: Auto-detect URLs, phone, email (underlined)

**Status & Time Row** (Below bubble, right-aligned):
- **Timestamp**: 12px, text secondary (gray)
- **Format**: "14:30" (24h format) or "2:30 PM" (12h based on locale)
- **Status Icons** (right of timestamp):
  - **Sending**: Clock icon (⏰) gray (optimistic state)
  - **Sent**: Single checkmark (✓) gray
  - **Delivered**: Double checkmark (✓✓) gray
  - **Read**: Double checkmark (✓✓) blue/brand color
- **Icon size**: 16px

**Spacing**:
- **Between consecutive sent messages**: 2px (tight grouping)
- **Before received message**: 12px (clear separation)

###### Received Message Bubble (Left side)

**Layout**:
```
[Avatar] [Message Content]
         [Time]
```

**Avatar** (Left):
- **Size**: 32px circle (small)
- **Position**: Bottom-aligned với bubble
- **Show**: Only on LAST message trong consecutive group
- **Hide**: If multiple consecutive received messages (to reduce clutter)

**Bubble Style**:
- **Background**: White (light mode), #2D3748 (dark mode)
- **Text color**: Text primary (#2D3748 light mode, white dark mode)
- **Border radius**: 16px
  - Top-left: 4px (less rounded - tail effect)
  - Other corners: 16px
- **Max width**: 70% screen width
- **Padding**: 12px horizontal, 10px vertical
- **Alignment**: Left side
- **Border**: 1px light gray (#E2E8F0) (light mode only)
- **Shadow**: None (flat design)

**Content**:
- **Text**: Font 16px, regular, text primary
- **Word wrap**: Yes
- **Link detection**: Auto-detect URLs, phone, email (underlined, tappable)

**Time** (Below bubble, left-aligned):
- **Timestamp**: 12px, text secondary
- **Format**: "14:30"

**Spacing**:
- **Between consecutive received messages**: 2px (tight grouping)
- **Before sent message**: 12px

##### Image Message

**Two variations**: Sent vs Received (same side logic as text)

###### Image Content
- **Display**: Thumbnail preview trong bubble
- **Size**: Max 200px width × 250px height (maintains aspect ratio)
- **Border radius**: 12px
- **Loading state**: Skeleton shimmer while loading
- **Compression**: Optimized for chat (max 1024px longest side)
- **Format**: JPEG or PNG

**Bubble Style**:
- **Background**: Transparent or minimal padding (image is main content)
- **Padding**: 4px around image
- **Caption** (optional): Text below image, same styling as text message

**Tương tác**:
- **Tap image** → Open fullscreen image viewer (see Section 3)
- **Haptic**: Light impact
- **Long press** → Show action menu (Copy, Save, Delete)

**Status & Time**: Same as text message

###### Image Upload State (Sent messages only)

**While uploading**:
- **Show**: Image thumbnail với progress overlay
- **Progress bar**: Circular progress indicator (0-100%)
- **Background**: Semi-transparent black overlay
- **Cancel button**: X icon (top-right corner)

**Tương tác**:
- **Tap Cancel** → Cancel upload, remove message

**Failed Upload**:
- **Show**: Image với red error icon overlay
- **Text**: "Failed to send" (below image)
- **Retry button**: "Retry" text button (tappable)

**Tương tác**:
- **Tap Retry** → Retry upload
- **Long press** → Delete failed message

##### Typing Indicator

**Show when**: Match is typing (realtime event)

**Layout**:
```
[Avatar] [Typing Animation]
```

**Components**:
- **Avatar**: 32px circle (match's avatar), left side
- **Bubble**: White background (light mode), dark gray (dark mode)
- **Animation**: Three animated dots (•••) bouncing sequentially
- **Dot color**: Gray (#A0AEC0)
- **Dot size**: 6px each
- **Spacing**: 4px between dots
- **Animation duration**: 1.5s loop

**Behavior**:
- **Appears**: When match starts typing
- **Disappears**: When match stops typing (5s timeout) OR match sends message
- **Position**: Always at bottom of message list (above input area)

**Animation**:
- Dots bounce up/down (5px) in sequence
- Smooth ease-in-out timing

#### C. Load More Messages (Pagination)

**Trigger**: User scrolls to top of message list

**Behavior**:
1. Detect when scroll position is near top (within 100px)
2. Fetch previous 30 messages from API
3. Prepend to message list (smooth transition)
4. Maintain scroll position (no jump)

**Loading State**:
- **Indicator**: Small spinner at top of list
- **Text**: "Loading more..." (12px, gray)
- **Duration**: Until API returns data

**End of History**:
- **Show**: When no more messages available
- **Text**: "Beginning of conversation" (12px, gray, centered)
- **Style**: Faded text, top of list

#### D. Scroll to Bottom Button (FAB)

**Show when**: User scrolls up (> 300px from bottom)

**Components**:
- **Button**: Floating Action Button (FAB)
- **Position**: Bottom-right corner (above input area)
- **Icon**: Down chevron (↓) icon
- **Background**: Brand primary (#FF6B35) with shadow
- **Size**: 48px diameter
- **Badge**: Unread count (if new messages arrived while scrolled up)
  - **Style**: Small red circle (16px) top-right corner
  - **Text**: Number (white, bold, 10px)
  - **Max**: "9+" if > 9

**Tương tác**:
- **Tap** → Smooth scroll to bottom (latest message)
- **Haptic**: Light impact
- **Animation**: Fade in/out on scroll

**Behavior**:
- **Hide**: When already at bottom (within 50px)
- **Show**: When scrolled up
- **Auto-dismiss**: When user manually scrolls to bottom

**Animations**:
- Button tap: Scale 0.95 → 1.0
- Scroll: Animated scroll (300ms ease-out)
- Fade in: 200ms
- Fade out: 200ms

---

### 3. Fullscreen Image Viewer

**Mô tả**: Modal overlay để xem ảnh fullscreen, với zoom/pan support

**Trigger**: Tap image message trong chat

**Components**:

#### A. Image Container
- **Background**: Black (rgba(0,0,0,0.95))
- **Layout**: Center screen, fill available space
- **Image**: Full resolution (load from server)
- **Fit mode**: Aspect fit (entire image visible)

**Gestures**:
- **Pinch**: Zoom in/out (min 1x, max 3x)
- **Pan**: Move image when zoomed in
- **Double tap**: Toggle zoom (1x ↔ 2x)
- **Swipe down**: Dismiss viewer (if not zoomed)

#### B. Close Button
- **Position**: Top-right corner (safe area)
- **Icon**: X icon (white)
- **Size**: 32px icon, 44×44pt touch target
- **Background**: Semi-transparent black circle

**Tương tác**:
- **Tap** → Dismiss viewer, return to chat
- **Haptic**: Light impact

#### C. Action Buttons (Bottom)

**Button 1: Save to Gallery**
- **Icon**: Download icon (⬇)
- **Text**: "Save"
- **Style**: White text + icon

**Tương tác**:
- **Tap** → Save image to device gallery
- **Request permission**: If first time (iOS/Android permission)
- **Success toast**: "Saved to gallery"
- **Error toast**: "Failed to save. Check permissions."

**Button 2: Share**
- **Icon**: Share icon (↗)
- **Text**: "Share"
- **Style**: White text + icon

**Tương tác**:
- **Tap** → Open native share sheet (share via other apps)

**Animations**:
- Viewer open: Fade in + scale from thumbnail (300ms)
- Viewer close: Fade out + scale to thumbnail (300ms)
- Zoom: Smooth animated zoom
- Pan: Follow gesture (no lag)

---

### 4. Input Area (Bottom, Sticky)

**Mô tả**: Message input với attachment options and send button

**Components**:

#### A. Container
- **Position**: Bottom of screen (fixed, always visible)
- **Background**: White (light mode), #2D3748 (dark mode)
- **Top border**: 1px light gray (#E2E8F0)
- **Padding**: 8px horizontal, 8px vertical (+ safe area inset)
- **Layout**: Horizontal row

#### B. Image Attach Button (Left)

**Icon**: Plus (+) or Image icon (📷)
- **Size**: 36px circle button
- **Color**: Gray icon, transparent background
- **Touch target**: 44×44pt

**Tương tác**:
- **Tap** → Open Image Picker Action Sheet (see Section 6)
- **Haptic**: Light impact

#### C. Text Input Field (Center, Flex Grow)

**Style**:
- **Background**: Light gray (#F7FAFC) light mode, darker gray dark mode
- **Border radius**: 20px (pill shape)
- **Padding**: 10px horizontal, 8px vertical
- **Font**: 16px, regular, text primary
- **Placeholder**: "Message Sarah..." (dynamic với match name)
- **Placeholder color**: Text secondary (gray)
- **Min height**: 40px
- **Max height**: 120px (auto-grow to 5 lines, then scroll)
- **Multiline**: Yes

**Behavior**:
- **Auto-grow**: Height increases as user types (up to 5 lines)
- **Auto-focus**: Focus on screen enter (keyboard opens)
- **Return key**: "Send" button on keyboard (iOS/Android)
- **Typing indicator**: Trigger realtime event to match (debounced 500ms)

**Tương tác**:
- **Type text** → Enable send button (if text non-empty)
- **Press Return key (on keyboard)** → Send message
- **Paste image** → Auto-attach image (if supported)

**Validations**:
- **Max length**: 5000 characters (soft limit, warning at 4900)
- **Empty message**: Cannot send (button disabled)

#### D. Emoji Button (Right of Input)

**Icon**: Emoji icon (😊)
- **Size**: 32px icon
- **Color**: Gray
- **Position**: Inside input field, right side

**Tương tác**:
- **Tap** → Toggle emoji picker (see Section 7)
- **Haptic**: Light impact

#### E. Send Button (Right)

**Style**:
- **Background**: Brand primary (#FF6B35) circle
- **Icon**: Send arrow (➤) white
- **Size**: 36px diameter
- **Position**: Right of input field

**States**:
- **Disabled** (no text): Gray background, 50% opacity
- **Enabled** (has text): Full color, 100% opacity

**Tương tác**:
- **Tap** → Send message:
  1. Validate: Check text non-empty
  2. Optimistic UI: Add message to list immediately (status = "sending")
  3. Clear input field
  4. Collapse input field height (reset to 40px)
  5. Scroll to bottom (show new message)
  6. Call API: POST /api/messages
  7. If success:
     - Update message status: sent → delivered
     - Trigger realtime event to match
  8. If error:
     - Update message status: failed
     - Show "Failed to send" below message
     - Show retry button
- **Haptic**: Medium impact (on success)

**Animations**:
- Button scale: 0.9 → 1.0 on tap
- Rotate send icon: 0° → 360° while sending (1 rotation)
- Fade: Disabled ↔ enabled (200ms)

**Keyboard Behavior**:
- **iOS**: Keyboard docked to input area (follows when scrolling)
- **Android**: Keyboard pushes content up (input stays visible)
- **Dismiss keyboard**: Tap outside input, scroll message list, navigate away

---

### 5. Action Sheet (Options Menu)

**Mô tả**: Bottom sheet với action options cho conversation

**Trigger**: Tap Options button (•••) in header

**Components**:

#### A. Sheet Container
- **Height**: Auto (fit content, ~300px)
- **Position**: Slide up from bottom
- **Backdrop**: Semi-transparent black (rgba(0,0,0,0.5))
- **Gesture**: Swipe down to dismiss

#### B. Sheet Header
- **Avatar**: 40px circle (match's avatar)
- **Name**: Bold, 18px, text primary
- **Text**: "Chat with [Name]"
- **Position**: Top of sheet, centered
- **Padding**: 16px vertical

#### C. Action Options (List)

**Option 1: View Profile**
- **Icon**: User icon (👤)
- **Text**: "View Profile"
- **Subtext**: "See [Name]'s full profile"
- **Style**: Default (black text)

**Tương tác**:
- **Tap** → Navigate to Match Detail Screen (15-match-detail.md)
- **Close sheet**

**Option 2: Unmatch**
- **Icon**: X icon (✕)
- **Text**: "Unmatch"
- **Subtext**: "Delete conversation and unmatch"
- **Style**: Destructive (red text)

**Tương tác**:
- **Tap** → Trigger Unmatch Confirmation (see Section 8)
- **Close sheet**

**Option 3: Report**
- **Icon**: Flag icon (🚩)
- **Text**: "Report"
- **Subtext**: "Report inappropriate behavior"
- **Style**: Destructive (red text)

**Tương tác**:
- **Tap** → Trigger Report Sheet (same as 07-matches-list.md Section 6)
- **Close sheet**

**Option 4: Block**
- **Icon**: Block icon (🚫)
- **Text**: "Block"
- **Subtext**: "Block and unmatch [Name]"
- **Style**: Destructive (red text)
- **Note**: Most severe action, cannot undo easily

**Tương tác**:
- **Tap** → Trigger Block Confirmation (see Section 9)
- **Close sheet**

**Option 5: Cancel**
- **Text**: "Cancel"
- **Style**: Bold text, separate section (top border)

**Tương tác**:
- **Tap** → Close sheet, no action

**Animations**:
- Sheet slide up: 250ms ease-out
- Backdrop fade in: 200ms
- Dismiss: Slide down 200ms

---

### 6. Image Picker Action Sheet

**Mô tả**: Sheet để chọn cách attach image (camera vs gallery)

**Trigger**: Tap Image Attach button (+) trong input area

**Components**:

#### A. Sheet Container
- **Height**: Auto (fit content, ~180px)
- **Position**: Slide up from bottom

#### B. Options

**Option 1: Take Photo**
- **Icon**: Camera icon (📷)
- **Text**: "Take Photo"

**Tương tác**:
- **Tap** → Open camera:
  1. Request camera permission (if first time)
  2. Open native camera app
  3. User takes photo
  4. Return with photo → Trigger Image Upload Flow
- **Close sheet**

**Option 2: Choose from Gallery**
- **Icon**: Gallery icon (🖼)
- **Text**: "Choose from Gallery"

**Tương tác**:
- **Tap** → Open gallery picker:
  1. Request photo library permission (if first time)
  2. Open native photo picker
  3. User selects photo
  4. Return with photo → Trigger Image Upload Flow
- **Close sheet**

**Option 3: Cancel**
- **Text**: "Cancel"

**Tương tác**:
- **Tap** → Close sheet, no action

**Animations**:
- Sheet slide up: 200ms ease-out

---

### 7. Emoji Picker

**Mô tả**: Modal overlay với emoji selector

**Trigger**: Tap Emoji button (😊) in input area

**Components**:

#### A. Picker Container
- **Position**: Above keyboard (replaces keyboard)
- **Height**: ~250px (standard emoji picker height)
- **Background**: White (light mode), dark gray (dark mode)
- **Top border**: 1px light gray

#### B. Emoji Categories (Tabs)
- **Categories**: Smileys, People, Animals, Food, Travel, Objects, Symbols, Flags
- **Layout**: Horizontal scrollable tabs (top)
- **Active tab**: Underline indicator (brand primary color)

#### C. Emoji Grid
- **Layout**: Grid (7-8 columns, depends on screen width)
- **Emoji size**: 32px each
- **Spacing**: 8px between emojis
- **Scroll**: Vertical scrolling per category

**Tương tác**:
- **Tap emoji** → Insert emoji at cursor position trong text input
- **Long press emoji** → Show skin tone variants (if applicable)
- **Swipe down** → Close emoji picker, show keyboard

**Search** (Optional):
- **Search bar**: Top of picker
- **Placeholder**: "Search emoji..."
- **Behavior**: Filter emojis realtime

**Recently Used** (First category):
- **Show**: Last 20 emojis used by user
- **Persistent**: Saved locally (AsyncStorage)

**Behavior**:
- **Toggle**: Tap emoji button again → Close picker, show keyboard
- **Auto-close**: When send message, picker closes

**Animations**:
- Open: Slide up from bottom (200ms)
- Close: Slide down (200ms)

---

### 8. Unmatch Confirmation Dialog

**Mô tả**: Alert dialog để confirm unmatch action (same as 07-matches-list.md)

**Trigger**: User taps Unmatch in Action Sheet

**Components**:

#### A. Dialog Container
- **Position**: Center screen
- **Size**: 85% screen width (max 320px)
- **Style**: White card với shadow, rounded corners (12px)
- **Backdrop**: Semi-transparent black (rgba(0,0,0,0.6))

#### B. Dialog Header
- **Icon**: Warning icon (⚠️) yellow/orange
- **Title**: "Unmatch [Name]?"
- **Font**: Bold, 18px, centered

#### C. Dialog Content
**Message Text**:
- **Line 1**: "Are you sure you want to unmatch?"
- **Line 2**: "• Your conversation will be deleted"
- **Line 3**: "• This action cannot be undone"
- **Font**: Regular, 14px, text secondary
- **Alignment**: Left-aligned, bulleted list

#### D. Dialog Actions

**Cancel Button** (Left):
- **Text**: "Cancel"
- **Style**: Outline button, gray border

**Tương tác**:
- **Tap** → Close dialog, no action

**Confirm Button** (Right):
- **Text**: "Unmatch"
- **Style**: Solid red button (#E53E3E)

**Tương tác**:
- **Tap** → Execute unmatch:
  1. Show loading spinner on button
  2. Call API: POST /api/matches/unmatch
  3. If success:
     - Navigate back to Matches List (07-matches-list.md)
     - Remove match from list (handled by list screen)
     - Show toast: "Đã unmatch với [Name]"
  4. If error:
     - Show error toast: "Không thể unmatch. Thử lại sau."
     - Keep dialog open

**Animations**:
- Dialog appear: Scale 0.9 → 1.0, fade in (200ms)
- Backdrop: Fade in (150ms)
- Dismiss: Fade out (150ms)

---

### 9. Block Confirmation Dialog

**Mô tả**: Alert dialog để confirm block action (most severe)

**Trigger**: User taps Block in Action Sheet

**Components**:

#### A. Dialog Container
- Same as Unmatch Dialog

#### B. Dialog Header
- **Icon**: Stop icon (🛑) red
- **Title**: "Block [Name]?"
- **Font**: Bold, 18px, centered

#### C. Dialog Content
**Message Text**:
- **Line 1**: "Are you sure you want to block this user?"
- **Line 2**: "• They won't be able to message you"
- **Line 3**: "• You will be unmatched"
- **Line 4**: "• Your conversation will be deleted"
- **Line 5**: "• They won't be shown in your discovery"
- **Font**: Regular, 14px, text secondary

#### D. Dialog Actions

**Cancel Button** (Left):
- **Text**: "Cancel"
- **Style**: Outline button

**Confirm Button** (Right):
- **Text**: "Block"
- **Style**: Solid red button (#E53E3E)

**Tương tác**:
- **Tap** → Execute block:
  1. Show loading spinner
  2. Call API: POST /api/users/block
  3. If success:
     - Navigate back to Matches List
     - Remove from list
     - Show toast: "Đã block [Name]"
  4. If error:
     - Show error toast: "Không thể block. Thử lại sau."

**Animations**: Same as Unmatch Dialog

---

### 10. Blocked State (If Match Blocked You)

**Mô tả**: Screen state khi match đã block user

**Trigger**: Load chat và detect match blocked current user

**UI**:

#### A. Empty State
- **Illustration**: Blocked icon (🚫) large, centered
- **Title**: "You can't message this person"
- **Subtitle**: "This user has blocked you or deleted their account."
- **Font**: Bold 20px title, regular 14px subtitle
- **Alignment**: Center screen

#### B. Back Button (Only)
- **Show**: Back button in header (only navigation available)
- **No other actions**: Options menu hidden

**Note**: User cannot send messages, cannot unmatch (already blocked by other side)

---

## Navigation

**Đến screen này từ**:
- **07-matches-list.md** - Tap match item (primary entry)
- **06-home-swipe.md** - Tap "Send Message" sau khi match
- **15-match-detail.md** - Tap "Send Message" button on profile
- **Push Notification** - Tap new message notification (deep link)

**Từ screen này đến**:
- **07-matches-list.md** - Tap Back button (return to list)
- **15-match-detail.md** - Tap avatar/name in header or "View Profile" in options
- **Image Fullscreen Viewer** (Section 3) - Tap image message
- **Device Camera** - Take photo flow
- **Device Gallery** - Choose photo flow

---

## States

### Default State (Active Chat)
- Message list loaded, scrolled to bottom (latest message visible)
- Input area visible, keyboard collapsed
- All messages marked as read
- Realtime updates active (WebSocket connected)
- Send button disabled (no text)
- Online status up-to-date

### Loading State (Initial Load)
**Trigger**: First time opening chat với match

**UI**:
- Show skeleton message bubbles (3-5 items)
- Shimmer animation
- Input area disabled
- Duration: Until API returns messages

### Loaded State (Has Messages)
- All messages rendered
- Scroll enabled
- Input area interactive
- Typing indicator may appear (if match typing)
- Send button state depends on text input

### Empty State (No Messages Yet)
**Trigger**: New match, no messages sent yet

**UI**:
- **Illustration**: Friendly empty state graphic (speech bubbles)
- **Title**: "Say hi to [Name]!"
- **Subtitle**: "Start the conversation and plan your next pickleball match."
- **Position**: Center screen
- **Input area**: Still visible and functional (user can type first message)

### Typing State
**Trigger**: Match is typing (realtime event)

**UI**:
- Typing indicator appears at bottom of message list
- Auto-scroll to bottom (to show typing indicator)
- Duration: Until match stops typing OR match sends message (max 5s)

### Sending Message State
**Trigger**: User taps Send button

**UI**:
- New message appears immediately (optimistic UI)
- Message status: "Sending..." (clock icon)
- Send button shows loading spinner briefly (200ms)
- Input field cleared and collapsed to min height
- Auto-scroll to bottom

### Message Sent State
**Trigger**: API confirms message sent

**UI**:
- Message status: Sent (single checkmark ✓)
- Timestamp updated to server time

### Message Delivered State
**Trigger**: Match's device receives message (realtime event)

**UI**:
- Message status: Delivered (double checkmark ✓✓)

### Message Read State
**Trigger**: Match opens chat and sees message (realtime event)

**UI**:
- Message status: Read (double checkmark ✓✓ blue)

### Image Uploading State
**Trigger**: User selects image to send

**UI**:
- Image message appears với progress overlay
- Circular progress indicator (0-100%)
- Cancel button visible
- Send button disabled (prevent sending while uploading)
- Duration: Until upload complete (typically 2-5s)

### Image Upload Failed State
**Trigger**: Upload error (network, server, file too large)

**UI**:
- Image với red error icon overlay
- Text: "Failed to send"
- Retry button visible
- Message removable (long press → delete)

### Scrolled Up State
**Trigger**: User scrolls up to view older messages

**UI**:
- Scroll to Bottom FAB appears (bottom-right)
- Badge on FAB shows unread count (if new messages arrive)
- Auto-scroll disabled (user in control)

### Load More State
**Trigger**: User scrolls near top (pagination)

**UI**:
- Small spinner at top of list
- Text: "Loading more..."
- Fetch previous 30 messages
- Maintain scroll position (no jump)

### Image Fullscreen State
**Trigger**: Tap image message

**UI**:
- Modal overlay (fullscreen image viewer)
- Black background
- Image centered, zoomable
- Close button (top-right)
- Action buttons (bottom): Save, Share

### Options Menu Open State
**Trigger**: Tap Options button (•••)

**UI**:
- Action sheet overlay visible
- Backdrop dims screen
- Options interactive (View Profile, Unmatch, Report, Block, Cancel)

### Unmatch/Block Dialog Open State
**Trigger**: Confirm destructive action

**UI**:
- Dialog centered on screen
- Backdrop dims background
- Buttons interactive
- Main screen not interactive

### Blocked State (Match Blocked Me)
**Trigger**: Detect user is blocked by match

**UI**:
- Empty state: "You can't message this person"
- Input area hidden (cannot send messages)
- Options menu hidden (no actions available)
- Only Back button visible

### Network Error State
**Trigger**: No internet, API error

**UI**:
- Show cached messages (if available)
- Toast: "Không có kết nối. Tin nhắn có thể không mới nhất."
- Input area still functional (queue messages locally)
- Send button works (queue messages for later)
- Retry banner (top): "Reconnecting..." with spinner

### Realtime Disconnected State
**Trigger**: WebSocket connection lost

**UI**:
- Fallback to polling (every 10s)
- Subtle indicator (bottom): "Reconnecting..." text (gray)
- Auto-reconnect attempts in background
- User can continue chatting (messages queued)

---

## Edge Cases

1. **Match deletes account mid-chat**: Show "User không còn tồn tại" toast, navigate back to Matches List
2. **Match unmatch while typing**: Save draft locally, show "Match đã unmatch" toast, navigate back
3. **Both users send message simultaneously**: Both messages appear in correct chronological order (server timestamp)
4. **Message failed to send, user leaves screen**: Save failed message locally, retry when user returns
5. **Image too large (> 10MB)**: Show error toast "Ảnh quá lớn. Tối đa 10MB", reject upload
6. **Image format not supported**: Show error toast "Định dạng không hỗ trợ. Chỉ JPG/PNG", reject
7. **User rapid tap Send button**: Debounce, only send once (prevent duplicate messages)
8. **Very long message (> 5000 chars)**: Show warning at 4900 chars, hard limit at 5000 (cannot type more)
9. **Message contains only whitespace**: Treat as empty, disable Send button
10. **Timestamp in future (clock skew)**: Handle gracefully, use server timestamp (not client)
11. **Avatar failed to load**: Show colored placeholder circle với first letter (like Gmail)
12. **Emoji-only message**: Display normally (no special handling needed)
13. **Link in message**: Auto-detect, make tappable (open in-app browser or external)
14. **Copy/paste long text**: Support, but enforce 5000 char limit (truncate if needed)
15. **Keyboard covers input on Android**: Adjust layout (push content up), ensure input visible
16. **User blocks match during chat**: Immediately unmatch, navigate back, show confirmation
17. **Multiple images selected (future)**: For now, only 1 image at a time (MVP limitation)
18. **Image viewer dismissed while still loading**: Cancel load, return to chat
19. **User leaves app while image uploading**: Continue upload in background (if possible), otherwise queue
20. **Message deleted by other user** (future feature): Show "[Name] deleted a message" placeholder

---

## Ghi chú

### UX Considerations
- **Realtime feel**: Messages appear instantly (no manual refresh), feels live
- **Optimistic UI**: Messages show immediately before server confirms (perceived speed)
- **Typing indicator**: Shows match is engaged, reduces "double message" confusion
- **Read receipts**: Transparency (user knows if message was seen), builds trust
- **Auto-scroll**: Always stay at bottom when new messages arrive (unless user scrolled up intentionally)
- **Scroll to Bottom FAB**: Easy way to jump to latest (especially after scrolling up)
- **Image preview in chat**: No need to download to see image (instant preview)
- **Fullscreen image**: Zoom/pan for details (important for court photos)
- **Message grouping**: Tight spacing for same sender (reduces clutter), clear separation between senders
- **Avatar on last received message**: Shows who sent (without repeating on every message)
- **Timestamp headers**: Clear date context (Today, Yesterday, specific date)
- **Input auto-grow**: Multiline support (long messages), but limit to 5 lines (prevent huge input)
- **Emoji picker**: Quick access to emojis (more expressive communication)
- **Image from camera or gallery**: Flexibility (take photo now vs use existing)
- **Send button state**: Visual feedback (enabled/disabled based on text presence)
- **Destructive action confirmation**: Prevent accidental unmatch/block (cannot undo)
- **Options menu**: Easy access to profile, unmatch, report, block (all in one place)
- **Block vs Unmatch**: Clear difference (block is more severe, prevents future contact)
- **Empty state encouragement**: "Say hi!" CTA (reduces barrier to first message)

### Animations & Performance
- **Target**: 60 FPS scrolling, no jank (even with 100+ messages)
- **List optimization**: Use FlatList với optimizations:
  - `inverted`: True (newest at bottom)
  - `keyExtractor`: Unique message_id
  - `getItemLayout`: Variable height (text vs image), memoize calculations
  - `removeClippedSubviews`: True (Android perf)
  - `maxToRenderPerBatch`: 10
  - `windowSize`: 10
- **Image optimization**:
  - Thumbnails: 200×250px display → Load 400×500px @ 2x
  - Use `react-native-fast-image` với aggressive caching
  - Lazy load: Only load images visible on screen
  - Compress before upload: Max 1024px longest side, JPEG 80% quality
- **Realtime efficiency**:
  - Batch updates: Group multiple events trong 100ms window
  - Debounce typing indicator: Send typing event max once per 500ms
  - Only update visible messages (skip off-screen status updates)
- **Animation library**: React Native Reanimated v4
  - Scroll: Native driver (60 FPS smooth)
  - Swipe gestures: UI thread animation
  - Typing indicator: Lottie animation or pure RN Animated
  - Send button: Rotate animation on UI thread
- **Pagination**: Load 30 messages initially, +30 when scroll near top
- **Memory management**: Recycle message items (FlatList), unload off-screen images
- **Input performance**: Debounce typing indicator event (prevent API spam)
- **Auto-scroll**: Animated scroll (300ms ease-out) feels smooth, not jarring

### Validations & Error Handling
- **Empty message**: Cannot send (button disabled)
- **Whitespace-only**: Treat as empty
- **Max length**: 5000 chars (show warning at 4900)
- **Image size**: Max 10MB (enforce client-side, reject before upload)
- **Image format**: JPG/PNG only (reject GIF, WebP for now)
- **Network error**: Queue messages locally, retry when online
- **Upload error**: Show clear error, allow retry or delete
- **Blocked state**: Clear messaging, no confusing errors
- **Rate limiting**: Client-side debounce (prevent spam), server-side rate limit (10 messages/min)
- **Input sanitization**: Prevent XSS trong message content (backend responsible)
- **Link detection**: Validate URLs before making tappable (prevent malicious links)

### Technical Notes

#### API Endpoints

##### GET /api/messages
**Purpose**: Fetch messages trong conversation

**Query Params**:
```json
{
  "conversation_id": "conv_uuid",
  "limit": 30,
  "before": "message_id" // For pagination (load older)
}
```

**Response** (200):
```json
{
  "messages": [
    {
      "id": "msg_uuid",
      "conversation_id": "conv_uuid",
      "sender_id": "user_uuid",
      "content": "Hey! Let's play this weekend?",
      "type": "text", // or "image"
      "image_url": null, // or "https://..." if type=image
      "status": "read", // sent, delivered, read
      "created_at": "2025-12-30T14:30:00Z",
      "read_at": "2025-12-30T14:35:00Z"
    }
  ],
  "has_more": true,
  "conversation": {
    "id": "conv_uuid",
    "match_id": "match_uuid",
    "participants": ["user1_uuid", "user2_uuid"]
  }
}
```

##### POST /api/messages
**Purpose**: Send new message

**Body**:
```json
{
  "conversation_id": "conv_uuid",
  "content": "Hey! Let's play this weekend?",
  "type": "text", // or "image"
  "image_url": null // or "https://..." if type=image
}
```

**Response** (201):
```json
{
  "message": {
    "id": "msg_uuid",
    "conversation_id": "conv_uuid",
    "sender_id": "user_uuid",
    "content": "Hey! Let's play this weekend?",
    "type": "text",
    "status": "sent",
    "created_at": "2025-12-30T14:30:00Z"
  }
}
```

##### POST /api/messages/upload-image
**Purpose**: Upload image để send như message

**Body**: FormData
- `image`: File (JPEG/PNG)
- `conversation_id`: UUID

**Response** (200):
```json
{
  "image_url": "https://cdn.example.com/images/msg_image_uuid.jpg",
  "thumbnail_url": "https://cdn.example.com/images/msg_image_uuid_thumb.jpg"
}
```

**Response** (400):
```json
{
  "error": "Image too large. Max 10MB."
}
```

##### POST /api/messages/mark-read
**Purpose**: Mark messages as read

**Body**:
```json
{
  "conversation_id": "conv_uuid",
  "message_ids": ["msg_uuid_1", "msg_uuid_2"]
}
```

**Response** (200):
```json
{
  "success": true,
  "marked_count": 2
}
```

##### GET /api/conversations/:id
**Purpose**: Get conversation details và check if blocked

**Response** (200):
```json
{
  "conversation": {
    "id": "conv_uuid",
    "match_id": "match_uuid",
    "participants": [
      {
        "id": "user1_uuid",
        "display_name": "Sarah",
        "avatar_url": "https://...",
        "is_online": true,
        "last_active": "2025-12-30T14:35:00Z"
      },
      // current user
    ],
    "is_blocked": false, // true if current user is blocked
    "blocked_by": null // user_id nếu blocked
  }
}
```

**Response** (403):
```json
{
  "error": "You are blocked by this user"
}
```

#### State Management

**Global State** (Zustand/Redux):
- `currentConversation`: Conversation object
- `messages`: Array of message objects
- `messagesLoading`: boolean
- `messagesError`: string | null
- `isTyping`: boolean (match is typing)
- `realtimeConnected`: boolean

**Actions**:
- `fetchMessages(conversationId, before?)`: Load messages (initial + pagination)
- `sendMessage(conversationId, content, type)`: Send text/image message
- `uploadImage(conversationId, imageFile)`: Upload image before sending
- `markAsRead(conversationId, messageIds)`: Mark messages as read
- `subscribeToConversation(conversationId)`: Setup realtime updates
- `unsubscribeFromConversation()`: Cleanup realtime
- `setTyping(conversationId, isTyping)`: Send typing indicator event

**Local State** (React):
- `inputText`: string (text input value)
- `inputHeight`: number (auto-grow height)
- `showEmojiPicker`: boolean
- `selectedImage`: Image | null (before upload)
- `uploadProgress`: number (0-100)
- `actionSheetVisible`: boolean
- `unmatchDialogVisible`: boolean
- `blockDialogVisible`: boolean
- `fullscreenImage`: string | null (image URL)
- `scrollOffset`: number (track scroll position)

**Persistence** (AsyncStorage):
- `messages_cache_${conversationId}`: JSON (offline fallback)
- `draft_message_${conversationId}`: string (save draft when user leaves)
- `failed_messages_${conversationId}`: JSON (retry queue)

#### Realtime Subscriptions (Supabase)

**Subscription: messages table**
```typescript
supabase
  .channel(`conversation:${conversationId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `conversation_id=eq.${conversationId}`
  }, (payload) => {
    // New message received
    if (payload.new.sender_id !== currentUserId) {
      addMessageToList(payload.new);
      markAsRead([payload.new.id]); // Auto-mark as read if chat open
      scrollToBottom();
    }
  })
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'messages',
    filter: `conversation_id=eq.${conversationId}`
  }, (payload) => {
    // Message status updated (sent → delivered → read)
    updateMessageStatus(payload.new.id, payload.new.status, payload.new.read_at);
  })
  .subscribe();
```

**Subscription: typing indicator**
```typescript
supabase
  .channel(`typing:${conversationId}`)
  .on('broadcast', { event: 'typing' }, (payload) => {
    // Match is typing
    if (payload.user_id !== currentUserId) {
      setIsTyping(true);
      // Auto-clear after 5s
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => setIsTyping(false), 5000);
    }
  })
  .subscribe();
```

**Subscription: user presence (online status)**
```typescript
supabase
  .channel(`presence:${matchUserId}`)
  .on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState();
    updateOnlineStatus(state[matchUserId]);
  })
  .subscribe();
```

#### Image Handling

**Upload Flow**:
1. User selects image từ camera/gallery
2. Compress image client-side:
   - Max dimension: 1024px (longest side)
   - Format: JPEG
   - Quality: 80%
   - Library: `react-native-image-resizer`
3. Upload to Supabase Storage:
   - Bucket: `message-images`
   - Path: `${conversationId}/${messageId}.jpg`
   - Generate signed URL (expiry 1 year)
4. Send message với `type: "image"`, `image_url: signed_url`

**Display**:
- Thumbnail trong chat: 200×250px (cover fit)
- Fullscreen: Original resolution (up to 1024px)
- Cache: `react-native-fast-image` với aggressive cache policy
- Fallback: Gray placeholder if load fails

**Security**:
- Signed URLs: Prevent unauthorized access
- Size limit: 10MB client-side, 15MB server-side (safety margin)
- Format validation: Server checks MIME type (prevent malicious files)
- Virus scan: Optional (future enhancement)

#### Message Status Flow

**States**:
1. **Sending** (optimistic): Client adds message to list immediately
2. **Sent**: Server confirms receipt, message saved to DB
3. **Delivered**: Match's device receives message (realtime event)
4. **Read**: Match opens chat and views message (realtime event)

**Implementation**:
- Client sets `status: "sending"` on send
- API responds with `status: "sent"` + `created_at`
- Realtime event updates to `status: "delivered"` when match's client ACKs
- Realtime event updates to `status: "read"` + `read_at` when match marks as read

**Retry Logic**:
- If API fails: Keep `status: "sending"` → Show retry button
- Exponential backoff: Retry after 1s, 2s, 4s, 8s (max 4 retries)
- Queue: Save failed messages locally, retry when online

#### Typing Indicator

**Send Event** (Debounced):
```typescript
// Debounce: Max 1 event per 500ms
const debouncedTyping = debounce(() => {
  supabase
    .channel(`typing:${conversationId}`)
    .send({
      type: 'broadcast',
      event: 'typing',
      payload: { user_id: currentUserId, is_typing: true }
    });
}, 500);

// Trigger on text input change
onChangeText(() => {
  debouncedTyping();
});
```

**Stop Event**:
```typescript
// Send khi user stops typing (5s timeout) hoặc sends message
supabase
  .channel(`typing:${conversationId}`)
  .send({
    type: 'broadcast',
    event: 'typing',
    payload: { user_id: currentUserId, is_typing: false }
  });
```

#### Performance Optimizations

1. **FlatList optimizations**:
   - `inverted`: True (scroll to bottom)
   - `keyExtractor`: `(item) => item.id`
   - `initialNumToRender`: 20
   - `maxToRenderPerBatch`: 10
   - `windowSize`: 10
   - `getItemLayout`: Not possible (variable height), skip

2. **Memoization**:
   - Memoize message bubble component: `React.memo(MessageBubble, arePropsEqual)`
   - Only re-render if `message.status` or `message.content` changes
   - Memoize timestamp formatting (expensive)

3. **Image preloading**:
   - Preload next 5 images in background (below/above viewport)
   - Use `FastImage.preload([urls])`

4. **Debounce**:
   - Typing indicator: 500ms
   - Scroll events: 100ms (for showing FAB)
   - Mark as read: Batch updates every 1s (max 10 messages)

5. **Lazy updates**:
   - Timestamp relative time: Update every 60s (not realtime)
   - Online status: Update every 30s (not realtime)

6. **Batch API calls**:
   - Mark as read: Group message IDs, send 1 API call per batch
   - Load more: Fetch 30 messages at once (not 1-by-1)

### Design Specs

#### Message Bubble
- **Max width**: 70% screen width
- **Padding**: 12px horizontal, 10px vertical
- **Border radius**: 16px (corners), 4px (tail corner)
- **Font**: 16px, regular
- **Line height**: 22px (1.375)
- **Spacing between bubbles**: 2px (same sender), 12px (different sender)

#### Input Area
- **Height**: 40px min, 120px max (auto-grow)
- **Border radius**: 20px (pill shape)
- **Padding**: 10px horizontal, 8px vertical
- **Font**: 16px, regular
- **Placeholder color**: #A0AEC0 (gray)

#### Avatar
- **Size**: 32px (message list), 40px (header)
- **Border**: 1px white
- **Online indicator**: 6px green dot (chat list: 8px)

#### Icons
- **Size**: 24px (header icons), 16px (status icons), 32px (emoji button)
- **Color**: Gray (#718096) default, brand primary on active

#### Typing Indicator
- **Dot size**: 6px
- **Spacing**: 4px between dots
- **Animation**: Bounce 5px up/down, 1.5s loop

#### Image Message
- **Max display size**: 200×250px
- **Border radius**: 12px
- **Upload progress**: Circular, 40px diameter, white stroke

#### Emoji Picker
- **Height**: 250px
- **Emoji size**: 32px
- **Grid columns**: 7-8 (depends on screen width)
- **Tab height**: 40px

### Accessibility

- **VoiceOver/TalkBack**:
  - Message bubble: "[Name] said: [Content]. Sent at [Time]. Read." (with status)
  - Send button: "Send message" (disabled: "Send message. Cannot send empty message.")
  - Attach button: "Attach image"
  - Options button: "More options"
  - Online status: "Sarah is online now" or "Last active 2 hours ago"
- **Touch targets**: All interactive elements min 44×44pt
- **Color contrast**: WCAG AA (4.5:1 for text on background)
- **Reduce motion**: Disable fancy animations, keep essential transitions
- **Screen reader support**: All actions clearly announced

### Analytics Tracking

Track events:
- `screen_view`: Chat Screen
- `message_sent`: type (text/image), length (chars), conversation_id
- `message_received`: type, conversation_id
- `image_attached`: source (camera/gallery)
- `image_upload_success`: size_kb, duration_ms
- `image_upload_failed`: error_reason
- `emoji_picker_opened`: -
- `emoji_selected`: emoji_code
- `typing_indicator_shown`: conversation_id
- `message_status_updated`: new_status (sent/delivered/read)
- `unmatch_initiated`: source (chat_options)
- `block_initiated`: source (chat_options)
- `profile_viewed`: from (chat_header)
- `scroll_to_bottom_tap`: -
- `load_more_messages`: conversation_id, offset
- `image_fullscreen_opened`: message_id
- `image_saved`: message_id
- `realtime_connected`: -
- `realtime_disconnected`: reason

### Security Considerations

- **Authorization**: User chỉ thấy messages trong conversations mà họ là participant
- **End-to-end encryption**: Not in MVP (future enhancement)
- **Message retention**: Messages stored indefinitely (không auto-delete)
- **Image moderation**: AI scan for inappropriate content (future enhancement)
- **Rate limiting**: Max 10 messages/min (prevent spam)
- **Input sanitization**: Backend sanitize message content (XSS prevention)
- **Link detection**: Validate URLs (prevent phishing)
- **Reporting**: All reported messages logged với context (audit trail)
- **Blocked users**: Cannot send messages, conversation hidden
- **Deleted accounts**: Conversation archived, messages preserved (anonymized)

### Future Enhancements

- **Voice messages**: Record and send audio (like WhatsApp)
- **Video messages**: Short video clips (max 30s)
- **GIF support**: Send GIFs từ GIPHY/Tenor
- **Stickers**: Custom pickleball-themed stickers
- **Message reactions**: React với emoji (like FB Messenger)
- **Reply to message**: Quote previous message in reply
- **Edit message**: Edit sent message (within 15 min)
- **Delete message**: Delete for everyone (within 1 hour)
- **Forward message**: Forward to another match
- **Rich link previews**: Show preview card for URLs (image + title + description)
- **Location sharing**: Share current location or court location
- **Calendar integration**: Propose match time, add to calendar
- **Video call**: In-app video chat (integration F05 extended)
- **Message search**: Search trong conversation
- **Pin messages**: Pin important messages to top
- **Mute conversation**: Disable notifications for specific chat
- **Scheduled messages**: Send message at specific time
- **Auto-translate**: Translate messages to user's language
- **Read receipts toggle**: User can disable read receipts (privacy)
- **Disappearing messages**: Messages auto-delete after X time (like Snapchat)
- **End-to-end encryption**: Full E2E encryption (like Signal)

---

*End of Chat Screen Documentation*
