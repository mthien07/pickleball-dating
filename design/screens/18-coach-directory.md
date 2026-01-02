# Coach Directory

## Screen Overview
Danh sách huấn luyện viên pickleball với thông tin cơ bản, filter/sort options và tính năng search. User có thể xem chi tiết HLV và liên hệ trực tiếp qua phone (không booking qua app).

## Mục đích
Giúp người dùng tìm kiếm và kết nối với HLV pickleball phù hợp theo khu vực, ngân sách và nhu cầu học tập.

---

## Các Section/Components Chính

### 1. Header
- **Title**: "Huấn Luyện Viên" (center hoặc left aligned)
- **Back Button**: Quay về màn hình trước
- **Search Icon**: Tap để mở search bar (expand animation)

**Tương tác**:
- Tap search icon → Search bar expand từ phải sang trái
- User nhập tên HLV → Filter realtime theo tên

### 2. Search Bar (Expandable)
- **Placeholder**: "Tìm HLV theo tên..."
- **Clear Button**: X icon (hiện khi có text)
- **Search Icon**: Bên trái input

**States**:
- Collapsed: Chỉ hiện search icon ở header
- Expanded: Full width input field
- Active: Border highlight khi focus

**Tương tác**:
- Tap vào search icon → Expand search bar + auto focus
- Nhập text → Filter danh sách realtime (debounce 300ms)
- Tap clear (X) → Xóa text + reset filter
- Tap outside → Collapse search bar nếu empty

### 3. Filter & Sort Section
**Layout**: Horizontal scroll pills

**Sort Options** (Radio select):
- "Rating cao nhất" (default)
- "Giá thấp nhất"
- "Kinh nghiệm nhiều nhất"

**Filter Options** (Multi-select):
- **Khu vực**: Dropdown với checkboxes (Quận 1, Quận 7, Bình Thạnh, v.v.)
- **Giá**: Range slider (100k - 1000k/giờ)
- **Chứng chỉ**: Checkboxes (PTR, USAPA Lv1, Lv2, Lv3, IPTPA)

**UI**:
- "Lọc & Sắp xếp" button với badge count (số filter đang active)
- Tap button → Bottom sheet với filter options
- Bottom sheet có:
  - Header: "Lọc & Sắp xếp" + Close icon
  - Body: Scroll view với filter sections
  - Footer: "Xóa bộ lọc" (text button) + "Áp dụng (X HLV)" (primary button)

**Tương tác**:
- Tap "Lọc & Sắp xếp" → Open bottom sheet
- Chọn filters → Preview count update realtime
- Tap "Áp dụng" → Close sheet + apply filters + scroll to top
- Tap "Xóa bộ lọc" → Reset tất cả filters

**States**:
- Badge count: Số filters active (không count sort)
- Preview count: "Tìm thấy X HLV"

### 4. Coach List
**Layout**: Vertical scroll list với card items

**Coach Card Design**:
```
┌─────────────────────────────────────┐
│ ┌────┐                              │
│ │    │  Nguyễn Văn A • 35 tuổi     │
│ │Ảnh │  ⭐ 4.8 (24 reviews)         │
│ │    │  📜 PTR Certified • USAPA Lv3│
│ └────┘  💼 8 năm kinh nghiệm        │
│         💰 300k - 500k/giờ          │
│         📍 Quận 1, Quận 3           │
│         [Xem chi tiết →]            │
└─────────────────────────────────────┘
```

**Elements trong mỗi card**:
- **Avatar**: Circular, 80x80px, left aligned
- **Name + Age**: Tên HLV • Tuổi (bold, 16px)
- **Rating**: Stars icon + số rating + (X reviews) - orange color
- **Certification Badges**: Scroll horizontal pills (small), gray background
- **Experience**: Icon + "X năm kinh nghiệm"
- **Price Range**: Icon + "XXXk - XXXk/giờ" (hoặc fixed price nếu chỉ 1 mức)
- **Areas**: Icon + "Khu vực 1, Khu vực 2" (truncate nếu quá dài)
- **CTA Button**: "Xem chi tiết" (outline button hoặc text button)

**Special Badges** (overlay trên avatar):
- **"Mới"**: Badge nhỏ góc trên phải avatar (nếu coach mới < 3 tháng)
- **"Nổi bật"**: Gold star icon góc trên phải (nếu featured by admin)

