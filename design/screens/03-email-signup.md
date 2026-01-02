# Email Signup Screen

## Screen Overview
Màn hình đăng ký tài khoản mới bằng email và password, với form validation realtime và feedback rõ ràng cho user.

## Mục đích
- Cho phép user tạo tài khoản mới bằng email + password
- Validate input realtime để giảm errors khi submit
- Hướng dẫn rõ ràng về password requirements
- Tạo trải nghiệm đăng ký nhanh chóng, không phức tạp

## Các Section/Components Chính

### 1. Header Section
**Mô tả**: Navigation và title

**Components**:
- **Back Button**: Arrow left icon ở top-left để quay về screen trước
- **Title**: "Create Account" hoặc "Đăng Ký Tài Khoản"
- **Subtitle**: "Enter your details to get started"

**Tương tác**:
- **Tap Back button** → Navigate về **02-login-register.md**

**Animations**:
- Slide-in from right khi vào screen
- Back button ripple effect on tap

### 2. Form Section
**Mô tả**: Form nhập thông tin đăng ký

**Components**:

#### A. Email Input Field
- **Label**: "Email Address"
- **Placeholder**: "your.email@example.com"
- **Input Type**: Email keyboard
- **Icon**: Mail icon (left side)
- **Validation Icon**: Checkmark (green) hoặc X (red) bên phải khi validate

#### B. Password Input Field
- **Label**: "Password"
- **Placeholder**: "Create a strong password"
- **Input Type**: Secure text (hidden)
- **Icon**: Lock icon (left side)
- **Toggle Visibility**: Eye icon (right side) để show/hide password
- **Password Strength Indicator**: Progress bar dưới input
  - Weak (red): < 8 ký tự
  - Medium (orange): 8+ ký tự, chưa đủ criteria
  - Strong (green): Đủ mọi criteria

#### C. Confirm Password Input Field
- **Label**: "Confirm Password"
- **Placeholder**: "Re-enter your password"
- **Input Type**: Secure text (hidden)
- **Icon**: Lock icon (left side)
- **Toggle Visibility**: Eye icon (right side)
- **Match Indicator**: Checkmark khi match với password trên

#### D. Password Requirements Box
- **Position**: Dưới Confirm Password field
- **Design**: Light background box với checkmarks
- **Requirements List**:
  - ✓/✗ At least 8 characters
  - ✓/✗ One uppercase letter (A-Z)
  - ✓/✗ One number (0-9)
  - ✓/✗ Passwords match
- **Behavior**: Realtime update checkmarks khi user typing

**Tương tác**:
- **Focus input** → Highlight border, show keyboard
- **Blur input** → Validate và hiển thị error nếu có
- **Type in Email** → Realtime format validation (check @ và domain)
- **Type in Password** → Update strength indicator và requirements checklist
- **Type in Confirm Password** → Realtime match validation
- **Tap Eye icon** → Toggle password visibility

**Validations**:
- **Email**:
  - Format: valid email (regex check)
  - Error message: "Please enter a valid email address"
- **Password**:
  - Min 8 characters
  - At least 1 uppercase letter
  - At least 1 number
  - Error message hiển thị requirement chưa đạt
- **Confirm Password**:
  - Must match password field
  - Error message: "Passwords do not match"

**Animations**:
- Input focus: Border color transition + slight scale (1.02)
- Error shake animation nếu validation fails
- Checkmark appear animation (scale + fade-in)
- Strength bar fill animation

### 3. Terms Agreement Section
**Mô tả**: Checkbox đồng ý điều khoản

**Components**:
- **Checkbox**: Custom styled checkbox (unchecked by default)
- **Terms Text**: "I agree to the [Terms of Service] and [Privacy Policy]"
- **Links**: "Terms of Service" và "Privacy Policy" là hyperlinks

**Tương tác**:
- **Tap checkbox** → Toggle checked/unchecked state với animation
- **Tap Terms/Privacy links** → Open WebView/in-app browser với policy pages
- **Validation**: Phải check trước khi submit (button disabled nếu chưa check)

**Animations**:
- Checkbox check animation (checkmark draw animation)
- Haptic feedback khi tap

