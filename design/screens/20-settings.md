# Settings Screen

## Screen Overview
Trung tâm quản lý tài khoản và cấu hình ứng dụng, cho phép người dùng kiểm soát thông tin cá nhân, preferences khám phá, quyền riêng tư, thông báo và các cài đặt app.

## Mục đích
- Quản lý thông tin tài khoản và bảo mật
- Tùy chỉnh trải nghiệm khám phá (discovery preferences)
- Kiểm soát privacy và notifications
- Cung cấp truy cập Support và Legal documents
- Cho phép logout và xóa tài khoản

---

## Các Section/Components Chính

### 1. Account Section (Top of screen)

#### Profile Card
- **Mô tả**: Card lớn hiển thị thông tin tài khoản chính
- **Components**:
  - Avatar (80x80 dp, circular)
  - Display name (bold, 18sp)
  - Email address (secondary text, 14sp)
  - Verified badge (blue checkmark icon nếu email/phone đã xác thực)
- **Tương tác**: Tap anywhere on card → Navigate to `21-edit-profile`
- **Visual**: Card có background subtle, slight elevation

#### Edit Profile Button
- **Mô tả**: Button "Chỉnh sửa hồ sơ"
- **Tương tác**: Tap → Navigate to `21-edit-profile`
- **Visual**: Outlined button hoặc text button với icon edit

#### Account Info Fields (read-only)
- **Email**:
  - Label: "Email"
  - Value: user email
  - Trailing icon: Green checkmark (verified) hoặc orange warning (unverified)
- **Phone**:
  - Label: "Số điện thoại"
  - Value: user phone (masked: +84 *** *** 789)
  - Trailing icon: Verified badge nếu đã xác thực

#### Change Password Button
- **Mô tả**: List item "Đổi mật khẩu"
- **Tương tác**: Tap → Show bottom sheet với:
  - Current password field
  - New password field (min 8 chars, validation)
  - Confirm new password field
  - "Lưu" button (disabled until valid)
- **Validation**:
  - Current password correct
  - New password matches confirmation
  - Password strength indicator (weak/medium/strong)

---

### 2. Discovery Preferences Section

**Header**: "Tùy chọn khám phá"

#### Distance Radius Slider
- **Label**: "Khoảng cách tìm kiếm"
- **Value display**: "Trong vòng [X] km"
- **Slider**: Min 1 km - Max 50 km (default: 20 km)
- **Tương tác**: Drag slider → Update value realtime, debounce save after 1s
- **Visual**: Primary color slider với thumb có label

#### Age Range Slider
- **Label**: "Khoảng tuổi"
- **Value display**: "[Min] - [Max] tuổi"
- **Slider**: Range slider Min 18 - Max 60 (default: 18-45)
- **Tương tác**: Drag both thumbs → Update range, debounce save
- **Visual**: Dual-thumb slider

#### Skill Level Filter
- **Label**: "Trình độ kỹ năng"
- **Value display**: Comma-separated selected levels hoặc "Tất cả"
- **Tương tác**: Tap → Open multi-select bottom sheet:
  - [ ] Beginner
  - [ ] Intermediate
  - [ ] Advanced
  - [ ] Pro
  - "Áp dụng" button
- **Validation**: Phải chọn ít nhất 1 level

#### Show Me (Gender Preferences)
- **Label**: "Hiển thị"
- **Options**: Radio group
  - ○ Nam
  - ○ Nữ
  - ○ Tất cả (default)
- **Tương tác**: Tap option → Select và save ngay

---

### 3. Notifications Section

**Header**: "Thông báo"

#### Permission Status (if not granted)
- **Banner** (yellow/warning):
  - Icon: Bell với slash
  - Text: "Thông báo bị tắt. Bật trong Cài đặt để nhận cập nhật quan trọng."
  - Action button: "Mở Cài đặt" → Deep link to system settings
- **Dismiss**: X button (banner dismissed until next app launch)

#### Toggle Switches (List items)
1. **New Matches**
   - Label: "Kết nối mới"
   - Subtitle: "Khi có người match với bạn"
   - Toggle: ON (default)

2. **New Messages**
   - Label: "Tin nhắn mới"
   - Subtitle: "Khi nhận tin nhắn từ matches"
   - Toggle: ON (default)

3. **Booking Reminders**
   - Label: "Nhắc đặt sân"
   - Subtitle: "Trước 2 giờ booking"
   - Toggle: ON (default)

4. **Promotions/News**
   - Label: "Khuyến mãi & Tin tức"
   - Subtitle: "Ưu đãi đặc biệt và cập nhật app"
   - Toggle: OFF (default)

- **Tương tác**: Toggle switch → Save preference instantly
- **State**: Disable all toggles nếu push permission chưa được cấp

