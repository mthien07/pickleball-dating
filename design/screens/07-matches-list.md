# Matches List Screen

## Screen Overview
Main screen hiển thị danh sách tất cả người đã match với user. List-based UI với avatar, name, last message preview, và unread badges. Support search, swipe actions (unmatch/report), và realtime updates. User có thể tap item để vào chat, tap avatar để xem profile, hoặc long press để show options menu.

## Mục đích
- Hiển thị danh sách tất cả matches (sorted by recent match first)
- Cho phép user nhanh chóng truy cập chat với từng match
- Cung cấp thông tin preview (last message, unread count, online status)
- Hỗ trợ actions: unmatch, report, view profile, search
- Realtime updates khi có tin nhắn mới hoặc match mới
- Empty state khuyến khích user tiếp tục swipe

---

## Các Section/Components Chính

### 1. Top Navigation Bar

**Mô tả**: Header với title và search

**Components**:

#### A. Screen Title
- **Position**: Top-left
- **Text**: "Matches" hoặc "Kết nối"
- **Font**: Bold, large (24px)
- **Color**: Text primary

#### B. Search Button
- **Position**: Top-right
- **Icon**: Magnifying glass icon (🔍)
- **Style**: Circle button với transparent background
- **Size**: 40px diameter

**Tương tác**:
- **Tap Search button** → Show search bar (see Section 2)

**Animations**:
- Button ripple effect on tap
- Smooth transition khi search bar appears

---

### 2. Search Bar (Collapsed by Default)

**Mô tả**: Search bar để tìm matches theo tên

**Components**:

#### A. Search Input Field
- **Position**: Below navigation bar (slides down)
- **Placeholder**: "Search matches..."
- **Icon**: Magnifying glass icon (left side)
- **Clear button**: X icon (right side, appears khi có text)
- **Style**: Rounded rectangle (12px radius), light background

**Tương tác**:
- **Tap Search button (top-right)** → Search bar slides down với animation
- **User types** → Filter matches realtime (debounced 300ms)
- **Tap Clear button** → Clear text, show full list again
- **Tap outside or Back** → Collapse search bar

**Validations**:
- Min 1 character to trigger search
- Case-insensitive search
- Search in: display_name, last_message content

**Animations**:
- Slide down: 200ms ease-out
- Collapse: 200ms ease-in
- Results update smoothly (no flicker)

**States**:
- **Collapsed** (default): Not visible
- **Expanded**: Visible, focused, keyboard open
- **Searching**: Shows filtered results
- **No results**: Show "Không tìm thấy '[query]'" message

---

### 3. Match List (Main Content)

**Mô tả**: Scrollable list của match items, sorted by recent match first

**Components**:

#### A. List Container
- **Layout**: Vertical scrolling list
- **Item height**: ~80px per item
- **Separator**: 1px line giữa items (light gray)
- **Scroll indicator**: Standard scrollbar (auto-hide)
- **Pull-to-refresh**: Gesture support (refresh matches)

#### B. Match Item (Single Item)

**Layout Structure**:

```
[Avatar] [Name & Message Preview] [Time & Badge]
```

