# Login & Register Screen

## Screen Overview
Màn hình chào mừng (Welcome Screen) hiển thị sau Splash Screen khi user chưa đăng nhập, cung cấp các lựa chọn để đăng ký tài khoản mới hoặc đăng nhập vào app.

## Mục đích
- Tạo ấn tượng đầu tiên tích cực với branding và value proposition
- Cung cấp nhiều phương thức authentication linh hoạt (Social + Email + Phone)
- Giảm friction trong onboarding flow
- Hướng dẫn user rõ ràng giữa đăng ký mới và đăng nhập

## Các Section/Components Chính

### 1. Branding & Value Proposition Section
**Mô tả**: Hero section với branding và messaging

**Components**:
- **App Logo**: Logo PickleBall Dating (size lớn, prominent)
- **Headline**: "Find Your Perfect Match"
- **Subheadline**: "On & Off Court" hoặc Vietnamese equivalent ("Tìm đối thủ hoàn hảo, cả trong và ngoài sân")
- **Hero Image/Illustration**: Hình minh họa người chơi pickleball hoặc abstract court pattern (optional, không bắt buộc nếu muốn giữ clean design)

**Tương tác**:
- Không có interaction (static display)

**Animations/Effects**:
- Fade-in animation khi vào screen (duration 400ms)
- Subtle parallax effect nếu có hero image (optional)

### 2. Social Login Section
**Mô tả**: Các nút đăng nhập nhanh qua social providers

**Components**:
- **Google Sign In Button**: Trắng với logo Google, text "Continue with Google"
- **Facebook Sign In Button**: Facebook blue với logo, text "Continue with Facebook"
- **Apple Sign In Button** (iOS only): Đen với logo Apple, text "Continue with Apple"

**Tương tác**:
- **Tap button** → Mở OAuth popup/redirect
- **OAuth flow**:
  - User grants permission → System verifies token
  - **If existing user**: Redirect to **06-home-swipe.md** (Home Screen)
  - **If new user**: Redirect to **05-profile-setup.md** (Profile Setup)
  - **If cancelled**: Quay lại screen này
- **Error cases**:
  - OAuth failed → Toast "Unable to sign in with [Provider]. Please try again."
  - Network error → Toast "No internet connection"

**Validations**:
- Check OAuth token validity
- Handle duplicate email scenario (nếu email từ social đã tồn tại → suggest link account)

**Animations/Effects**:
- Button press: Scale down 0.98 với haptic feedback
- Loading spinner trên button khi processing
- Ripple effect khi tap (Android)

### 3. Divider Section
**Mô tả**: Divider text để phân tách social login và traditional methods

**Components**:
- **Horizontal line** với text "OR" ở giữa
- Styling: Light gray line, text màu secondary

### 4. Traditional Login Options Section
**Mô tả**: Buttons để chọn phương thức email hoặc phone

**Components**:
- **Email Sign Up Button**: Outlined button với icon email
  - Text: "Sign up with Email"
  - Icon: Mail icon (left side)
- **Phone Sign Up Button**: Outlined button với icon phone
  - Text: "Sign up with Phone"
  - Icon: Phone icon (left side)

**Tương tác**:
- **Tap Email button** → Navigate to **03-email-signup.md**
- **Tap Phone button** → Navigate to **04-phone-signup.md**

**Animations/Effects**:
- Button press: Scale down 0.98 với haptic feedback
- Slide transition khi navigate

### 5. Existing User Section
**Mô tả**: Link dành cho returning users

**Components**:
- **Text prompt**: "Already have an account?"
- **Sign In Link**: Hyperlink styled text "Sign In"

**Tương tác**:
- **Tap "Sign In"** → Navigate to Login Screen (có thể là modal overlay hoặc separate screen)
  - Modal hiển thị form login với:
    - Email/Phone input
    - Password input
    - "Forgot Password?" link
    - Submit button
  - Hoặc navigate to dedicated Login screen tương tự layout này nhưng focus vào login form

**Animations/Effects**:
- Link underline animation on press
- Modal slide-up animation (nếu dùng modal)

### 6. Footer Section
**Mô tả**: Legal links và policy

