# Payment Method Selection

## Screen Overview
Màn hình chọn phương thức thanh toán với countdown timer giữ slot, hiển thị tóm tắt booking, các phương thức thanh toán phổ biến tại VN, và xử lý payment flow bảo mật theo chuẩn PCI DSS.

---

## Mục đích
- Cho phép user chọn phương thức thanh toán phù hợp (Card, E-wallet, ATM)
- Hiển thị countdown timer để user biết thời gian còn lại giữ slot
- Tóm tắt booking chi tiết trước khi thanh toán
- Thu thập thông tin thanh toán một cách bảo mật
- Xử lý payment flow với các gateways khác nhau

---

## Các Section/Components Chính

### 1. Countdown Timer Banner (Sticky Top)
- **Vị trí**: Luôn sticky ở top khi scroll
- **Hiển thị**:
  - Icon clock + Text: "Giữ chỗ còn: 05:23" (MM:SS format)
  - Background gradient: Green → Yellow khi < 3 min → Red khi < 1 min
  - Pulse animation khi < 2 min
- **Tương tác**: Không interactive, chỉ hiển thị
- **Logic**:
  - Countdown từ 10:00 (10 phút)
  - Update mỗi giây
  - Khi hết thời gian → Show modal "Hết thời gian giữ slot" → Navigate back
- **Hiệu ứng**: Pulse animation với scale 1.0 → 1.05 khi < 2 min

### 2. Booking Summary (Collapsible Card)
- **Vị trí**: Dưới countdown timer
- **State mặc định**: Collapsed (chỉ hiển thị total amount)
- **Collapsed state**:
  - Court name + Total amount
  - Chevron down icon
- **Expanded state** (tap để expand):
  - **Court Info**:
    - Thumbnail ảnh sân (60x60)
    - Tên sân
    - Địa chỉ (truncated)
  - **Booking Details**:
    - Ngày: DD/MM/YYYY
    - Giờ: HH:MM - HH:MM
    - Thời lượng: X giờ
  - **Price Breakdown**:
    - Subtotal: XXX,XXXđ (price × hours)
    - Discount: -XX,XXXđ (nếu có, show discount code)
    - Service fee: X,XXXđ
    - **Total**: XXX,XXXđ (bold, larger font)
- **Tương tác**: Tap anywhere để toggle expand/collapse
- **Hiệu ứng**: Smooth expand/collapse animation (300ms)

### 3. Payment Methods Section
- **Header**: "Chọn phương thức thanh toán"
- **Layout**: Radio button list, mỗi item là card
- **Options** (theo thứ tự):
  1. **Thẻ ATM nội địa**
     - Icon: ATM card
     - Label: "Thẻ ATM nội địa"
     - Sublabel: "Các ngân hàng Việt Nam"
  2. **Visa / Mastercard**
     - Icon: Visa + MC logos
     - Label: "Thẻ tín dụng/Ghi nợ quốc tế"
     - Sublabel: "Visa, Mastercard"
  3. **MoMo**
     - Icon: MoMo logo
     - Label: "Ví MoMo"
     - Sublabel: "Thanh toán nhanh"
  4. **ZaloPay**
     - Icon: ZaloPay logo
     - Label: "Ví ZaloPay"
     - Sublabel: "Thanh toán an toàn"
  5. **Apple Pay** (iOS only)
     - Icon: Apple Pay logo
     - Label: "Apple Pay"
     - Sublabel: "Thanh toán 1 chạm"
- **Tương tác**:
  - Tap vào card để select
  - Radio button tích active
  - Card selected có border primary color
- **Hiệu ứng**: Scale down slightly khi tap (0.98)

### 4. Saved Cards Section (Conditional)
- **Điều kiện hiển thị**: Nếu user có saved cards
- **Vị trí**: Xuất hiện trước Payment Methods khi user đã chọn "Visa/Mastercard"
- **Header**: "Thẻ đã lưu"
- **Card Item**:
  - Card brand icon (Visa/MC)
  - Last 4 digits: •••• 4242
  - Expiry: MM/YY (nếu expired → show warning)
  - Radio button
