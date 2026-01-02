# Phone Signup Screen

## Screen Overview
Màn hình đăng ký tài khoản mới bằng số điện thoại và xác thực OTP, bao gồm 2 sub-screens: Phone Input và OTP Verification. Flow này được thiết kế để nhanh chóng và an toàn với retry limits và timeout handling.

## Mục đích
- Cho phép user tạo tài khoản nhanh chóng bằng số điện thoại
- Xác thực số điện thoại qua OTP để đảm bảo tính hợp lệ
- Cung cấp trải nghiệm an toàn với rate limiting và error handling
- Giảm friction trong signup flow (không cần nhớ password)

---

## Sub-Screen 1: Phone Number Input

### 1. Header Section
**Mô tả**: Navigation và title

**Components**:
- **Back Button**: Arrow left icon ở top-left để quay về screen trước
- **Title**: "Sign Up with Phone" hoặc "Đăng Ký Bằng SĐT"
- **Subtitle**: "We'll send you a verification code"

**Tương tác**:
- **Tap Back button** → Navigate về **02-login-register.md**

**Animations**:
- Slide-in from right khi vào screen
- Back button ripple effect on tap

### 2. Phone Input Section
**Mô tả**: Input field với country code selector

**Components**:

#### A. Country Code Selector
- **Button**: Flag + code (e.g., "🇻🇳 +84")
- **Default**: Vietnam (+84)
- **Dropdown**: Tap để mở country picker modal

#### B. Phone Number Input Field
- **Label**: "Phone Number"
- **Placeholder**: "912 345 678" (format hint)
- **Input Type**: Numeric keyboard
- **Format**: Auto-format khi typing (space sau mỗi 3 digits: "091 234 5678")
- **Prefix**: Country code hiển thị bên trái (read-only)
- **Max Length**: 10 digits (cho VN, adjust cho other countries)

**Tương tác**:
- **Tap Country Code** → Mở Country Picker Modal:
  - Search bar at top
  - List countries với flag + name + code
  - Scroll to find
  - Tap country → Update code, close modal
- **Focus Phone Input** → Highlight border, show numeric keyboard
- **Type digits** → Auto-format với spaces
- **Realtime validation**:
  - Check digit count (10 cho VN)
  - Check valid prefixes (091, 090, 093, 094, 088, 089, v.v.)
  - Show green checkmark khi valid
  - Show red X khi invalid

**Validations**:
- **Format**: 10 digits cho Vietnam
- **Prefix**: Valid Vietnam carrier prefixes
- **Error messages**:
  - "Please enter a valid phone number"
  - "This phone number format is not supported"

**Animations**:
- Input focus: Border color transition + slight scale (1.02)
- Auto-format: Smooth transition khi add/remove spaces
- Checkmark appear animation (scale + fade-in)
- Error shake animation nếu validation fails

### 3. Terms Agreement Section
**Mô tả**: Checkbox đồng ý điều khoản

**Components**:
- **Checkbox**: Custom styled checkbox (unchecked by default)
- **Terms Text**: "I agree to the [Terms of Service] and [Privacy Policy]"
- **Links**: "Terms of Service" và "Privacy Policy" là hyperlinks

**Tương tác**:
- **Tap checkbox** → Toggle checked/unchecked state với animation
- **Tap Terms/Privacy links** → Open WebView/in-app browser
- **Validation**: Phải check trước khi submit (button disabled nếu chưa check)

**Animations**:
- Checkbox check animation (checkmark draw animation)
- Haptic feedback khi tap

### 4. Submit Button Section
**Mô tả**: Button để gửi OTP

**Components**:
- **Primary Button**: "Send Code" hoặc "Gửi Mã"
- **Full-width button** với prominent styling

**Tương tác**:
- **Tap button** → Validate phone number:
  - Nếu invalid → Shake animation, focus phone input
  - Nếu valid → Call API send OTP
- **API Processing**:
  - Show loading spinner trên button
  - Button text: "Sending..."
  - Disable button và input

**States**:
- **Enabled**: Phone valid + Terms checked
- **Disabled**: Phone invalid hoặc chưa check Terms (grayed out)
- **Loading**: Spinner trên button

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
- **Tap "Sign In"** → Navigate về **02-login-register.md**

**Animations**:
- Link underline animation on press

---

## Sub-Screen 2: OTP Verification

### 1. Header Section
**Mô tả**: Navigation, title và context

**Components**:
- **Back Button**: Arrow left icon ở top-left
- **Title**: "Enter Code" hoặc "Nhập Mã Xác Thực"
- **Subtitle**: "We sent a code to [+84 91 234 5678]" (hiển thị phone number đã nhập)
- **Edit Link**: "Wrong number?" → Tap để quay về Phone Input screen

