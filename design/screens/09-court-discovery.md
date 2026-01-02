# Court Discovery Screen

## Screen Overview
Main screen cho phép người dùng tìm kiếm và khám phá các sân pickleball gần vị trí hiện tại. Hỗ trợ 2 chế độ xem (List View và Map View), tìm kiếm nâng cao, và filter theo nhiều tiêu chí.

## Mục đích
- Giúp người dùng dễ dàng tìm sân pickleball phù hợp với nhu cầu
- Hiển thị thông tin sân rõ ràng (giá, khoảng cách, rating) để ra quyết định nhanh
- Hỗ trợ nhiều cách tìm kiếm: dạng danh sách, bản đồ, tìm kiếm text, filter

## Các Section/Components Chính

### 1. Top Navigation Bar
**Mô tả:**
- Fixed header với title "Sân Pickleball" (center)
- View toggle: Segmented control 2 tabs "Danh sách" / "Bản đồ" (bên phải title)
- Background: Solid color with shadow

**Tương tác:**
- Tap "Danh sách" → Switch to List View
- Tap "Bản đồ" → Switch to Map View
- View preference được lưu lại (remember last used)

**Hiệu ứng:**
- Smooth transition khi toggle giữa views
- Tab active: bold text + indicator underline
- Tab inactive: normal weight text

---

### 2. Search & Filter Bar
**Mô tả:**
- Search input field với icon search (magnifying glass) bên trái
- Placeholder: "Tìm sân hoặc địa chỉ..."
- Filter button ở bên phải với badge count (nếu có filter active)
- Nằm dưới navigation bar, sticky khi scroll

**Tương tác:**
- Tap search field → Navigate to Search Screen (modal)
- Tap Filter icon → Open Filter Bottom Sheet
- Badge hiển thị số filter đang active (ví dụ: "3")

**Validations:**
- Search query min 2 ký tự để trigger search

**Hiệu ứng:**
- Focus effect: Border color change, subtle shadow
- Filter badge: Pulsing animation khi mới apply

---

### 3. Sort Dropdown (List View only)
**Mô tả:**
- Dropdown button "Sắp xếp: [Option]" nằm dưới search bar
- Options: "Khoảng cách", "Đánh giá", "Giá thấp đến cao", "Giá cao đến thấp"
- Current sort option hiển thị trên button

**Tương tác:**
- Tap button → Show dropdown menu với options
- Select option → Re-sort list và update button label
- Default: Sort by "Khoảng cách"

**Hiệu ứng:**
- Dropdown menu: Slide down animation
- List re-ordering: Fade + slide animation

---

### 4. List View - Court Cards
**Mô tả:**
- Scrollable list of court cards
- Mỗi card có layout horizontal:
  - **Left**: Court image (16:9 aspect ratio, rounded corners)
  - **Right**: Court info stack:
    - Court name (bold, 1 line, ellipsis)
    - Address snippet (2 lines max, gray text, smaller)
    - Distance chip (icon + "X.X km")
    - Rating row: Star icons (filled/half/empty) + count "(XX)"
    - Price: "XXXk VND/giờ" (bold, accent color)
    - "Partner" badge nếu `is_partner = true` (top-right overlay on image)
  - **Quick Action**: "Đặt ngay" button (bottom right)

**Tương tác:**
- Tap card (anywhere except "Đặt ngay") → Navigate to Court Detail Screen
- Tap "Đặt ngay" → Navigate to Court Booking Screen (pre-fill court)
- Pull down → Refresh list (re-fetch courts with current filters)
- Scroll to bottom → Load more courts (pagination 20 items)

**States:**
- Loading: Skeleton cards (shimmer effect)
- Empty: "Không tìm thấy sân. Thử điều chỉnh bộ lọc?"
- Error: "Không thể tải danh sách sân" + Retry button

**Hiệu ứng:**
- Card press: Scale down 0.98 + shadow increase
- Pull to refresh: Standard spinner animation
- Load more: Bottom loading indicator

---

### 5. Map View - Google Maps
**Mô tả:**
- Full screen Google Maps component
- **User location**: Blue pulsing dot
- **Court markers**: Custom pickleball pin icons
  - Partner courts: Green pin
  - Regular courts: Orange pin
  - Cluster markers khi zoom out (show count)
- **Mini card preview** (bottom sheet): Xuất hiện khi tap marker
  - Court name, rating stars, price
  - Arrow icon ở right edge (chỉ navigation)
- **"My Location" button**: Floating bottom-right (above mini card)
- **Map controls**: Zoom in/out (standard Google Maps)