- **Action**: "+ Sử dụng thẻ mới" button
- **Tương tác**: Select saved card → chỉ cần nhập CVV
- **Validation**: Check expiry date, show warning nếu card sắp hết hạn (< 1 month)

### 5. Payment Form (Conditional - Dựa trên method đã chọn)

#### A. Card Payment Form (Visa/MC hoặc ATM)
- **Hiển thị khi**: User chọn Visa/MC hoặc ATM và KHÔNG dùng saved card
- **Fields**:
  1. **Card Number**:
     - Input mask: XXXX XXXX XXXX XXXX
     - Auto-detect card type (show icon)
     - Validation: Luhn algorithm
     - Placeholder: "1234 5678 9012 3456"
  2. **Expiry Date**:
     - Input mask: MM/YY
     - Validation: Not in past, reasonable future (< 10 years)
     - Placeholder: "MM/YY"
  3. **CVV**:
     - Input mask: XXX (hoặc XXXX cho Amex)
     - Secure input (dots)
     - Info icon → tooltip "3 số sau thẻ"
     - Placeholder: "123"
  4. **Cardholder Name**:
     - Text input
     - Validation: Letters only, min 3 chars
     - Placeholder: "NGUYEN VAN A"
  5. **Save Card Checkbox**:
     - Label: "Lưu thẻ cho lần sau"
     - Sublabel: "Thông tin thẻ được mã hóa an toàn"
     - Default: Unchecked
- **Tương tác**: Tab order natural, auto-advance khi field complete
- **Validation**: Real-time validation với error messages dưới field

#### B. E-wallet Redirect (MoMo/ZaloPay/Apple Pay)
- **Hiển thị khi**: User chọn e-wallet
- **Content**:
  - Icon ví điện tử lớn
  - Text: "Bạn sẽ được chuyển đến ứng dụng [MoMo/ZaloPay] để hoàn tất thanh toán"
  - Amount hiển thị rõ ràng
  - Info: "Sau khi thanh toán, bạn sẽ được tự động quay lại ứng dụng"
- **Tương tác**: None (chỉ informational)

#### C. Saved Card CVV Only
- **Hiển thị khi**: User chọn saved card
- **Content**:
  - Hiển thị card info (masked)
  - **CVV field** only:
    - Label: "Nhập mã CVV"
    - Secure input
    - Validation: 3 hoặc 4 digits
- **Tương tác**: Focus vào CVV field ngay

### 6. Security Badges Section
- **Vị trí**: Dưới payment form, trên CTA button
- **Content**:
  - PCI DSS badge với checkmark
  - SSL Secure icon
  - Text: "Thông tin thanh toán được mã hóa bảo mật"
- **Styling**: Small, subtle, centered

### 7. Terms & Policy Section
- **Layout**: Checkbox + Text link
- **Content**:
  - Checkbox (required)
  - Text: "Tôi đồng ý với [Điều khoản dịch vụ] và [Chính sách hủy]"
  - Links mở bottom sheet hoặc web view
- **Validation**: Phải check mới enable CTA button
- **Chính sách hủy** (hiển thị trong link):
  - > 24h: Hoàn 100%
  - 12-24h: Hoàn 50%
  - 2-12h: Không hoàn
  - < 2h: Không thể hủy

### 8. CTA Button (Sticky Bottom)
- **Layout**: Fixed bottom với safe area inset
- **States**:
  - **Default**: "Xác nhận thanh toán XXX,XXXđ"
    - Background: Primary color
    - Text: White, bold
  - **Loading**: Spinner + "Đang xử lý..."
    - Disabled state
  - **Disabled**:
    - Background: Gray
    - Trigger: Chưa chọn method HOẶC form chưa valid HOẶC chưa agree terms
- **Tương tác**: Tap → Submit payment
- **Hiệu ứng**: Haptic feedback khi tap

---

## Navigation

### Đến screen này từ:
- **12-court-booking.md** (sau khi select slots và tap "Tiếp tục")

### Từ screen này đến:
- **14-payment-success.md** (khi payment succeeded)
- **Payment Error Modal** (khi payment failed → retry hoặc change method)
- **Back to 12-court-booking.md** (nếu user back hoặc timeout)
- **External Apps** (MoMo/ZaloPay) → Deep link back

