# Court Detail Screen

## Screen Overview
Màn hình chi tiết sân pickleball hiển thị đầy đủ thông tin về sân bao gồm ảnh, thông tin cơ bản, tiện ích, đánh giá từ người dùng, và vị trí. Người dùng có thể xem thông tin chi tiết để đưa ra quyết định đặt sân hoặc lưu sân yêu thích.

## Mục đích
- Cung cấp đầy đủ thông tin về sân để người dùng đưa ra quyết định đặt sân
- Hiển thị đánh giá từ người dùng khác để tham khảo chất lượng
- Cung cấp hướng dẫn đến sân và các thông tin liên hệ
- Kích thích hành động đặt sân với CTA rõ ràng

## Các Section/Components Chính

### 1. Image Gallery
**Mô tả:**
- Full-width swipeable gallery (PageView/Carousel) ở top screen
- Aspect ratio: 16:9
- Dots indicator (pagination dots) ở bottom gallery để chỉ vị trí ảnh hiện tại
- Counter overlay ở top-right: "X/Y" (e.g., "3/8")
- Back button (arrow left) ở top-left với backdrop blur/shadow để nổi bật
- Favorite button (heart icon) ở top-right với backdrop blur/shadow

**Tương tác:**
- Swipe left/right → Chuyển qua ảnh tiếp theo/trước
- Tap ảnh → Full screen image viewer với zoom/pinch support
- Tap back button → Navigate back to Court Discovery
- Tap favorite button → Toggle favorite status (heart filled/outline)
  - Add to favorites → Show toast "Đã lưu vào yêu thích"
  - Remove from favorites → Show toast "Đã bỏ yêu thích"

**Validations:**
- Nếu không có ảnh → Hiển thị placeholder image (court icon)
- Minimum 1 ảnh (yêu cầu từ admin khi tạo court)

**Hiệu ứng:**
- Swipe: Smooth horizontal scroll animation
- Dots indicator: Active dot scale + color change
- Favorite button tap: Heart scale + color animation (red when active)
- Full screen transition: Fade + scale animation

---

### 2. Court Header Section
**Mô tả:**
- **Court Name**: Large, bold text (28pt), 2 lines max with ellipsis
- **Partner Badge** (nếu is_partner = true):
  - Badge với icon verified + text "Đối Tác"
  - Background: gradient gold/premium color
  - Hiển thị bên cạnh tên sân
- **Rating Row**:
  - Star rating: 5 stars (filled/half/empty) based on average rating
  - Rating number: "4.5" bold text
  - Review count: "(234 đánh giá)" gray text
  - Tap → Scroll to Reviews Section
- **Address Row**:
  - Location icon (pin)
  - Full address text (multiline if needed)
  - Distance chip: "2.3 km" với location arrow icon
- **Get Directions Link**:
  - Link/button "Chỉ đường" với arrow right icon
  - Blue/accent color

**Tương tác:**
- Tap rating row → Auto-scroll to Reviews Section (smooth scroll)
- Tap "Chỉ đường" → Open Google Maps app với destination = court location
  - iOS: Use Apple Maps as fallback
  - Android: Use Google Maps
  - If no map app → Show error toast "Không có ứng dụng bản đồ"

**Hiệu ứng:**
- "Chỉ đường" link: Underline on press
- Partner badge: Subtle shimmer/shine animation on mount
- Stars: Animate fill from left to right on mount (0.3s delay)

---

### 3. Quick Info Cards
**Mô tả:**
- Horizontal scrollable row với 3 info cards
- Mỗi card có:
  - Icon ở top (currency, court type, clock)
  - Label (gray, small text)
  - Value (bold, large text)

**Card 1: Price**
- Icon: Currency symbol (₫)
- Label: "Giá thuê"
- Value: "200k VND/giờ"
- Highlight với accent background color

**Card 2: Court Type**
- Icon: Roof (indoor) hoặc Sun (outdoor)
- Label: "Loại sân"
- Value: "Indoor" hoặc "Outdoor"

