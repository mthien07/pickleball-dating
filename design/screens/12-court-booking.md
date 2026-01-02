# Court Booking Screen

## Screen Overview
Màn hình đặt sân cho phép người dùng chọn ngày, chọn các slot giờ trống, và tiến hành thanh toán. Screen bao gồm cơ chế **slot locking với countdown timer 10 phút** để đảm bảo slot không bị mất khi người dùng đang thanh toán. Đây là core screen của booking flow với nhiều states và validations quan trọng.

## Mục đích
- Cho phép người dùng xem lịch trống của sân theo ngày
- Hỗ trợ chọn nhiều slots liên tiếp hoặc rời rạc
- Hiển thị giá tiền rõ ràng cho từng slot (peak/off-peak pricing)
- Lock slots trong 10 phút để bảo vệ quyền đặt chỗ của người dùng
- Dẫn dắt người dùng đến màn hình thanh toán một cách mượt mà

## Các Section/Components Chính

### 1. Court Info Header (Sticky Top)
**Mô tả:**
- Fixed position ở top screen với subtle shadow
- Layout: Horizontal row
- **Left side**:
  - Court avatar/thumbnail (60x60pt, rounded 8pt)
  - Court info stack:
    - Court name (bold, 16pt, 1 line with ellipsis)
    - Address snippet (gray, 12pt, 1 line with ellipsis)
    - Distance chip: "2.3 km" (small, gray background)
- **Right side**:
  - Price info (aligned right):
    - Price text: "200k VND/giờ" (bold, accent color, 14pt)
    - Note: "(Tùy khung giờ)" (gray, 10pt) nếu price varies

**Tương tác:**
- Tap header → Collapse/expand header (minimize to show only court name khi scroll down)
- Tap court thumbnail → Navigate back to Court Detail (11-court-detail.md)

**States:**
- **Expanded** (default): Full info visible
- **Collapsed** (on scroll): Only name + price visible, height reduced

**Hiệu ứng:**
- Scroll-triggered collapse: Smooth height animation (200ms)
- Shadow intensity increases khi scroll down

---

### 2. Date Selector
**Mô tả:**
- Horizontal scrollable calendar (FlatList horizontal)
- Show 7 days visible at once (swipe to see more)
- Date range: Today → +30 days ahead
- Each date card:
  - Day of week: "T2", "T3", "T4", etc. (small, gray)
  - Date number: "15" (large, bold)
  - Month: "Th12" (small, gray) - only show if different from current month
  - Availability indicator (dot below date):
    - **Green dot**: Has available slots
    - **Gray dot**: Fully booked
    - **No dot**: Past date (disabled)
  - Border/background changes based on state (see States below)

**Tương tác:**
- Swipe left/right → Scroll through dates
- Tap date → Select date
  - If date available → Highlight + fetch slots for that date
  - If date fully booked → Show tooltip "Sân đã kín ngày này"
  - If past date → Prevent selection, show tooltip "Không thể đặt ngày quá khứ"
- Auto-scroll to selected date khi mount (today selected by default)

**States:**
- **Today**: Blue border + "Hôm nay" label
- **Selected**: Primary color background, white text, scale 1.05
- **Available**: White background, green dot indicator
- **Fully booked**: Gray background, gray dot, opacity 0.6
- **Past date**: Gray background, no dot, opacity 0.4, disabled

**Validations:**
- Cannot select past dates (date < today)
- Cannot select dates > 30 days from today
- Dates with operating_hours = closed → Treated as fully booked

**Hiệu ứng:**
- Date selection: Scale animation (1.0 → 1.05) + background color transition
- Date cards: Slide in from right on mount (staggered 0.05s)
- Scroll to selected: Smooth horizontal scroll animation

---

### 3. Time Slots Grid
**Mô tả:**
- Grid layout: 2 columns (3 columns on tablets)
- Group slots by time of day with section headers:
  - **Morning** (6:00 - 12:00): Sun icon + "Buổi sáng"
  - **Afternoon** (12:00 - 18:00): Cloud icon + "Buổi chiều"
  - **Evening** (18:00 - 22:00): Moon icon + "Buổi tối"
- Each slot card:
  - Time range: "6:00 - 7:00" (bold, 14pt)
  - Duration: "1 giờ" (gray, 12pt)
  - Price: "200k VND" (accent color, 12pt, bold)
  - Peak indicator: "⚡ Giờ cao điểm" badge (nếu peak pricing)
  - Status-based styling (see States below)
  - Checkmark icon (top-right) nếu selected
  - Lock icon + user avatar (nếu reserved by others)