---

### 4. Privacy Section

**Header**: "Quyền riêng tư"

#### Hide Profile Toggle
- **Label**: "Ẩn hồ sơ"
- **Subtitle**: "Profile của bạn sẽ không xuất hiện trong swipe discovery"
- **Toggle**: OFF (default)
- **Tương tác**: Toggle ON → Show confirmation dialog:
  - Title: "Ẩn hồ sơ?"
  - Message: "Bạn sẽ không xuất hiện trong kết quả tìm kiếm. Bạn vẫn có thể chat với matches hiện tại."
  - Actions: "Hủy" | "Ẩn"
- **Effect**: Khi ON, user không xuất hiện trong swipe cards của người khác

#### Hide Online Status Toggle
- **Label**: "Ẩn trạng thái online"
- **Subtitle**: "Matches sẽ không thấy khi bạn đang online"
- **Toggle**: OFF (default)
- **Effect**: Khi ON, green dot không hiển thị trong matches list/chat

#### Block List
- **Label**: "Danh sách chặn"
- **Subtitle**: "[X] người dùng" (dynamic count)
- **Tương tác**: Tap → Navigate to Block List screen (danh sách users đã block):
  - List items: Avatar + Name + "Bỏ chặn" button
  - Empty state: "Bạn chưa chặn ai"
- **Trailing icon**: Chevron right

---

### 5. App Settings Section

**Header**: "Cài đặt ứng dụng"

#### Language Selector
- **Label**: "Ngôn ngữ"
- **Value display**: "Tiếng Việt" (current language)
- **Tương tác**: Tap → Bottom sheet với radio options:
  - ○ Tiếng Việt
  - ○ English
  - "Lưu" button
- **Effect**: Change app locale, reload texts (không reload toàn bộ app)
- **Trailing icon**: Chevron right

#### Dark Mode Toggle
- **Label**: "Chế độ tối"
- **Subtitle**: Auto-detect device theme hoặc manual override
- **Options**: Segmented control hoặc radio:
  - ○ Theo hệ thống (default)
  - ○ Bật
  - ○ Tắt
- **Tương tác**: Select option → Change theme instantly
- **Effect**: Smooth transition (200ms) giữa light/dark mode

---

### 6. Support & Legal Section

**Header**: "Hỗ trợ & Pháp lý"

#### List Items (chevron right)
1. **Help Center**
   - Icon: Question mark circle
   - Label: "Trung tâm trợ giúp"
   - Tương tác: Tap → Open WebView với FAQ/Help articles

2. **Terms of Service**
   - Icon: Document icon
   - Label: "Điều khoản sử dụng"
   - Tương tác: Tap → Open WebView hoặc PDF viewer

3. **Privacy Policy**
   - Icon: Shield icon
   - Label: "Chính sách bảo mật"
   - Tương tác: Tap → Open WebView hoặc PDF viewer

4. **Contact Support**
   - Icon: Email icon
   - Label: "Liên hệ hỗ trợ"
   - Tương tác: Tap → Bottom sheet với options:
     - Email: support@pickleballdating.vn (tap to copy)
     - Hotline: 1900-xxxx (tap to call)
     - "Gửi email" button → Open email composer

---

### 7. Account Actions Section

**Header**: None (visually separated)

#### Logout Button
- **Visual**: Outlined button, full width, neutral color
- **Label**: "Đăng xuất"
- **Icon**: Exit icon (leading)
- **Tương tác**: Tap → Show confirmation dialog:
  - Title: "Đăng xuất?"
  - Message: "Bạn có chắc muốn đăng xuất?"
  - Actions: "Hủy" | "Đăng xuất"
- **Effect**: Clear session → Navigate to `02-login-register`

#### Delete Account Button (Bottom of screen)
- **Visual**: Text button, destructive color (red)
- **Label**: "Xóa tài khoản"
- **Icon**: Trash icon (leading)
- **Tương tác**: Tap → Show strong confirmation dialog:
  - Title: "Xóa tài khoản vĩnh viễn?"
  - Message:
    ```
    Tất cả dữ liệu của bạn sẽ bị xóa sau 30 ngày:
    • Profile và ảnh
    • Matches và tin nhắn
    • Lịch sử đặt sân

    Bạn có thể đăng nhập lại trong 30 ngày để khôi phục tài khoản.
    ```
  - Text input: "Nhập 'XÓA' để xác nhận" (must type exactly "XÓA")
  - Actions: "Hủy" | "Xóa tài khoản" (destructive, disabled until input valid)
- **Effect**:
  - Mark account for deletion (grace period 30 days)
  - Logout immediately
  - Show toast: "Tài khoản sẽ bị xóa sau 30 ngày. Đăng nhập lại để khôi phục."

