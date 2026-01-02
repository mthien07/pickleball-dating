# Edit Profile Screen

## Screen Overview
Cho phép người dùng chỉnh sửa thông tin cá nhân, quản lý ảnh, cập nhật skill level và preferences. Support real-time validation và auto-save draft locally.

## Mục đích
- Cập nhật profile information (basic info, pickleball stats, preferences)
- Quản lý photo gallery (add/delete/reorder/set main photo)
- Validate input real-time và prevent invalid data
- Draft changes locally nếu chưa save

## Các Section/Components Chính

### 1. Header
- Title: "Chỉnh sửa hồ sơ"
- **Left**: Back/Cancel button
  - Nếu có thay đổi chưa save → Show confirmation dialog: "Bạn có chắc muốn hủy? Thay đổi sẽ không được lưu."
  - Nếu chưa edit gì → Navigate back trực tiếp
- **Right**: "Lưu" button
  - Disabled (gray) khi không có thay đổi
  - Enabled (primary color) khi detect changes
  - Show loading spinner khi đang save
  - Tương tác: Tap → Validate → Save changes → Navigate back với success feedback

### 2. Photo Management Section
- **Photo Grid** (6 slots, 2 columns):
  - Slot với ảnh hiện tại:
    - Thumbnail (square, aspect ratio 1:1)
    - **Star badge** (top-right) nếu là main photo
    - Tap photo → Show Action Sheet:
      - "Xem ảnh" (fullscreen preview)
      - "Đặt làm ảnh chính" (if not main)
      - "Xóa ảnh" (confirm dialog)
      - "Hủy"
    - Long-press + drag → Reorder photos (visual feedback: shadow, scale up)
  - Empty slot:
    - Dashed border, "+" icon
    - Tap → Show Photo Picker: "Chọn từ thư viện" / "Chụp ảnh mới" / "Hủy"
- **"Thêm ảnh" Button** (nếu < 6 photos):
  - Outlined button, camera icon
  - Tap → Same photo picker as empty slot
- **Upload Progress**:
  - Show progress bar overlay trên thumbnail khi đang upload
  - Success → Replace với ảnh đã upload
  - Failed → Show retry button on thumbnail

**Validations:**
- Yêu cầu ít nhất 1 photo
- Max 6 photos
- File size max 10MB per photo
- Supported formats: JPG, PNG, HEIC

**Hiệu ứng:**
- Drag & drop animation khi reorder
- Fade in khi thêm ảnh mới
- Fade out khi xóa ảnh
- Skeleton loading cho thumbnails

### 3. Basic Info Section
- **Display Name**:
  - Text input, placeholder: "Tên hiển thị"
  - Real-time validation:
    - 2-30 ký tự
    - Show error text bên dưới nếu invalid: "Tên phải từ 2-30 ký tự"
    - Red border khi error
  - Character counter: "12/30"

- **Date of Birth**:
  - **Display only** nếu đã set (gray background, disabled):
    - Format: "15/08/1995 (29 tuổi)"
    - Helper text: "Ngày sinh không thể thay đổi sau khi thiết lập"
  - Editable picker nếu chưa set lần đầu:
    - Tap → Date picker modal
    - Validation: Must be 18+ years old
    - Show age automatically: "(29 tuổi)"

- **Gender**:
  - Segmented control / Radio buttons:
    - Options: "Nam" / "Nữ" / "Khác"
  - Default: current value hoặc unselected

- **Bio**:
  - Multiline text input (4-6 lines height)
  - Placeholder: "Giới thiệu bản thân, sở thích chơi pickleball..."
  - Live character counter: "245/500"
  - Auto-expand khi typing (max 6 lines)
  - Show warning when > 450 chars: counter turns orange
  - Show error when = 500: counter turns red

### 4. Pickleball Info Section
- **Skill Level**:
  - Dropdown / Selector:
    - Options: "Mới bắt đầu" / "Trung bình" / "Nâng cao" / "Chuyên nghiệp"
  - Icon indicator cho mỗi level (1-4 stars)

- **Play Style**:
  - Segmented control:
    - "Thi đấu" (competitive icon)
    - "Giải trí" (casual icon)
    - "Giao lưu" (social icon)
  - Single select

- **Looking For**:
  - Multi-select chips:
    - "Đối thủ" / "Đồng đội đánh đôi" / "Hẹn hò" / "Tất cả"
  - Tap to toggle (filled vs outlined)
  - Allow multiple selections
  - Visual: colored chips khi selected

### 5. Availability Section (Optional)
- **Collapsible section** (default collapsed):
  - Header: "Thời gian có thể chơi" + expand/collapse icon

- **Days Available** (khi expanded):
  - 7-day picker: T2, T3, T4, T5, T6, T7, CN
  - Multi-select toggle buttons (filled when selected)

- **Time Slots** (per day selected):
  - For each selected day, show time slot toggles:
    - "Sáng" (6-12h) / "Chiều" (12-18h) / "Tối" (18-22h)
  - Visual: horizontal chips per day row
  - Example:
    ```
    T2: [Sáng] [Chiều]
    T4: [Chiều] [Tối]
    ```

### 6. Location Preferences Section
- **Preferred Location**:
  - Dropdown / Picker:
    - 2-tier selection: City → District
    - Example: "TP. Hồ Chí Minh → Quận 1"
  - Show map preview (optional, small thumbnail)

- **Search Radius** (optional):
  - Slider: 1-50km
  - Default: 10km
  - Display: "Bán kính: 10 km"

## Navigation
- **Đến screen này từ**:
  - 02-user-profile-player.md (tap "Chỉnh sửa" button)