---

## States

### 1. Default State
- Countdown đang chạy
- Booking summary collapsed
- Chưa chọn payment method
- CTA disabled

### 2. Method Selected State
- Payment method card highlighted
- Form tương ứng hiển thị (nếu card) hoặc info (nếu e-wallet)
- CTA vẫn disabled (chưa valid form hoặc chưa agree terms)

### 3. Form Filled State
- Tất cả fields valid (green checkmarks)
- Terms agreed
- CTA enabled và highlighted

### 4. Loading State (Processing Payment)
- CTA showing spinner + "Đang xử lý..."
- Countdown vẫn chạy
- Disable all interactions
- Overlay với loading indicator

### 5. Payment Gateway Redirect State (E-wallet)
- User được redirect ra app MoMo/ZaloPay/Apple Pay
- App vẫn giữ session
- Khi quay lại, check payment status

### 6. Error State
- Modal hiển thị error:
  - **Card Declined**: "Thẻ bị từ chối. Vui lòng thử thẻ khác hoặc liên hệ ngân hàng."
  - **Insufficient Funds**: "Số dư không đủ. Vui lòng thử phương thức khác."
  - **Gateway Timeout**: "Kết nối bị gián đoạn. Đang kiểm tra trạng thái thanh toán..."
  - **3D Secure Required**: Redirect to 3DS page → Return
  - **Network Error**: "Mất kết nối. Vui lòng kiểm tra mạng và thử lại."
- Actions:
  - **Retry**: Thử lại với cùng method
  - **Change Method**: Quay lại chọn method khác
  - **Cancel**: Quay lại booking slots

### 7. Timeout State
- Countdown reaches 00:00
- Modal: "Hết thời gian giữ slot"
  - Text: "Slot đã được giải phóng. Vui lòng chọn lại."
  - CTA: "Chọn lại slot"
- Navigate back to 12-court-booking.md

### 8. Saved Card Expired State
- Show warning badge: "Thẻ sắp hết hạn"
- User vẫn có thể chọn nhưng cảnh báo có thể fail
- Suggest "Sử dụng thẻ mới"

---

## Edge Cases

### 1. Countdown Expires During Payment Processing
- **Scenario**: User submit payment khi còn 5s, nhưng payment mất 10s
- **Handling**:
  - Backend vẫn xử lý payment nếu submitted trước timeout
  - Frontend show loading state
  - Nếu payment success → proceed
  - Nếu slot bị người khác book ngay sau timeout → refund tự động + notify

### 2. Payment Gateway Timeout
- **Scenario**: Stripe/MoMo không trả response trong 30s
- **Handling**:
  - Frontend polling payment status mỗi 3s (max 10 lần)
  - Show: "Đang kiểm tra trạng thái thanh toán..."
  - Nếu sau 10 lần vẫn pending → "Thanh toán đang xử lý, kết quả sẽ được gửi qua email/SMS"
  - Background job check status và notify user

### 3. Card Declined
- **Scenario**: Bank từ chối thẻ
- **Handling**:
  - Show error message cụ thể từ gateway
  - Countdown vẫn chạy (slot vẫn được giữ)
  - User có thể retry hoặc đổi method

### 4. 3D Secure Redirect
- **Scenario**: Card yêu cầu 3DS verification
- **Handling**:
  - Open in-app browser hoặc WebView
  - User complete 3DS flow
  - Redirect back via deep link
  - Continue payment flow

### 5. Network Offline During Payment
- **Scenario**: User mất mạng khi tap "Xác nhận thanh toán"
- **Handling**:
  - Detect network offline trước khi submit
  - Show: "Không có kết nối mạng. Vui lòng kiểm tra và thử lại."
  - Không giảm countdown khi offline

### 6. User Navigates Back During Payment
- **Scenario**: User tap back khi đang loading payment
- **Handling**:
  - Show confirmation dialog: "Thanh toán đang xử lý. Bạn có chắc muốn hủy?"
  - Nếu confirm → Cancel payment (nếu chưa charged), release slot
  - Nếu payment đã success → Navigate to success screen

