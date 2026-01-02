# Rating & Review Screen

## Screen Overview
Cho phép người dùng đánh giá đối thủ sau trận đấu hoặc đánh giá sân sau khi booking. Screen hỗ trợ 2 modes: Rate Opponent và Rate Court với rating system dạng sao và text review.

## Mục đích
- Thu thập feedback về quality của opponents và courts
- Xây dựng trust và credibility trong community
- Cung cấp thông tin hữu ích cho users khác
- Khuyến khích positive interactions

---

## Mode 1: Rate Opponent

### 1. Header Section
- **Back Button**: Close rating screen
- **Title**: "Đánh giá đối thủ"
- **Progress Indicator**: (Optional) "Bước 1/2" nếu có multiple ratings pending

### 2. Opponent Info Card
- **Avatar**: Opponent's profile picture (80x80dp, circular)
- **Name**: Full name
- **Skill Level Badge**: Display skill level (Beginner/Intermediate/Advanced)
- **Match Date**: "Trận đấu ngày [date]"
- **Match Location**: Court name (subtle, smaller text)

**Design**:
- Card có subtle shadow
- Centered layout
- Avatar có border màu primary khi active

### 3. Star Rating Section

#### 3.1. Overall Rating
- **Label**: "Đánh giá chung"
- **Star Component**: 5 stars (interactive)
  - Default: All gray/outline
  - On tap: Fill từ trái qua phải
  - Selected: Yellow/gold filled
  - Size: 32dp per star
- **Rating Text**: "[X]/5" hoặc text labels (Rất tệ → Xuất sắc)

#### 3.2. Detailed Ratings
Grid layout 2 columns:

**Column 1:**
- **Skill Accuracy**: "Độ chính xác kỹ năng"
  - Star rating (1-5)
  - Subtitle: "Skill level có đúng không?"

- **Attitude**: "Thái độ"
  - Star rating (1-5)
  - Subtitle: "Thân thiện, lịch sự"

**Column 2:**
- **Punctuality**: "Đúng giờ"
  - Star rating (1-5)
  - Subtitle: "Đến đúng giờ hẹn"

**Interaction**:
- Tap vào star để rate
- Visual feedback: Bounce animation khi select
- Có thể re-rate (tap lại để change)

**Validations**:
- Overall rating BẮT BUỘC (minimum)
- Detailed ratings optional (nhưng encourage)
- Show warning nếu chỉ có overall: "Thêm đánh giá chi tiết giúp cộng đồng hiểu rõ hơn"

### 4. Quick Tags Section
- **Label**: "Tags nhanh" (optional)
- **Tags Grid**: Wrap layout
  - "Thân thiện"
  - "Cạnh tranh"
  - "Vui vẻ"
  - "Đối thủ tốt"
  - "Tôn trọng"
  - "Hỗ trợ"

**Interaction**:
- Tap để select/deselect
- Multiple selection allowed
- Selected: Primary color background, white text
- Unselected: Gray border, gray text
- Rounded corners (16dp)

### 5. Text Review Section
- **Label**: "Nhận xét (tùy chọn)"
- **Textarea**:
  - Placeholder: "Chia sẻ trải nghiệm của bạn với đối thủ này..."
  - Max 500 characters
  - Character counter: "[X]/500"
  - Auto-resize height
  - Min height: 80dp

**Validations**:
- Optional field
- No profanity filter (can add later)

### 6. Action Buttons

**Primary CTA**: "Gửi đánh giá"
- Full-width button
- Enabled khi có ít nhất Overall rating
- Disabled state nếu chưa rate

**Secondary Actions**:
- **"Đánh giá sau"**: Text button, right aligned
- **"Bỏ qua"**: Text button, left aligned (gray)

**Behaviors**:
- "Gửi": Submit rating → Success confirmation
- "Đánh giá sau": Close screen, remind later (notification)
- "Bỏ qua": Close screen, don't ask again for this match

---

## Mode 2: Rate Court

### 1. Header Section
- **Back Button**: Close rating screen
- **Title**: "Đánh giá sân"