**Card 3: Operating Hours**
- Icon: Clock
- Label: "Giờ hoạt động"
- Value: "6:00 - 22:00"
- Show current status:
  - Green dot + "Đang mở cửa" (nếu hiện tại trong giờ hoạt động)
  - Red dot + "Đã đóng cửa" (nếu ngoài giờ)

**Tương tác:**
- Cards không tappable, chỉ hiển thị thông tin
- Horizontal scroll nếu màn hình nhỏ

**Hiệu ứng:**
- Cards slide in from bottom on mount (staggered 0.1s delay between cards)

---

### 4. Amenities Section
**Mô tả:**
- Section header: "Tiện ích" (bold, 20pt)
- Grid layout 2 columns với icon + label
- Common amenities:
  - 🅿️ Bãi đỗ xe (Parking)
  - 🚿 Phòng tắm (Showers)
  - 🔒 Tủ khóa (Locker Rooms)
  - 🏸 Thuê dụng cụ (Equipment Rental)
  - 📶 WiFi miễn phí (Free WiFi)
  - ☕ Căn tin (Cafe/Canteen)
  - 🏪 Cửa hàng (Pro Shop)
  - 👨‍🏫 HLV (Coaching Available)

**Tương tác:**
- Static display, không có interaction
- Gray out amenities không có (reduce opacity 40%)

**Hiệu ứng:**
- Available amenities: Normal opacity với checkmark icon
- Unavailable amenities: Gray + cross icon (hoặc không hiển thị)

---

### 5. Description Section
**Mô tả:**
- Section header: "Giới thiệu" (bold, 20pt)
- Description text: Multiline paragraph
- Initially show 3 lines only
- "Đọc thêm" link ở cuối nếu text > 3 lines

**Tương tác:**
- Tap "Đọc thêm" → Expand to show full text
- Sau khi expand → "Thu gọn" link xuất hiện
- Tap "Thu gọn" → Collapse back to 3 lines

**States:**
- Collapsed: 3 lines + "Đọc thêm"
- Expanded: Full text + "Thu gọn"
- No truncation needed: Show full text without "Đọc thêm"

**Hiệu ứng:**
- Expand/collapse: Height animation (300ms ease)
- "Đọc thêm" link: Color change on press

---

### 6. Reviews Section
**Mô tả:**
- Section header: "Đánh giá" (bold, 20pt) + "Xem tất cả" link (right)
- **Rating Breakdown** (nếu có reviews):
  - Average rating: Large number "4.5" + stars
  - Star distribution: Horizontal progress bars cho 5★, 4★, 3★, 2★, 1★
    - Label: "5★" + progress bar + percentage "60%"
    - Progress bar color: Yellow/gold gradient
- **Recent Reviews List**:
  - Show top 3 most recent reviews
  - Each review card:
    - User avatar (circular, 40pt) + name + verified badge (nếu có)
    - Rating stars (5 stars)
    - Review date: "2 tuần trước"
    - Review text: 3 lines max with "..." truncation
    - Review images (nếu có): Horizontal scrollable thumbnails (60x60pt)
    - Helpful count: "👍 Hữu ích (12)" (gray text)

**No Reviews State:**
- Placeholder illustration (empty reviews)
- Text: "Chưa có đánh giá"
- Sub-text: "Hãy là người đầu tiên đánh giá sân này sau khi chơi!"

**Tương tác:**
- Tap "Xem tất cả" → Navigate to All Reviews Screen (F09)
- Tap review card → Expand to full review (modal or navigate)
- Tap review image thumbnail → Open image gallery (fullscreen)
- Tap "Hữu ích" → Mark review as helpful (thumbs up)
  - Toggle: Tap lại để un-mark
  - Show animation khi mark

**Hiệu ứng:**
- Progress bars: Animate width from 0 to value on mount
- Review cards: Fade in staggered (0.1s delay)
- "Hữu ích" button: Scale animation on tap

---

### 7. Location Section
**Mô tả:**
- Section header: "Vị trí" (bold, 20pt)
- **Mini Map Preview**:
  - Static map image (Google Maps Static API) hoặc interactive map snippet
  - Height: 200pt
  - Show marker at court location
  - Rounded corners (16pt)