### 4. Submit Button Section
**Mô tả**: Button để submit form

**Components**:
- **Primary Button**: "Sign Up" hoặc "Đăng Ký"
- **Full-width button** với prominent styling (brand primary color)

**Tương tác**:
- **Tap button** → Validate toàn bộ form:
  - Nếu có errors → Scroll to first error field, focus vào field đó, shake animation
  - Nếu valid → Call API signup
- **API Processing**:
  - Show loading spinner trên button
  - Disable button và tất cả inputs
  - Dim screen slightly với loading overlay (optional)

**States**:
- **Enabled**: All validations pass + Terms checked
- **Disabled**: Có validation errors hoặc chưa check Terms (grayed out, not tappable)
- **Loading**: Spinner trên button, text "Creating account..."

**Animations**:
- Button press: Scale down 0.98 + haptic feedback
- Loading spinner rotation
- Success: Quick checkmark animation before transition

### 5. Existing Account Section
**Mô tả**: Link cho user đã có tài khoản

**Components**:
- **Text prompt**: "Already have an account?"
- **Sign In Link**: "Sign In" styled as hyperlink

**Tương tác**:
- **Tap "Sign In"** → Navigate về **02-login-register.md** hoặc mở Login modal

**Animations**:
- Link underline animation on press

## Navigation

**Đến screen này từ**:
- **02-login-register.md** - Via "Sign up with Email" button

**Từ screen này đến**:
- **02-login-register.md** - Via back button hoặc "Sign In" link
- **Email Verification Screen** (tạm thời) - After successful signup (có thể là modal hoặc separate screen)
- **05-profile-setup.md** - After email verified (via deep link từ email)

## States

### Default State
- Tất cả input fields empty
- Password strength: None
- Requirements checklist: Tất cả unchecked
- Terms checkbox: Unchecked
- Submit button: Disabled (grayed out)
- No error messages visible

### Typing State
- Input đang focus có highlighted border
- Password strength indicator updates realtime
- Requirements checklist updates realtime
- Submit button enable/disable based on validation

### Validation Error State
- Input có error hiển thị red border
- Error message text màu red dưới input
- Error icon (X) bên phải input
- Submit button disabled

### Valid State
- Tất cả inputs có green checkmark
- Password requirements tất cả checked (green)
- Terms checkbox checked
- Submit button enabled (bright, tappable)

### Loading State (API Call)
- Loading spinner trên submit button
- Button text: "Creating account..."
- Tất cả inputs disabled
- Screen có subtle loading overlay
- Cannot tap back button

### Success State (Account Created)
- Success animation (checkmark) trên button
- Toast notification: "Account created! Check your email."
- Auto-navigate to Email Verification screen sau 1 giây

### Error States

#### Email Already Exists Error
- **Trigger**: API returns email already registered
- **UI**:
  - Email input hiển thị red border
  - Error message dưới email: "This email is already registered. [Sign In] instead?"
  - "Sign In" là link → navigate to Login
- **Button**: Quay về enabled state
- **User Action**: Change email hoặc tap Sign In link

#### Network Error
- **Trigger**: No internet connection hoặc API timeout
- **UI**:
  - Toast notification: "No internet connection. Please try again."
  - Submit button quay về enabled state
- **User Action**: Retry khi có mạng

#### Server Error
- **Trigger**: API returns 500 hoặc unexpected error
- **UI**:
  - Toast notification: "Something went wrong. Please try again."
  - Submit button quay về enabled state
- **User Action**: Retry

### Edge Cases
- **User navigates back mid-submission**: Cancel API call, quay về screen trước
- **App killed during API call**: Khi mở lại, không auto-retry (user phải nhập lại)
- **Password manager autofill**: Support autofill attributes, auto-validate sau khi fill
- **Email trong spam folder**: Hiển thị hint trong verification screen "Didn't receive email? Check your spam folder"
- **User changes email after submit**: Cho phép edit, nhưng phải submit lại
- **Multiple rapid taps on Submit**: Debounce button (chỉ accept 1 tap, ignore các taps sau trong 2 giây)
- **Keyboard covers input**: Auto-scroll form để input đang focus nằm visible area

