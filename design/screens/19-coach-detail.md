# Coach Detail Screen

## Screen Overview
Hiển thị thông tin chi tiết về huấn luyện viên pickleball (profile, certification, experience, pricing, reviews, contact) để người dùng có thể quyết định liên hệ hoặc book.

## Mục đích
- Cung cấp thông tin toàn diện về coach (credentials, experience, specialization)
- Hiển thị reviews và ratings từ học viên
- Cho phép liên hệ trực tiếp qua phone/email
- Hỗ trợ sharing coach profile

## Các Section/Components Chính

### 1. Photo Gallery Section (Top)
- **Mô tả**: Swipeable photo gallery với 1-6 ảnh (photos of coach, training sessions, students)
- **Tương tác**:
  - Swipe ngang để xem các ảnh
  - Pagination dots hiển thị vị trí ảnh hiện tại
  - Tap ảnh để xem fullscreen (optional)
- **Hiệu ứng**: Smooth swipe transition giữa các ảnh
- **States**:
  - 1 ảnh: Không có dots, không swipe
  - 2-6 ảnh: Dots + swipe enabled
  - No photos: Placeholder ảnh mặc định

### 2. Basic Info Section
- **Mô tả**: Card hiển thị thông tin cơ bản của coach
- **Components**:
  - **Avatar overlay** (nếu có, góc trái trên gallery) hoặc dưới gallery
  - **Coach Name** (H3 bold) + **Verified Badge** (nếu verified)
  - **Age** (e.g., "35 tuổi") + **Location** (e.g., "TP.HCM")
  - **Years of Experience** (e.g., "8 năm kinh nghiệm")
  - **Specialization** (e.g., "Chuyên singles, kỹ thuật nâng cao")
- **Validations**: Name bắt buộc

### 3. Certifications Section
- **Mô tả**: Danh sách chứng chỉ với icons
- **Components**:
  - **Title**: "Chứng Chỉ"
  - **Certification Items** (horizontal chips hoặc vertical list):
    - PTR Certified (icon + text)
    - USAPA Certified (icon + text)
    - Khác (nếu có)
- **States**:
  - Has certifications: Hiển thị icons + text
  - No certifications: Hiển thị "Chưa có chứng chỉ"

### 4. Training Focus Section
- **Mô tả**: Điểm mạnh training của coach
- **Components**:
  - **Title**: "Điểm Mạnh"
  - **Focus Tags** (chips): Singles, Doubles, Beginner, Advanced, Tactics, Technique, v.v.
- **Tương tác**: Tags là read-only chips

### 5. Bio Section
- **Mô tả**: Giới thiệu chi tiết về coach (free text)
- **Components**:
  - **Title**: "Giới Thiệu"
  - **Bio Text** (expandable):
    - Default: 3 dòng text + "Xem thêm" link
    - Expanded: Full text + "Thu gọn" link
- **Tương tác**: Tap "Xem thêm" để expand, "Thu gọn" để collapse
- **States**:
  - Short bio (≤3 lines): Không có "Xem thêm"
  - Long bio: Truncate + "Xem thêm"
  - No bio: Hiển thị placeholder "Chưa có giới thiệu"

### 6. Achievements Section (Optional)
- **Mô tả**: Thành tích nổi bật (tournaments, awards)
- **Components**:
  - **Title**: "Thành Tích"
  - **Achievement List** (bulleted hoặc cards):
    - Trophy icon + text (e.g., "Vô địch giải X 2024")
- **States**:
  - Has achievements: Hiển thị list
  - No achievements: Section không hiển thị (hoặc "Chưa có thành tích")

### 7. Price Info Section
- **Mô tả**: Giá và packages
- **Components**:
  - **Title**: "Học Phí"
  - **Price Range** (e.g., "400.000đ - 800.000đ/giờ")
  - **Packages** (cards):
    - Package Name (e.g., "Gói 10 buổi")
    - Price (e.g., "7.000.000đ")
    - Description (e.g., "Giảm 12%, 90 phút/buổi")
  - **Note** (nhỏ): "Giá có thể thay đổi, liên hệ để xác nhận"
- **States**:
  - Has packages: Hiển thị cards
  - No packages: Chỉ hiển thị price range

### 8. Availability Section (Optional)
- **Mô tả**: Thời gian rảnh (free-form text)
- **Components**:
  - **Title**: "Lịch Rảnh"
  - **Text** (e.g., "T2-T6: 6-9 sáng, 5-8 tối. T7-CN: Cả ngày")
  - **Note**: "Liên hệ để book cụ thể"
- **States**:
  - Has availability: Hiển thị text
  - No availability: Section không hiển thị hoặc "Liên hệ để hỏi lịch"

### 9. Reviews Section
- **Mô tả**: Đánh giá từ học viên
- **Components**:
  - **Title**: "Đánh Giá" + **Rating Summary** (e.g., "4.8 ⭐ (23 đánh giá)")
  - **Top 3 Reviews** (cards):
    - Avatar + Name + Rating (stars)
    - Date (e.g., "2 tuần trước")
    - Review Text (max 3 lines, expandable inline)
  - **"Xem Tất Cả" Button** (outline):
    - Tap → **Expand inline** (bottom sheet với ScrollView):
      - All reviews (pagination nếu >20)
      - Close button để collapse
