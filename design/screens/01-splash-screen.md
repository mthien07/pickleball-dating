# Splash Screen

## Screen Overview
Màn hình đầu tiên hiển thị khi user mở app, kiểm tra session và quyết định điều hướng tiếp theo (Home nếu đã đăng nhập hoặc Welcome nếu chưa).

## Mục đích
- Tạo ấn tượng thương hiệu đầu tiên
- Khởi tạo app configuration và check authentication status
- Điều hướng user đến đúng màn hình dựa trên trạng thái đăng nhập

## Các Section/Components Chính

### 1. Branding Section
**Mô tả**: Hiển thị logo và tagline của ứng dụng

**Components**:
- **App Logo**: Logo PickleBall Dating với animation fade-in + scale
- **Tagline**: "Find Your Perfect Match On & Off Court" (hoặc Vietnamese equivalent)
- **Loading Indicator**: Spinner hoặc animated progress bar ở bottom

**Tương tác**:
- Không có user interaction (passive screen)
- Auto-transition sau khi check auth xong

**Animations/Effects**:
- Logo fade-in từ opacity 0 → 1 (duration: 300ms)
- Logo slight scale from 0.8 → 1 với spring animation
- Tagline fade-in delay 200ms sau logo
- Loading spinner continuous rotation

### 2. Background
**Mô tả**: Gradient background hoặc hero image liên quan pickleball

**Components**:
- **Gradient**: Brand color gradient (primary → secondary)
- **Optional Pattern**: Subtle pickleball court pattern overlay (opacity 0.1)

## Navigation

**Đến screen này từ**:
- App launch (first screen)
- Deep link handling (temporary show rồi redirect)

**Từ screen này đến**:
- **02-login-register.md** - Nếu chưa đăng nhập (no valid session)
- **06-home-swipe.md** - Nếu đã đăng nhập và profile setup xong
- **05-profile-setup.md** - Nếu đã auth nhưng chưa complete profile

## States

### Default State
- Logo centered vertically và horizontally
- Tagline positioned below logo (16px spacing)
- Loading indicator at bottom (32px from safe area)
- Background gradient hiển thị

### Loading State
- Spinner rotating
- Đang call Supabase để check session
- Duration tối đa: 3 giây

### Success State (Auth Check Complete)
- Fade-out animation toàn bộ screen
- Transition đến screen tiếp theo với slide animation

### Error State
- Nếu network error khi check auth:
  - Hiển thị toast "No internet connection"
  - Auto-retry sau 2 giây
  - Nếu retry 3 lần thất bại → redirect to Welcome screen (offline mode)

### Edge Cases
- **Session expired**: Refresh token failed → redirect Login
- **App killed during splash**: Resume lại process
- **Deep link pending**: Complete auth check trước rồi mới handle deep link
- **First time install**: No session → Welcome screen
- **Biometric prompt (future)**: Nếu enabled, show prompt trước khi redirect Home

## Ghi chú

**UX Considerations**:
- Splash screen KHÔNG nên quá lâu (tối đa 3 giây)
- Nếu auth check nhanh (<500ms), vẫn giữ splash tối thiểu 1 giây để user thấy branding
- Animation phải smooth, professional (60 FPS)
- Tránh jarring transitions khi chuyển screen

**Technical Notes**:
- Sử dụng SecureStore để read access/refresh tokens
- Parallel check: token validation + profile completeness
- Pre-load critical assets (fonts, core images) trong splash
- Implement timeout 3s cho auth check

**Accessibility**:
- Logo có `accessibilityLabel="PickleBall Dating Logo"`
- Loading indicator có `accessibilityLabel="Loading"`
- Announce navigation destination với screen reader

**Performance**:
- Không load heavy assets trong splash
- Use skeleton/placeholder cho next screen
- Optimize logo file size (<100KB)