---

### 8. App Version (Footer)
- **Label**: "Phiên bản [version] ([build])"
- **Example**: "Phiên bản 1.0.0 (123)"
- **Visual**: Center-aligned, secondary text, small size (12sp)
- **Tương tác**: Tap 7 lần liên tục → Show developer menu (debug builds only)

---

## Navigation

### Đến screen này từ:
- **Tab Navigation**: "Cá nhân" tab → Settings button (icon settings trong `10-profile-me`)
- **Deep link**: From push notification "Update your preferences"

### Từ screen này đến:
- **21-edit-profile** (Chỉnh sửa hồ sơ button)
- **Block List Screen** (Danh sách chặn - new screen, simple list)
- **WebViews**: Help Center, Terms, Privacy Policy
- **System Settings**: (Deep link cho notification permission)
- **02-login-register** (Sau khi logout)

---

## States

### Default State
- All sections visible
- Toggle switches reflect current preferences
- Sliders at saved values
- Profile card with user data

### Loading State
- Skeleton loaders cho profile card khi fetch user data
- Disabled state cho switches/sliders khi đang save

### Error State
- **Save failed**: Toast "Không thể lưu cài đặt. Vui lòng thử lại."
- **Network error**: Banner at top "Không có kết nối mạng. Một số tính năng bị hạn chế."

### Permission Not Granted State
- Notification section shows warning banner
- All notification toggles disabled (grayed out)
- Banner với CTA "Mở Cài đặt"

### Account Deletion Pending State
- **If user returns within 30 days**:
  - Banner at top (orange):
    - "Tài khoản của bạn sẽ bị xóa vào [date]. Nhấn đây để khôi phục."
    - Tap → Show dialog:
      - Title: "Khôi phục tài khoản?"
      - Message: "Tài khoản của bạn sẽ được kích hoạt lại."
      - Actions: "Hủy" | "Khôi phục"
  - Delete account button replaced với "Hủy xóa tài khoản"

---

## Ghi chú

### UX Considerations
- **Immediate feedback**: Toggle/slider changes phải có visual feedback ngay lập tức
- **Save indication**: Không cần explicit "Save" button cho toggles/sliders (auto-save với debounce)
- **Confirmation dialogs**: Bắt buộc cho destructive actions (logout, delete account)
- **Accessibility**:
  - All toggles có semantic labels
  - Sliders có min/max announcements
  - Destructive actions có clear warnings

### Validations
- **Password change**:
  - Current password must be correct (API validation)
  - New password min 8 characters, must have uppercase + lowercase + number
  - Confirm password must match
- **Discovery preferences**:
  - Distance: 1-50 km
  - Age range: 18-60, min must be < max
  - Skill level: Ít nhất 1 level selected
- **Account deletion**:
  - Must type exactly "XÓA" (case-sensitive)
  - Confirmation button disabled until valid

### Error Handling
- **Network errors**: Retry với exponential backoff, show toast
- **Permission denied**: Clear messaging với CTA đến system settings
- **Session expired**: Auto-logout → Navigate to login
- **API errors**: Generic error toast với option to contact support

### Privacy & Security
- **Password display**: All password fields masked (eye icon để toggle visibility)
- **Phone masking**: Chỉ hiển thị 3 số cuối (+84 *** *** 789)
- **Block list**: Private, không public
- **Account deletion**: 30-day grace period, data backup trong period này

### Analytics Events
- `settings_opened`
- `preference_changed` (distance, age, skill_level, gender, language, dark_mode)
- `notification_toggled` (type, enabled/disabled)
- `privacy_toggled` (hide_profile, hide_online_status)
- `password_changed`
- `logout_confirmed`
- `account_deletion_initiated`
- `account_deletion_cancelled`

---

## Technical Notes

### State Management
- User preferences sync với backend (debounce 1s cho sliders)
- Local storage backup cho offline access
- Optimistic updates cho toggles (revert nếu API fail)

### Performance
- Lazy load webviews (Help, Terms, Privacy)
- Debounce slider changes (avoid excessive API calls)
- Cache permission status (check once per session)

### Push Permission Handling
```typescript
// Check permission status on mount
const checkPermission = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  setHasPermission(status === 'granted');
};

// Open system settings
const openSettings = () => {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
};
```

### Account Deletion Flow
```
1. User taps "Xóa tài khoản"
2. Dialog với strong warning + grace period info
3. User types "XÓA" to confirm
4. API call: PATCH /users/{id} { deletion_scheduled_at: now + 30 days }
5. Logout immediately
6. Cron job: Delete accounts where deletion_scheduled_at < now
7. If user logs in within 30 days → PATCH { deletion_scheduled_at: null }
```

---

**End of Screen Description**