### 2. Court Info Card
- **Court Photo**: 16:9 ratio, rounded corners
- **Court Name**: Bold, 18sp
- **Address**: Subtitle, gray
- **Booking Date**: "Đặt sân ngày [date]"

**Design**:
- Photo có overlay gradient để text dễ đọc
- Card có subtle shadow

### 3. Star Rating Section

#### 3.1. Overall Rating
- **Label**: "Đánh giá chung"
- **Star Component**: Same as opponent rating
- **Rating Text**: "[X]/5"

#### 3.2. Detailed Ratings
Grid layout 2 columns:

**Column 1:**
- **Court Quality**: "Chất lượng sân"
  - Star rating (1-5)
  - Subtitle: "Mặt sân, lưới, sọc kẻ"

- **Facilities**: "Tiện nghi"
  - Star rating (1-5)
  - Subtitle: "WC, chỗ ngồi, tủ đồ"

**Column 2:**
- **Service**: "Dịch vụ"
  - Star rating (1-5)
  - Subtitle: "Nhân viên, hỗ trợ"

**Same interactions & validations as opponent rating**

### 4. Quick Tags Section
- **Label**: "Tags nhanh" (optional)
- **Tags Grid**:
  - "Được bảo trì tốt"
  - "Sạch sẽ"
  - "Ánh sáng tốt"
  - "Nhân viên thân thiện"
  - "Giá hợp lý"
  - "Tiện nghi đầy đủ"

**Same interactions as opponent tags**

### 5. Photo Upload Section (Optional)
- **Label**: "Thêm ảnh (1-3 ảnh)"
- **Upload Area**:
  - Dashed border box
  - Camera icon
  - Text: "Chụp hoặc chọn ảnh"

**Uploaded Photos**:
- Thumbnail grid (80x80dp)
- Max 3 photos
- Delete icon (X) trên góc mỗi thumbnail
- Tap để view full size

**Interactions**:
- Tap → Bottom sheet: "Chụp ảnh" / "Chọn từ thư viện"
- Image picker integration
- Compress before upload
- Show loading indicator khi uploading

### 6. Text Review Section
- **Label**: "Nhận xét (tùy chọn)"
- **Textarea**: Same as opponent mode
- **Placeholder**: "Chia sẻ trải nghiệm của bạn với sân này..."

### 7. Action Buttons
Same as Mode 1 (Gửi / Đánh giá sau / Bỏ qua)

---

## Common Components (Both Modes)

### Star Rating Component
```
Props:
- rating: number (0-5)
- onChange: (rating: number) => void
- size: 'small' | 'medium' | 'large'
- label: string (optional)
- subtitle: string (optional)

States:
- Unrated: Gray outline stars
- Hovered (mobile: tapped): Yellow outline stars
- Rated: Yellow filled stars

Animation:
- Scale up khi tap (1.0 → 1.2 → 1.0)
- Fill animation từ trái qua phải
```

### Rating Success Modal
**Content**:
- Checkmark icon (animated)
- "Cảm ơn đánh giá của bạn!"
- "Đánh giá của bạn giúp cộng đồng phát triển tốt hơn"

**Actions**:
- Auto close sau 2 seconds
- Hoặc "Đóng" button

**Animation**:
- Fade in
- Checkmark scales from 0 → 1 với bounce

---

## Navigation

### Đến screen này từ:
1. **Match Completion Flow**:
   - Sau khi match status = "completed"
   - Bottom sheet prompt: "Đánh giá đối thủ?"
   - Tap "Đánh giá" → Navigate to Rating Screen (Opponent mode)

2. **Booking History**:
   - Booking list item → "Đánh giá sân" button
   - Navigate to Rating Screen (Court mode)

3. **Match List** (10-match-list.md):
   - Match card → "Đánh giá" button (nếu chưa rate)
   - Navigate to Rating Screen (Opponent mode)

4. **Notifications**:
   - Reminder notification: "Đừng quên đánh giá đối thủ/sân"
   - Tap → Navigate to Rating Screen

### Từ screen này đến:
1. **Success → Navigate Back**:
   - Return to previous screen
   - Show toast: "Đánh giá đã được gửi"