- **Từ screen này đến**:
  - Back to 02-user-profile-player.md (after save hoặc cancel)
  - Photo Picker (Camera/Gallery - native)
  - Photo Fullscreen Viewer (modal)

## States

### Default State (Loaded)
- All fields populated với current user data
- Photos displayed in grid
- "Lưu" button disabled (no changes yet)

### Editing State (Dirty)
- Detect any field changes
- "Lưu" button becomes enabled
- Draft changes stored locally (auto-save mỗi 3s)

### Saving State
- Show loading overlay trên "Lưu" button
- Disable all inputs
- Upload photos nếu có ảnh mới
- Submit form data

### Success State
- Show toast: "Cập nhật hồ sơ thành công ✓"
- Navigate back to 02-user-profile-player.md
- Clear local draft

### Error State
- Show error toast: "Không thể lưu. Vui lòng thử lại."
- Re-enable inputs
- Keep draft locally
- Retry button

### Photo Upload States
- **Uploading**: Progress bar (0-100%)
- **Success**: Checkmark icon overlay
- **Failed**: Error icon + "Thử lại" button

## Validations

### Client-side Validation (Real-time)
1. **Display Name**:
   - Required
   - 2-30 characters
   - Show error immediately when out of range

2. **Bio**:
   - Max 500 characters
   - Warning at 450, error at 500

3. **Photos**:
   - At least 1 photo required
   - Max 6 photos
   - File size < 10MB
   - Valid image format (JPG/PNG/HEIC)

4. **Date of Birth** (nếu editable):
   - Must be 18+ years old
   - Valid date format

5. **At least one selection required**:
   - Skill level
   - Play style
   - Looking for (at least 1)

### Submit Validation
- Check all required fields before submit
- Show first error field và scroll to it
- Disable "Lưu" button until all errors fixed

## Actions

### Primary Actions
1. **"Lưu" Button**:
   - Validate all fields
   - Upload new photos (parallel)
   - Submit profile data to backend
   - Handle success/error states
   - Navigate back on success

2. **"Hủy" Button**:
   - If no changes → Navigate back
   - If dirty → Show confirm dialog:
     - "Bạn có chắc muốn hủy? Thay đổi sẽ không được lưu."
     - "Giữ lại" (stay) / "Hủy bỏ" (discard & navigate back)

### Photo Actions
1. **Add Photo**:
   - Show photo picker (Camera/Gallery)
   - Validate file (size, format)
   - Upload with progress
   - Add to grid on success

2. **Delete Photo**:
   - Show confirm dialog: "Xóa ảnh này?"
   - Remove from grid
   - If deleting main photo → Auto-set first remaining photo as main

3. **Set as Main Photo**:
   - Remove star from current main
   - Add star to new main
   - Visual feedback (animation)

4. **Reorder Photos**:
   - Long-press to start drag
   - Drag to new position
   - Other photos shift smoothly
   - Release to drop

### Auto-save Draft
- Debounce 3 seconds after last edit
- Save to AsyncStorage locally
- Restore draft when user returns (if not saved)
- Show indicator: "Lưu nháp..." (subtle text)

## Edge Cases

### Unsaved Changes
- User taps Back/Cancel → Confirm discard dialog
- App goes to background → Auto-save draft
- User returns → Restore draft với prompt: "Bạn có thay đổi chưa lưu. Tiếp tục chỉnh sửa?"

### Photo Upload Failed
- Show error on thumbnail
- "Thử lại" button
- Option to remove failed photo
- Continue editing other fields

### Network Offline
- Queue changes locally
- Show "Offline - sẽ lưu khi có mạng" indicator
- Retry when network returns
- Sync queue khi online

### Invalid Data
- Show errors under each field
- Scroll to first error field
- Disable "Lưu" until fixed
- Preserve user input (don't clear)

### Date of Birth Edge Case
- Already set → Display only, cannot edit
- Not set (new user) → Show picker, require 18+
- Invalid age → Error: "Bạn phải từ 18 tuổi trở lên"

### Photo Limit Reached
- Hide "Thêm ảnh" button when 6 photos
- Show message: "Tối đa 6 ảnh"
- Must delete photo before adding new one

### Concurrent Edits
- If profile updated elsewhere (other device):
  - Show alert: "Hồ sơ đã được cập nhật từ thiết bị khác"
  - Option: "Ghi đè" / "Tải lại"

## Ghi chú

### UX Considerations
- **Clear visual feedback** cho mọi action (tap, drag, upload, validation)
- **Real-time validation** để user sửa ngay (không đợi submit)
- **Auto-save draft** prevents data loss
- **Confirm dialogs** cho destructive actions (delete photo, discard changes)
- **Progress indicators** cho async operations (upload, save)

### Accessibility
- Form labels rõ ràng
- Error messages descriptive
- Touch targets ≥ 44x44 pts
- Screen reader support cho photo grid

### Performance
- Lazy load photo picker
- Compress images before upload (max 1080x1080)
- Debounce validation (avoid excessive checks)
- Optimize drag & drop (use Reanimated)

### Design Tokens
- Use system photo picker (native UX)
- Consistent spacing (16px between sections)
- Form inputs follow design system
- Error states use semantic colors (red-500)

### Backend Integration Notes (for Backend Phase)
- **Draft API**: `POST /api/profile/draft` (save locally, optional sync)
- **Update Profile API**: `PATCH /api/profile`
  - Multipart form-data (JSON + photos)
  - Return updated profile object
- **Photo Upload API**: `POST /api/profile/photos`
  - Parallel uploads
  - Return URLs
- **Photo Delete API**: `DELETE /api/profile/photos/:id`
- **Photo Reorder API**: `PATCH /api/profile/photos/order`
  - Send new order array: `[{id, position}]`