**Tương tác**:
- **Tap Back button** → Navigate về Phone Input screen (sub-screen 1)
- **Tap "Wrong number?"** → Quay về Phone Input screen, giữ phone number đã nhập để edit

**Animations**:
- Slide-in from right khi vào screen
- Back button ripple effect on tap

### 2. OTP Input Section
**Mô tả**: 6 input fields cho OTP digits

**Components**:
- **6 OTP Input Boxes**: Separate boxes cho mỗi digit
  - Size: Square boxes, prominent
  - Styling: Border, centered text
  - Active box: Highlighted border (brand color)
  - Filled box: Check icon hoặc just show digit
  - Error state: Red border cho all boxes

**Tương tác**:
- **Auto-focus**: First box auto-focus khi vào screen
- **Type digit** → Auto-advance to next box
- **Delete** → Move to previous box
- **Paste OTP**: Support paste 6-digit code (auto-fill all boxes)
- **Auto-submit**: Khi nhập đủ 6 digits → Auto-call verify API
- **Realtime validation**: Check nếu OTP correct ngay khi đủ 6 digits

**Validations**:
- **Format**: 6 numeric digits
- **Error handling**: Xử lý theo PRD (max 5 sai → khóa 15 phút)

**Animations**:
- Box focus animation: Scale + border color transition
- Digit entry: Fade-in digit với slight bounce
- Auto-advance: Smooth focus transition
- Error shake: All boxes shake together
- Success: Boxes turn green with checkmarks

### 3. Retry Limit Indicator
**Mô tả**: Hiển thị số lần nhập sai còn lại

**Components**:
- **Text**: "Attempts remaining: [X]/5" (chỉ hiển thị sau lần sai đầu tiên)
- **Color**: Warning color (orange) khi còn 2-3 lần, red khi còn 1 lần

**Behavior**:
- Hidden khi chưa có error
- Appear sau lần verify failed đầu tiên
- Update count sau mỗi failed attempt
- Khi đạt 5 lần sai → Hiển thị lockout state

### 4. Resend OTP Section
**Mô tả**: Option để gửi lại OTP

**Components**:
- **Timer Text**: "Resend code in 00:[59]" (countdown 60 giây)
- **Resend Button**: Enabled sau khi countdown = 0
  - Text: "Resend Code"
  - Styled as text button (secondary style)

**Tương tác**:
- **Countdown**: Auto-start khi vào screen
- **Countdown = 0**: Enable Resend button
- **Tap Resend** → Call API send OTP again:
  - Show loading spinner
  - Reset countdown to 60s
  - Clear current OTP input
  - Focus first box
  - Increment resend count (max 3 resends / session)

**States**:
- **Countdown active**: Button disabled, timer running
- **Resend available**: Button enabled, no timer
- **Resend limit reached** (3 times): Button disabled, show message "Too many attempts. Please try again later."

**Animations**:
- Countdown: Smooth number transition
- Button enable: Fade-in + scale animation

### 5. Loading/Success/Error States

#### Loading State (Verifying OTP)
- **Trigger**: Auto-submit khi nhập đủ 6 digits
- **UI**:
  - Loading spinner overlay toàn screen hoặc trên OTP boxes
  - Dim OTP boxes slightly
  - Disable all interactions
  - Text: "Verifying..."

#### Success State
- **Trigger**: API returns OTP correct
- **UI**:
  - All boxes turn green với checkmark icons
  - Success animation (confetti hoặc checkmark burst - optional)
  - Text: "Verified!" (brief)
- **Action**: Auto-navigate to **05-profile-setup.md** sau 0.5 giây

#### Error State - Wrong OTP
- **Trigger**: API returns OTP incorrect
- **UI**:
  - All boxes shake animation và turn red
  - Error message below boxes: "Incorrect code. Please try again."
  - Show "Attempts remaining: [X]/5"
  - Clear OTP input
  - Auto-focus first box
- **Action**: User có thể nhập lại

#### Error State - Lockout (5 Failed Attempts)
- **Trigger**: Nhập sai 5 lần
- **UI**:
  - Disable all OTP boxes (grayed out)
  - Hide Resend button
  - Large warning icon
  - Error message: "Too many incorrect attempts. Please try again in 15 minutes."
  - Countdown timer: "Unlocks in 14:59"
- **Action**: User phải chờ 15 phút, không thể làm gì

#### Error State - OTP Expired
- **Trigger**: API returns OTP expired (sau 5 phút)
- **UI**:
  - Clear OTP boxes
  - Error message: "Code expired. Please request a new one."
  - Auto-enable Resend button (skip countdown)
  - Focus on Resend button
- **Action**: User tap Resend để lấy OTP mới

#### Error State - Network Error
- **Trigger**: No internet hoặc API timeout
- **UI**:
  - Toast notification: "No internet connection. Please check and try again."
  - Keep OTP input intact
  - Retry button appears (optional)