- **Tương tác**:
  - Tap "Xem Tất Cả" → Bottom sheet với full reviews
  - Swipe down hoặc tap X để close bottom sheet
- **States**:
  - Has reviews: Hiển thị rating + top 3
  - No reviews: "Chưa có đánh giá"

### 10. Contact Section
- **Mô tả**: Thông tin liên hệ trực tiếp
- **Components**:
  - **Title**: "Liên Hệ"
  - **Phone** (nếu có):
    - Icon + Number (e.g., "0912345678")
    - "Gọi Ngay" button (primary, small)
  - **Email** (nếu có):
    - Icon + Email (e.g., "coach@example.com")
    - "Gửi Email" link
  - **Note** (italic, nhỏ): "Liên hệ trực tiếp với coach để book lịch"
- **Tương tác**:
  - Tap "Gọi Ngay" → Mở native phone dialer
  - Tap Email → Mở native email app
- **States**:
  - Phone available: Hiển thị phone + button
  - Phone not available: Không hiển thị phone
  - Email available: Hiển thị email
  - Email not available: Không hiển thị email

### 11. Sticky Bottom Action Bar
- **Mô tả**: Fixed bottom bar với primary actions
- **Components**:
  - **"Gọi Ngay" Button** (primary, 50% width):
    - Icon phone + text
    - Disabled nếu phone not available
  - **"Gửi Email" Button** (outline, 30% width):
    - Icon email
    - Disabled nếu email not available
  - **"Chia Sẻ" Icon Button** (outline, 20% width):
    - Icon share
- **Tương tác**:
  - Tap "Gọi Ngay" → Native phone dialer
  - Tap "Gửi Email" → Native email app
  - Tap "Chia Sẻ" → **Native share sheet** với deeplink text:
    - Text: "Xem coach {Name} trên PickleBall App: {deeplink URL}"
- **Validations**:
  - Phone not available → "Gọi Ngay" disabled
  - Email not available → "Gửi Email" disabled
  - Share luôn enabled

## Navigation
- **Đến screen này từ**:
  - Screen 18 (Coach Directory): Tap coach card
- **Từ screen này đến**:
  - Back to Screen 18 (Coach Directory): Back button/gesture
  - Native Phone Dialer: Tap "Gọi Ngay"
  - Native Email App: Tap "Gửi Email"
  - Native Share Sheet: Tap "Chia Sẻ"
  - (Optional) Fullscreen Image Gallery: Tap photo

## States

### Default State
- Hiển thị full thông tin coach (gallery, info, certifications, bio, price, reviews, contact)
- Sticky bottom bar enabled/disabled dựa trên phone/email availability

### Loading State
- Skeleton loaders cho:
  - Photo gallery
  - Basic info card
  - Bio
  - Reviews
- Bottom bar disabled

### Error State (Coach Not Found)
- Empty state:
  - Icon error
  - Message: "Không tìm thấy thông tin coach"
  - "Quay Lại" button → Navigate back to Screen 18

### Empty Reviews State
- Reviews section hiển thị:
  - "Chưa có đánh giá"
  - Icon + text gợi ý "Hãy là người đầu tiên đánh giá coach này"

### Coach Unavailable State (Optional)
- Banner (top):
  - Warning icon + text: "Coach hiện không nhận học viên mới"
  - Bottom bar disabled (hoặc chỉ enable "Chia Sẻ")

### No Contact Info State
- Contact section hiển thị:
  - "Thông tin liên hệ chưa được cập nhật"
  - Only "Chia Sẻ" button enabled

## Ghi chú

### UX Considerations
1. **Photo Gallery**: Ưu tiên ảnh chất lượng cao, aspect ratio consistent (16:9 hoặc 4:3)
2. **Reviews Expansion**: Expand inline (bottom sheet) thay vì navigate screen riêng để giữ context
3. **Contact Actions**: Direct actions (phone/email) ưu tiên cao hơn booking flow phức tạp
4. **Share Functionality**: Deeplink text giúp viral marketing + easy referral
5. **Certifications**: Icons rõ ràng (PTR, USAPA logos) để build trust
6. **Price Transparency**: Hiển thị range + note "Liên hệ để xác nhận" để tránh miscommunication

### Validations
- **Coach ID**: Phải valid (nếu không → Error state)
- **Phone Number**: Format validate nếu có (e.g., 10 digits)
- **Email**: Format validate nếu có

### Error Handling
- **API Error**: Toast "Không thể tải thông tin coach" + Retry button
- **Network Error**: Offline banner + Cache data (nếu có)
- **Invalid Phone/Email**: Toast "Số điện thoại/email không hợp lệ"

### Accessibility
- **Images**: Alt text cho screen readers
- **Buttons**: Clear labels (không chỉ icon)
- **Font Size**: Scalable cho accessibility settings

### Technical Notes
- **Deep Linking**: Format `pickleballapp://coach/{coach_id}`
- **Share Text**: "Xem coach {Name} trên PickleBall App: {deeplink}"
- **Native Integrations**:
  - Phone: `tel:{phone_number}`
  - Email: `mailto:{email}`
  - Share: `Share.share({ message: ... })`
