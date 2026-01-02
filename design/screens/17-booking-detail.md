# Booking Detail Screen

## Screen Overview
Màn hình chi tiết booking hiển thị thông tin đầy đủ về một booking cụ thể, bao gồm QR code để check-in tại sân, thông tin sân chi tiết, countdown timer (nếu upcoming), chính sách hủy, và các quick actions. Screen này là hub trung tâm cho mọi thao tác liên quan đến một booking.

## Mục đích
- Cung cấp QR code nhanh chóng để check-in tại sân
- Hiển thị đầy đủ thông tin booking để user không bỏ sót gì
- Countdown timer cho booking sắp diễn ra để tạo urgency
- Hỗ trợ hủy booking theo chính sách với refund calculation rõ ràng
- Quick actions tiện lợi (Calendar, Directions, Share, Rebook, Rate)
- Checklist "What to Bring" để user chuẩn bị đầy đủ

## Các Section/Components Chính

### 1. Header Section
**Mô tả:**
- **Layout**: Fixed top bar với safe area padding
- **Components**:
  - Back button (left): Arrow left icon
  - Title: "Chi tiết Booking" (center, bold, 18pt)
  - Share button (right): Share icon
  - Status badge (below title): Pill badge màu theo trạng thái
- **Background**: White với subtle shadow bottom

**Tương tác:**
- Tap Back → Navigate back to Booking History (16)
- Tap Share → Open native share sheet:
  - Text: "Booking tại [Court Name] vào [Date] lúc [Time]. Mã: [Reference]"
  - Image: QR code (nếu có)
  - Deep link: `/bookings/:bookingId`