- **Action**: User có thể retry khi có mạng

---

## Navigation

**Đến screen này từ**:
- **02-login-register.md** - Via "Sign up with Phone" button

**Từ screen này đến**:
- **02-login-register.md** - Via back button (from Phone Input sub-screen)
- **Phone Input sub-screen** - Via back button hoặc "Wrong number?" (from OTP sub-screen)
- **05-profile-setup.md** - After successful OTP verification

---

## States Summary

### Phone Input Sub-Screen States

#### Default State
- Phone input empty
- Country code: Vietnam (+84) default
- Terms checkbox: Unchecked
- Submit button: Disabled

#### Typing State
- Input focused với highlighted border
- Realtime format (auto-add spaces)
- Realtime validation
- Submit button enable/disable based on validation

#### Valid State
- Phone number valid (green checkmark)
- Terms checked
- Submit button enabled

#### Loading State (Sending OTP)
- Loading spinner trên button
- Button text: "Sending..."
- Disable input và button
- Cannot navigate back

#### Success State (OTP Sent)
- Brief success feedback (optional toast: "Code sent!")
- Auto-navigate to OTP Verification sub-screen

#### Error States
- **Phone Already Exists**:
  - Error message: "This phone is already registered. [Sign In] instead?"
  - "Sign In" là link → navigate to Login
  - Submit button quay về enabled
- **Network Error**:
  - Toast: "No internet connection"
  - Submit button quay về enabled
- **Server Error**:
  - Toast: "Something went wrong. Please try again."
  - Submit button quay về enabled

### OTP Verification Sub-Screen States

#### Default State
- First OTP box auto-focused
- All boxes empty
- Countdown timer: 60s
- Resend button disabled
- No error messages

#### Typing State
- Current box highlighted
- Auto-advance on digit entry
- Auto-submit when 6 digits entered

#### Verifying State
- Loading spinner
- Disable all inputs
- Text: "Verifying..."

#### Success State
- Green checkmarks in all boxes
- Success message
- Auto-navigate to Profile Setup

#### Error States
- **Wrong OTP**: Boxes shake, turn red, clear input, show attempts remaining
- **Lockout**: Disable inputs, show 15-minute countdown
- **Expired**: Clear input, auto-enable Resend
- **Network Error**: Toast message, keep input

---

## Edge Cases

1. **User navigates back during OTP verification**: Cancel API call, clear OTP state
2. **App killed during verify**: Khi mở lại, redirect về Phone Input screen (không keep state)
3. **Phone number đã tồn tại**: Hiển thị error với suggestion Sign In
4. **SMS delay** (OTP chậm đến): User có thể Resend sau 60s
5. **Clipboard OTP paste**: Auto-fill all 6 boxes nếu paste format đúng (6 digits)
6. **Multiple rapid taps on Send**: Debounce button (accept 1 tap, ignore trong 2 giây)
7. **Keyboard covers input**: Auto-scroll để input visible
8. **Country code change mid-flow**: Clear phone number, reset validation
9. **Lockout expires**: Auto-enable inputs sau 15 phút (nếu user vẫn trên screen)
10. **Resend limit reached** (3 times): Disable Resend, show error message, suggest try later
11. **Wrong number entered**: User có thể tap "Wrong number?" để quay về edit
12. **OTP SMS chứa deeplink**: Support iOS/Android auto-fill OTP từ SMS

---

## Ghi chú

### UX Considerations
- **Fast input**: Numeric keyboard, auto-advance, auto-submit reduce friction
- **Clear feedback**: Realtime validation, clear error messages, countdown timers
- **Error prevention**: Disable submit until valid, limit retry attempts
- **Trust building**: Show phone number in OTP screen để user verify correct
- **Escape hatches**: "Wrong number?" link, Resend option, back navigation
- **Accessibility**: VoiceOver/TalkBack announce OTP boxes, error states, countdown

### Validations & Error Handling
- **Client-side**: Validate phone format, digit count trước khi gọi API
- **Server-side**: Backend validate phone format, check exists, rate limit
- **OTP Security**:
  - OTP valid trong 5 phút
  - Max 5 verify attempts
  - Max 3 resend requests per session
  - 15-minute lockout sau 5 failed verifications
- **Rate Limiting** (backend):
  - Max 3 OTP sends per phone per hour
  - Max 10 send requests per IP per hour (prevent spam)
- **Error tracking**: Log all failed attempts, lockouts for security monitoring

### Technical Notes
- **API Endpoints**:
  - `POST /auth/send-otp` (Phone Input → Send OTP)
    - Request: `{ "phone": "+84912345678" }`
    - Response: `{ "success": true, "expires_in": 300 }`
    - Errors: 409 (phone exists), 429 (rate limit), 500 (server error)
  - `POST /auth/verify-otp` (OTP Verification)
    - Request: `{ "phone": "+84912345678", "otp": "123456" }`
    - Response: `{ "success": true, "user": {...}, "session": {...} }`
    - Errors: 400 (wrong OTP), 410 (expired), 429 (too many attempts), 423 (locked)

