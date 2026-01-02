# Booking Confirmation Screen

## Screen Overview
Màn hình xác nhận đặt sân thành công sau khi thanh toán hoàn tất. Screen hiển thị animation celebration, booking details đầy đủ, QR code để check-in tại sân, và các actions hữu ích (thêm vào lịch, chia sẻ, xem chi tiết). Đây là screen mang lại cảm giác thành công và tin cậy cho user sau khi hoàn tất booking.

## Mục đích
- Tạo cảm giác thành công và hài lòng với celebration animation
- Cung cấp thông tin booking đầy đủ và rõ ràng (reference, details, QR)
- Cho phép user lưu booking vào calendar để nhắc nhở
- Hỗ trợ share booking với bạn bè/người chơi cùng
- Giải thích chính sách hủy và hướng dẫn tiếp theo (what's next)
- Dẫn dắt user đến các actions tiếp theo (xem chi tiết, đặt sân khác, về home)

## Các Section/Components Chính

### 1. Success Animation Header
**Mô tả:**
- Full-width section ở top của screen
- **Animation elements**:
  - **Checkmark icon**: Large circular checkmark (green) với animation:
    - Scale từ 0 → 1.2 → 1.0 (elastic bounce)
    - Rotate từ -45° → 0°
    - Duration: 600ms
  - **Confetti particles**: Rơi từ top xuống (rainbow colors)
    - 20-30 particles với random positions, sizes, rotation
    - Gravity effect (slow down at bottom)
    - Duration: 2s, fade out sau 1.5s
  - **Success glow**: Radial gradient (green center → transparent)
- **Text content**:
  - Main title: "Đặt Sân Thành Công!" (bold, 24pt, green color)
  - Subtitle: "Booking của bạn đã được xác nhận" (14pt, gray)
- **Background**: White với subtle green gradient top

**Tương tác:**
- None (pure visual feedback)

**Hiệu ứng:**
- Animation plays automatically on mount (once, không loop)
- Confetti có physics-based animation (gravity + bounce)
- Checkmark có haptic feedback (success vibration) khi animation complete

**States:**
- **Animating** (first 2s): Full animation playing
- **Static** (sau 2s): Confetti đã biến mất, chỉ còn checkmark + text

---

### 2. Booking Illustration (Optional)
**Mô tả:**
- Illustration vui vẻ về pickleball/court booking
- Style: Friendly, minimalist, pastel colors
- Position: Dưới success header, trên booking details card
- Size: 200x150pt (horizontal ratio)
- Examples:
  - Hai người chơi pickleball với sân backdrop
  - Calendar với checkmark + pickleball racket
  - Happy character holding booking confirmation

**Tương tác:**
- None (decorative)

**Hiệu ứng:**
- Fade in (400ms delay sau success animation)
- Subtle floating animation (slow up-down 2px, 3s loop)

---

### 3. Booking Details Card
**Mô tả:**
- Card container với shadow và rounded corners
- Layout: Vertical stack
- Sections:

#### A. Booking Reference
- **Layout**: Horizontal với badge style
- **Content**:
  - Label: "Mã đặt sân" (small, gray)
  - Reference ID: "PB-240315-A7K2" (large, bold, monospace font)
  - Copy icon button (right side)
- **Styling**:
  - Background: Light blue (#E3F2FD)
  - Border: Dashed blue
  - Padding: 12pt
- **Tương tác**:
  - Tap copy icon → Copy reference to clipboard
  - Show toast: "Đã sao chép mã booking"

#### B. Court Information
- **Layout**: Horizontal row
- **Left side**:
  - Court thumbnail (80x80pt, rounded 8pt)
  - Badge: "Đối tác" nếu partner court
- **Right side** (vertical stack):
  - Court name (bold, 16pt)
  - Address (gray, 12pt, 2 lines max with ellipsis)
  - Distance: "2.3 km từ vị trí của bạn" (small, gray)
  - Rating: ⭐ 4.8 (12 reviews)
- **Tương tác**:
  - Tap entire section → Navigate to Court Detail (11-court-detail.md)

#### C. Date & Time Details
- **Layout**: Grid 2 columns
- **Items**:
  - **Ngày đặt**:
    - Icon: Calendar
    - Label: "Ngày đặt"
    - Value: "Thứ Hai, 15 Tháng 12, 2025" (bold)
  - **Giờ chơi**:
    - Icon: Clock
    - Label: "Giờ chơi"
    - Value: "18:00 - 20:00" (bold)
  - **Thời lượng**:
    - Icon: Hourglass
    - Label: "Thời lượng"
    - Value: "2 giờ" (bold)
  - **Slots**:
    - Icon: Grid
    - Label: "Slots"
    - Value: "18:00-19:00, 19:00-20:00" (small, gray)
- **Styling**: Each cell có icon + text, spacing 16pt

#### D. Payment Summary
- **Layout**: Vertical list
- **Items**:
  - Subtotal: "400,000đ" (right-aligned)
  - Discount: "-40,000đ" (green, nếu có)
  - Service fee: "10,000đ"
  - **Total Paid**: "370,000đ" (bold, large, primary color)
- **Divider**: Thin line trước Total
- **Payment method badge**:
  - Icon: Visa/MC/MoMo/ZaloPay
  - Text: "Đã thanh toán qua Visa ****4242"

**Tương tác:**
- Tap payment method → Show payment receipt (future)

**Hiệu ứng:**
- Card slide up from bottom (300ms delay)
- Each section fade in staggered (50ms delay per section)

---

### 4. QR Code Section
**Mô tả:**
- Prominent section để check-in tại sân
- **Layout**: Centered card với padding
- **Components**:
  - **Header**:
    - Icon: QR code icon
    - Title: "Mã QR Check-in" (bold, 16pt)
    - Subtitle: "Quét mã này tại sân để xác nhận" (gray, 12pt)
  - **QR Code Image**:
    - Size: 200x200pt
    - Center aligned
    - White background với border
    - QR encodes: booking reference + hash for security
    - Error correction: High (L-level)
  - **Instruction text**:
    - "Vui lòng xuất trình mã QR này khi đến sân" (small, center, gray)
  - **Save to Photos Button**:
    - Style: Outline button (white background, primary border)
    - Text: "Lưu vào Thư viện Ảnh"
    - Icon: Download icon
- **Fallback** (nếu QR gen failed):
  - Show booking reference lớn thay QR
  - Text: "QR code sẽ được gửi qua email/SMS"

**Tương tác:**
- **Tap "Lưu vào Thư viện Ảnh"**:
  - Request photo library permission (nếu chưa có)
  - Save QR image to device photos
  - Show toast: "Đã lưu QR vào thư viện ảnh"
  - Haptic feedback
- **Long press QR**: Show share sheet (same as tap Share action)

**Edge Cases:**
- **Permission denied**: Show alert "Vui lòng cấp quyền truy cập Thư viện Ảnh trong Cài đặt"
- **QR gen failed**: Show fallback UI với booking reference text
- **Save failed**: Show error toast "Không thể lưu ảnh. Vui lòng thử lại"

**Hiệu ứng:**
- QR code fade in (400ms) sau khi card hiển thị
- Save button: Scale animation khi tap

---

### 5. Action Buttons Section
**Mô tả:**
- Grid of action buttons (2 columns trên mobile, 4 columns trên tablet)
- **Buttons** (theo priority):

#### A. Xem Chi Tiết (Primary Action)
- **Style**: Filled button, primary color
- **Icon**: Document icon
- **Text**: "Xem Chi Tiết"
- **Tương tác**: Navigate to Booking Detail Screen (17-booking-detail.md)

#### B. Thêm vào Lịch
- **Style**: Outline button
- **Icon**: Calendar plus icon
- **Text**: "Thêm vào Lịch"
- **Tương tác**:
  - Open native calendar app
  - Pre-fill event:
    - Title: "Chơi Pickleball - [Court Name]"
    - Date & Time: Từ booking
    - Location: Court address
    - Notes: Booking reference + court phone
    - Reminder: 2 giờ trước
  - Show toast: "Đã thêm vào lịch"
- **Edge Case**:
  - Calendar permission denied → Show alert "Vui lòng cấp quyền truy cập Lịch"

#### C. Chia Sẻ
- **Style**: Outline button
- **Icon**: Share icon
- **Text**: "Chia Sẻ"
- **Tương tác**:
  - Open native share sheet
  - Share content:
    - Text: "Tôi vừa đặt sân pickleball tại [Court Name] vào [Date] lúc [Time]. Mã booking: [Reference]. Chơi cùng nhé!"
    - Image: QR code (nếu có)
    - URL: Deep link to booking detail (future)
  - Platforms: WhatsApp, Messenger, SMS, Email, Copy link
- **Edge Case**:
  - Share unavailable (rare) → Fallback to copy text to clipboard

#### D. Đặt Sân Khác
- **Style**: Outline button (secondary color)
- **Icon**: Plus icon
- **Text**: "Đặt Sân Khác"
- **Tương tác**: Navigate to Court Discovery (09-court-discovery.md)

#### E. Về Trang Chủ
- **Style**: Text button (no border)
- **Icon**: Home icon
- **Text**: "Về Trang Chủ"
- **Tương tác**: Navigate to Home/Swipe Screen (06-home-swipe.md)

**Layout:**
- Row 1: "Xem Chi Tiết" (full width hoặc 2-column với "Thêm vào Lịch")
- Row 2: "Thêm vào Lịch" + "Chia Sẻ" (nếu row 1 là full width)
- Row 3: "Đặt Sân Khác" + "Về Trang Chủ"
- Spacing: 12pt giữa các buttons

**Hiệu ứng:**
- Buttons slide in from bottom (staggered, 50ms delay per button)
- Tap: Scale down to 0.95

---

### 6. Reminder Notification Banner
**Mô tả:**
- Info banner với subtle background (light yellow/blue)
- **Layout**: Horizontal row
- **Components**:
  - Bell icon (left)
  - Text: "Bạn sẽ nhận thông báo nhắc nhở 2 giờ trước giờ chơi" (14pt)
  - Settings icon (right, optional)
- **Tương tác**:
  - Tap settings icon → Navigate to Notification Settings (in User Settings)

**States:**
- **Visible** (default): If notification permission granted
- **Hidden**: If notification permission denied hoặc user disabled reminders

---

### 7. Cancellation Policy Section
**Mô tả:**
- Collapsible section với chính sách hủy
- **Header**:
  - Icon: Info circle
  - Text: "Chính sách hủy đặt sân" (bold)
  - Chevron down/up (expand/collapse indicator)
- **Content (collapsed by default)**:
  - Policy table:
    - > 24h trước: Hoàn 100%
    - 12-24h trước: Hoàn 50%
    - 2-12h trước: Không hoàn tiền
    - < 2h: Không thể hủy
  - **Deadline countdown** (nếu trong 24h):
    - "Còn 18 giờ 23 phút để hủy với hoàn tiền 100%"
    - Color-coded: Green (>24h), Orange (12-24h), Red (<12h)
  - Link: "Hủy booking" → Navigate to Cancel Booking flow (in 17-booking-detail.md)

**Tương tác:**
- Tap header → Toggle expand/collapse
- Tap "Hủy booking" link → Show cancellation dialog (confirm action)

**Hiệu ứng:**
- Expand/collapse: Smooth height animation with spring physics

---

### 8. What's Next Section
**Mô tả:**
- Tips/guidance section để user chuẩn bị cho booking
- **Header**: "Những điều cần lưu ý" (bold, 16pt)
- **Tips list** (vertical):
  1. **Icon**: Clock
     - Text: "Đến sớm 10-15 phút để làm thủ tục"
  2. **Icon**: Backpack
     - Text: "Mang theo vợt, giày thể thao và nước uống"
  3. **Icon**: Phone
     - Text: "Chuẩn bị mã QR hoặc mã booking để check-in"
  4. **Icon**: User group
     - Text: "Mời bạn bè cùng chơi qua tính năng Chia sẻ"
  5. **Icon**: Star
     - Text: "Đừng quên đánh giá sân sau khi chơi!"

- **Styling**: Each tip có icon (primary color) + text (gray, 14pt)

**Tương tác:**
- None (informational)

**Hiệu ứng:**
- Fade in with stagger (100ms delay per tip)

---

### 9. Support Contact (Footer)
**Mô tả:**
- Small footer section với support info
- **Content**:
  - Text: "Cần hỗ trợ? Liên hệ chúng tôi"
  - Phone link: "📞 1900-xxxx" (tap to call)
  - Email link: "✉️ support@pickleballapp.vn" (tap to email)
- **Styling**: Center aligned, gray text, 12pt

**Tương tác:**
- Tap phone → Open phone dialer với số pre-filled
- Tap email → Open email app với support email pre-filled

---

## Navigation

**Đến screen này từ:**
- Payment Method Screen (13-payment-method.md) → Khi payment succeeded
- Deep link: `/bookings/:bookingId/confirmation` (từ notification hoặc email)

**Từ screen này đến:**
- Booking Detail Screen (17-booking-detail.md) → Tap "Xem Chi Tiết"
- Court Discovery (09-court-discovery.md) → Tap "Đặt Sân Khác"
- Home/Swipe Screen (06-home-swipe.md) → Tap "Về Trang Chủ"
- Court Detail (11-court-detail.md) → Tap court info section
- Native Calendar App → Tap "Thêm vào Lịch"
- Native Share Sheet → Tap "Chia Sẻ"
- User Settings (Notification) → Tap settings icon trong reminder banner

**Back button behavior:**
- **Không có back button** (hoặc disabled)
- Lý do: Success screen là terminal state, force user chọn action rõ ràng
- Nếu user tap hardware back (Android) → Show confirmation: "Về trang chủ?"

---

## States

### Default State (Success)
- Success animation playing (first 2s)
- All booking details visible
- QR code loaded và hiển thị
- Action buttons enabled
- Reminder banner visible (nếu permission granted)
- Cancellation policy collapsed

### QR Code Loading State
- QR section shows skeleton placeholder (shimmer)
- "Đang tạo mã QR..." text
- After 3s timeout → Fallback to reference text

### QR Generation Failed State
- QR section shows fallback UI:
  - Large booking reference text
  - Icon: Warning triangle
  - Message: "Mã QR sẽ được gửi qua email và SMS trong giây lát"
  - No "Lưu vào ảnh" button

### Calendar Permission Denied State
- Show alert modal:
  - Title: "Không thể thêm vào lịch"
  - Message: "Vui lòng cấp quyền truy cập Lịch trong Cài đặt ứng dụng"
  - Actions: "Mở Cài đặt" | "Đóng"
- Tap "Mở Cài đặt" → Deep link to app settings

### Share Unavailable State (Rare)
- Fallback: Copy booking text to clipboard
- Show toast: "Đã sao chép thông tin booking để chia sẻ"

### Expanded Cancellation Policy State
- Policy section expanded với full content
- Deadline countdown visible (nếu applicable)
- "Hủy booking" link visible

---

## Edge Cases

### 1. QR Code Generation Failed
**Scenario:** Backend service không thể tạo QR (service down, error)

**Behavior:**
- Show fallback UI trong QR section:
  - Booking reference text lớn, bold, center
  - Icon: Document với checkmark
  - Message: "Mã QR đang được xử lý và sẽ được gửi qua email/SMS"
  - No "Lưu vào ảnh" button
- Email/SMS service sends QR later (background job)
- User vẫn có thể check-in bằng booking reference

### 2. Calendar Permission Denied
**Scenario:** User từ chối permission hoặc chưa grant

**Behavior:**
- Tap "Thêm vào Lịch" → Check permission
- Nếu not determined → Request permission
- Nếu denied → Show alert:
  - "Không thể thêm vào lịch. Vui lòng cấp quyền Lịch trong Cài đặt."
  - Actions: "Mở Cài đặt" (deep link) | "Đóng"
- Nếu restricted (parental control) → Show error toast

### 3. Photo Library Permission Denied
**Scenario:** User từ chối lưu QR vào photos

**Behavior:**
- Tap "Lưu vào Thư viện Ảnh" → Check permission
- Nếu denied → Show alert similar to Calendar case
- Alternative: Suggest screenshot hoặc share via email

### 4. Share Sheet Unavailable
**Scenario:** Device không support share (rare edge case)

**Behavior:**
- Tap "Chia Sẻ" → Detect share unavailable
- Fallback: Copy booking details text to clipboard
- Show toast: "Đã sao chép thông tin để chia sẻ"

### 5. Booking Reference Copy Failed
**Scenario:** Clipboard write failed (permission issue on some devices)

**Behavior:**
- Show error toast: "Không thể sao chép. Vui lòng ghi lại mã: [Reference]"
- Highlight reference text để user có thể long-press to copy manually

### 6. Network Offline
**Scenario:** User mất mạng ngay sau payment success

**Behavior:**
- Booking đã được tạo (server-side confirmed)
- Screen vẫn hiển thị đầy đủ (data từ payment response)
- QR có thể fail → Fallback to reference text
- Show offline banner: "Bạn đang offline. Một số tính năng bị hạn chế."
- Actions vẫn work (calendar, save photo local), nhưng không share online

### 7. Deep Link from Email/SMS
**Scenario:** User tap link "Xem booking" từ email confirmation

**Behavior:**
- Deep link navigate đến screen này với bookingId
- Fetch booking details từ API
- Show loading state → Populate screen
- Nếu booking not found → Error screen "Không tìm thấy booking"

### 8. Booking in Past (User quay lại screen sau khi chơi)
**Scenario:** User navigate back to confirmation screen của booking đã qua

**Behavior:**
- Screen vẫn hiển thị đầy đủ info
- **Changes**:
  - Reminder banner hidden (không còn reminder)
  - Cancellation policy section hidden (không thể hủy)
  - Add "Đánh giá sân" button (nếu chưa review)
  - "Đặt lại" button thay vì "Đặt sân khác"

### 9. Multiple Bookings in Same Session
**Scenario:** User đặt nhiều sân liên tiếp (tap "Đặt sân khác")

**Behavior:**
- Mỗi booking có confirmation screen riêng
- No history stack confusion (deep linking handles correctly)
- Notification reminder phân biệt từng booking

### 10. Calendar Event Already Exists
**Scenario:** User tap "Thêm vào Lịch" nhiều lần

**Behavior:**
- Check if event với booking reference đã tồn tại
- Nếu có → Show toast "Sự kiện đã có trong lịch"
- Nếu chưa → Add event
- Prevent duplicate events

### 11. QR Code Scan Expired
**Scenario:** Booking đã qua (user muốn xem lại QR)

**Behavior:**
- QR vẫn hiển thị (historical record)
- Add badge: "Đã sử dụng" hoặc "Hết hạn" (overlay on QR)
- "Lưu vào ảnh" button disabled hoặc hidden

### 12. Partial Cancellation (Future - Multiple Slots)
**Scenario:** User book 3 slots nhưng chỉ muốn hủy 1 slot

**Behavior (MVP: Not supported):**
- Cancellation là all-or-nothing
- Future enhancement: Allow partial cancellation với pro-rated refund

### 13. Cancellation Deadline Approaching
**Scenario:** User xem confirmation screen khi gần deadline hủy

**Behavior:**
- Cancellation policy auto-expanded (không collapsed)
- Countdown timer hiển thị prominently:
  - "Chỉ còn 2 giờ 15 phút để hủy với hoàn tiền 100%"
  - Color: Orange (warning)
- Badge trên policy header: "⚠️ Sắp hết hạn"

### 14. Confetti Animation Performance
**Scenario:** Device cũ, animation lag

**Behavior:**
- Detect low-performance device (frame rate < 30fps)
- Simplify animation:
  - Reduce confetti particles (30 → 10)
  - Disable glow effect
  - Use simpler checkmark animation
- Maintain UX quality trên mọi devices

### 15. Long Court Name/Address
**Scenario:** Court name quá dài (> 50 chars)

**Behavior:**
- Text truncate với ellipsis:
  - Court name: 2 lines max
  - Address: 2 lines max
- Tap court section → Navigate to full detail screen

---

## Ghi chú

### UX Considerations:
- **Celebration Moment**: Success animation phải tạo cảm giác thành công, hài lòng → Tăng trust và retention
- **Information Clarity**: Tất cả thông tin booking phải rõ ràng, dễ access → User không hoang mang
- **QR Prominence**: QR code phải lớn, dễ scan → Core value của booking
- **Action Guidance**: Buttons rõ ràng, sorted by priority → User biết làm gì tiếp theo
- **Offline Capable**: Screen phải work offline (dựa vào cached data) → Reliable experience
- **Shareable**: Easy share để user invite friends → Viral growth potential
- **Calendar Integration**: Giảm friction booking → user nhớ đến sân đúng giờ
- **Policy Transparency**: Cancellation policy rõ ràng → Avoid disputes

### Performance:
- **Animation Performance**:
  - Confetti sử dụng requestAnimationFrame (60fps target)
  - Limit particles count based on device capability
  - Use React Native Reanimated for native thread animations
- **QR Generation**:
  - Generate QR client-side nếu backend slow (fallback strategy)
  - Cache QR image để avoid re-render
- **Image Saving**:
  - Compress QR image before saving (PNG, lossless)
  - Async operation with loading indicator

### Accessibility:
- **VoiceOver/TalkBack**:
  - Success header: "Đặt sân thành công! Booking của bạn đã được xác nhận"
  - QR code: "Mã QR check-in. Hình ảnh. Chạm đúp để lưu vào thư viện ảnh"
  - Booking details: Read all fields in logical order
  - Action buttons: Clear labels với context
- **Color Contrast**: All text meet WCAG AA (4.5:1 minimum)
- **Touch Targets**: Buttons min 44x44pt
- **Screen Reader**: Announce success khi screen loads

### Analytics Events:
- `booking_confirmation_view` (booking_id, court_id, amount)
- `booking_qr_save` (booking_id)
- `booking_calendar_add` (booking_id, success: true/false)
- `booking_share` (booking_id, platform: whatsapp/messenger/sms/email)
- `booking_view_detail` (booking_id)
- `booking_book_another` (from_booking_id)
- `booking_go_home` (from_booking_id)
- `booking_policy_expand` (booking_id)
- `booking_copy_reference` (booking_id)

### Business Logic:
- **QR Code Content**:
  - Format: JSON string encoded
  - Data: `{ booking_id, reference, hash, timestamp }`
  - Hash: HMAC-SHA256 để verify authenticity tại sân
  - Expiry: QR valid đến end_time + 1 hour (buffer)
- **Reminder Notification**:
  - Scheduled tại confirmation time
  - Trigger: 2 hours before booking start_time
  - Content: "Nhắc nhở: Bạn có booking tại [Court] lúc [Time]. Mã: [Reference]"
  - Deep link: Navigate to booking detail
- **Email/SMS Confirmation**:
  - Sent immediately after booking confirmed
  - Content: Booking details + QR image attachment + cancel link
  - Transactional email (high deliverability priority)

### Security:
- **QR Code Security**:
  - Include cryptographic hash để prevent fake QR
  - Backend validates hash before accepting check-in
  - QR expires after booking time + buffer
  - One-time use (scan invalidates QR)
- **Deep Link Validation**:
  - Verify booking belongs to authenticated user
  - Token-based access if shared via link

### Integration Points:
- **Backend APIs**:
  - `GET /bookings/:id` - Fetch booking details (nếu deep link)
  - `POST /bookings/:id/qr` - Request QR regeneration (nếu failed)
  - `POST /bookings/:id/calendar` - Log calendar add event
- **Native APIs**:
  - Calendar API: Add event
  - Photo Library API: Save image
  - Share Sheet API: Share content
  - Clipboard API: Copy text
- **Email/SMS Service**:
  - Send confirmation email với QR attachment
  - Send SMS với booking reference + link
- **Push Notification**:
  - Schedule reminder notification (2h before)

### Future Enhancements (Post-MVP):
- **Invite Match to Booking**: "Mời bạn chơi cùng" button → Send via chat
- **Social Share Preview**: Rich preview khi share lên social (Open Graph)
- **Booking to Apple Wallet**: Add booking pass to Wallet app (iOS)
- **Recurring Booking**: "Đặt lại hàng tuần" option
- **Booking Timeline**: Show timeline từ booking → reminder → check-in → complete
- **Court Navigation**: "Chỉ đường đến sân" button → Open Google Maps navigation
- **Weather Forecast**: Show weather cho ngày booking (outdoor courts)
- **Equipment Rental**: Option to rent equipment tại sân (if available)

---

**Phụ thuộc vào:**
- F01 (Authentication)
- F07 (Court Booking - payment success triggers this screen)

**Được sử dụng bởi:**
- F08 (Push Notifications - reminder scheduled here)
- F11 (Booking History - reference to booking detail)

**Third-party Integrations:**
- Calendar API (iOS/Android native)
- Photo Library API (iOS/Android)
- Share Sheet (native)
- Email/SMS services (transactional)