**Status Badge Colors:**
| Status | Text | Background | Icon |
|--------|------|-----------|------|
| Confirmed | "Đã xác nhận" | Blue (#2196F3) | Checkmark |
| Completed | "Hoàn thành" | Green (#4CAF50) | Checkmark circle |
| Cancelled | "Đã hủy" | Red (#F44336) | X mark |
| Refunded | "Đã hoàn tiền" | Orange (#FF9800) | Money return |
| No Show | "Không đến" | Gray (#9E9E9E) | Warning |
| In Progress | "Đang diễn ra" | Purple (#9C27B0) | Clock |

**Hiệu ứng:**
- Share button: Scale animation on tap

---

### 2. QR Code Section (Upcoming/In Progress Bookings)
**Mô tả:**
- **Visibility**: Hiển thị khi status = Confirmed hoặc In Progress
- **Layout**: Centered card với padding 24pt, elevation shadow
- **Components**:
  - **Header**:
    - Icon: QR code icon (primary color)
    - Title: "Mã QR Check-in" (bold, 18pt)
    - Subtitle: "Quét mã tại sân để xác nhận booking" (gray, 14pt)
  - **QR Code Image**:
    - Size: 200x200pt (square)
    - Background: White với subtle border (1pt, gray)
    - Content: Booking reference + hash (HMAC-SHA256)
    - Error correction: High (L-level)
    - Center aligned
  - **Brightness indicator** (nếu QR displayed):
    - "Độ sáng tối đa để scan dễ hơn" (small, gray, 12pt)
  - **Instruction text**:
    - "Hiển thị mã này khi đến sân" (center, 14pt, gray)
  - **Action Buttons** (horizontal row):
    - **"Lưu QR"**: Outline button, icon Download
      - Tap → Save QR to Photo Library
      - Show toast: "Đã lưu QR vào thư viện ảnh"
    - **"Phóng to"**: Outline button, icon Expand
      - Tap → Full screen QR modal (max brightness)
      - Swipe down to dismiss

**States:**
- **QR Loading**: Skeleton placeholder với "Đang tạo mã QR..."
- **QR Failed**: Show booking reference lớn thay QR
  - Icon: Document checkmark
  - Text: "Sử dụng mã booking: [Reference]"
  - Sub-text: "QR đã được gửi qua email/SMS"
  - No action buttons
- **QR Expired** (booking past):
  - QR có overlay badge "Đã sử dụng" hoặc "Hết hạn"
  - Buttons disabled và gray out

**Edge Cases:**
- **Permission Denied** (Photo Library):
  - Show alert: "Vui lòng cấp quyền truy cập Thư viện Ảnh trong Cài đặt"
  - Actions: "Mở Cài đặt" | "Đóng"
- **Save Failed**:
  - Toast: "Không thể lưu ảnh. Vui lòng thử lại"
  - Suggest screenshot as fallback
- **QR Regenerate** (nếu expired < 30min):
  - Show "Tạo lại QR" button
  - Tap → Request new QR from backend

**Hiệu ứng:**
- QR fade in animation (400ms)
- Full screen modal: Slide up with brightness boost
- Save button: Scale + haptic feedback

---

### 3. Countdown Section (Upcoming Bookings < 48h)
**Mô tả:**
- **Visibility**: Show khi booking trong vòng 48 giờ và status = Confirmed
- **Layout**: Prominent banner với gradient background (primary color)
- **Components**:
  - **Countdown Display**:
    - Large text: "Còn [X] giờ [Y] phút" (white, bold, 24pt)
    - Sub-text: "đến giờ chơi" (white, 14pt)
    - Icon: Clock (animated ticking)
  - **Reminder Toggle**:
    - Label: "Nhắc 2 giờ trước" (white, 14pt)
    - Switch toggle (white track, primary thumb)
    - State: ON by default

**Tương tác:**
- **Countdown**: Update realtime every minute
- **Toggle Reminder**:
  - Tap → Toggle ON/OFF
  - ON: Schedule notification 2h before booking
  - OFF: Cancel scheduled notification
  - Show toast: "Đã bật nhắc nhở" / "Đã tắt nhắc nhở"

**States:**
- **> 24h**: Background gradient blue → light blue
- **12-24h**: Background gradient orange → light orange
- **< 12h**: Background gradient red → light red (urgent)
- **< 30 min**: Flash animation (pulse effect) + "Sắp bắt đầu!" text

**Edge Cases:**
- **Notification Permission Denied**:
  - Toggle disabled với tooltip "Vui lòng bật thông báo trong Cài đặt"
  - Tap → Show alert with "Mở Cài đặt" action
- **Booking Started** (in progress):
  - Countdown changes to "Đã bắt đầu [X] phút trước"
  - Background: Purple gradient
  - No toggle

**Hiệu ứng:**
- Countdown numbers: Flip animation mỗi phút
- Flash effect: Pulse glow (< 30 min)
- Toggle: Smooth slide animation

---

### 4. Booking Info Card
**Mô tả:**
- **Layout**: Card container với rounded corners, shadow
- **Sections**:

#### A. Booking Reference
- **Layout**: Horizontal row với badge style
- **Content**:
  - Label: "Mã đặt sân" (small, gray, 12pt)
  - Reference ID: "PB-260115-K3M7" (large, bold, monospace, 18pt)
  - Copy icon button (right)
- **Styling**:
  - Background: Light blue (#E3F2FD)
  - Border: Dashed blue (1pt)
  - Padding: 12pt
- **Tương tác**:
  - Tap Copy icon → Copy to clipboard
  - Toast: "Đã sao chép mã booking"
  - Haptic feedback

#### B. Court Information
- **Layout**: Horizontal row với tap target
- **Left side**:
  - Court thumbnail (80x80pt, rounded 12pt)
  - Partner badge overlay (nếu is_partner)
- **Right side** (flex, vertical):
  - Court name (bold, 16pt, 2 lines max with ellipsis)
  - Address (gray, 12pt, 2 lines max)
  - Distance + Rating row:
    - "2.3 km" với location icon
    - "⭐ 4.8" với star icon
  - **"Chỉ đường" link** (blue, 14pt, underline)
- **Tương tác**:
  - Tap court info → Navigate to Court Detail (11)
  - Tap "Chỉ đường" → Open Google Maps với directions
    - iOS fallback: Apple Maps
    - Error: "Không có ứng dụng bản đồ"

#### C. Date & Time Details
- **Layout**: Grid 2 columns, spacing 16pt
- **Items**:
  1. **Ngày đặt**:
     - Icon: Calendar (primary color)
     - Label: "Ngày đặt" (gray, 12pt)
     - Value: "Thứ Hai, 15/01/2026" (bold, 14pt)
  2. **Giờ chơi**:
     - Icon: Clock (primary color)
     - Label: "Giờ chơi"
     - Value: "18:00 - 20:00" (bold, 14pt)
  3. **Thời lượng**:
     - Icon: Hourglass (primary color)
     - Label: "Thời lượng"
     - Value: "2 giờ" (bold, 14pt)
  4. **Slots chi tiết**:
     - Icon: Grid (primary color)
     - Label: "Slots"
     - Value: "18:00-19:00, 19:00-20:00" (14pt, gray)

#### D. Payment Summary
- **Layout**: Vertical list với spacing 8pt
- **Items**:
  - Row: "Subtotal" | "400.000đ" (right-aligned, gray)
  - Row: "Giảm giá" | "-40.000đ" (green, nếu có)
  - Row: "Phí dịch vụ" | "10.000đ" (gray)
  - **Divider line** (1pt, light gray)
  - Row: "Tổng cộng" | "370.000đ" (bold, 18pt, primary color)
- **Payment Method Badge**:
  - Icon: Visa/MC/MoMo/ZaloPay logo
  - Text: "Đã thanh toán qua Visa ****4242" (gray, 12pt)

**Hiệu ứng:**
- Card slide up from bottom on mount
- Each section fade in staggered (50ms delay)
- Copy animation: Icon scale + checkmark transition

---

### 5. Quick Actions Section
**Mô tả:**
- **Layout**: Grid 2x2 hoặc 2x3 (tùy số actions)
- **Buttons** (vary by booking status):

#### Universal Actions (All bookings):
1. **"Thêm vào Lịch"**:
   - Icon: Calendar plus
   - Style: Outline button, blue
   - Tương tác:
     - Open calendar app
     - Pre-fill event:
       - Title: "Chơi Pickleball - [Court Name]"
       - Date/Time: From booking
       - Location: Court address
       - Notes: Reference + phone
       - Reminder: 2h before
     - Toast: "Đã thêm vào lịch"
   - Edge case: Permission denied → Alert

2. **"Chia Sẻ"**:
   - Icon: Share
   - Style: Outline button, green
   - Tương tác: Native share sheet (như header Share)

#### Upcoming/In Progress Actions:
3. **"Chỉ đường"**:
   - Icon: Navigate arrow
   - Style: Filled button, primary color
   - Tương tác: Open Google Maps navigation

#### Upcoming Actions (< deadline):
4. **"Hủy Booking"** (destructive):
   - Icon: X mark
   - Style: Outline button, red
   - **Eligibility Check**:
     - < 2h before → Disabled, tooltip "Không thể hủy trước 2 giờ"
     - >= 2h → Enabled
   - Tương tác:
     - Tap → Show Cancellation Dialog (see section 7)

#### Completed Actions:
5. **"Đánh Giá Sân"**:
   - Icon: Star
   - Style: Filled button, yellow
   - **Visibility**:
     - Show nếu chưa rated
     - Hide hoặc disable nếu đã rated → Show "Đã đánh giá" text
   - Tương tác: Navigate to Rating Screen (22)

6. **"Đặt Lại Sân Này"**:
   - Icon: Refresh
   - Style: Outline button, green
   - Tương tác:
     - Navigate to Court Booking (12) với court pre-filled
     - Pre-select same time slot nếu available
   - Edge case: Court closed → Disabled, tooltip "Sân ngừng hoạt động"

**Layout:**
- Row 1: "Thêm vào Lịch" + "Chia Sẻ"
- Row 2: "Chỉ đường" + "Hủy Booking" (upcoming)
- Row 2: "Đánh Giá Sân" + "Đặt Lại" (completed)
- Spacing: 12pt between buttons

**Hiệu ứng:**
- Buttons slide in from bottom (staggered, 50ms delay)
- Tap: Scale to 0.95
- Disabled: Opacity 40%, no interaction

---

### 6. Cancellation Policy Section (Upcoming Bookings)
**Mô tả:**
- **Visibility**: Show khi status = Confirmed hoặc In Progress
- **Layout**: Collapsible accordion card
- **Header** (always visible):
  - Icon: Info circle (left)
  - Text: "Chính sách hủy đặt sân" (bold, 16pt)
  - Chevron down/up (right, rotate on expand)
  - Background: Light yellow (#FFF9C4)

**Content** (expanded state):
- **Policy Table**:

| Thời gian trước booking | Hoàn tiền | Màu |
|-------------------------|-----------|-----|
| > 24 giờ | 100% | Green |
| 12-24 giờ | 50% | Yellow |
| 2-12 giờ | 0% | Orange |
| < 2 giờ | Không thể hủy | Red |

- **Deadline Countdown** (dynamic):
  - **Text**: "Còn [X] giờ [Y] phút để hủy với hoàn tiền 100%"
  - **Color-coded**:
    - Green: > 24h (100% refund)
    - Yellow: 12-24h (50% refund)
    - Orange: 2-12h (0% refund)
    - Red: < 2h (cannot cancel)
  - **Progress bar**: Visual indicator (fill from left)
  - **Icon**: Clock với warning triangle (nếu < 12h)

- **Refund Calculation** (if user cancels now):
  - "Nếu hủy ngay:" (gray, 14pt)
  - Refund amount: "[XXX.XXXđ]" (large, bold, green/yellow/red)
  - Percentage: "(100% / 50% / 0%)" (gray)

- **"Hủy Booking" Button** (bottom of section):
  - Style: Destructive button (red)
  - Text: "Hủy Booking Này"
  - Disabled nếu < 2h
  - Tương tác: Show Cancellation Dialog (section 7)

**Tương tác:**
- Tap header → Toggle expand/collapse
- Chevron rotate animation (smooth)
- Tap "Hủy Booking" → Cancellation Dialog

**States:**
- **Collapsed** (default): Header only
- **Expanded**: Full content visible
- **Auto-expand**: Nếu deadline < 12h → Auto expand on screen load

**Edge Cases:**
- **Deadline Passed** (< 2h):
  - "Hủy Booking" button disabled, gray
  - Tooltip: "Không thể hủy trước 2 giờ khi booking bắt đầu"
- **Already In Progress**:
  - Section hidden hoặc show "Không thể hủy khi booking đang diễn ra"

**Hiệu ứng:**
- Expand/collapse: Height animation (300ms, ease-out)
- Countdown: Update every minute
- Progress bar: Animate width on mount

---

### 7. Cancellation Dialog (Modal)
**Mô tả:**
- **Trigger**: Tap "Hủy Booking" button
- **Layout**: Bottom sheet modal (iOS) hoặc Dialog (Android)
- **Components**:
  - **Header**:
    - Icon: Warning triangle (red)
    - Title: "Xác nhận hủy booking" (bold, 18pt)
    - Close button (X, top-right)
  - **Warning Message**:
    - "Bạn có chắc muốn hủy booking này?" (14pt, gray)
  - **Refund Info Card**:
    - Background: Light green/yellow/red (tùy refund %)
    - Content:
      - "Số tiền hoàn lại: [XXX.XXXđ]" (bold, 16pt)
      - "([100/50/0]% tổng giá trị)" (gray, 12pt)
      - "Hoàn tiền trong 3-5 ngày làm việc" (small, gray)
  - **Reason Input** (optional):
    - Label: "Lý do hủy (tùy chọn)" (12pt, gray)
    - TextInput: Multiline, placeholder "Nhập lý do..."
    - Max chars: 200
  - **Actions**:
    - "Quay lại" button (outline, gray) → Dismiss modal
    - "Xác nhận hủy" button (filled, red) → Execute cancellation

**Tương tác:**
- Tap "Xác nhận hủy":
  - Show loading spinner on button
  - Call API `POST /bookings/:id/cancel`
  - **Success**:
    - Dismiss modal
    - Update booking status to "Cancelled"
    - Show success toast: "Đã hủy booking. Hoàn tiền trong 3-5 ngày"
    - Refresh screen (update status badge, hide sections)
    - Haptic feedback (success)
  - **Error**:
    - Show error toast: "Không thể hủy. Vui lòng thử lại hoặc liên hệ hỗ trợ"
    - Keep modal open
    - Enable retry

- Tap "Quay lại" → Dismiss modal
- Tap outside modal (iOS) → Dismiss
- Swipe down (iOS) → Dismiss

**Edge Cases:**
- **Network Error**:
  - Toast: "Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại"
  - Retry button
- **Cancellation Rejected** (backend rule changed):
  - Toast: "Đã quá hạn để hủy booking này"
  - Force refresh screen
- **Concurrent Cancellation** (admin cancelled same time):
  - Toast: "Booking đã được hủy bởi admin"
  - Refresh screen

**Hiệu ứng:**
- Modal slide up from bottom (iOS) với blur backdrop
- Refund card: Fade in với scale animation
- Confirm button: Loading spinner replace text

---

### 8. What to Bring Checklist
**Mô tả:**
- **Visibility**: Show cho upcoming và in-progress bookings
- **Layout**: Card với checkable list
- **Header**:
  - Icon: Backpack
  - Title: "Chuẩn bị gì?" (bold, 16pt)
- **Checklist Items** (vertical list):
  1. ☐ Vợt pickleball (hoặc thuê tại sân)
  2. ☐ Giày thể thao (đế không trượt)
  3. ☐ Nước uống
  4. ☐ Khăn lau mồ hôi
  5. ☐ CMND/CCCD (để check-in)
  6. ☐ Điện thoại (hiển thị QR code)
- **Styling**: Each item có checkbox (tap to check), gray text when unchecked, strikethrough + green when checked

**Tương tác:**
- Tap checkbox → Toggle checked/unchecked
- State persists locally (AsyncStorage)
- No backend sync (local UX only)
- Reset checklist sau khi booking completed

**Hiệu ứng:**
- Check animation: Scale + checkmark fade in
- Strikethrough: Smooth line animation

---

### 9. Court Contact Section
**Mô tả:**
- **Layout**: Card với action rows
- **Header**:
  - Icon: Phone circle
  - Title: "Liên hệ sân" (bold, 16pt)
- **Contact Rows**:
  1. **Phone**:
     - Icon: Phone
     - Text: "(028) 1234 5678" (bold, 14pt)
     - Action: Tap to call
     - Right icon: Arrow right
  2. **Email**:
     - Icon: Email
     - Text: "contact@courtabc.vn" (bold, 14pt)
     - Action: Tap to email
     - Right icon: Arrow right
  3. **Website** (optional):
     - Icon: Globe
     - Text: "courtabc.vn" (bold, 14pt)
     - Action: Tap to open browser
     - Right icon: External link

**Tương tác:**
- Tap Phone → Open phone dialer với number pre-filled
- Tap Email → Open email app với email pre-filled
  - Subject: "Booking [Reference] - [Court Name]"
  - Body: Booking details
- Tap Website → Open in-app browser hoặc Safari/Chrome

**Edge Cases:**
- **No phone app** (tablet):
  - Show toast: "Thiết bị không hỗ trợ gọi điện"
  - Copy phone number to clipboard as fallback
- **No email app**:
  - Toast: "Không có ứng dụng email"
  - Copy email to clipboard

**Hiệu ứng:**
- Row tap: Ripple effect (Android), highlight (iOS)

---

### 10. Support/Help Footer
**Mô tả:**
- **Layout**: Small footer section, gray background
- **Content**:
  - Text: "Cần hỗ trợ với booking này?" (center, gray, 12pt)
  - Link: "Liên hệ hỗ trợ" (blue, underline)
- **Tương tác**:
  - Tap link → Navigate to Support screen hoặc open chat
  - Or: Open email với support@ and booking details pre-filled

---

## Navigation

### Đến screen này từ:
- **Booking History (16)** → Tap booking card
- **Booking Confirmation (14)** → Tap "Xem Chi Tiết"
- **Push Notification** → Tap reminder notification
- **Deep link**: `/bookings/:bookingId`
- **Email/SMS** → Tap "Xem booking" link

### Từ screen này đến:
- **Booking History (16)** → Back button
- **Court Detail (11)** → Tap court info
- **Court Booking (12)** → Tap "Đặt Lại Sân Này"
- **Rating Screen (22)** → Tap "Đánh Giá Sân"
- **Google Maps** (external) → Tap "Chỉ đường"
- **Native Calendar** → Tap "Thêm vào Lịch"
- **Native Share Sheet** → Tap "Chia Sẻ"
- **Phone Dialer** → Tap phone contact
- **Email App** → Tap email contact

---

## States

### Default State (Upcoming Booking)
- QR code section visible và loaded
- Countdown section visible (nếu < 48h)
- Booking info card full
- Quick actions: Calendar, Share, Chỉ đường, Hủy
- Cancellation policy collapsed
- What to Bring checklist visible
- Court contact visible

### In Progress State
- QR code visible (overlay "Đang sử dụng")
- Countdown shows "Đã bắt đầu X phút trước"
- Quick actions: Calendar, Share, Chỉ đường (no Hủy)
- Cancellation policy hidden
- Checklist visible

### Completed State
- QR code hidden hoặc show "Đã sử dụng" overlay
- Countdown hidden
- Quick actions: Calendar, Share, Đánh giá, Đặt lại
- Cancellation policy hidden
- Checklist hidden
- Add "Đã hoàn thành lúc [time]" badge

### Cancelled State
- QR code hidden
- Countdown hidden
- Refund status card visible:
  - "Đã hủy lúc [time]"
  - "Hoàn tiền: [amount]đ ([%]%)"
  - "Trạng thái: Đang xử lý / Đã hoàn"
- Quick actions: Share, Đặt lại (no Calendar, Chỉ đường, Đánh giá, Hủy)
- Cancellation policy replaced với refund info
- Show cancellation reason (nếu có)

### Loading State
- Skeleton placeholders:
  - QR: Gray square với shimmer
  - Booking info: Skeleton text lines
  - Actions: Skeleton buttons
- Disable interactions

### Error State
- Failed to load:
  - Icon: Error/warning
  - Message: "Không thể tải thông tin booking"
  - Actions:
    - "Thử lại" → Retry fetch
    - "Quay lại" → Back to Booking History

---

## Edge Cases

### 1. QR Code Generation Failed
**Scenario:** Backend không thể generate QR

**Behavior:**
- QR section shows fallback:
  - Large booking reference (monospace, bold)
  - Icon: Document checkmark
  - Message: "Sử dụng mã booking này để check-in"
  - Sub-text: "QR đã được gửi qua email/SMS"
  - No "Lưu QR" button
- User có thể check-in bằng reference
- Email/SMS contains QR image (backup)

### 2. Booking Starting in < 30 Minutes
**Scenario:** User mở screen khi sắp đến giờ

**Behavior:**
- Countdown section:
  - Flash/pulse animation (red gradient)
  - Text: "Sắp bắt đầu! Còn [X] phút"
- QR code highlighted (glow border)
- "Chỉ đường" button prominent (filled, large)
- Push notification sent: "Booking sắp bắt đầu!"
- Auto-increase screen brightness (suggest)

### 3. Cancellation Deadline Passed (< 2h)
**Scenario:** User tries to cancel quá muộn

**Behavior:**
- "Hủy Booking" button disabled, gray
- Tooltip: "Không thể hủy trước 2 giờ khi booking bắt đầu"
- Cancellation policy shows "< 2h: Không thể hủy" row in red
- Suggest contact support: "Liên hệ hỗ trợ nếu cần hủy khẩn cấp"

### 4. Refund Pending
**Scenario:** Booking cancelled, refund processing

**Behavior:**
- Status badge: "Đã hoàn tiền" (orange)
- Refund status card:
  - "Số tiền hoàn lại: [amount]đ"
  - "Trạng thái: Đang xử lý"
  - Progress bar (animated)
  - "Hoàn tiền trong 3-5 ngày làm việc"
  - "Ngày dự kiến: [date]"
- No "Hủy" button (already cancelled)
- Show "Đặt lại" button

### 5. Booking Past & Unrated
**Scenario:** Completed booking, user chưa review

**Behavior:**
- "Đánh Giá Sân" button prominent:
  - Badge: "Mới" hoặc "Nhắc nhở"
  - Yellow color, filled
  - Move to top of quick actions
- Show reminder text:
  - "Đánh giá sân để giúp cộng đồng!"
  - Star icons animation (pulse)
- After 7 days → Reminder less prominent

### 6. QR Code Expired (Booking Completed)
**Scenario:** User mở detail của booking đã chơi xong

**Behavior:**
- QR có overlay badge "Đã sử dụng" hoặc "Hết hạn"
- QR blurred hoặc grayed out
- "Lưu QR" button hidden
- Show "Check-in lúc [time]" text (nếu có data)

### 7. Court Closed Permanently
**Scenario:** Court đã ngừng hoạt động (sau khi booking)

**Behavior:**
- Court info có warning badge: "Sân ngừng hoạt động"
- "Chỉ đường" disabled
- "Đặt lại" disabled với tooltip: "Sân không còn hoạt động"
- Suggest: "Tìm sân tương tự" button → Court Discovery với filters

### 8. Multiple Bookings Same Day
**Scenario:** User có nhiều bookings cùng ngày

**Behavior:**
- Countdown section shows cho booking gần nhất
- Add navigation arrows: "< Booking trước | Booking sau >"
- Swipe left/right → Navigate between bookings cùng ngày
- Badge: "1/3" để indicate position

### 9. Device Offline
**Scenario:** User offline, mở booking đã cached

**Behavior:**
- Show cached data với stale indicator:
  - Banner: "Bạn đang offline. Dữ liệu có thể chưa cập nhật"
  - Timestamp: "Cập nhật lúc [time]"
- QR vẫn visible (cached image)
- Disable actions require network:
  - "Hủy Booking" disabled
  - "Share" works offline (share text only)
  - "Thêm vào Lịch" works (local)
  - "Chỉ đường" works (open Maps)
- Auto-refresh when online

### 10. Booking Edited by Admin
**Scenario:** Admin thay đổi booking (time, court)

**Behavior:**
- Show "Đã cập nhật" badge (orange)
- Changes highlighted:
  - Old value strikethrough, gray
  - New value bold, primary color
  - Example: "18:00 - 20:00" → "19:00 - 21:00"
- Alert modal on screen load:
  - "Booking đã được cập nhật bởi admin"
  - List changes
  - "Đồng ý" button
- Email/notification sent about changes

### 11. Price Changed After Booking
**Scenario:** Court tăng/giảm giá sau khi booking

**Behavior:**
- Honor original price paid (không bị ảnh hưởng)
- Payment summary shows:
  - "Giá tại thời điểm đặt: [original price]"
  - Note: "(Giá hiện tại: [current price])" - informational only
- No refund/charge difference

### 12. Calendar Permission Denied
**Scenario:** User từ chối calendar permission

**Behavior:**
- Tap "Thêm vào Lịch" → Check permission
- Alert: "Vui lòng cấp quyền Lịch trong Cài đặt"
- Actions:
  - "Mở Cài đặt" → Deep link to app settings
  - "Đóng"
- Alternative: "Sao chép thông tin" để user add manually

### 13. Screenshot QR Code
**Scenario:** User screenshot QR thay vì save

**Behavior:**
- QR vẫn valid (one-time scan tại sân)
- Court staff scans QR từ screenshot → Works
- System marks as used sau scan
- Security: QR has HMAC hash, prevents fake QRs

### 14. Booking Starting Soon, User Far Away
**Scenario:** Booking < 1h, user location > 30 min away

**Behavior:**
- Show warning banner:
  - Icon: Warning triangle
  - Text: "Bạn cách sân ~[X] km. Đi ngay để kịp giờ!"
  - Background: Orange
- "Chỉ đường" button flash animation
- Suggest call court: "Liên hệ sân nếu đến trễ"

---

## Ghi chú

### UX Considerations:
1. **QR Prominence**: QR code ở top, dễ access ngay → Core value
2. **Countdown Urgency**: Visual cues (color, animation) tạo urgency khi gần giờ
3. **Cancellation Transparency**: Policy rõ ràng, refund calculation trước khi confirm → Trust
4. **Quick Actions Context-aware**: Actions thay đổi theo status → Relevant
5. **What to Bring Checklist**: Giúp user chuẩn bị đầy đủ → Better experience
6. **One-tap Directions**: "Chỉ đường" nhanh chóng → Reduce friction
7. **Offline Capable**: Cached data + local actions work offline → Reliable

### Performance:
- **QR Generation**: Client-side fallback nếu backend slow (use qrcode.js)
- **Countdown Update**: Efficient timer (update every 60s, not every second)
- **Image Caching**: Cache QR, court thumbnail locally
- **Lazy Load**: Load sections on scroll nếu content dài
- **Background Refresh**: Pull booking updates khi app foreground

### Accessibility:
- **VoiceOver/TalkBack**:
  - QR code: "Mã QR check-in. Hình ảnh. Chạm đúp để phóng to"
  - Countdown: "Còn 2 giờ 15 phút đến giờ chơi"
  - Actions: Clear labels with context
- **Color Contrast**: Status badges, countdown colors meet WCAG AA
- **Touch Targets**: Buttons min 44x44pt
- **Dynamic Type**: Support text size adjustment

### Analytics Events:
- `booking_detail_view` (booking_id, status)
- `booking_qr_save` (booking_id)
- `booking_qr_fullscreen` (booking_id)
- `booking_cancel_initiated` (booking_id)
- `booking_cancel_confirmed` (booking_id, refund_amount)
- `booking_calendar_add` (booking_id)
- `booking_share` (booking_id)
- `booking_directions` (booking_id)
- `booking_rebook` (booking_id)
- `booking_rate_tap` (booking_id)
- `booking_checklist_item_checked` (booking_id, item)

### Validation Rules:
- Booking ID: Must be valid UUID
- QR Code: Validate hash before display
- Refund Amount: Must match backend calculation
- Cancellation Deadline: Validate client + server side

### Business Logic:
- **QR Code Content**:
  - Format: JSON `{ booking_id, reference, hash, timestamp }`
  - Hash: HMAC-SHA256(booking_id + secret)
  - Expiry: end_time + 1h buffer
  - One-time use (scan marks as used)
- **Refund Calculation**:
  - > 24h: 100% total_paid
  - 12-24h: 50% total_paid
  - 2-12h: 0%
  - < 2h: Cannot cancel
- **Countdown Timer**:
  - Calculate: start_time - current_time
  - Update: Every 60 seconds
  - Stop: When booking starts hoặc past

### Security:
- **QR Validation**: HMAC prevents fake QRs
- **Deep Link**: Verify booking belongs to authenticated user
- **Cancellation**: Server-side deadline check (không trust client time)
- **Refund**: Double-check eligibility backend

### API Endpoints:
- `GET /bookings/:id` - Fetch booking details
- `POST /bookings/:id/cancel` - Cancel booking (with reason)
- `POST /bookings/:id/qr/regenerate` - Regenerate QR (if expired)
- `POST /bookings/:id/calendar` - Log calendar add (analytics)

### Future Enhancements:
- **Live Chat**: Chat với court staff từ screen này
- **Weather Widget**: Show weather forecast (outdoor courts)
- **Invite Friends**: Share booking với matches để chơi cùng
- **Court Navigation**: In-app map với turn-by-turn directions
- **Apple Wallet Pass**: Add booking to Wallet (iOS)
- **Re-schedule**: Change time/date without cancelling (nếu court allows)

---

*Screen design complete. Ready for frontend implementation with mock data.*