- **Full Address**: Text below map
- **Get Directions Button**:
  - Full width button với icon navigate
  - Text: "Chỉ đường" hoặc "Mở trong Google Maps"
  - Secondary style (outline)

**Tương tác:**
- Tap map preview → Open full interactive map (modal hoặc Google Maps app)
- Tap "Chỉ đường" button → Open Google Maps app với directions

**Hiệu ứng:**
- Map preview: Fade in on mount
- Button press: Scale + ripple effect

---

### 8. CTA Section (Sticky Bottom Bar)
**Mô tả:**
- Fixed position bottom bar với safe area padding
- Background: Solid white/dark với subtle top shadow
- Layout: Horizontal row
- **Left side**:
  - Price info: "200k VND/giờ" (bold, accent color)
  - Sub-text: "Giá có thể thay đổi theo khung giờ" (small, gray)
- **Right side**:
  - Primary button: "Đặt Sân" (full height, accent color)
  - Share icon button (secondary)
  - Favorite icon button (heart, secondary)

**Tương tác:**
- Tap "Đặt Sân" → Navigate to Court Booking Screen (12-court-booking.md) với court pre-filled
- Tap Share button → Open native share sheet
  - Share content: Court name + address + app deep link
- Tap Favorite button → Toggle favorite (same as gallery favorite)
  - Synced với favorite button in gallery

**States:**
- **Court Available**: "Đặt Sân" button enabled, accent color
- **Court Closed**: "Đặt Sân" button disabled, gray color
  - Show "Sân đang đóng cửa" text thay vì giá
  - Sub-text: "Mở cửa lúc 6:00 sáng mai"
- **Court Temporarily Unavailable**: "Đặt Sân" button disabled
  - Show "Sân tạm ngưng hoạt động"

**Hiệu ứng:**
- Sticky bar: Slide up from bottom on mount
- Button press: Scale + ripple
- Share sheet: Native iOS/Android animation
- Favorite heart: Scale + color animation (red when favorited)

---

## Navigation

**Đến screen này từ:**
- Court Discovery Screen (09-court-discovery.md) → Tap court card (List View)
- Court Discovery Screen (09-court-discovery.md) → Tap court marker/mini card (Map View)
- Search Results → Tap court result
- Booking History (16-booking-history.md) → Tap "Xem sân" from booking detail
- Deep link: `/courts/:courtId`

**Từ screen này đến:**
- Court Booking Screen (12-court-booking.md) → Tap "Đặt Sân" button
- All Reviews Screen (phần của F09) → Tap "Xem tất cả" in Reviews Section
- Full Screen Image Gallery (modal) → Tap gallery image
- Google Maps App → Tap "Chỉ đường"
- Native Share Sheet → Tap Share button
- Back to Court Discovery → Tap back button

---

## States

### Default State
- Full court information loaded và displayed
- All images loaded in gallery
- Reviews section shows top 3 reviews
- "Đặt Sân" button enabled (nếu court available)
- Operating hours hiển thị status hiện tại (open/closed)

### Loading State
- Skeleton layout với placeholders:
  - Gallery: Gray rectangle với shimmer
  - Header: Skeleton text lines
  - Quick info cards: Skeleton cards
  - Amenities: Skeleton icon grid
  - Description: Skeleton paragraph (3-4 lines)
  - Reviews: Skeleton review cards (3 cards)
  - Location: Gray map placeholder
- Disable all interactions
- Show loading spinner in header nếu cần

### Error State
- Failed to load court → Show error message
- Icon: Error/warning icon
- Title: "Không thể tải thông tin sân"
- Message: "Đã có lỗi xảy ra. Vui lòng thử lại."
- Actions:
  - "Thử lại" button → Retry fetch
  - "Quay lại" button → Navigate back to Court Discovery

### Court Closed State
- Full information displayed
- "Đặt Sán" button disabled và gray out
- Quick info card hiển thị: Red dot + "Đã đóng cửa"
- Bottom CTA shows: "Sân đang đóng cửa - Mở cửa lúc 6:00 sáng mai"
- User có thể xem thông tin nhưng không thể đặt

