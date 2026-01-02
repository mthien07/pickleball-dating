# Booking History Screen

## Screen Overview
Màn hình hiển thị lịch sử đặt sân của người dùng với phân loại theo trạng thái (Sắp tới, Đã hoàn thành, Đã hủy), cho phép xem chi tiết booking, hủy booking theo chính sách, và đặt lại sân từ booking cũ.

## Mục đích
- Giúp người dùng theo dõi tất cả booking đã tạo
- Quản lý các booking sắp tới (xem QR, hủy, chỉ đường)
- Review các booking đã hoàn thành (đánh giá, đặt lại)
- Xem lại các booking đã hủy (lý do, đặt lại)
- Truy cập nhanh thông tin booking và QR code để check-in

---

## Các Section/Components Chính

### 1. Header Section
**Mô tả:**
- Title: "Lịch sử đặt sân"
- Back button ở góc trái (nếu navigate từ screen khác)
- Optional: Search icon để search booking theo sân hoặc reference code

**Tương tác:**
- Tap Back → quay về previous screen
- Tap Search → mở search bar để tìm booking

---

### 2. Tab Filter (Segmented Control)
**Mô tả:**
- 3 tabs ngang, thiết kế pill hoặc underline:
  - **"Sắp tới"** (badge hiển thị số lượng nếu > 0)
  - **"Đã hoàn thành"**
  - **"Đã hủy"**
- Tab active có màu primary, underline hoặc background fill
- Tab inactive màu gray

**Tương tác:**
- Tap tab → chuyển sang danh sách tương ứng
- Swipe trái/phải giữa tabs → navigate between tabs
- Animation: smooth slide transition khi đổi tab

**States:**
- Default: Tab "Sắp tới" được chọn
- Badge on "Sắp tới" tab (số booking upcoming)

---

### 3. Booking List (Per Tab)

#### 3.1. Booking Card (List Item)
**Mô tả:**
- **Layout**: Horizontal card với shadow nhẹ
- **Bên trái**: Court thumbnail (vuông 80x80 hoặc 100x100, corner radius)
- **Bên phải**:
  - **Court Name** (bold, 16pt)
  - **Date**: "Thứ 7, 15/01/2026" (14pt, gray)
  - **Time slots**: "08:00 - 10:00" (14pt, gray)
  - **Price paid**: "360.000đ" (bold, 16pt, primary color)
  - **Status Badge**: Pill badge với màu theo trạng thái (xem bảng bên dưới)
- **Separator line** giữa các cards

**Status Badges:**
| Status | Text | Color | Icon |
|--------|------|-------|------|
| Confirmed | "Đã xác nhận" | Blue | Checkmark |
| Completed | "Hoàn thành" | Green | Checkmark circle |
| Cancelled | "Đã hủy" | Red/Gray | X mark |
| Refunded | "Đã hoàn tiền" | Orange | Money return |
| No Show | "Không đến" | Orange | Warning |
| In Progress | "Đang diễn ra" | Purple | Clock |

**Tương tác:**
- Tap card → Navigate to **17-booking-detail** screen
- Swipe left hoặc long-press → Show Quick Actions (xem section 4)

**Edge Cases:**
- **Booking starting soon (< 2h)**:
  - Highlight card border (primary color glow)
  - Show countdown badge: "Còn 1h 30p"
  - Move card to top of list
- **Refund pending**: Show "Đang hoàn tiền..." status màu yellow

---

#### 3.2. Empty State (Per Tab)
**Mô tả:**
- **Icon/Illustration**: Friendly icon related to context
- **Message text** (center, gray):
  - **Sắp tới**: "Chưa có booking sắp tới"
  - **Đã hoàn thành**: "Chưa có booking hoàn thành"
  - **Đã hủy**: "Không có booking bị hủy"
- **CTA Button** (chỉ cho tab "Sắp tới"):
  - "Đặt sân ngay" → Navigate to Court Discovery (F06)

**Tương tác:**
- Tap CTA → Navigate to Court Discovery screen

---

### 4. Quick Actions (Swipe/Long-press Menu)
**Mô tả:**
- Hiện khi user swipe left hoặc long-press trên booking card
- Các actions khác nhau tùy trạng thái booking:

#### 4.1. Sắp tới (Confirmed):
- **"Xem chi tiết"** (blue) → Booking Detail
- **"Hủy booking"** (red, destructive)
  - Check cancellation eligibility (< 2h → disabled)
  - Show refund amount dialog trước khi confirm
