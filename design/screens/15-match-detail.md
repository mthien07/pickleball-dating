# Match Detail Screen

## Screen Overview
Màn hình hiển thị đầy đủ thông tin profile của người đã match, cho phép user xem chi tiết ảnh, bio, pickleball info, stats và thực hiện các hành động (nhắn tin, unmatch, report).

## Mục đích
- Cung cấp thông tin chi tiết về match để user quyết định có muốn tiếp tục tương tác không
- Cho phép user nhắn tin hoặc unmatch nhanh chóng
- Hiển thị thông tin pickleball để đánh giá độ phù hợp
- Cung cấp options để report/block nếu cần

---

## Các Section/Components Chính

### 1. Header Section
**Layout**: Full-width hero image với overlay controls

**Components**:
- **Main Photo**:
  - Full-width hero image (aspect ratio 4:3)
  - Hiển thị ảnh chính của match
  - Gradient overlay ở bottom để text dễ đọc

- **Back Button**:
  - Position: Top-left (safe area)
  - Icon: Chevron left hoặc X
  - Color: White với shadow/backdrop blur
  - Action: Navigate back to Matches List (07)

- **Options Menu**:
  - Position: Top-right (safe area)
  - Icon: Three dots vertical
  - Color: White với shadow/backdrop blur
  - Action: Open action sheet với options:
    - "Unmatch" (destructive style)
    - "Report" (destructive style)
    - "Block" (destructive style)
    - "Cancel"

**Interactions**:
- Tap Back → Navigate to 07-matches-list
- Tap Options → Show action sheet
- Tap photo → Open photo gallery view (fullscreen swipeable)

---

### 2. Photo Gallery Section
**Layout**: Horizontal scrollable carousel

**Components**:
- **Photo Carousel**:
  - Display 1-6 photos horizontally
  - Current photo indicator (dots below carousel)
  - Swipeable left/right với smooth animation
  - Lazy load images

- **Photo Counter**:
  - Position: Bottom-right của carousel
  - Format: "1/6"
  - Semi-transparent background

**Interactions**:
- Swipe left/right → Navigate photos
- Tap photo → Open fullscreen gallery modal
- Pinch to zoom (in fullscreen mode)

**States**:
- Loading: Skeleton shimmer
- Error: Placeholder image với retry button
- Single photo: Hide indicators
- Multiple photos: Show dots + counter

---

### 3. Basic Info Section
**Layout**: Card với padding

**Components**:
- **Name & Age**:
  - Format: "Tên, 28"
  - Font: Bold, large (24px)

- **Location**:
  - Icon: Pin
  - Format: "Quận 1, TP.HCM"
  - Font: Regular, medium (16px)

- **Distance**:
  - Format: "2.5 km từ bạn"
  - Color: Secondary/gray
  - Font: Regular, small (14px)

- **Status Indicator**:
  - Online: Green dot + "Đang hoạt động"
  - Offline: Gray text "Hoạt động 2h trước"
  - Format: Small text với icon

**Validation**:
- Nếu không có location → Hide distance
- Nếu last_active > 7 days → Show "Hoạt động 1 tuần trước"

---

### 4. Pickleball Info Section
**Layout**: Card với multiple subsections

**Components**:

**A. Skill Level**:
- Badge component (prominent)
- Options: Beginner / Intermediate / Advanced / Pro
- Color-coded (green/blue/orange/red)
- Icon: Trophy or star

**B. Play Style**:
- Label: "Phong cách chơi"
- Value: Competitive / Casual / Social
- Display: Chip/tag style

**C. Looking For**:
- Label: "Đang tìm"
- Values: Multiple tags
  - "Đối thủ"
  - "Partner đánh đôi"
  - "Hẹn hò"
  - "Tất cả"
- Display: Multiple chips, wrap if needed

**D. Bio**:
- Label: "Giới thiệu"
- Content: Text content (max 500 chars)
- Display:
  - Default: Show 3 lines với "...xem thêm"
  - Expanded: Full text với "thu gọn"
- Font: Regular, readable (16px)

**Interactions**:
- Tap "xem thêm" → Expand bio
- Tap "thu gọn" → Collapse bio

**States**:
- No bio: Show placeholder "Chưa có giới thiệu"
- Empty tags: Show "Chưa thiết lập"

---

### 5. Availability Section
**Layout**: Card (optional, nếu user đã set availability)

**Components**:
- **Label**: "Lịch rảnh"
- **Days Grid**:
  - Display: 7 boxes (T2-CN)
  - Available days: Highlighted (primary color)
  - Unavailable days: Gray

- **Time Slots**:
  - Display below selected days
  - Format: "Sáng (6-12h), Chiều (12-18h), Tối (18-22h)"
  - Show only slots user marked available

**Display Logic**:
- Nếu user chưa set → Hide entire section
- Nếu có data → Show days + time slots

---

### 6. Stats Section
**Layout**: Horizontal cards/tiles (nếu có data)

**Components**:
- **Average Rating**:
  - Icon: Star
  - Value: "4.5/5"
  - Label: "Đánh giá trung bình"

- **Games Played**:
  - Icon: Trophy
  - Value: "15"
  - Label: "Trận đã chơi"

**Display Logic**:
- Nếu chưa có ratings/games → Hide section
- Nếu < 3 ratings → Show "Chưa đủ đánh giá"

---

### 7. Action Buttons Section (Bottom Fixed)
**Layout**: Fixed bottom bar với safe area padding