2. **Skip/Later**:
   - Close screen
   - Return to previous screen
   - (Optional) Schedule reminder notification

---

## States

### 1. Default State
- All stars unrated (gray outline)
- Text review empty
- Submit button disabled
- No tags selected
- No photos (Court mode)

### 2. Partially Filled State
- Some ratings filled
- Submit button enabled nếu có Overall rating
- Visual indicator: Progress bar hoặc "X/4 categories rated"

### 3. Submitting State
- Loading spinner on Submit button
- Disable all inputs
- Text: "Đang gửi..."

### 4. Success State
- Show success modal
- Confetti animation (optional, subtle)
- Auto navigate back sau 2s

### 5. Error State
- Error message dưới Submit button
- Red text: "Không thể gửi đánh giá. Vui lòng thử lại."
- Retry button
- Inputs vẫn editable

### 6. Edit Mode State (Already Rated)
- Load existing rating data
- Pre-fill stars, tags, text
- Submit button text: "Cập nhật đánh giá"
- Show previous rating date: "Đánh giá lần cuối: [date]"

---

## Edge Cases

### 1. Already Rated
- Nếu user đã rate opponent/court:
  - Load existing rating
  - Switch to **Edit Mode**
  - Show "Cập nhật đánh giá" button
  - Option to delete rating: "Xóa đánh giá" (text button, red)

### 2. Offline Mode
- Nếu không có internet:
  - Disable Submit button
  - Show warning: "Không có kết nối. Đánh giá sẽ được lưu và gửi khi có mạng."
  - Save locally (AsyncStorage)
  - Auto-sync khi online

### 3. User Skips
- Nếu tap "Bỏ qua":
  - Confirm dialog: "Bạn chắc chắn không muốn đánh giá?"
  - Options: "Không đánh giá" / "Quay lại"
  - Nếu confirm → Set flag "don't ask again for this match/booking"

### 4. Multiple Pending Ratings
- Nếu có nhiều ratings pending (multiple matches):
  - Show queue indicator: "Bạn có 3 đánh giá đang chờ"
  - Navigation arrows: Previous/Next
  - Progress: "1/3", "2/3", "3/3"

### 5. Inappropriate Content
- (Future) Add report button nếu rating của người khác inappropriate
- Profanity filter cho text reviews (optional)

### 6. Self-Rating Prevention
- Backend validation: Không thể rate chính mình
- UI: Không show rating option nếu opponent là chính user

### 7. Rating Too Soon
- Nếu match chưa kết thúc:
  - Disable rating
  - Show message: "Chỉ có thể đánh giá sau khi trận đấu kết thúc"

### 8. Photo Upload Failures
- Nếu upload ảnh fail:
  - Show error dưới photo
  - Option to retry upload
  - Option to remove ảnh và submit without photo

---

## Validations

### Submit Validations:
1. **Overall rating** (BẮT BUỘC): Phải có ít nhất 1 star
2. **Text review length**: Max 500 characters
3. **Photos** (Court mode): Max 3 photos, each < 5MB
4. **Network**: Phải có internet (hoặc save offline)

### Error Messages:
- "Vui lòng chọn ít nhất 1 sao"
- "Nhận xét quá dài (tối đa 500 ký tự)"
- "Ảnh quá lớn (tối đa 5MB mỗi ảnh)"
- "Không thể tải ảnh lên. Vui lòng thử lại."

---

## Animations & Interactions

### Star Rating Animations:
- **Tap star**: Scale animation (1.0 → 1.2 → 1.0) trong 200ms
- **Fill stars**: Sequential fill từ trái qua phải (50ms mỗi star)
- **Haptic feedback**: Light impact khi tap star

### Tag Selection:
- **Select**: Background color transition (200ms)
- **Deselect**: Reverse transition
- **Bounce**: Slight scale animation (1.0 → 1.05 → 1.0)

### Submit Button:
- **Enabled state**: Fade in (300ms)
- **Loading**: Spinner rotates, button text fades out
- **Success**: Checkmark animation, button becomes green briefly

### Success Modal:
- **Entry**: Fade in + scale up (0.8 → 1.0)
- **Checkmark**: Draw animation (SVG path animation)
- **Exit**: Fade out (300ms) sau 2 seconds