**Tương tác:**
- Tap slot → Toggle selection
  - **If available** → Select slot
    - If first slot → Add to selection
    - If have existing slots:
      - Adjacent slots (e.g., 6-7, 7-8) → Auto-add to same booking
      - Non-adjacent slots → Show dialog: "Đặt riêng hoặc thêm vào booking hiện tại?"
        - Option 1: "Đặt riêng" → Clear previous, start new selection
        - Option 2: "Thêm vào" → Allow multiple separate bookings (future)
  - **If booked** → No action, shake animation
  - **If reserved by you** → Deselect slot (remove from selection)
  - **If reserved by others** → Show toast "Slot đang được giữ bởi người khác"

**States:**
- **Available**:
  - Background: White
  - Border: Light gray (1pt)
  - Text: Black
  - Enabled: Yes
- **Booked**:
  - Background: Light gray (#F5F5F5)
  - Border: None
  - Text: Gray with strikethrough
  - Overlay: "Đã đặt" label (small, gray)
  - Enabled: No
- **Selected** (by current user):
  - Background: Primary color (blue/green)
  - Border: None
  - Text: White
  - Checkmark icon: White, top-right corner
  - Scale: 0.98 (slightly smaller than available)
  - Enabled: Yes (tap again to deselect)
- **Reserved by you** (from slot locking):
  - Background: Light yellow (#FFF9E6)
  - Border: Yellow (2pt)
  - Text: Black
  - Badge: "Đang giữ" (yellow background)
  - Enabled: Yes
- **Reserved by others**:
  - Background: Light orange (#FFE5CC)
  - Border: Orange (1pt)
  - Text: Gray
  - Lock icon + small avatar
  - Enabled: No

**Validations:**
- Cannot select booked slots
- Cannot select slots reserved by others
- Cannot select slots if court closed
- Minimum 1 slot selection required to proceed

**Hiệu ứng:**
- Slot selection: Scale animation (1.0 → 0.98) + background color transition (200ms)
- Slot deselection: Scale back (0.98 → 1.0) + background fade (200ms)
- Booked slot tap: Horizontal shake animation (reject feedback)
- Loading slots: Skeleton cards with shimmer

---

### 4. Slot Locking Mechanism (Countdown Timer)
**Mô tả:**
- Appears ONLY when user has selected at least 1 slot
- Position: Sticky below header (always visible during selection)
- Layout: Horizontal bar với warning/alert styling
- Components:
  - **Left side**: Clock icon + Timer text
    - Format: "Giữ chỗ: 09:45 còn lại" (MM:SS)
    - Color changes based on time remaining:
      - **> 5 min**: Blue/info color
      - **2-5 min**: Orange/warning color
      - **< 2 min**: Red/danger color, pulse animation
  - **Right side**: "Hủy giữ chỗ" button (text button, gray)
- **Explanation text** (small, below timer):
  - "Slots của bạn đang được giữ tạm thời. Vui lòng hoàn tất thanh toán trước khi hết giờ."

**Tương tác:**
- **Timer countdown**: Auto-decrement every second
  - At 02:00 remaining → Show warning alert: "Chỉ còn 2 phút! Vui lòng hoàn tất thanh toán"
  - At 00:00 → Auto-release slots
    - Show modal: "Hết thời gian giữ chỗ"
    - Content: "Slots của bạn đã được giải phóng. Vui lòng chọn lại."
    - CTA: "Chọn lại" → Dismiss modal, refresh slots
- **Tap "Hủy giữ chỗ"**:
  - Show confirmation dialog: "Bạn chắc chắn muốn hủy giữ chỗ?"
  - If confirm → Release slots, clear selection, hide timer

**States:**
- **Hidden**: No slots selected yet
- **Active (> 5 min)**: Blue timer, normal display
- **Warning (2-5 min)**: Orange timer, pulse icon
- **Critical (< 2 min)**: Red timer, pulse animation, show alert banner
- **Expired**: Hide timer, show modal, release slots

**Validations:**
- Timer must persist when navigating to Payment Screen (13-payment-method.md)
- Timer visible in both Booking Screen and Payment Screen
- If timeout occurs during payment → Cancel payment, return to Booking Screen

**Hiệu ứng:**
- Timer appearance: Slide down from header (200ms)
- Timer text: Smooth number transition (no flicker)
- Color change: Fade transition (300ms)
- < 2 min: Pulse animation on clock icon (1s loop)
- Timeout modal: Fade in with backdrop blur

---

### 5. Selected Slots Summary (Collapsible Bottom Sheet)
**Mô tả:**
- Bottom sheet (modal) triggered when user selects slots
- **Handle bar** at top (drag to expand/collapse)
- **Collapsed state** (default):
  - Shows: Selected slots count + Total price
  - Example: "2 slots • 400k VND"
  - Arrow up icon (right side)
- **Expanded state**:
  - Full breakdown of selected slots
  - Each slot item:
    - Time: "6:00 - 7:00"
    - Price: "200k VND"
    - Remove icon (trash, right side)
  - Subtotal: "Tạm tính: 400k VND"
  - Discount section (if applicable):
    - "Giảm giá: -40k VND" (green)
  - **Total**: "Tổng: 360k VND" (large, bold, accent color)
  - Duration summary: "Tổng thời gian: 2 giờ"

**Tương tác:**
- **Drag handle bar** → Toggle expand/collapse
- **Tap collapsed bar** → Expand
- **Tap "X" close button** (expanded) → Collapse
- **Tap remove icon** on slot → Remove slot from selection
  - Update total price
  - If no slots left → Auto-collapse and hide bottom sheet
- **Swipe down** (expanded) → Collapse

**States:**
- **Hidden**: No slots selected
- **Collapsed**: At least 1 slot selected, show summary only
- **Expanded**: User dragged up or tapped, show full breakdown

**Validations:**
- Total price updates in real-time khi add/remove slots
- Discount calculation applies automatically (if discount code in future)

**Hiệu ứng:**
- Bottom sheet slide up (on first slot selection): Smooth slide + bounce (400ms)
- Expand/collapse: Height animation with spring physics
- Slot removal: Fade out + slide left (200ms)
- Price update: Number count-up animation (300ms)

---

### 6. CTA Section (Sticky Bottom Bar)
**Mô tả:**
- Fixed position at bottom với safe area padding
- Background: Solid color với subtle top shadow
- Layout: Full-width button
- **Button content**:
  - Left side: "Tiếp tục Thanh toán"
  - Right side: Total price "400k VND" (badge style)

**Tương tác:**
- Tap button → Navigate to Payment Method Screen (13-payment-method.md)
  - Pass selected slots data
  - Timer continues in Payment Screen
- Button disabled khi:
  - No slots selected
  - Slots loading
  - Countdown timer expired

**States:**
- **Enabled** (at least 1 slot selected):
  - Background: Primary color (blue/green)
  - Text: White, bold
  - Price badge: White background, primary color text
- **Disabled** (no slots selected or loading):
  - Background: Gray
  - Text: Light gray
  - Opacity: 0.5
  - No price badge

**Hiệu ứng:**
- Button press (enabled): Scale down (0.98) + ripple effect
- Button disabled tap: Horizontal shake (reject feedback)
- Price badge update: Fade + scale animation

---

## Navigation

**Đến screen này từ:**
- Court Detail Screen (11-court-detail.md) → Tap "Đặt Sân" button (court pre-filled)
- Booking History (16-booking-history.md) → Tap "Đặt lại" from completed booking (court pre-filled)
- Home Screen → Tap "Đặt sân nhanh" (pick court first)
- Deep link: `/courts/:courtId/booking`

**Từ screen này đến:**
- Payment Method Screen (13-payment-method.md) → Tap "Tiếp tục Thanh toán"
- Court Detail Screen (11-court-detail.md) → Tap court thumbnail in header
- Back → Tap back button (show confirmation if slots selected)

---

## States

### Default State
- Date selector shows today → +30 days
- Today is selected by default
- Time slots loaded for today
- Available slots highlighted
- No slots selected yet
- Countdown timer hidden
- CTA button disabled

### Loading State
**Initial load (on mount):**
- Court header: Loaded (from previous screen)
- Date selector: Skeleton date cards (7 cards with shimmer)
- Time slots: Skeleton grid (12 slot cards with shimmer)
- CTA button: Disabled

**Loading slots for new date:**
- Date selector: Active (user can still switch dates)
- Time slots: Show previous date's slots with 50% opacity overlay + loading spinner
- After 1s → Replace with skeleton if still loading
- CTA button: Disabled

### Active Selection State
- At least 1 slot selected
- Countdown timer visible (10:00 remaining)
- Selected slots highlighted (blue/green background)
- Selected Slots Summary bottom sheet visible (collapsed)
- CTA button enabled with total price

### Countdown Warning State (< 2 min)
- Timer turns red, pulse animation
- Alert banner appears: "Chỉ còn 2 phút! Hoàn tất thanh toán ngay"
- Selected slots blink briefly (attention grab)

### Countdown Expired State
- Timer reaches 00:00
- Slots auto-deselected and released
- Modal appears: "Hết thời gian giữ chỗ"
- Content: "Slots của bạn đã được giải phóng. Vui lòng chọn lại."
- CTA: "Chọn lại" → Dismiss modal, refresh slots
- Refresh slots grid to show updated availability

### Error State
**Failed to load slots:**
- Empty state illustration (calendar with X)
- Title: "Không thể tải lịch trống"
- Message: "Đã có lỗi xảy ra. Vui lòng thử lại."
- CTA: "Thử lại" button → Retry fetch slots

**Network error during slot selection:**
- Show toast: "Mất kết nối. Vui lòng kiểm tra internet"
- Selected slots remain in UI (not sent to server yet)
- Retry when connection restored

### Court Closed State
- Date selector shows all dates as gray (fully booked indicator)
- Time slots section shows empty state:
  - Icon: Closed sign
  - Text: "Sân đang đóng cửa hôm nay"
  - Sub-text: "Vui lòng chọn ngày khác hoặc liên hệ sân để biết thêm thông tin"

---

## Edge Cases

### 1. Slot Becomes Unavailable During Selection
**Scenario:** User selects slot A, then selects slot B. But slot A is booked by another user in the meantime.

**Behavior:**
- Before proceeding to payment, validate all selected slots
- If conflict detected → Show modal:
  - Title: "Một số slot đã bị đặt"
  - Content: "Slot 6:00 - 7:00 đã được người khác đặt. Vui lòng chọn lại."
  - Auto-remove conflicted slots from selection
  - CTA: "Đóng" → Return to Booking Screen with remaining slots selected
- Update total price
- Refresh slots grid to show latest availability

### 2. User Backgrounds App During Countdown
**Scenario:** User selects slots (timer starts), then switches to another app.

**Behavior:**
- Timer continues in background (use background task)
- When user returns:
  - If timer still valid → Resume countdown display
  - If timer expired → Show timeout modal immediately
  - Push notification at 1 min remaining: "Slots của bạn sẽ hết hạn trong 1 phút!"

### 3. Countdown Expires While on Payment Screen
**Scenario:** User proceeds to Payment Screen, but 10 min expires before completing payment.

**Behavior:**
- Payment Screen detects timer expiration
- Show modal: "Hết thời gian giữ chỗ. Thanh toán đã bị hủy."
- Automatically navigate back to Booking Screen
- Slots released
- User must select slots again

### 4. Court Closed on Selected Date
**Scenario:** User selects a date where court is closed (e.g., holiday).

**Behavior:**
- Date has gray dot (fully booked indicator)
- When tapped → Show tooltip: "Sân đóng cửa ngày này"
- Prevent selection
- Time slots section shows: "Sân đóng cửa. Chọn ngày khác."

### 5. Multiple Consecutive Slots Selected
**Scenario:** User selects 6:00-7:00, 7:00-8:00, 8:00-9:00 (3 consecutive hours).

**Behavior:**
- Auto-group as single booking
- Summary shows: "6:00 - 9:00 (3 giờ)"
- Total price calculated: 3 × price per hour
- Booking created as single record (start: 6:00, end: 9:00)

### 6. Non-Adjacent Slots Selected
**Scenario:** User selects 6:00-7:00 and 10:00-11:00 (non-adjacent).

**Behavior:**
- Show dialog: "Bạn muốn đặt 2 slot riêng biệt?"
- Options:
  - "Đặt riêng" → Clear previous selection, keep only latest
  - "Đặt cả hai" → Allow (create 2 separate bookings - future feature)
- MVP: Force separate booking flow (book one at a time)

### 7. Peak Hours Pricing Varies
**Scenario:** Morning slots 200k/h, evening slots 300k/h (peak).

**Behavior:**
- Each slot card shows its specific price
- Peak slots have "⚡ Giờ cao điểm" badge
- Summary total correctly sums different prices
- Example: 6-7 (200k) + 18-19 (300k) = 500k total

### 8. No Slots Available for Selected Date
**Scenario:** All slots booked for that date.

**Behavior:**
- Date card shows gray dot (fully booked)
- Time slots section shows empty state:
  - Icon: Calendar with X
  - Text: "Không có slot trống cho ngày này"
  - Sub-text: "Hãy thử ngày khác hoặc đặt sân khác"
  - CTA: "Xem sân khác" → Navigate to Court Discovery

### 9. Only 1-2 Slots Remaining
**Scenario:** Court almost fully booked, only 1-2 slots left.

**Behavior:**
- Show badge on date card: "Sắp hết chỗ" (orange)
- Encourage urgency: "Chỉ còn 2 slot!" (small text above grid)
- No other special behavior

### 10. User Selects Slots, Then Changes Date
**Scenario:** User selects slots for Dec 15, then switches date to Dec 16.

**Behavior:**
- Show confirmation dialog:
  - "Bạn có các slot đã chọn cho ngày 15/12. Chuyển ngày sẽ hủy chọn những slot này."
  - Options: "Hủy" (stay on current date) | "Chuyển ngày" (clear selection, switch date)
- If user confirms → Clear selection, load slots for new date

### 11. Slot Lock Fails (Server Error)
**Scenario:** User selects slots and taps "Tiếp tục", but API call to lock slots fails.

**Behavior:**
- Show error toast: "Không thể giữ slot. Vui lòng thử lại."
- Slots remain selected in UI (not locked on server)
- Allow retry: "Thử lại" button
- If retry fails 3 times → Show error with "Liên hệ hỗ trợ"

### 12. Network Offline
**Scenario:** User has no internet connection.

**Behavior:**
- On mount: Show error state "Không có kết nối internet"
- Cannot load slots
- CTA: "Thử lại" (check network and retry)
- Offline icon in header

### 13. Price Changes During Session
**Scenario:** Admin updates slot price while user is browsing.

**Behavior:**
- Use price at lock time (when user taps "Tiếp tục")
- Lock API returns final price
- If price differs from displayed → Show notification:
  - "Giá đã thay đổi: 200k → 220k. Bạn có muốn tiếp tục?"
  - Options: "Hủy" | "Tiếp tục"

### 14. Booking for Tomorrow Past Midnight
**Scenario:** User at 11:50 PM selects slots for tomorrow (12:01 AM = tomorrow).

**Behavior:**
- Allow selection (within 30-day window policy)
- Validate booking time against current time + court policy
- No special restriction

### 15. User Has Unpaid Booking
**Scenario:** User already has slots locked from another session (e.g., browser tab).

**Behavior:**
- On mount, check if user has active locks
- If yes → Show notification:
  - "Bạn có slots đang giữ từ lúc [time]. Muốn tiếp tục với booking đó?"
  - Options: "Hủy booking cũ" | "Xem booking cũ"
- If "Xem booking cũ" → Load those slots and continue

---

## Ghi chú

### UX Considerations:
- **Slot Locking is Critical**: Timer và slot locking mechanism là core value proposition → Phải hiển thị rõ ràng, không bị miss
- **Price Transparency**: Show exact price per slot, không hide fees → Build trust
- **Multi-select UX**: Allow selecting multiple slots dễ dàng (tap to toggle), nhưng clarify khi non-adjacent
- **Date Selection First**: Force user chọn date trước khi show slots → Giảm cognitive load
- **Summary Always Visible**: Collapsed bottom sheet luôn hiển thị tổng → User biết mình đang đặt gì
- **Countdown Urgency**: Color coding (blue → orange → red) tạo urgency nhẹ nhàng, không stress
- **Error Recovery**: Mọi error đều có "Thử lại" hoặc alternative action → Không dead-end

### Performance:
- **Lazy Load Slots**: Only load slots for selected date (không pre-load all dates)
- **Cache Slots**: Cache 5 minutes để tránh reload khi user quay lại screen
- **Optimistic Selection**: Update UI ngay khi tap slot, validate sau
- **Debounce Date Switch**: Wait 300ms sau khi user taps date trước khi fetch slots (avoid rapid taps)
- **Pagination**: If court có > 20 slots/day, consider pagination or virtual scroll

### Accessibility:
- **Date Selector**:
  - VoiceOver: "Thứ Hai, 15 tháng 12. Có slot trống. Nút. Chạm đúp để chọn"
  - Horizontal scroll: Accessible via swipe gestures
- **Time Slots**:
  - Available: "6 giờ đến 7 giờ. 200 nghìn đồng. Có sẵn. Nút. Chạm đúp để chọn"
  - Booked: "6 giờ đến 7 giờ. Đã đặt. Không khả dụng"
  - Selected: "6 giờ đến 7 giờ. 200 nghìn đồng. Đã chọn. Nút. Chạm đúp để bỏ chọn"
- **Countdown Timer**: "Thời gian giữ chỗ: 9 phút 45 giây còn lại"
- **CTA Button**: "Tiếp tục thanh toán. 400 nghìn đồng. Nút. Chạm đúp để kích hoạt"

### Analytics Events:
- `booking_screen_view` (court_id, source: court_detail/history/deeplink)
- `booking_date_select` (court_id, date_selected, day_of_week)
- `booking_slot_select` (court_id, slot_time, slot_price, is_peak)
- `booking_slot_deselect` (court_id, slot_time)
- `booking_slots_locked` (court_id, slot_count, total_amount, lock_duration: 600s)
- `booking_timer_warning` (court_id, time_remaining: 120s)
- `booking_timer_expired` (court_id, slot_count)
- `booking_timer_cancelled` (court_id, manual: true/false)
- `booking_proceed_payment` (court_id, slot_count, total_amount)
- `booking_slot_conflict` (court_id, conflicted_slots)

### Validation Rules:
- **Date range**: Today → Today + 30 days
- **Slots per booking**: Min 1, Max 10 (configurable per court)
- **Booking duration**: Min 1 hour, Max 8 hours consecutive
- **Lock timeout**: Exactly 10 minutes (600 seconds)
- **Max concurrent locks per user**: 1 (prevent abuse)
- **Price format**: Integer, > 0, displayed as "XXXk VND"

### Business Logic:
- **Slot Locking**:
  - When user taps "Tiếp tục" → API call locks selected slots for 10 min
  - Locked slots show status: `locked`, `locked_by: user_id`, `locked_until: timestamp`
  - Other users see locked slots as "reserved by others" (orange state)
  - Auto-release at timeout or when user completes/cancels payment
- **Peak Pricing**:
  - Slots have individual prices based on time_of_day
  - Peak hours (6-8 AM, 5-9 PM): Higher price
  - Off-peak hours (9 AM-4 PM, 9-10 PM): Lower price
  - Show badge on peak slots: "⚡ Giờ cao điểm"
- **Consecutive Slot Discount** (Future):
  - Book 3+ consecutive hours → 10% discount
  - Show discount in summary: "Giảm giá (3 giờ+): -60k VND"
- **Cancellation Policy Display**:
  - Show policy link in header: "Chính sách hủy đặt"
  - Tap → Modal with full policy (refund %, time windows)

### Security:
- **Slot Lock Verification**:
  - Before payment, verify user owns the lock (check `locked_by`)
  - Prevent hijacking another user's locked slots
- **Price Validation**:
  - Backend validates price matches current slot price (prevent manipulation)
  - If mismatch → Reject booking, show updated price
- **Concurrent Booking Prevention**:
  - Database constraint: UNIQUE (court_id, date, start_time, end_time)
  - Optimistic locking: Check `locked_until` before confirming booking
- **Rate Limiting**:
  - Max 3 lock attempts per minute per user (prevent spam)

### Integration Points:
- **Backend APIs**:
  - `GET /courts/:id/slots?date=YYYY-MM-DD` - Fetch available slots
  - `POST /bookings/lock` - Lock selected slots (returns lock_id, locked_until)
  - `DELETE /bookings/lock/:id` - Release lock manually
  - `POST /bookings` - Create booking after payment success
- **Real-time**:
  - WebSocket subscription: `courts/:court_id/slots`
  - Listen for slot status changes (booked, locked, released)
  - Update UI in real-time when other users book
- **Payment Integration**:
  - Pass lock_id to Payment Screen
  - Payment Screen validates lock before processing payment
  - On payment success → Convert lock to booking
  - On payment fail/timeout → Release lock

### Future Enhancements (Post-MVP):
- **Invite match to booking**: "Mời người chơi" button → Send invitation via chat
- **Recurring bookings**: "Đặt lại hàng tuần" option for same time slot
- **Waitlist**: If no slots available, join waitlist for cancellations
- **Group bookings**: Book for multiple courts at once (tournaments)
- **Discount codes**: Apply promo codes in summary section
- **Split payment**: Share booking cost with match (invite + split bill)