**Tương tác:**
- Pan/Zoom map → Load courts in new viewport (debounced)
- Tap court marker → Show mini card preview (bottom sheet)
- Tap mini card → Navigate to Court Detail Screen
- Tap elsewhere on map → Close mini card
- Tap "My Location" button → Re-center map on user location (animated)
- Long press marker → Show quick action menu (Directions, Book, Details)

**States:**
- Loading: Map with loading overlay
- Location permission denied: Show modal with explanation + "Open Settings" button
- Map load error: Fallback message "Bản đồ không khả dụng. Sử dụng chế độ danh sách."

**Hiệu ứng:**
- Marker tap: Bounce animation
- Mini card: Slide up from bottom
- Re-center: Smooth animated camera movement
- Cluster markers: Expand/collapse animation on zoom

---

### 6. Filter Bottom Sheet (Modal)
**Mô tả:**
- Draggable bottom sheet với handle bar ở top
- **Header**: "Bộ lọc" + "Đặt lại" button (right)
- **Filters**:
  1. **Distance Slider**: "Khoảng cách: X km" (1-50km, step 1)
  2. **Price Range Slider**: "Giá: XXk - XXXk VND/giờ" (0-500k, step 10k)
  3. **Min Rating**: Segmented control "Bất kỳ / 3⭐+ / 4⭐+"
  4. **Court Type Chips**: "Indoor" / "Outdoor" / "Cả hai" (single select)
  5. **Amenities Checkboxes**:
     - Bãi đỗ xe (Parking)
     - Tủ khóa (Locker)
     - Căn tin (Canteen)
     - Thuê dụng cụ (Equipment rental)
     - Phòng tắm (Showers)
  6. **Partner Courts Only**: Toggle switch "Chỉ sân đối tác"
- **Live Preview**: "~XX sân phù hợp" (updates as filters change)
- **Footer**: "Áp dụng" button (primary, full width)

**Tương tác:**
- Drag handle bar → Expand/collapse sheet
- Adjust sliders → Preview count updates live
- Select chips → Single selection, active state highlight
- Check amenities → Multiple selection allowed
- Tap "Đặt lại" → Reset all filters to defaults
- Tap "Áp dụng" → Apply filters, re-fetch courts, close sheet

**Validations:**
- Distance min 1km (không được 0)
- Price range: Min không được lớn hơn Max

**Hiệu ứng:**
- Sheet open: Slide up + backdrop dim
- Slider drag: Haptic feedback on value change
- Preview count: Fade animation on update
- Apply button: Ripple effect

---

### 7. Search Screen (Modal)
**Mô tả:**
- Full screen modal với close button (X) top-right
- Search input ở top (auto-focus khi mở)
- **Recent Searches** section (hiển thị khi chưa type):
  - List of recent search keywords
  - Clear all button ở right header
- **Search Results** (hiển thị khi query >= 2 chars):
  - Debounced search (300ms)
  - Results list tương tự Court Cards
  - Highlight matching text (bold)

**Tương tác:**
- Type query → Trigger search after 300ms debounce
- Tap result → Navigate to Court Detail Screen
- Tap recent search → Auto-fill and search
- Tap "X" button → Close search screen
- Tap "Clear all" → Remove all recent searches

**States:**
- No results: "Không tìm thấy. Thử tìm 'Quận 7'?"
- Loading: Skeleton cards
- Error: "Tìm kiếm thất bại" + Retry

**Hiệu ứng:**
- Modal open: Slide up from bottom
- Keyboard: Push content up
- Results appear: Fade in animation

---

### 8. Location Permission Request
**Mô tả:**
- Modal overlay khi chưa có location permission
- Icon: Location pin
- Title: "Cho phép truy cập vị trí"
- Message: "Để hiển thị sân gần bạn và tính khoảng cách chính xác"
- Buttons:
  - "Cho phép" (primary)
  - "Bỏ qua" (secondary)

**Tương tác:**
- Tap "Cho phép" → Request system location permission
  - Granted → Get location, load courts
  - Denied → Use default location (city center)
- Tap "Bỏ qua" → Use default location, close modal

**States:**
- If permission permanently denied → Show "Open Settings" button thay vì "Cho phép"

**Hiệu ứng:**
- Modal: Fade in + scale
- Buttons: Ripple effect

---

## Navigation

**Đến screen này từ:**
- Main Tab Bar → Tap "Courts" tab
- Home Screen → Tap "Tìm sân" CTA
- Deep link: `/courts`