**Components**:
- **Primary Button - "Nhắn Tin"**:
  - Style: Filled, primary color
  - Width: ~70% của container
  - Icon: Message bubble
  - Action: Navigate to 08-chat-screen với match_id

- **Secondary Button - "Unmatch"**:
  - Style: Outlined, destructive color (red)
  - Width: ~25% của container
  - Icon: X hoặc broken heart
  - Action: Show confirmation dialog → Unmatch

**Interactions**:
- Tap "Nhắn Tin" → Navigate to 08-chat-screen
- Tap "Unmatch" → Show confirmation dialog
  - Dialog title: "Bạn chắc chắn muốn unmatch?"
  - Dialog body: "Cuộc trò chuyện sẽ bị xóa và không thể hoàn tác"
  - Actions: "Hủy" (cancel) / "Unmatch" (destructive)
  - On confirm → API call → Navigate back to 07-matches-list

---

## Navigation

### Đến screen này từ:
- **07-matches-list.md** (tap vào avatar trong match item)
- **07-matches-list.md** (long press → "View Profile")
- **08-chat-screen.md** (tap vào header/avatar)

### Từ screen này đến:
- **07-matches-list.md** (tap Back button)
- **08-chat-screen.md** (tap "Nhắn Tin" button)
- **07-matches-list.md** (sau khi unmatch thành công)

---

## States

### 1. Default State
- Hiển thị đầy đủ tất cả sections có data
- Tất cả buttons enabled
- Photos loaded và swipeable
- Online status hiển thị chính xác

### 2. Loading State
- Hero image: Skeleton shimmer
- Photo carousel: Skeleton placeholders
- Info sections: Skeleton text
- Bottom buttons: Disabled

### 3. Blocked State
**Trigger**: Match đã bị user block

**Changes**:
- Header shows "Đã chặn" badge
- Unmatch button → "Bỏ chặn" button
- Nhắn tin button disabled
- Show message: "Bạn đã chặn người này"

### 4. Unmatched State
**Trigger**: Match đã unmatch hoặc bị unmatch

**Behavior**:
- Không thể vào screen này
- Nếu đang xem mà bị unmatch → Show toast "Match đã bị hủy" → Auto navigate back

### 5. Error State
**Trigger**: Không load được profile data

**Display**:
- Error icon
- Message: "Không thể tải thông tin"
- Retry button
- Back button

---

## Edge Cases

### 1. No Bio
**Behavior**:
- Show placeholder text: "Chưa có giới thiệu"
- Style: Italic, gray color
- No expand/collapse functionality

### 2. Account Deleted
**Trigger**: Match's account bị xóa

**Behavior**:
- Show alert: "Tài khoản này không còn tồn tại"
- Disable all actions
- Auto navigate back sau 2s

### 3. They Blocked You
**Trigger**: Match đã block user hiện tại

**Behavior**:
- Show limited profile (chỉ có tên, ảnh chính)
- Hide all sensitive info (location, bio, availability)
- Disable "Nhắn Tin" button
- Show message: "Không thể xem thông tin chi tiết"

### 4. They Unmatched
**Trigger**: Match đã unmatch trong khi user đang xem

**Behavior**:
- Show toast: "Match đã hủy kết nối"
- Auto navigate back to 07-matches-list
- Remove from list

### 5. No Photos (Only Avatar)
**Behavior**:
- Hide carousel section
- Show only hero image
- Hide photo counter

### 6. Unmatch Failed
**Trigger**: API error khi unmatch

**Behavior**:
- Show error toast: "Có lỗi xảy ra, vui lòng thử lại"
- Keep user on screen
- Enable retry

### 7. Slow Connection
**Behavior**:
- Show progressive loading (text first, images later)
- Skeleton for images
- Timeout sau 10s → Show error state

---

## Ghi chú

### UX Considerations
1. **Photo Privacy**: Hero image thu hút nhưng không quá invasive
2. **Information Hierarchy**: Thông tin quan trọng nhất (tên, skill, looking for) hiển thị trước
3. **Quick Actions**: Bottom buttons fixed để dễ truy cập
4. **Confirmation**: Unmatch là destructive action, cần confirm rõ ràng
5. **Loading Experience**: Progressive loading để reduce perceived wait time

### Validations
- Tất cả text fields phải có fallback khi empty
- Images phải có error handling và retry
- Distance calculation cần user's location permission
- Online status cập nhật realtime nếu có WebSocket

### Error Handling
- Network errors: Show cached data nếu có, hoặc error state với retry
- Permission errors (location): Show "Cần quyền truy cập vị trí"
- 404 errors (user deleted): Show appropriate message và navigate back
- 403 errors (blocked): Show limited profile

### Performance
- Lazy load images (especially in carousel)
- Cache profile data với TTL 5 phút
- Optimize images (progressive JPEGs, WebP nếu supported)
- Debounce scroll events trong carousel

### Accessibility
- All images cần alt text
- All buttons cần accessible labels
- Color contrast ratio >= 4.5:1
- Support VoiceOver/TalkBack navigation
- Tap targets >= 44x44 points

### Animation Notes
- Screen transition: Slide from right (standard stack)
- Photo carousel: Horizontal swipe với momentum
- Expand bio: Smooth height animation (200ms)
- Confirmation dialog: Fade in với scale (150ms)
- Loading skeleton: Shimmer animation loop