### 7. Saved Card Expired
- **Scenario**: User chọn card đã hết hạn
- **Handling**:
  - Validation khi load saved cards (gray out expired cards)
  - Show warning: "Thẻ đã hết hạn vào MM/YY"
  - Force user chọn thẻ khác hoặc add new

### 8. Discount Code Invalid
- **Scenario**: Discount code hết hạn/sai giữa chừng
- **Handling**:
  - Validate discount code real-time khi enter
  - Nếu invalid → Show error: "Mã giảm giá không hợp lệ hoặc đã hết hạn"
  - Update total amount accordingly

### 9. Price Changed
- **Scenario**: Court thay đổi giá sau khi user lock slot
- **Handling**:
  - Backend lock giá tại thời điểm lock slot
  - Frontend hiển thị giá đã lock
  - Nếu có thay đổi → Show modal thông báo trước khi payment

### 10. Multiple Payment Attempts
- **Scenario**: User spam tap CTA
- **Handling**:
  - Debounce button (disable ngay sau first tap)
  - Prevent duplicate payment submissions
  - Show loading state immediately

### 11. E-wallet App Not Installed
- **Scenario**: User chọn MoMo/ZaloPay nhưng chưa cài app
- **Handling**:
  - Check app installed (native deep link check)
  - Nếu chưa cài → Show modal: "Vui lòng cài đặt ứng dụng [MoMo/ZaloPay]"
  - CTA: "Tải ứng dụng" (mở App Store/Play Store)

### 12. Concurrent Booking Conflict
- **Scenario**: Hai users lock cùng slot, cả hai thanh toán
- **Handling**:
  - Backend atomic transaction: First payment wins
  - Second payment rejected → Refund ngay + notify
  - Show: "Slot đã được đặt. Vui lòng chọn slot khác."

---

## Ghi chú

### UX Considerations
1. **Countdown Visibility**: Timer PHẢI luôn visible (sticky) để user aware deadline
2. **Payment Security Assurance**: Hiển thị badges, SSL icons để tăng trust
3. **Error Messages**: Phải cụ thể, actionable (không chỉ "Lỗi", mà "Thẻ bị từ chối - thử thẻ khác")
4. **Loading Feedback**: Clear indication khi processing (spinner + text)
5. **Form Validation**: Real-time để user sửa ngay, không đợi submit
6. **Saved Card UX**: Nếu có, ưu tiên hiển thị để giảm friction
7. **E-wallet Guidance**: Giải thích rõ flow redirect để user không ngạc nhiên

### Validations
1. **Card Number**: Luhn check + card type detection
2. **Expiry**: Not past, < 10 years in future
3. **CVV**: 3-4 digits depending on card type
4. **Name**: Letters, spaces, hyphens only
5. **Terms Agreement**: Checkbox required
6. **Network**: Check connectivity before submit

### Error Handling Strategy
1. **User-facing errors**: Clear, Vietnamese, actionable
2. **Technical errors**: Log to backend, show generic message to user
3. **Payment failures**: Always offer retry or alternative
4. **Timeouts**: Graceful degradation, status polling
5. **Network issues**: Detect early, guide user

### Performance
- **Form rendering**: < 100ms
- **Payment submission**: Show loading immediately (< 50ms)
- **Countdown update**: Every 1s (use setInterval efficiently)
- **Card validation**: Debounce 300ms

### Security Notes
- **Never log card details** (PCI compliance)
- **Use Stripe Elements** or equivalent (tokenization)
- **HTTPS only** for all payment requests
- **CVV never stored** (even for saved cards)
- **3DS compliance** for SCA requirements

### Accessibility
- **VoiceOver/TalkBack**: Label all form fields clearly
- **Color contrast**: Error messages in high contrast red
- **Touch targets**: Min 44x44pt for all interactive elements
- **Screen reader**: Announce countdown updates (throttled to every 30s to avoid spam)

---

**Phụ thuộc vào:**
- F01 (Authentication)
- F06 (Court Discovery)
- F07 (Court Booking flow)

**Được sử dụng bởi:**
- F07 (Booking confirmation flow)
- F11 (Booking History)

**Third-party Integrations:**
- Stripe (Card payments)
- MoMo SDK (E-wallet)
- ZaloPay SDK (E-wallet)
- Apple Pay (iOS)