**Từ screen này đến:**
- Court Detail Screen (`11-court-detail.md`) → Tap court card/marker
- Court Booking Screen (`12-court-booking.md`) → Tap "Đặt ngay" button
- Search Screen (modal) → Tap search field
- Filter Sheet (modal) → Tap filter icon
- Google Maps App → Tap "Chỉ đường" (external)

---

## States

### Default State
- List view loaded với courts sorted by distance
- User location obtained (if permission granted)
- No filters active
- Search field empty

### Loading State
- Skeleton cards (List View) hoặc map loading overlay (Map View)
- Shimmer animation on placeholders
- Disable interactions until loaded

### Empty State (No Courts Found)
- Illustration: Empty pickleball court
- Text: "Không tìm thấy sân trong khu vực này"
- Suggestions:
  - "Mở rộng phạm vi tìm kiếm?"
  - "Đề xuất sân mới cho khu vực này" (report button)

### Error State
- Error icon + message: "Không thể tải danh sách sân"
- Retry button
- Fallback: Show cached courts (nếu có) với disclaimer "Dữ liệu có thể đã lỗi thời"

### Offline State
- Show cached courts với banner top: "Bạn đang offline. Hiển thị dữ liệu đã lưu."
- Disable search, filter, refresh actions

---

## Edge Cases

1. **GPS không chính xác/timeout**:
   - Use last known location
   - Nếu không có → Use default location (city center)
   - Show disclaimer: "Vị trí có thể không chính xác"

2. **Không có sân trong radius**:
   - Suggest expand search radius
   - Show nearest courts outside radius với disclaimer

3. **Google Maps load failed**:
   - Show error toast: "Bản đồ không khả dụng"
   - Auto-switch to List View
   - Hide Map toggle option

4. **Search không có kết quả**:
   - Suggest popular searches: "Quận 1", "Quận 7", "Bình Thạnh"
   - "Thử tìm kiếm theo khu vực?"

5. **Court temporarily closed**:
   - Show "Tạm đóng cửa" badge on card
   - Gray out "Đặt ngay" button
   - Show expected reopen date in Court Detail

6. **Price varies by time**:
   - Show price range: "150k - 300k VND/giờ"
   - Note: "(Tùy khung giờ)"

7. **New court (no reviews)**:
   - Show "Chưa có đánh giá" instead of stars
   - Encourage: "Hãy là người đầu tiên đánh giá!"

8. **Multiple courts same name**:
   - Append district in subtitle: "Sân ABC - Quận 7"

9. **Location permission denied permanently**:
   - Show modal with "Open Settings" button
   - Guide user: "Cài đặt → PickleBall → Vị trí → Cho phép"

10. **Slow connection**:
    - Progressive loading: Show text first, images lazy load
    - Low-res thumbnail → High-res image
    - Timeout after 10s → Show error

---

## Ghi chú

### UX Considerations:
- **Default to List View**: Easier to scan multiple courts quickly
- **Remember view preference**: Use last selected view (List/Map)
- **Sticky search bar**: Always accessible khi scroll
- **Quick action "Đặt ngay"**: Reduce friction cho returning users
- **Filter badge count**: Visual cue cho active filters
- **Real-time preview count**: Giúp user biết trước kết quả filter

### Performance:
- **List pagination**: 20 items per page để tránh lag khi scroll
- **Map clustering**: Group markers khi zoom out (improve performance)
- **Debounce search**: 300ms delay để tránh spam API
- **Image lazy loading**: Load images chỉ khi visible in viewport
- **Cache strategy**: Cache court list 5 mins, court details 15 mins

### Accessibility:
- Search field: VoiceOver label "Tìm sân pickleball"
- Filter button: Badge count announced "3 bộ lọc đang áp dụng"
- Court cards: Full content announced (name, distance, price, rating)
- Map markers: Tappable area min 44x44pt
- Sliders: Support voice control for adjusting values

### Analytics Events:
- `court_discovery_view` (view: list/map)
- `court_search` (query: string)
- `court_filter_applied` (filters: object)
- `court_card_tap` (court_id: string, from: list/map)
- `court_book_quick` (court_id: string)
- `location_permission_response` (granted: boolean)

### Validation Rules:
- Distance slider: 1-50km (default: 10km)
- Price range: 0-500k VND/giờ (default: 0-500k, no limit)
- Search query: Min 2 chars to trigger search
- Location: Fallback to city center if unavailable

### Business Logic:
- **Partner badge priority**: Hiển thị partner courts ở top (nếu sort by distance)
- **Rating threshold**: Chỉ show rating nếu >= 3 reviews (avoid misleading)
- **Inactive courts**: Không hiển thị courts có `is_active = false`
- **Price display**: Nếu price_range có → Show range, nếu không → Show price_per_hour