- **"Thêm vào lịch"** (green) → Export to device calendar
- **"Chỉ đường"** (blue) → Open Maps app with court location

#### 4.2. Đã hoàn thành (Completed):
- **"Xem chi tiết"** (blue) → Booking Detail
- **"Đánh giá sân"** (yellow) → Navigate to **22-rating-screen**
  - Nếu đã đánh giá → disabled hoặc show "Đã đánh giá"
- **"Đặt lại"** (green) → Rebook flow (navigate to booking screen với court pre-filled)

#### 4.3. Đã hủy (Cancelled):
- **"Xem chi tiết"** (blue) → Booking Detail (show cancellation reason)
- **"Đặt lại"** (green) → Rebook flow

**Tương tác:**
- Tap action → Execute tương ứng
- Tap outside menu → Close menu
- Swipe back right → Close menu

**Edge Cases:**
- **Cancellation deadline passed (< 2h)**: Disable "Hủy booking" action, show tooltip "Không thể hủy trước 2 giờ"
- **Court closed permanently**: Disable "Đặt lại", show "Sân ngừng hoạt động"

---

### 5. Pull to Refresh
**Mô tả:**
- Pull down từ top của list → Refresh bookings từ server
- Show custom loading spinner với animation
- Show "Cập nhật lúc [time]" text khi refresh xong

**Tương tác:**
- Pull down → Trigger refresh
- Release → Load new data
- Show toast nếu có booking mới: "Có 1 booking mới"

---

### 6. Pagination/Load More
**Mô tả:**
- Load 20 bookings per page
- Khi scroll gần bottom (threshold 80%) → Auto load more
- Show loading indicator ở bottom khi fetching

**States:**
- Loading: Spinner ở bottom
- All loaded: "Đã hiển thị tất cả" text ở bottom
- Error loading more: "Lỗi tải thêm. Thử lại?" với retry button

---

### 7. Optional: Date Range Filter
**Mô tả:**
- Icon filter ở header (funnel icon)
- Tap → Show date range picker modal
- User chọn "Từ ngày" và "Đến ngày"
- Apply filter → Update list

**Tương tác:**
- Tap filter icon → Open date picker modal
- Select date range → Apply filter
- Clear filter → Reset to show all

---

## Navigation

### Đến screen này từ:
- **Tab Bar** (Main navigation) → Direct access
- **Profile Screen** → "Lịch sử đặt sân" option
- **Booking Confirmation Screen** (sau khi đặt sân) → "Xem tất cả booking"
- **Booking Detail Screen** (17) → Back navigation

### Từ screen này đến:
- **17-booking-detail** → Tap on booking card
- **Court Discovery (03)** → Tap "Đặt sân ngay" từ empty state
- **22-rating-screen** → Tap "Đánh giá sân" từ quick action
- **Booking Screen** → Tap "Đặt lại" (rebook flow)
- **Maps App** (external) → Tap "Chỉ đường"
- **Device Calendar** (external) → Tap "Thêm vào lịch"

---

## States

### Default State
- Tab "Sắp tới" active
- Show list of upcoming bookings (sorted by date ascending - nearest first)
- Pull-to-refresh enabled
- Quick actions available via swipe/long-press

### Loading State
- Initial load: Full screen skeleton loader (3-5 booking card skeletons)
- Pull to refresh: Spinner ở top
- Load more: Spinner ở bottom

### Empty State
- Per tab empty state (illustration + message + CTA nếu tab "Sắp tới")

### Error State
- Network error: Show retry screen
- "Không thể tải lịch sử. Kiểm tra kết nối và thử lại"
- Retry button → Reload
- Show cached bookings if available với warning "Dữ liệu có thể chưa cập nhật"

---

## Edge Cases

### 1. Booking Starting Soon (< 2 hours)
- **Display**:
  - Highlight card với border glow màu primary
  - Show countdown badge: "Còn 1h 30p" (update realtime)
  - Pin to top of "Sắp tới" list
- **Action**:
  - Disable "Hủy booking" (< 2h rule)
  - Emphasize "Chỉ đường" và QR code access

### 2. Cancellation Deadline Passed
- **Display**: "Hủy booking" action disabled trong quick actions
- **UI**: Show tooltip/alert "Không thể hủy trước 2 giờ khi booking bắt đầu"

### 3. Refund Pending
- **Display**: Status badge "Đang hoàn tiền..." màu yellow/orange
- **Detail**: Tap card → Booking detail hiển thị "Hoàn tiền trong 3-5 ngày làm việc"