**Tương tác**:
- Tap anywhere on card → Navigate to 19-coach-detail
- Cards có subtle shadow + slight scale animation on press

**States**:
- Normal: White background, border subtle
- Pressed: Scale 0.98 + slight shadow increase
- Unavailable coach (is_available: false): Opacity 0.6 + "Tạm ngưng nhận học viên" tag

### 5. Loading State
**Skeleton Cards** (3-4 items):
- Shimmer animation
- Same layout as coach card
- Gray placeholders cho avatar, text lines, badges

**Pull to Refresh**:
- Standard pull-down gesture
- Spinner indicator
- Refresh danh sách coaches

### 6. Empty States

**Case 1: No coaches in database** (First time app launch, no data)
- Illustration: Coach whistle icon
- Title: "Chưa có HLV nào"
- Subtitle: "Danh sách HLV sẽ được cập nhật sớm"
- CTA: "Quay lại" button

**Case 2: Filter returns empty**
- Illustration: Filter icon với sad face
- Title: "Không tìm thấy HLV"
- Subtitle: "Thử mở rộng bộ lọc hoặc tìm kiếm khu vực lân cận"
- CTA: "Xóa bộ lọc" button (primary)

**Case 3: Search returns empty**
- Illustration: Magnifying glass
- Title: "Không tìm thấy 'Tên HLV'"
- Subtitle: "Kiểm tra lại từ khóa hoặc thử tên khác"
- CTA: "Xóa tìm kiếm" button

### 7. Floating Action Button (Optional)
- **Icon**: Info icon
- **Position**: Bottom right
- **Action**: Tap → Show tooltip "Liên hệ trực tiếp với HLV qua số điện thoại"
- **Fade out**: Khi scroll down, fade in khi scroll up

---

## Navigation

### Đến screen này từ:
- **Main Tab Bar**: "HLV" tab (nếu có dedicated tab)
- **Home Screen**: "Tìm HLV" card/button
- **Settings**: "Huấn luyện viên" menu item
- **Profile**: "Cải thiện kỹ năng" suggestion

### Từ screen này đến:
- **19-coach-detail**: Tap vào coach card
- **Back**: Quay về màn hình trước (navigation stack)

---

## States

### Default State
- Danh sách coaches sorted by rating (cao nhất trước)
- No filters active
- Search collapsed
- Loading indicator nếu first load

### Loading State
- **First Load**: Skeleton cards (3-4 items)
- **Pull to Refresh**: Spinner ở top, content vẫn visible
- **Pagination Load More**: Spinner ở bottom khi scroll to end (nếu có > 20 coaches)

### Filtered State
- Badge count trên "Lọc & Sắp xếp" button
- Danh sách update theo filters
- Scroll to top sau khi apply filters

### Search Active State
- Search bar expanded
- Danh sách filter theo search query
- Empty state nếu không tìm thấy

### Error State
- **Network Error**: Toast "Không thể tải danh sách HLV. Vui lòng thử lại"
- **Retry Button**: "Thử lại" button trong empty state
- **Cached Data**: Hiện cached coaches nếu có + banner "Dữ liệu có thể không mới nhất"

---

## Edge Cases

### 1. Coach mới (chưa có reviews)
- Hiển thị "Chưa có đánh giá" thay vì rating
- Badge "Mới" trên avatar

### 2. Coach có nhiều khu vực hoạt động (> 3 areas)
- Hiển thị 2 khu vực đầu + "+X khu vực"
- Example: "Quận 1, Quận 3 +2 khu vực"

### 3. Coach có giá cố định (không range)
- Hiển thị: "500k/giờ" (không dùng range format)

### 4. Coach tạm ngưng nhận học viên (is_available: false)
- Card opacity 60%
- Tag "Tạm ngưng" màu gray
- Vẫn cho phép xem detail nhưng không gọi được

### 5. Coach profile thiếu thông tin
- Hiển thị các field có data
- Nếu thiếu avatar → Placeholder initials (tên viết tắt)
- Nếu thiếu price → "Liên hệ để biết giá"

### 6. Danh sách quá dài (> 50 coaches)
- Implement pagination hoặc infinite scroll
- Load thêm 20 coaches khi scroll gần cuối
- "Đang tải thêm..." spinner ở bottom