### No Reviews State
- Reviews section hiển thị empty state:
  - Illustration: Empty review icon
  - Text: "Chưa có đánh giá"
  - Sub-text: "Hãy là người đầu tiên đánh giá sân này sau khi chơi!"
- Rating breakdown KHÔNG hiển thị
- "Xem tất cả" link KHÔNG hiển thị

---

## Edge Cases

### 1. Court Closed/Unavailable
**Scenario:** Court đang trong giờ đóng cửa hoặc tạm ngưng hoạt động
**Behavior:**
- Dim "Đặt Sân" button (disabled, gray)
- Show message: "Sân đang đóng cửa" hoặc "Sân tạm ngưng hoạt động"
- Hiển thị next opening time: "Mở cửa lúc 6:00 sáng mai"
- User vẫn có thể xem thông tin, reviews, save favorite

### 2. No Images Available
**Scenario:** Admin chưa upload ảnh cho sân
**Behavior:**
- Show placeholder image (court icon or generic pickleball court illustration)
- Gallery chỉ có 1 ảnh placeholder
- Dots indicator không hiển thị
- Counter: "1/1"

### 3. Court Deleted/Removed
**Scenario:** Court đã bị xóa khỏi hệ thống (accessed via old deep link)
**Behavior:**
- Show error state: "Sân này không còn tồn tại"
- Message: "Sân có thể đã ngưng hoạt động hoặc bị gỡ khỏi hệ thống"
- Action: "Tìm sân khác" button → Navigate to Court Discovery

### 4. No Reviews Yet
**Scenario:** Court mới, chưa có reviews
**Behavior:**
- Rating header: "Chưa có đánh giá" thay vì stars
- Rating breakdown: KHÔNG hiển thị
- Show empty state với encourage message
- "Xem tất cả" link: KHÔNG hiển thị

### 5. Very Long Description
**Scenario:** Description text > 10 lines
**Behavior:**
- Initially collapsed to 3 lines
- "Đọc thêm" link visible
- Tap "Đọc thêm" → Expand full text
- "Thu gọn" link appears sau khi expand

### 6. Price Varies by Time Slot
**Scenario:** Court có giá khác nhau theo khung giờ (peak/off-peak)
**Behavior:**
- Show price range: "150k - 300k VND/giờ"
- Note: "(Tùy khung giờ)"
- In booking screen, show exact price per slot

### 7. Location Permission Denied
**Scenario:** User denied location permission
**Behavior:**
- Distance chip: KHÔNG hiển thị (hoặc show "-- km")
- Mini map preview: Show static map WITHOUT user location marker
- "Chỉ đường" vẫn hoạt động (open Google Maps với destination only)

### 8. Google Maps Unavailable
**Scenario:** Device không có Google Maps app hoặc Maps API failed
**Behavior:**
- Mini map preview: Show fallback với address text only
- "Chỉ đường" button:
  - iOS: Open Apple Maps
  - Android: Show error "Vui lòng cài đặt Google Maps"

### 9. Image Load Failed
**Scenario:** Một hoặc nhiều ảnh trong gallery không load được
**Behavior:**
- Show placeholder cho ảnh failed
- Gallery vẫn swipeable với ảnh còn lại
- Counter: Update based on loaded images (e.g., "3/5" nếu 2 ảnh failed)

### 10. Review Images Load Failed
**Scenario:** Review images không load được
**Behavior:**
- Show gray placeholder với icon image broken
- User không thể tap vào placeholder
- Review text vẫn hiển thị bình thường

### 11. Very New Court (Opened Today)
**Scenario:** Court mới mở, chưa có lượt đặt hoặc reviews
**Behavior:**
- Show "New" badge bên cạnh court name
- Reviews section: Empty state
- Consider showing promotional message: "Đặt ngay để nhận ưu đãi khai trương!" (nếu có promo)