### 4. Past Booking Unrated
- **Display**: Badge nhỏ "Đánh giá ngay" trên booking card (completed tab)
- **Action**: Tap badge hoặc "Đánh giá sân" quick action → 22-rating-screen

### 5. Multiple Bookings Same Day
- **Display**: Show all, sorted by time (earliest first)
- **Grouping**: Optional date header "Hôm nay", "Ngày mai", "15/01/2026"

### 6. Very Old Bookings (> 1 year)
- **Display**: Paginate normally
- **Performance**: Lazy load as user scrolls
- **Option**: "Chỉ hiển thị 6 tháng gần nhất" toggle in settings

### 7. Booking In Progress (Current Time)
- **Display**: Special badge "Đang diễn ra" màu purple
- **Position**: Pin to top of "Sắp tới" list
- **Action**: Emphasize QR code, directions

### 8. Court Closed Permanently
- **Display**: Gray out court info, show "Sân ngừng hoạt động"
- **Action**: Disable "Đặt lại", suggest similar courts

### 9. Booking Edited by Admin
- **Display**: Show "Đã cập nhật" badge
- **Detail**: Booking detail hiển thị changes (e.g., time changed from X to Y)

### 10. Price Changed After Booking
- **Display**: Honor original price paid
- **Detail**: Show "Giá tại thời điểm đặt: X đ" (không bị ảnh hưởng nếu sân tăng giá sau)

### 11. Device Change / Login on New Device
- **Display**: QR code vẫn available (fetch từ server)
- **Security**: User must be authenticated

### 12. Screenshot QR Code
- **Behavior**: QR vẫn valid (one-time scan tại sân)
- **Security**: Court staff scans QR, system marks as used

---

## Ghi chú

### UX Considerations
1. **Quick Access to QR**: Booking sắp tới nên dễ dàng access QR code để check-in → Highlight QR trong booking detail
2. **Clear Cancellation Policy**: Hiển thị rõ refund amount trước khi user confirm cancel
3. **Rebook Convenience**: "Đặt lại" action phải smooth, pre-fill court info để user chỉ cần chọn ngày/giờ mới
4. **Rating Reminder**: Gentle reminder đánh giá sân sau booking completed (không quá invasive)
5. **Countdown Urgency**: Booking < 2h cần visual cues rõ ràng (highlight, countdown) để user không miss

### Validations
- **Cancel Booking**: Validate time remaining < 2h → Show error
- **Rebook**: Check court availability trước khi navigate
- **Add to Calendar**: Check calendar permission

### Error Handling
- **Load Failed**: Show cached data + stale indicator "Cập nhật lúc X"
- **Cancel Failed**: Retry option + Contact Support
- **Refund Processing Error**: Booking vẫn cancelled, refund manual → "Hoàn tiền trong 5-7 ngày"
- **QR Generation Failed**: Booking valid, show booking reference as backup

### Performance
- **Pagination**: Load 20 items at a time
- **Caching**: Cache bookings, background refresh when pull
- **Realtime**: Optional: Realtime update nếu booking status change (via push notification)

### Animations
- **Tab Switch**: Smooth slide transition
- **Quick Actions**: Slide from right (swipe left) hoặc pop up (long-press)
- **Pull to Refresh**: Custom spinner animation
- **Card Highlight**: Subtle glow/pulse animation cho booking starting soon

### Accessibility
- **VoiceOver/TalkBack**: Label all actions rõ ràng
- **Color Contrast**: Status badges phải contrast đủ
- **Tap Targets**: Minimum 44x44pt cho tất cả interactive elements

---

## Cancellation Policy Display (Reference)

| Time Before Booking | Refund | UI Display (trong Cancel Dialog) |
|---------------------|--------|-----------------------------------|
| > 24 hours | 100% | "Hoàn 100% (XXX.XXXđ)" - Green |
| 12-24 hours | 50% | "Hoàn 50% (XXX.XXXđ)" - Yellow |
| 2-12 hours | 0% | "Không hoàn tiền" - Red |
| < 2 hours | N/A | "Không thể hủy" - Disabled button |

---

## Data Display (Booking Card Example)

```
┌─────────────────────────────────────────┐
│ [Court Image]  Sân ABC Quận 1           │
│  80x80         Thứ 7, 15/01/2026        │
│                08:00 - 10:00            │
│                360.000đ  [Đã xác nhận]  │
└─────────────────────────────────────────┘
      ↑             ↑          ↑        ↑
   Thumbnail    Date/Time   Price   Status Badge
```

---

*Screen design complete. Ready for frontend implementation với mock data.*