### 7. User location không bật
- Không filter theo khoảng cách
- Hiển thị tất cả coaches sorted by rating
- Optional banner: "Bật vị trí để tìm HLV gần bạn"

### 8. Slow network
- Timeout after 10s → Show error state
- Cached data fallback nếu có
- Retry mechanism

---

## Validations

### Search Input
- Minimum 2 ký tự để trigger search
- Debounce 300ms để tránh search liên tục
- Trim whitespace
- Case-insensitive search

### Filter Values
- Price range: Min 100k, Max 1000k, step 50k
- Areas: At least 1 area selected (hoặc all areas nếu không chọn)
- Certification: Multiple select allowed

### Data Validation
- Coach card chỉ render nếu có id, name, phone
- Avatar fallback nếu avatar_url invalid
- Rating phải từ 0-5, hiển thị 1 decimal

---

## Animations & Interactions

### Micro-interactions
1. **Card Press**: Scale 0.98 + shadow increase (100ms ease-out)
2. **Search Expand**: Width animation 300ms ease-in-out
3. **Filter Badge**: Bounce animation khi update count
4. **Pull to Refresh**: Standard spring animation
5. **Bottom Sheet**: Slide up from bottom (300ms ease-out)
6. **Loading Skeleton**: Shimmer animation left-to-right loop

### Transitions
- **To Detail**: Shared element transition cho coach avatar (nếu platform support)
- **Filter Apply**: Fade out old list + fade in new list (200ms)

### Haptics
- Light haptic on card tap
- Success haptic on filter apply

---

## Accessibility

### Screen Reader
- "Danh sách huấn luyện viên" heading
- Each card: "HLV [Name], [Age] tuổi, rating [X] sao, [Y] đánh giá, giá [price range], [areas]. Nhấn để xem chi tiết"
- Search: "Tìm kiếm huấn luyên viên theo tên"
- Filter button: "Lọc và sắp xếp, [X] bộ lọc đang áp dụng"

### Keyboard Navigation
- Search input focusable
- Filter options keyboard navigable
- Tab order: Search → Filter → Coach cards (top to bottom)

### Color Contrast
- Text on white background: WCAG AA compliant
- Rating stars: Orange #FF9500 (sufficient contrast)
- Badges: Dark text on light background

---

## Performance Considerations

### Optimization
- **List Virtualization**: Chỉ render visible cards + buffer (FlatList với windowSize)
- **Image Optimization**: Lazy load avatars, cache với 7 days TTL
- **Search Debounce**: 300ms để reduce re-renders
- **Filter Memoization**: Cache filtered results khi filters không đổi
- **Pagination**: Load 20 coaches per page

### Memory
- Release images off-screen (FlatList removeClippedSubviews)
- Clear search cache khi unmount

---

## Ghi chú

### UX Considerations
1. **Trust Signals**: Rating + review count + certification badges giúp user tin tưởng
2. **Clarity**: Giá và khu vực phải rõ ràng ngay từ card (no hidden info)
3. **Simplicity**: Không quá nhiều filter options để tránh overwhelm (chỉ 3 filters chính)
4. **Contact Clarity**: Screen này chỉ hiển thị info, contact ở detail screen

### Business Logic
- Coaches managed by admin (không có self-registration trong MVP)
- Rating từ admin-managed reviews (users không thể review trong MVP)
- No booking/payment qua app → Contact trực tiếp qua phone
- Featured coaches có thể là paid placement (future monetization)

### Data Source
- Coaches data từ Supabase coaches table
- Cache locally với stale-while-revalidate strategy
- Pull to refresh để force fresh data

### Future Enhancements (Out of scope MVP)
- Map view để xem coaches gần user
- "Yêu thích" để save coaches
- Compare 2-3 coaches side-by-side
- Video intro của coaches
- Booking slots calendar preview

---

## Dependencies

### Data
- **coaches** table từ Supabase
- **coach_reviews** table (for rating calculation)
- User location (optional, for distance sorting)

### APIs
- `GET /coaches?area={area}&price_min={min}&price_max={max}&sort={sort}`
- `GET /coaches/search?q={query}`

### Libraries
- React Native Reanimated (animations)
- Bottom Sheet library (filter UI)
- Fast Image (avatar caching)

---

*Screen Design Complete*