## Ghi chú

### UX Considerations
- **Realtime validation**: Validate ngay khi blur để user biết errors sớm
- **Progressive disclosure**: Không hiển thị tất cả errors cùng lúc, focus vào field user đang nhập
- **Clear requirements**: Password requirements rõ ràng, không để user đoán
- **Password strength feedback**: Visual indicator giúp user tạo password mạnh hơn
- **Autofocus**: Email field auto-focus khi vào screen
- **Tab order**: Support tab navigation qua các fields theo thứ tự logic
- **Error prevention**: Disable submit button cho đến khi đủ criteria để tránh frustration

### Validations & Error Handling
- **Client-side validation**: Validate mọi field trước khi gọi API (fast feedback)
- **Server-side validation**: Backend phải validate lại để bảo mật
- **Error messages**: Rõ ràng, actionable (nói user phải làm gì)
- **Error tracking**: Log tất cả signup failures để analyze patterns
- **Rate limiting**: Limit số attempts để prevent spam (ví dụ: max 5 signups / IP / hour)

### Technical Notes
- **API Endpoint**: `POST /auth/signup` (Supabase Auth)
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123"
  }
  ```
- **Response**:
  - Success (201): User object + session token + "Check email to verify"
  - Error (400): Validation errors
  - Error (409): Email already exists
  - Error (500): Server error
- **Email Verification**:
  - Supabase tự động gửi verification email
  - Email chứa deep link: `pickleballapp://verify-email?token=xxx`
  - Token hợp lệ trong 24 giờ
- **Session Handling**:
  - Lưu access token + refresh token vào SecureStore ngay sau signup
  - Session vẫn chưa "active" cho đến khi verify email
  - User có thể browse app nhưng có restrictions (prompt verify khi cần)

### Design Specs
- **Input heights**: 56px (touch-friendly)
- **Input spacing**: 16px vertical gap
- **Font sizes**:
  - Title: 28px bold
  - Subtitle: 16px regular
  - Input labels: 14px medium
  - Input text: 16px regular
  - Error text: 12px regular
- **Colors**:
  - Error: #E53E3E (red)
  - Success: #38A169 (green)
  - Input border default: #E2E8F0 (light gray)
  - Input border focus: Brand primary
  - Input border error: #E53E3E
- **Padding**: 20px horizontal screen padding
- **Safe area**: Respect notch/home indicator
- **Keyboard avoidance**: Use KeyboardAvoidingView (React Native)

### Accessibility
- **Labels**: Tất cả inputs có accessible labels
- **Error announcements**: Screen reader announce errors khi validation fails
- **Focus order**: Logical tab order through form
- **Touch targets**: Min 44x44pt cho tất cả interactive elements
- **Color contrast**: Text và backgrounds đạt WCAG AA standards
- **Password toggle**: Accessible label "Show password" / "Hide password"

### Performance
- **Debounce validation**: Debounce realtime validation 300ms để tránh quá nhiều checks
- **Optimize regex**: Email validation regex efficient
- **Throttle API calls**: Prevent multiple simultaneous signups
- **Cancel pending requests**: Cancel API call nếu user navigate away
- **Image optimization**: Icons optimized SVG hoặc icon fonts

### Analytics Tracking
- Track events:
  - `screen_view`: Email Signup Screen
  - `signup_start`: User taps first input
  - `signup_attempt`: User taps Submit button
  - `signup_success`: API returns success
  - `signup_error`: API returns error (với error type)
  - `field_validation_error`: Track which fields fail most often
  - `terms_clicked`: User taps Terms/Privacy links
  - `back_pressed`: User exits mid-signup

### Future Enhancements
- **Social signup reminder**: "Or continue with Google/Facebook" option vẫn visible
- **Email suggestions**: Autocorrect common typos (gmial → gmail)
- **Password generator**: Option to auto-generate strong password
- **Have I Been Pwned integration**: Check nếu password đã bị leak
- **Profile photo upload**: Allow upload ảnh ngay trong signup flow (optional step)
- **Referral code field**: Nếu có referral program