### Photo Upload:
- **Upload progress**: Linear progress bar beneath thumbnail
- **Success**: Checkmark overlay on thumbnail (fade in)
- **Delete**: Scale down + fade out (200ms)

---

## Accessibility

### Screen Reader Support:
- Star rating: "Đánh giá chung: [X] trên 5 sao"
- Tags: "Tag [name], đã chọn" / "chưa chọn"
- Photos: "Ảnh [number] của 3"

### Keyboard Navigation:
- Tab order: Stars → Tags → Text → Photos → Buttons
- Enter để select tags
- Space để toggle tags

### High Contrast Mode:
- Stars: Higher contrast yellow/gray
- Tags: Thicker borders
- Text: WCAG AA compliant

### Touch Target Size:
- Stars: Min 44x44dp
- Tags: Min 44dp height
- Buttons: Min 48dp height

---

## Performance Considerations

### Image Optimization:
- Compress photos trước upload (max 1024x1024px)
- Use thumbnail cho grid display
- Lazy load full-size images

### Debouncing:
- Text review: Debounce character count (300ms)
- Star rating: Immediate update, no debounce

### Caching:
- Cache existing ratings locally
- Offline queue cho pending ratings
- Sync khi có network

---

## Backend Integration Notes

### API Endpoints (Future):
```
POST /api/ratings/opponent
{
  matchId: string
  opponentId: string
  overallRating: number (1-5)
  skillAccuracy: number (1-5) | null
  attitude: number (1-5) | null
  punctuality: number (1-5) | null
  tags: string[]
  review: string | null
}

POST /api/ratings/court
{
  bookingId: string
  courtId: string
  overallRating: number (1-5)
  courtQuality: number (1-5) | null
  facilities: number (1-5) | null
  service: number (1-5) | null
  tags: string[]
  review: string | null
  photos: string[] (URLs)
}

PUT /api/ratings/:id (Update existing rating)
DELETE /api/ratings/:id (Delete rating)
```

### Mock Data Behavior:
- Simulate 1s delay khi submit
- Random success/error (95% success)
- Store ratings in AsyncStorage
- Load existing rating nếu có

---

## Design Tokens

### Colors:
- **Star unrated**: Gray 300 (#D1D5DB)
- **Star rated**: Amber 400 (#FBBF24)
- **Tag selected**: Primary color
- **Tag unselected**: Gray 200 border
- **Success green**: Green 500 (#10B981)
- **Error red**: Red 500 (#EF4444)

### Spacing:
- Section spacing: 24dp
- Star spacing: 8dp
- Tag spacing: 8dp
- Card padding: 16dp

### Typography:
- Screen title: 24sp, Bold
- Section labels: 16sp, SemiBold
- Star rating text: 14sp, Regular
- Review text: 14sp, Regular
- Character counter: 12sp, Regular, Gray

---

## Ghi chú

### UX Considerations:
1. **Khuyến khích đánh giá**:
   - Timely prompts (ngay sau match/booking)
   - Reminder notifications (sau 24h nếu chưa rate)
   - Gamification: Badge "Top Reviewer" (future)

2. **Prevent rating fatigue**:
   - Cho phép skip/rate later
   - Không force rating
   - Quick tags để giảm friction

3. **Trust & credibility**:
   - Verified badge cho users đã chơi nhiều matches
   - Show rating count: "[User] đã nhận 15 đánh giá"
   - Average rating display

4. **Reciprocal ratings**:
   - Encourage cả 2 bên đánh giá nhau
   - Unlock opponent's rating after user rates (optional incentive)

5. **Positive reinforcement**:
   - Thank you message sau rating
   - Show impact: "Bạn đã giúp 10 người khác"

### Future Enhancements:
- Private feedback (chỉ admin thấy)
- Rating analytics for courts (heatmaps, trends)
- AI moderation cho inappropriate reviews
- Translation cho reviews (multi-language support)
- Video reviews (short clips)

---

**ĐÂY LÀ SCREEN CUỐI CÙNG (22/22) TRONG DESIGN PHASE!**