##### Avatar Section (Left)
- **Size**: 56px diameter (circle)
- **Content**: User's avatar image
- **Border**: 2px white border (để highlight)
- **Online indicator**: Green dot (8px) bottom-right corner nếu online
  - **Green** (#38A169): Online trong 5 phút
  - **Gray** (#CBD5E0): Offline
- **Position**: Align left, vertically centered

##### Content Section (Center, Flex Grow)
**Row 1: Name & Age**
- **Name**: Bold, 16px, text primary
- **Age**: Regular, 16px, text secondary
- **Format**: "Sarah, 28"
- **Max width**: Truncate nếu quá dài với "..."

**Row 2: Last Message Preview**
- **Content**: Text của tin nhắn cuối cùng
- **Font**: Regular, 14px, text secondary
- **Max lines**: 1 line (truncate với "...")
- **Format**:
  - Nếu user là sender: "You: [message]"
  - Nếu match là sender: "[message]"
  - Nếu là ảnh: "📷 Photo" hoặc "You: 📷 Photo"
  - Nếu chưa có message: "Say hi to Sarah!" (khuyến khích)

**Row 3 (Optional): New Badge**
- **Show if**: is_new = true (match chưa xem)
- **Badge**: Small pill chip
- **Text**: "New"
- **Color**: Brand primary (orange), white text
- **Font**: Bold, 10px

##### Right Section (Right Align)
**Row 1: Timestamp**
- **Format**:
  - "Now" (< 1 min)
  - "2m ago" (< 1 hour)
  - "3h ago" (< 24 hours)
  - "Yesterday" (1 day ago)
  - "Mon" (2-6 days ago)
  - "12/25" (> 7 days ago)
- **Font**: Regular, 12px, text secondary
- **Position**: Top-right

**Row 2: Unread Badge**
- **Show if**: unread_count > 0
- **Badge**: Circle với background brand primary (orange)
- **Content**: Number (e.g., "3")
  - If count > 9: Show "9+"
- **Font**: Bold, 10px, white
- **Size**: Min 20px diameter (expand với text width)
- **Position**: Below timestamp, right-aligned

**Tương tác**:

##### Primary Action: Tap Item
- **Trigger**: Tap anywhere on item (except avatar)
- **Action**: Navigate to Chat Screen (08-chat-screen.md)
- **Before navigation**:
  - Mark all messages as read
  - Update unread_count to 0
  - Remove unread badge
  - Update UI optimistically
- **Haptic**: Light impact

##### Secondary Action: Tap Avatar
- **Trigger**: Tap avatar specifically
- **Action**: Open Match Detail Screen (15-match-detail.md)
  - View full profile của matched user
- **Haptic**: Light impact

##### Long Press Action
- **Trigger**: Long press on item (500ms hold)
- **Action**: Show Action Sheet (see Section 4)
- **Haptic**: Medium impact
- **Visual feedback**: Item scales slightly (0.98) during press

##### Swipe Actions
**Swipe Left (on item)**:
- **Trigger**: Swipe left > 30% item width
- **Reveal**: Two action buttons (slide in from right)

**Button 1: Unmatch**
- **Icon**: X icon (white)
- **Color**: Red (#E53E3E)
- **Width**: 80px
- **Position**: First button (right)

**Button 2: Report**
- **Icon**: Flag icon (white)
- **Color**: Orange (#FF6B35)
- **Width**: 80px
- **Position**: Second button (right of Unmatch)

**Tương tác**:
- **Tap Unmatch button** → Trigger Unmatch Flow (see Section 5)
- **Tap Report button** → Trigger Report Flow (see Section 6)
- **Swipe back right** → Hide buttons, return to normal

**Animations**:
- Swipe gesture: Smooth follow finger
- Buttons reveal: Slide in from right (staggered)
- Spring back if not fully swiped

**Validations**:
- Swipe threshold: 30% width OR velocity > 500px/s
- Prevent simultaneous swipe on multiple items

**Animations**:
- List scroll: Native smooth scrolling
- Item tap: Ripple effect + scale 0.98
- Avatar tap: Scale 0.95 → 1.05 bounce
- Long press: Scale 0.98, slight shadow increase
- Pull-to-refresh: Standard spinner animation
- New item insert: Fade in + slide down from top (300ms)
- Item remove (unmatch): Slide left + fade out (300ms)

---

### 4. Action Sheet (Long Press)

**Mô tả**: Bottom sheet với action options khi user long press match item

**Trigger**: Long press match item

**Components**:

#### A. Sheet Container
- **Height**: Auto (fit content, ~250px)
- **Position**: Slide up from bottom
- **Backdrop**: Semi-transparent black (rgba(0,0,0,0.5))
- **Gesture**: Swipe down to dismiss

#### B. Sheet Header
**Match Preview**:
- **Avatar**: 40px circle
- **Name**: Bold, 16px
- **Text**: "Actions for [Name]"
- **Position**: Top of sheet, centered

#### C. Action Options (List)

**Option 1: View Profile**
- **Icon**: User icon (👤)
- **Text**: "View Profile"
- **Style**: Default (black text)

**Tương tác**:
- **Tap** → Navigate to Match Detail Screen (15-match-detail.md)
- **Close sheet**

**Option 2: Message**
- **Icon**: Chat bubble icon (💬)
- **Text**: "Send Message"
- **Style**: Default (black text)

**Tương tác**:
- **Tap** → Navigate to Chat Screen (08-chat-screen.md)
- **Close sheet**

**Option 3: Unmatch**
- **Icon**: X icon (✕)
- **Text**: "Unmatch"
- **Style**: Destructive (red text)

**Tương tác**:
- **Tap** → Trigger Unmatch Flow (see Section 5)
- **Close sheet**

**Option 4: Report**
- **Icon**: Flag icon (🚩)
- **Text**: "Report"
- **Style**: Destructive (red text)

**Tương tác**:
- **Tap** → Trigger Report Flow (see Section 6)
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
- Options: Slight scale on tap (0.98)

**Accessibility**:
- VoiceOver: Announce "Actions for [Name]"
- Each option clearly labeled
- Cancel option always available

---

### 5. Unmatch Confirmation Dialog

**Mô tả**: Alert dialog để confirm destructive unmatch action

**Trigger**: User taps Unmatch (từ Action Sheet hoặc swipe action)

**Components**:

#### A. Dialog Container
- **Position**: Center screen
- **Size**: ~80% screen width, auto height
- **Style**: White card với shadow, rounded corners (12px)
- **Backdrop**: Semi-transparent black (rgba(0,0,0,0.6))

#### B. Dialog Header
- **Icon**: Warning icon (⚠️) (yellow/orange)
- **Title**: "Unmatch [Name]?"
- **Font**: Bold, 18px, centered

#### C. Dialog Content
**Message Text**:
- **Line 1**: "Are you sure you want to unmatch?"
- **Line 2**: "• Your conversation will be deleted"
- **Line 3**: "• This action cannot be undone"
- **Font**: Regular, 14px, text secondary
- **Alignment**: Left-aligned, bulleted list

#### D. Dialog Actions (Buttons)

**Cancel Button** (Left/Bottom):
- **Text**: "Cancel"
- **Style**: Outline button, gray border
- **Font**: Medium, 16px

**Tương tác**:
- **Tap** → Close dialog, no action
- **Haptic**: Light impact

**Confirm Button** (Right/Bottom):
- **Text**: "Unmatch"
- **Style**: Solid red button (#E53E3E)
- **Font**: Bold, 16px, white

**Tương tác**:
- **Tap** → Execute unmatch:
  1. Show loading spinner on button (disable taps)
  2. Call API: POST /api/matches/unmatch
  3. If success:
     - Remove item from list với slide-out animation
     - Show toast: "Đã unmatch với [Name]"
     - Update UI
  4. If error:
     - Show error toast: "Không thể unmatch. Thử lại sau."
     - Keep item in list
     - Re-enable button
- **Haptic**: Medium impact (on success)

**Animations**:
- Dialog appear: Scale 0.9 → 1.0, fade in (200ms)
- Backdrop: Fade in (150ms)
- Dismiss: Fade out (150ms)
- Button press: Scale 0.98

**Accessibility**:
- VoiceOver: Announce dialog title and consequences
- Focus on Cancel button by default (safe action)
- Destructive button clearly marked

---

### 6. Report Bottom Sheet

**Mô tả**: Bottom sheet để select report reason

**Trigger**: User taps Report (từ Action Sheet hoặc swipe action)

**Components**:

#### A. Sheet Container
- **Height**: ~60% screen height
- **Position**: Slide up from bottom
- **Backdrop**: Semi-transparent black
- **Gesture**: Swipe down to dismiss

#### B. Sheet Header
- **Title**: "Report [Name]"
- **Font**: Bold, 20px
- **Close button**: X icon (top-right)

#### C. Report Reasons (Vertical List)

**Options** (radio buttons):

**Option 1: Spam**
- **Icon**: 🚫
- **Text**: "Spam or scam"
- **Subtext**: "Sending unwanted promotional messages"

**Option 2: Fake Profile**
- **Icon**: 👤
- **Text**: "Fake profile"
- **Subtext**: "Using someone else's photos or information"

**Option 3: Harassment**
- **Icon**: ⚠️
- **Text**: "Harassment"
- **Subtext**: "Abusive or threatening behavior"
- **Note**: Auto-unmatch khi select option này

**Option 4: Inappropriate Content**
- **Icon**: 🔞
- **Text**: "Inappropriate content"
- **Subtext**: "Offensive photos or messages"
- **Note**: Auto-unmatch khi select option này

**Option 5: Other**
- **Icon**: 📝
- **Text**: "Other"
- **Subtext**: "Please describe the issue"

**Tương tác**:
- **Tap option** → Select (radio button checked)
- **Only 1 option** can be selected

#### D. Additional Details (Show if "Other" selected)
- **Component**: Text area input
- **Placeholder**: "Please describe the issue..."
- **Max length**: 500 characters
- **Counter**: Show character count (e.g., "45/500")
- **Required**: Yes (if "Other" selected)

#### E. Submit Button (Bottom, sticky)
- **Text**: "Submit Report"
- **Style**: Full-width, red button
- **State**: Disabled until reason selected (and details if "Other")

**Tương tác**:
- **Tap Submit** → Execute report:
  1. Show loading spinner on button
  2. Call API: POST /api/reports
  3. If success:
     - Close sheet
     - Show toast: "Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét."
     - If reason = Harassment or Inappropriate:
       * Auto unmatch (remove from list)
       * Show additional toast: "Đã unmatch với [Name]"
     - Otherwise: Keep in list (under review)
  4. If error:
     - Show error toast: "Không thể gửi báo cáo. Thử lại sau."
     - Keep sheet open (user có thể retry)
- **Haptic**: Medium impact (on success)

**Animations**:
- Sheet slide up: 300ms ease-out
- Radio selection: Scale + color change
- Text area expand: Smooth height transition
- Submit button enable: Fade in + slight scale

**Accessibility**:
- VoiceOver: Announce each option clearly
- Radio buttons: Clear selected state
- Text area: Announce character limit

---

### 7. Empty State (No Matches Yet)

**Mô tả**: Screen state khi user chưa có match nào

**Trigger**: matches.length === 0

**Components**:

#### A. Illustration
- **Visual**: Friendly empty state graphic
  - Example: Character holding pickleball paddle with question mark
  - Or: Empty list icon với heart
- **Position**: Center screen (vertically centered)
- **Size**: ~200px width/height

#### B. Message Section

**Primary Text**:
- **Text**: "No matches yet"
- **Font**: Bold, 24px, text primary
- **Alignment**: Center

**Subtitle**:
- **Text**: "Start swiping to find your perfect pickleball partner!"
- **Font**: Regular, 16px, text secondary
- **Alignment**: Center

#### C. Call-to-Action Button
- **Text**: "Start Swiping"
- **Icon**: Swipe icon (optional)
- **Style**: Full-width button (80% width), brand primary color
- **Position**: Below subtitle (24px margin)

**Tương tác**:
- **Tap** → Navigate to Home - Swipe Screen (06-home-swipe.md)
- **Haptic**: Light impact

**Animations**:
- Illustration: Subtle floating animation (up/down 5px, 3s duration)
- Button: Pulse animation (1x per 3s, attention-grabbing)
- Fade in: All elements with stagger (illustration → text → button)

---

### 8. Loading States

#### A. Initial Load (First Time)
**Trigger**: App fetch matches từ server (first load)

**UI**:
- **Component**: Skeleton list items (3-5 items visible)
- **Skeleton structure** per item:
  - Circle placeholder (avatar) - pulsing
  - Rectangle placeholder (name) - pulsing
  - Rectangle placeholder (message preview) - pulsing
  - Small circle placeholder (time badge) - pulsing
- **Animation**: Shimmer effect (left → right, repeat)
- **Duration**: Until API response

#### B. Pull-to-Refresh Loading
**Trigger**: User pulls down list to refresh

**UI**:
- **Component**: Standard spinner at top of list
- **Text**: "Refreshing..."
- **Duration**: Until API response
- **Behavior**: List stays scrollable

#### C. Background Refresh (Silent)
**Trigger**: Realtime update (new match, new message)

**UI**:
- **No blocking UI**
- **Update**: Silently update list
  - New match: Insert at top với animation
  - New message: Update preview + move to top
- **Subtle indicator**: Small pulse animation on updated item

---

### 9. Realtime Updates

**Mô tả**: Matches list updates realtime via WebSocket (Supabase Realtime)

**Events**:

#### Event 1: New Match
**Trigger**: Server creates new match

**Update**:
1. Insert new match item at top of list
2. Show "New" badge on item
3. Animate: Slide down from top + fade in (300ms)
4. Badge disappears after user taps item

#### Event 2: New Message
**Trigger**: Match sends message

**Update**:
1. Update last_message preview
2. Increment unread_count
3. Move item to top of list (if not already)
4. Animate: Subtle bounce + highlight background (flash effect)
5. Update timestamp to "Now"

#### Event 3: Message Read
**Trigger**: User reads messages (in Chat Screen)

**Update**:
1. Set unread_count = 0
2. Remove unread badge
3. Animate: Fade out badge

#### Event 4: Match Deleted (Other User Unmatched)
**Trigger**: Match user unmatches từ phía kia

**Update**:
1. Remove item from list
2. Animate: Slide left + fade out (300ms)
3. Show toast: "[Name] đã unmatch với bạn"

#### Event 5: User Goes Online/Offline
**Trigger**: Match's online status changes

**Update**:
1. Update online indicator (green ↔ gray)
2. Animate: Pulse green dot once (khi online)

**Technical**:
- Use Supabase Realtime subscriptions
- Subscribe to: matches, conversations, messages tables
- Optimistic UI: Update UI immediately, rollback if error
- Fallback: Polling every 30s if WebSocket fails

---

## Navigation

**Đến screen này từ**:
- **Bottom Tab Bar** - Matches tab (primary entry)
- **06-home-swipe.md** - Tap "Send Message" trong Match modal (nếu chưa ở Matches tab)
- **08-chat-screen.md** - Back button từ chat
- **15-match-detail.md** - Back button từ profile detail

**Từ screen này đến**:
- **08-chat-screen.md** - Tap match item (primary flow)
- **15-match-detail.md** - Tap avatar hoặc "View Profile" trong action sheet
- **06-home-swipe.md** - Tap "Start Swiping" trong empty state
- **09-court-discovery.md** - Navigate via Courts tab
- **10-profile-me.md** - Navigate via Profile tab

---

## States

### Default State
- Match list loaded và visible (sorted recent first)
- Search bar collapsed
- No items selected
- Pull-to-refresh enabled
- Realtime updates active
- Online indicators up-to-date

### Loading State (Initial)
- Show skeleton list items (3-5 items)
- Shimmer animation
- No interaction enabled (except back button)
- Duration: Until API returns data

### Loaded State (Has Matches)
- List fully rendered
- All items interactive
- Scroll enabled
- Unread badges visible
- New badges visible (if any)
- Online indicators active

### Empty State
- No matches in database
- Show empty illustration
- Show "Start Swiping" CTA
- Hide search button (no point)

### Search Active State
- Search bar expanded
- Keyboard open
- List filtered by query
- If no results: Show "Không tìm thấy '[query]'"
- Clear button visible (if text present)

### Swipe Action Revealed State
- Item swiped left
- Action buttons (Unmatch, Report) visible
- Other items not swipeable (prevent confusion)
- Tap outside item → Close swipe action

### Action Sheet Open State
- Bottom sheet overlay visible
- Backdrop dims main screen
- Sheet options interactive
- Main screen not scrollable
- Swipe down to dismiss

### Unmatch Dialog Open State
- Dialog centered on screen
- Backdrop dims background
- Buttons interactive
- Main screen not interactive
- Focus on dialog

### Report Sheet Open State
- Bottom sheet overlay visible
- Backdrop dims main screen
- Radio options interactive
- Text area (if "Other" selected)
- Submit button state depends on selection

### Pull-to-Refresh Active State
- User dragging list down
- Spinner visible at top
- "Refreshing..." text
- List still visible underneath

### Realtime Update State
- New item animating in (slide + fade)
- Updated item highlighted briefly
- Removed item animating out

### Error States

#### Network Error (Load Failed)
**Trigger**: No internet khi fetch matches

**UI**:
- Show cached matches nếu có
- Toast: "Không có kết nối. Dữ liệu có thể không mới nhất."
- Pull-to-refresh enabled (to retry)
- Realtime updates paused

#### Unmatch Failed
**Trigger**: Server error khi unmatch

**UI**:
- Toast: "Không thể unmatch. Thử lại sau."
- Keep item in list
- Retry button trong toast (optional)
- Log error for debugging

#### Report Failed
**Trigger**: Server error khi submit report

**UI**:
- Toast: "Không thể gửi báo cáo. Thử lại sau."
- Keep report sheet open
- User có thể retry (submit again)
- Optionally save report locally, retry background

#### Realtime Connection Lost
**Trigger**: WebSocket disconnect

**UI**:
- Fallback to polling (every 30s)
- Subtle indicator: Small "Reconnecting..." text (bottom)
- Auto-reconnect attempts in background
- User can continue using app normally

---

## Edge Cases

1. **100+ matches**: Paginate list, load 30 at a time (infinite scroll)
2. **User unmatch themselves**: Not possible (UI prevents)
3. **Both users unmatch simultaneously**: Remove from list for both, no conflict
4. **Match deleted mid-action** (while opening chat): Show toast "Match không còn tồn tại", navigate back
5. **New match arrives while searching**: Add to full list, but not visible in filtered search (until clear search)
6. **User rapid tap match item** (double-tap): Debounce, only 1 navigation
7. **Swipe action open + new message arrives**: Close swipe action, update item, move to top
8. **Unmatch during realtime update**: Handle race condition - last action wins (server-side)
9. **Report submitted but match already deleted**: Server returns 404, show "Match không còn tồn tại"
10. **User blocks match after reporting**: Remove from list immediately (block supersedes report)
11. **Search query với special characters**: Sanitize input, prevent injection
12. **Very long name** (> 50 chars): Truncate với "..." (e.g., "Verylongname...")
13. **Last message = emoji only**: Display emoji directly (no truncate)
14. **Timestamp in future** (clock skew): Handle gracefully, show "Now" (no negative time)
15. **Avatar failed to load**: Show default placeholder avatar (color based on first letter)
16. **Unread count > 99**: Display "99+" (prevent badge overflow)
17. **User offline + swipe action**: Queue unmatch/report locally, sync when online
18. **Multiple reports for same match**: Backend deduplicates, UI allows (doesn't block)
19. **Match expired** (14 days no message - optional): Gray out item, show "Expired" badge (future feature)
20. **New match notification tapped** (push): Open app → Navigate to Matches → Highlight new match

---

## Ghi chú

### UX Considerations
- **Sort by recent**: Most recent match/message first → User sees active conversations
- **Unread badge**: Clear visual indicator để user không bỏ lỡ messages
- **Online indicator**: Helps user decide who to message (higher chance of quick reply)
- **Swipe actions**: Quick access to unmatch/report (familiar iOS pattern)
- **Long press**: Alternative to swipe (Android-friendly)
- **Search**: Essential khi user có 50+ matches
- **Empty state CTA**: Immediate action để user không stuck
- **Realtime updates**: Feels live, engaging (no manual refresh needed)
- **Destructive action confirmation**: Prevents accidental unmatch (can't undo)
- **Report flow simplicity**: Easy to report, low friction
- **Avatar tap = View Profile**: Intuitive (consistent với other dating apps)
- **Pull-to-refresh**: Familiar gesture, gives user control
- **Optimistic UI**: Updates feel instant (even if server slow)

### Animations & Performance
- **Target**: 60 FPS scrolling (no jank)
- **List optimization**: Use FlatList với optimizations:
  - `keyExtractor`: Unique match_id
  - `getItemLayout`: Fixed 80px height (skip measurement)
  - `removeClippedSubviews`: True (Android perf)
  - `maxToRenderPerBatch`: 10
  - `windowSize`: 10
- **Image optimization**:
  - Avatar thumbnails: 56×56px @ 2x = 112px source
  - Use `react-native-fast-image` với aggressive caching
  - Fallback: Color placeholder (based on first letter)
- **Realtime efficiency**:
  - Batch updates: Group multiple events trong 100ms window
  - Debounce rapid updates (prevent flicker)
  - Only update visible items (skip off-screen)
- **Search debounce**: 300ms delay (prevent API spam)
- **Animation library**: React Native Reanimated v4
  - Swipe action: UI thread animation (smooth)
  - Item animations: Worklet-based
  - Spring physics for natural feel
- **Pagination**: Load 30 items initially, +30 khi scroll near bottom
- **Memory management**: Recycle list items (FlatList handles automatically)

### Validations & Error Handling
- **Empty list check**: Show appropriate state (empty vs loading)
- **Network resilience**: Cached data + offline queue
- **Optimistic updates**: Update UI immediately, rollback if API fails
- **Error toasts**: User-friendly messages (không tech jargon)
- **Retry logic**: Auto-retry for realtime connection, manual retry for actions
- **Input sanitization**: Prevent XSS trong search query và report details
- **Rate limiting**: Client-side debounce (prevent spam), server-side rate limit
- **Graceful degradation**: If realtime fails → fallback to polling

### Technical Notes

#### API Endpoints

##### GET /api/matches
**Purpose**: Fetch user's matches

**Query Params**:
```json
{
  "limit": 30,
  "offset": 0,
  "include_unread": true
}
```

**Response** (200):
```json
{
  "matches": [
    {
      "id": "match_uuid",
      "user_id": "current_user_uuid",
      "matched_user_id": "other_user_uuid",
      "matched_at": "2025-12-30T10:00:00Z",
      "conversation_id": "conv_uuid",
      "is_new": false,
      "last_message": {
        "content": "Hey! Let's play this weekend?",
        "sent_at": "2025-12-30T14:30:00Z",
        "sender_id": "other_user_uuid",
        "type": "text" // or "image"
      },
      "unread_count": 3,
      "matched_user": {
        "id": "other_user_uuid",
        "display_name": "Sarah",
        "age": 28,
        "avatar_url": "https://...",
        "is_online": true,
        "last_active": "2025-12-30T14:35:00Z"
      }
    }
  ],
  "total": 47,
  "has_more": true
}
```

##### POST /api/matches/unmatch
**Purpose**: Unmatch a user

**Body**:
```json
{
  "match_id": "match_uuid"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Unmatch successful"
}
```

**Response** (404):
```json
{
  "error": "Match not found"
}
```

##### POST /api/reports
**Purpose**: Report a user

**Body**:
```json
{
  "reported_user_id": "user_uuid",
  "reason": "harassment", // spam, fake, harassment, inappropriate, other
  "details": "Optional text if reason=other",
  "context": "match" // or "profile", "chat"
}
```

**Response** (200):
```json
{
  "success": true,
  "report_id": "report_uuid",
  "action_taken": "auto_unmatch" // if harassment/inappropriate
}
```

##### GET /api/matches/search
**Purpose**: Search matches by name

**Query Params**:
```json
{
  "query": "Sarah",
  "limit": 30
}
```

**Response** (200):
```json
{
  "results": [
    // Same format as /api/matches
  ],
  "count": 2
}
```

#### State Management
**Global State** (Zustand/Redux):
- `matches`: Array of match objects
- `unreadTotal`: Total unread count (for tab badge)
- `matchesLoading`: boolean
- `matchesError`: string | null
- `realtimeConnected`: boolean

**Actions**:
- `fetchMatches(offset, limit)`: Load matches
- `refreshMatches()`: Pull-to-refresh
- `searchMatches(query)`: Search matches
- `unmatchUser(matchId)`: Unmatch action
- `reportUser(userId, reason, details)`: Report action
- `markAsRead(matchId)`: Update unread count
- `subscribeToRealtime()`: Setup WebSocket
- `unsubscribeFromRealtime()`: Cleanup WebSocket

**Local State** (React):
- `searchQuery`: string
- `searchActive`: boolean
- `actionSheetVisible`: boolean
- `selectedMatchId`: string | null
- `unmatchDialogVisible`: boolean
- `reportSheetVisible`: boolean
- `swipedItemId`: string | null

**Persistence** (AsyncStorage):
- `matches_cache`: JSON (offline fallback)
- `last_fetch_timestamp`: ISO datetime (cache invalidation)

#### Realtime Subscriptions (Supabase)

**Subscription 1: matches table**
```typescript
supabase
  .channel('matches')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'matches',
    filter: `user_id=eq.${currentUserId}`
  }, (payload) => {
    // New match created
    addMatchToList(payload.new);
  })
  .on('postgres_changes', {
    event: 'DELETE',
    schema: 'public',
    table: 'matches',
    filter: `user_id=eq.${currentUserId}`
  }, (payload) => {
    // Match deleted (other user unmatched)
    removeMatchFromList(payload.old.id);
  })
  .subscribe();
```

**Subscription 2: messages table**
```typescript
supabase
  .channel('messages')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `conversation_id=in.(${conversationIds})`
  }, (payload) => {
    // New message in any conversation
    updateLastMessage(payload.new);
    incrementUnreadCount(payload.new.conversation_id);
  })
  .subscribe();
```

**Subscription 3: user_presence (online status)**
```typescript
supabase
  .channel('presence')
  .on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState();
    updateOnlineStatus(state);
  })
  .subscribe();
```

#### Image Handling
- **Avatar size**: 56px display → Load 112×112px (2x) từ CDN
- **Caching**: Use `react-native-fast-image`:
  ```javascript
  <FastImage
    source={{ uri: avatarUrl, priority: FastImage.priority.normal }}
    style={{ width: 56, height: 56 }}
    resizeMode={FastImage.resizeMode.cover}
  />
  ```
- **Fallback**: If image fails → Show colored circle với first letter (like Gmail)
- **Signed URLs**: Supabase Storage URLs với expiry (1 hour)

#### Search Implementation
- **Client-side**: Filter locally nếu list < 100 items (instant results)
- **Server-side**: Query database nếu list > 100 items (pagination support)
- **Debounce**: 300ms delay before API call
- **Fuzzy search**: Match partial names (case-insensitive)
- **Algorithm**: PostgreSQL `ILIKE` or full-text search

#### Performance Optimizations
1. **FlatList optimizations**:
   - `getItemLayout`: Fixed 80px height (skip expensive calculations)
   - `removeClippedSubviews`: True (Android only)
   - `maxToRenderPerBatch`: 10 items
   - `updateCellsBatchingPeriod`: 50ms
   - `initialNumToRender`: 15 items
   - `windowSize`: 10 (5 viewports above + below)

2. **Image preloading**: Load next 10 avatars in background
3. **Memoization**: Memoize match item component (React.memo)
4. **Lazy updates**: Debounce timestamp updates (update every 10s, not realtime)
5. **Batch API calls**: Group unread updates (send every 30s OR 10 items)

### Design Specs

#### Match Item Layout
- **Height**: 80px
- **Padding**: 12px horizontal, 10px vertical
- **Avatar**: 56px circle, 12px from left edge
- **Content margin**: 12px left of avatar
- **Right section width**: 80px fixed
- **Separator**: 1px, color #E2E8F0 (light gray)

#### Typography
- **Name**: 16px, Bold, #2D3748 (dark gray)
- **Age**: 16px, Regular, #718096 (medium gray)
- **Message preview**: 14px, Regular, #A0AEC0 (light gray)
- **Timestamp**: 12px, Regular, #CBD5E0 (very light gray)
- **Unread badge**: 10px, Bold, White

#### Colors
- **Online indicator**: #38A169 (green)
- **Offline indicator**: #CBD5E0 (gray)
- **Unread badge background**: #FF6B35 (brand orange)
- **New badge**: #FF6B35 (brand orange)
- **Swipe unmatch button**: #E53E3E (red)
- **Swipe report button**: #FF6B35 (orange)
- **Action sheet destructive**: #E53E3E (red)
- **Background**: #FFFFFF (light mode), #1A202C (dark mode)

#### Swipe Action Buttons
- **Width**: 80px each
- **Height**: 80px (full item height)
- **Icon size**: 24px (white)
- **Spacing**: 0px (buttons side-by-side)

#### Action Sheet
- **Border radius**: 16px (top corners only)
- **Option height**: 56px
- **Icon size**: 24px
- **Backdrop**: rgba(0,0,0,0.5)

#### Unmatch Dialog
- **Width**: 85% screen width (max 320px)
- **Padding**: 20px
- **Border radius**: 12px
- **Button height**: 48px
- **Button spacing**: 12px

#### Report Sheet
- **Height**: 60% screen (max-height)
- **Radio button size**: 20px
- **Option height**: 72px (includes subtext)
- **Text area height**: 120px (min)

### Accessibility
- **VoiceOver/TalkBack**:
  - Match item: "Sarah, 28. Last message: Hey! Let's play. 3 unread messages. 2 hours ago. Tap to open chat."
  - Avatar: "View profile"
  - Unread badge: "3 unread messages"
  - Online indicator: "Online now" or "Last seen 2 hours ago"
- **Touch targets**: All interactive elements min 44×44pt
- **Color contrast**: WCAG AA (4.5:1 for text)
- **Swipe alternative**: Long press (for users who can't swipe)
- **Reduce motion**: Disable fancy animations (keep essential transitions)
- **Screen reader support**: All actions clearly announced

### Analytics Tracking
Track events:
- `screen_view`: Matches List Screen
- `match_item_tap`: match_id, has_unread
- `match_avatar_tap`: match_id (view profile)
- `match_long_press`: match_id (action sheet opened)
- `match_swipe_unmatch`: match_id
- `match_swipe_report`: match_id
- `unmatch_initiated`: match_id, source (swipe/action_sheet)
- `unmatch_confirmed`: match_id
- `unmatch_cancelled`: match_id
- `report_initiated`: match_id, source
- `report_submitted`: match_id, reason
- `report_cancelled`: match_id
- `search_opened`: -
- `search_performed`: query, result_count
- `search_cleared`: -
- `empty_state_shown`: -
- `empty_state_cta_tap`: -
- `pull_to_refresh`: -
- `realtime_new_match`: match_id
- `realtime_new_message`: match_id, sender_id

### Security Considerations
- **Authorization**: User chỉ thấy matches của chính mình (backend enforce)
- **Rate limiting**: Max 10 unmatch/hour, 5 report/hour (prevent abuse)
- **Input sanitization**: Search query và report details cleaned (XSS prevention)
- **Soft delete**: Unmatched conversations archived (không delete ngay), recovery possible trong 30 days
- **Report logging**: All reports logged với timestamp, IP, context (audit trail)
- **Privacy**: Last message content không include sensitive data (backend filter)
- **API tokens**: All requests authenticated với JWT (Supabase Auth)

### Future Enhancements
- **Filter tabs**: All, Recent, Favorites (premium)
- **Favorite matches**: Pin important matches to top
- **Archive matches**: Hide inactive matches (don't unmatch)
- **Match expiry**: Auto-archive matches với no messages trong 30 days (configurable)
- **Icebreaker prompts**: Suggest conversation starters
- **Video call**: Quick video chat với matches (integration F05)
- **Shared courts**: Show "Both of you liked [Court Name]" (connection cue)
- **Mutual friends**: "You both know [User]" (if friends feature added)
- **Match notes**: Private notes about each match
- **Scheduled messages**: Send message at specific time (e.g., "Good morning")
- **Typing indicator**: Show "Sarah is typing..." realtime
- **Read receipts**: Show checkmarks (sent, delivered, read)
- **Mute conversations**: Disable notifications for specific match
- **Bulk actions**: Select multiple matches → Unmatch all (with confirmation)