- **Supabase Implementation**:
  - Use Supabase Auth phone authentication
  - OTP sent via SMS provider (Twilio, AWS SNS, etc.)
  - Store retry counts và lockout timestamps trong database
  - Use Supabase realtime để sync lockout status across devices

- **Session Handling**:
  - Lưu access token + refresh token vào SecureStore ngay sau verify success
  - Session active immediately (không cần email verification step)

- **SMS Format**:
  - "Your PickleBall Dating verification code is: 123456. Valid for 5 minutes."
  - Support iOS auto-fill format (domain association)
  - Support Android SMS Retriever API

### Design Specs

#### Phone Input Sub-Screen
- **Input height**: 56px
- **Country code button width**: 80px
- **Phone input font**: 18px medium (readable cho numbers)
- **Spacing**: 16px vertical gap giữa elements
- **Country Picker Modal**:
  - Full screen modal
  - Search bar: 48px height
  - List item: 56px height, flag + name + code
  - Scrollable list với fast scroll indicator

#### OTP Verification Sub-Screen
- **OTP box size**: 56x56px squares
- **OTP box spacing**: 8px gap giữa boxes
- **Font size**: 24px bold (OTP digit inside box)
- **Countdown timer**: 14px regular font
- **Error message**: 12px regular, red color
- **Attempts indicator**: 14px medium, warning color

#### Colors
- **Success**: #38A169 (green)
- **Error**: #E53E3E (red)
- **Warning**: #ED8936 (orange)
- **Border default**: #E2E8F0 (light gray)
- **Border focus**: Brand primary
- **Border error**: #E53E3E
- **Lockout background**: #FEF5E7 (light yellow)

#### Animations
- **OTP box animations**: 60 FPS với Reanimated
- **Countdown**: Update mỗi 1 giây với smooth transition
- **Shake animation**: 3 oscillations trong 400ms
- **Success checkmark**: Scale from 0 to 1 trong 300ms với ease-out

### Accessibility
- **OTP boxes**: Grouped as single element cho screen readers với label "Enter 6-digit code"
- **Countdown**: Announce remaining time every 15 seconds
- **Error messages**: Auto-announce khi appear
- **Lockout state**: Clearly announce "Account temporarily locked. Try again in [time]"
- **Touch targets**: Min 44x44pt cho all interactive elements
- **Focus order**: Logical flow through OTP boxes

### Performance
- **Debounce resend**: Prevent multiple rapid resend requests
- **Cancel API calls**: Cancel pending verify call nếu user navigate away
- **Throttle OTP verification**: Client-side throttle mỗi 1 giây (prevent spam submissions)
- **Optimize SMS delivery**: Use reliable SMS provider với fast delivery
- **Timer precision**: Use Reanimated worklets cho smooth countdown

### Analytics Tracking
- Track events:
  - `screen_view`: Phone Signup Screen (Phone Input)
  - `screen_view`: Phone Signup Screen (OTP Verification)
  - `phone_input_start`: User taps phone field
  - `country_picker_opened`: User taps country selector
  - `send_otp_attempt`: User taps Send Code
  - `send_otp_success`: OTP sent successfully
  - `send_otp_error`: OTP send failed (với error type)
  - `otp_input_complete`: User enters 6 digits
  - `otp_verify_success`: OTP verified successfully
  - `otp_verify_error`: OTP verify failed (với attempts remaining)
  - `otp_resend`: User taps Resend
  - `otp_lockout`: User locked out for 15 minutes
  - `wrong_number_tapped`: User edits phone number
  - `back_pressed`: User exits mid-flow

### Security Considerations
- **No OTP in logs**: Never log actual OTP values
- **Secure transmission**: HTTPS only
- **No OTP hints**: Không hiển thị hints về OTP format để prevent brute force
- **Audit trail**: Log all phone signup attempts với IP, timestamp
- **Phone verification**: OTP confirms phone ownership (anti-fraud)
- **Lockout enforcement**: Backend enforces lockout (không rely vào client)

### Future Enhancements
- **Voice OTP**: Option "Call me instead" nếu SMS không đến
- **Alternative verification**: Email fallback nếu phone không available
- **Smart resend**: Detect SMS delivery failure và auto-enable Resend sớm hơn
- **OTP autofill**: iOS/Android native OTP autofill integration
- **Biometric after first login**: Face ID/Touch ID cho subsequent logins
- **International support**: More countries với correct validation
- **WhatsApp OTP**: Send OTP via WhatsApp Business API (nếu available)