**Components**:
- **Terms text**: Small gray text "By continuing, you agree to our"
- **Terms Link**: Hyperlink "Terms of Service"
- **Privacy Link**: Hyperlink "Privacy Policy"

**Tương tác**:
- **Tap links** → Open WebView hoặc in-app browser với policy pages

## Navigation

**Đến screen này từ**:
- **01-splash-screen.md** - Khi chưa có valid session
- Deep link xử lý (nếu user chưa auth)
- Logout từ **20-settings.md**

**Từ screen này đến**:
- **03-email-signup.md** - Via "Sign up with Email"
- **04-phone-signup.md** - Via "Sign up with Phone"
- **05-profile-setup.md** - Via successful social login (new user)
- **06-home-swipe.md** - Via successful social login (existing user) hoặc login success
- **Login Modal/Screen** - Via "Sign In" link

## States

### Default State
- Tất cả buttons enabled
- No loading indicators
- Hero section fully visible
- Social buttons ở top, traditional options ở dưới
- Footer legal text at bottom

### Loading State (Processing OAuth)
- Button đang process hiển thị spinner
- Disable tất cả other buttons
- Dim screen slightly với loading overlay (optional)

### Error State
- Toast notification hiển thị error message:
  - "Unable to connect. Please check your internet."
  - "Sign in failed. Please try again."
  - "This email is already registered. Please sign in."
- Button quay về default state sau error
- User có thể retry immediately

### Success State (OAuth)
- Quick success feedback (checkmark animation trên button)
- Fade-out animation toàn screen
- Navigate to next screen với slide transition

### Edge Cases
- **No internet on launch**: Hiển thị offline banner at top, disable tất cả auth buttons
- **OAuth popup blocked**: Toast "Please allow popups to continue"
- **Multiple social accounts với same email**:
  - Hiển thị dialog: "This email is linked to [Provider]. Sign in with [Provider] instead?"
  - Suggest linking accounts (future feature)
- **iOS không có Apple Sign In button**: Chỉ hiển thị trên iOS 13+
- **User dismisses OAuth mid-flow**: Quay lại screen này, no state change
- **Deep link expired**: Hiển thị message "Link expired. Please sign up again."

## Ghi chú

### UX Considerations
- **Reduce cognitive load**: Social buttons ở top vì fastest signup method
- **Progressive disclosure**: Không hiển thị quá nhiều form fields ngay đầu
- **Clear hierarchy**: Social > Email/Phone > Sign In link
- **Trust signals**: Hiển thị "1000+ players matched" hoặc testimonials (optional)
- **Accessibility**: Tất cả buttons có accessible labels, support VoiceOver/TalkBack
- **Keyboard navigation**: Support tab navigation cho web version

### Validations & Error Handling
- **OAuth errors**: Clear, actionable messages (avoid technical jargon)
- **Network timeout**: 10s timeout cho OAuth calls
- **Rate limiting**: Nếu quá nhiều failed attempts (5 trong 15 phút), hiển thị CAPTCHA
- **Security**: Log all authentication attempts cho security monitoring

### Technical Notes
- **OAuth implementation**: Sử dụng Supabase Auth với providers config
- **Deep linking**: Setup universal links (iOS) và App Links (Android)
- **Session persistence**: Check SecureStore trước khi hiển thị screen
- **Analytics tracking**: Track button taps, signup method chosen, OAuth success/fail rates

### Design Specs
- **Button heights**: 56px (touch-friendly)
- **Button spacing**: 12px vertical gap
- **Safe area**: Respect notch/home indicator areas
- **Responsive**: Adjust layout cho tablets/landscape
- **Dark mode**: Support dark theme với inverted colors

### Performance
- **Lazy load**: Hero image lazy load nếu có
- **Optimize images**: Logo và icons tối ưu (<50KB total)
- **Fast OAuth**: Prefetch OAuth configs để reduce latency
- **Animation**: 60 FPS animations với React Native Reanimated

### Future Enhancements
- Fingerprint/Face ID quick login (nếu user đã đăng nhập trước)
- "Skip for now" option cho guest browsing (limited features)
- A/B test button order và messaging
- Social proof metrics ("Join 10,000+ players")