### 12. Court at Maximum Distance
**Scenario:** Court nằm rất xa user location (> 50km)
**Behavior:**
- Distance chip: Show exact distance "52.3 km"
- Consider showing warning: "Sân khá xa vị trí của bạn"
- "Chỉ đường" vẫn hoạt động bình thường

---

## Ghi chú

### UX Considerations:
- **Hero Gallery First**: Lead với visual (ảnh đẹp) để tạo ấn tượng ban đầu
- **Sticky CTA**: "Đặt Sân" button luôn visible (sticky bottom) để giảm friction
- **Progressive Disclosure**: Description collapsed by default để tránh overwhelming
- **Social Proof**: Reviews section nổi bật để xây dựng trust
- **Quick Info Cards**: Highlight 3 thông tin quan trọng nhất (giá, loại sân, giờ hoạt động)
- **Favorite Synced**: Favorite button ở 2 vị trí (gallery + bottom CTA) phải synced
- **Clear Directions CTA**: Multiple entry points để "Chỉ đường" (address row + location section)

### Performance:
- **Image Lazy Loading**: Gallery images load on demand (swipe)
- **Static Map Preview**: Use Static Maps API thay vì interactive map để tăng performance
- **Review Pagination**: Show top 3 reviews only, full list in separate screen
- **Cache Court Data**: Cache 15 minutes để giảm API calls
- **Optimistic Favorite**: Update favorite UI ngay, sync to server in background

### Accessibility:
- **Gallery**:
  - VoiceOver: "Ảnh X trong Y. Chạm đúp để xem toàn màn hình"
  - Swipe accessible: Support VoiceOver swipe gestures
- **Rating Stars**: Announce "Đánh giá 4.5 trên 5 sao từ 234 đánh giá"
- **Amenities Icons**: Each icon has accessible label (e.g., "Bãi đỗ xe có sẵn")
- **"Đặt Sân" Button**:
  - Enabled: "Đặt sân. Nút. Chạm đúp để kích hoạt"
  - Disabled: "Sân đang đóng cửa. Mở cửa lúc 6 giờ sáng mai"
- **Map**: VoiceOver label "Bản đồ hiển thị vị trí sân"

### Analytics Events:
- `court_detail_view` (court_id, source: list/map/search/deeplink)
- `court_gallery_swipe` (court_id, image_index)
- `court_gallery_fullscreen` (court_id)
- `court_favorite_toggle` (court_id, action: add/remove)
- `court_share` (court_id)
- `court_get_directions` (court_id)
- `court_book_tap` (court_id)
- `court_reviews_view_all` (court_id)
- `court_review_helpful` (review_id)
- `court_description_expand` (court_id)

### Validation Rules:
- Court ID: Must be valid UUID
- Images: Array với min 1 ảnh (hoặc show placeholder)
- Price: Must be > 0, format with "k VND/giờ"
- Rating: 0.0 - 5.0 (show 1 decimal place)
- Operating hours: Validate format "HH:MM - HH:MM"
- Address: Required, multiline support

### Business Logic:
- **Partner Badge Priority**: Hiển thị nổi bật để promote partnership
- **Review Threshold**: Chỉ show rating nếu >= 3 reviews (avoid misleading single review)
- **Operating Hours**: Tính toán real-time open/closed status based on current time
- **Favorite Persistence**: Save to user profile, sync across devices
- **Price Display**:
  - Fixed price → "200k VND/giờ"
  - Variable price → "150k - 300k VND/giờ (Tùy khung giờ)"
- **Distance Calculation**: Use Haversine formula based on GPS coordinates

### Security:
- **Deep Link Validation**: Validate court_id parameter để tránh injection
- **Image URLs**: Validate và sanitize URLs trước khi load
- **Review Content**: Sanitize review text để tránh XSS
- **Phone Numbers**: Format và validate trước khi tap-to-call

### API Endpoints (for reference):
- `GET /courts/:id` - Fetch court details
- `GET /courts/:id/reviews` - Fetch court reviews (paginated)
- `POST /courts/:id/favorite` - Add to favorites
- `DELETE /courts/:id/favorite` - Remove from favorites
- `POST /reviews/:id/helpful` - Mark review as helpful
