# Activity Diagram: Court Booking (F07)

## Feature Overview
Cho phep nguoi dung dat san pickleball truc tuyen voi quy trinh: chon ngay, chon slot gio, thanh toan, nhan xac nhan va ma QR de check-in tai san.

## Actors
- **Primary**: Authenticated User
- **Secondary**:
  - Payment Gateway (Stripe)
  - Booking System
  - Email/SMS Service (confirmations)
  - QR Code Generator

---

## Main Flow

### Flow 1: Bat Dau Dat San

```mermaid
flowchart TD
    A[User tap 'Dat san' tu Court Detail] --> B[Navigate to Booking Screen]
    B --> C[Show court summary header]
    C --> D[Name, address, price/hour]
    D --> E[Load booking calendar]
    E --> F[Show current month]
    F --> G[Highlight available dates]
    G --> H[Gray out past dates]
    H --> I[User select date]
    I --> J[Fetch available slots for date]
    J --> K[Show time slots grid]
```

---

### Flow 2: Chon Ngay va Gio

```mermaid
flowchart TD
    A[User xem calendar] --> B[Tap on date]
    B --> C{Date available?}
    C -->|Khong| D[Show 'Het slot' or past date]
    C -->|Co| E[Highlight selected date]
    E --> F[Fetch slots for date]
    F --> G[Show loading]
    G --> H[Display time slots]
    H --> I[Slot states:]
    I --> J[- Available: Green/selectable]
    I --> K[- Booked: Red/disabled]
    I --> L[- Selected: Blue/highlighted]
    I --> M[- Locked: Orange/someone booking]

    H --> N[User tap slot]
    N --> O{Slot available?}
    O -->|Khong| P[Show 'Slot da duoc dat']
    O -->|Co| Q[Select slot]
    Q --> R{Already have slots selected?}
    R -->|Co| S{Adjacent to existing?}
    S -->|Co| T[Add to selection]
    S -->|Khong| U[Ask: Replace or Add?]
    U -->|Replace| V[Clear previous, select new]
    U -->|Add| W[Allow non-adjacent - separate bookings]
    R -->|Chua| X[First slot selected]
    T --> Y[Update total price]
    V --> Y
    W --> Y
    X --> Y
    Y --> Z[Enable 'Tiep tuc' button]
```

---

### Flow 3: Lock Slot va Review

```mermaid
flowchart TD
    A[User tap 'Tiep tuc'] --> B[API: Lock selected slots]
    B --> C{Lock success?}
    C -->|Co| D[Slots locked for 10 min]
    D --> E[Show countdown timer]
    E --> F[Display Booking Summary]
    F --> G[- San: Ten san]
    F --> H[- Ngay: DD/MM/YYYY]
    F --> I[- Gio: HH:MM - HH:MM]
    F --> J[- Thoi luong: X gio]
    F --> K[- Gia: XXX.XXXd/gio]
    F --> L[- Tong: XXX.XXXd]
    L --> M[- Discount code input - optional]
    M --> N[Apply discount if valid]
    N --> O[Update total]

    C -->|Khong| P[Slot da bi dat boi nguoi khac]
    P --> Q[Show error]
    Q --> R[Refresh available slots]

    E --> S{Timer expires?}
    S -->|Co| T[Slots released]
    T --> U[Show 'Het thoi gian']
    U --> V[Option: Chon lai]
```

---

### Flow 4: Thanh Toan

```mermaid
flowchart TD
    A[User tap 'Thanh toan'] --> B[Show Payment Methods]
    B --> C[Options:]
    C --> D[- The noi dia ATM]
    C --> E[- Visa/Mastercard]
    C --> F[- MoMo]
    C --> G[- ZaloPay]
    C --> H[- Apple Pay - iOS]

    D --> I[User select method]
    E --> I
    F --> I
    G --> I
    H --> I

    I --> J{Method = Card?}
    J -->|Co| K[Show card input form]
    K --> L[Card number, expiry, CVV]
    L --> M{Save card?}
    M -->|Co| N[Mark for tokenization]
    M -->|Khong| O[One-time use]
    N --> P[Submit payment]
    O --> P

    J -->|Khong - MoMo/Zalo| Q[Redirect to app]
    Q --> R[Complete payment in wallet app]
    R --> S[Return to app via deep link]

    P --> T{Payment result}
    S --> T
    T -->|Success| U[Payment confirmed]
    T -->|Failed| V[Show error]
    T -->|Cancelled| W[Return to summary]
    V --> X[Retry or change method]
```

---

### Flow 5: Xac Nhan Booking

```mermaid
flowchart TD
    A[Payment Success] --> B[Create booking record]
    B --> C[Generate QR code]
    C --> D[Generate booking reference]
    D --> E[Show Success Screen]
    E --> F[Confetti animation]
    F --> G[Booking Confirmation:]
    G --> H[- Reference: PB-XXXXXX]
    G --> I[- San: Ten san]
    G --> J[- Ngay gio chi tiet]
    G --> K[- QR Code hinh anh]
    G --> L[- 'Them vao Calendar']
    G --> M[- 'Chia se']

    E --> N[Send confirmation email]
    E --> O[Send SMS confirmation]
    E --> P[Schedule reminder notification]
    P --> Q[2h truoc booking]

    E --> R[User actions:]
    R --> S[Tap 'Xong' -> Home]
    R --> T[Tap 'Xem booking' -> Booking Detail]
    R --> L
    L --> U[Add to device calendar]
```

---

### Flow 6: Huy Booking

```mermaid
flowchart TD
    A[User vao Booking Detail] --> B[Show booking info + QR]
    B --> C[User tap 'Huy booking']
    C --> D[Check cancellation policy]
    D --> E{How long before booking?}
    E -->|> 24h| F[Full refund available]
    E -->|12-24h| G[50% refund]
    E -->|< 12h| H[No refund]
    E -->|< 2h| I[Cannot cancel]

    F --> J[Show refund amount]
    G --> J
    H --> J
    J --> K[Confirmation dialog]
    K --> L{'Xac nhan huy?'}
    L --> M[Show refund info]
    M --> N{User confirm?}
    N -->|Cancel| O[Close dialog]
    N -->|Confirm| P[API: Cancel booking]
    P --> Q{Success?}
    Q -->|Co| R[Process refund]
    R --> S[Update booking status]
    S --> T[Send cancellation email]
    T --> U[Show success: 'Da huy']
    Q -->|Loi| V[Show error - retry]

    I --> W[Show 'Khong the huy']
    W --> X[Explain policy]
```

---

## Alternative Flows

### Alt 1: Invite Match to Booking
**Trigger**: User muon moi nguoi da match choi cung
1. After selecting slots, option "Moi nguoi choi"
2. Show list of matches
3. Select match(es)
4. Send invitation via chat
5. Match co the chap nhan/tu choi
6. Neu chap nhan, chia tien (split payment - future)

**Note**: MVP chi send invitation, chua co split payment

### Alt 2: Rebook from History
**Trigger**: User muon dat lai san da dat truoc
1. Tu Booking History, tap "Dat lai"
2. Pre-fill court selection
3. Show calendar for new date
4. Continue booking flow

### Alt 3: Saved Card Payment
**Trigger**: User co card da luu
1. Show saved cards
2. User select card
3. Enter CVV only
4. Process payment

---

## Error Handling

### Error 1: Slot Conflict
- **Trigger**: Slot bi dat ngay khi user dang thanh toan
- **System**:
  - Detect before payment
  - Show "Slot da bi dat"
  - Suggest alternative slots
- **User**: Chon slot khac

### Error 2: Payment Failed
- **Trigger**: Card declined, insufficient funds
- **System**:
  - Show specific error message
  - Keep slots locked (countdown continues)
- **User**: Retry or change payment method

### Error 3: Payment Gateway Timeout
- **Trigger**: Stripe/MoMo timeout
- **System**:
  - Check payment status
  - If pending, poll for result
  - If failed, allow retry
- **User**: Wait or retry

### Error 4: Lock Expired During Payment
- **Trigger**: 10 min timeout
- **System**:
  - Cancel payment attempt
  - Release slots
  - "Het thoi gian giu slot"
- **User**: Start over

### Error 5: QR Generation Failed
- **Trigger**: Service error
- **System**:
  - Booking still confirmed
  - QR generated later
  - Send via email/SMS
- **User**: "QR se duoc gui qua email"

### Error 6: Network Error During Booking
- **Trigger**: Connection lost
- **System**:
  - If pre-payment: lose lock, retry
  - If during payment: check status when reconnect
  - If post-payment: booking confirmed (server-side)
- **User**: Specific guidance per stage

---

## Edge Cases

1. **Midnight booking**: Handle date change correctly
2. **Timezone differences**: Use court's local timezone
3. **Last slot of day**: Validate against closing time
4. **Concurrent booking attempts**: First to lock wins
5. **Price change during session**: Use price at lock time
6. **Partial day availability**: Show only available slots
7. **Holiday pricing**: Show special price, explain
8. **Double booking prevention**: Database constraint + lock
9. **Booking for tomorrow past midnight**: Allow within policy
10. **Court closes permanently**: Refund pending bookings

---

## Dependencies

- **Requires**:
  - F01 (Authentication)
  - F06 (Court Discovery)
- **Required by**:
  - F09 (Rating & Review - after booking)
  - F11 (Booking History)
- **Integrates with**:
  - Stripe Payment Gateway
  - MoMo/ZaloPay SDK
  - F08 (Push Notifications - reminders)
  - Calendar API (device)
  - Email/SMS services

---

## Data Structure

### Booking Object
```typescript
interface Booking {
  id: string;
  reference: string; // PB-XXXXXX
  user_id: string;
  court_id: string;
  court: { name: string; address: string; };
  date: Date;
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  duration_hours: number;
  price_per_hour: number;
  discount_code?: string;
  discount_amount: number;
  total_amount: number;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'refunded' | 'partial_refund';
  booking_status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  qr_code: string;
  created_at: DateTime;
  cancelled_at?: DateTime;
  cancellation_reason?: string;
}
```

### Slot Object
```typescript
interface TimeSlot {
  court_id: string;
  date: Date;
  start_time: string;
  end_time: string;
  status: 'available' | 'locked' | 'booked';
  locked_by?: string; // user_id
  locked_until?: DateTime;
  booking_id?: string;
  price: number;
}
```

### Payment Object
```typescript
interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  currency: 'VND';
  method: 'card' | 'momo' | 'zalopay' | 'apple_pay';
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  stripe_payment_id?: string;
  momo_transaction_id?: string;
  created_at: DateTime;
  completed_at?: DateTime;
}
```

---

## Cancellation Policy

| Time Before Booking | Refund |
|---------------------|--------|
| > 24 hours | 100% |
| 12-24 hours | 50% |
| 2-12 hours | 0% |
| < 2 hours | Cannot cancel |

**Note**: Policy configurable per court

---

## Security Considerations

1. **Payment Security**
   - PCI DSS compliant (Stripe handles card data)
   - Never store raw card numbers
   - Use payment tokens

2. **Slot Lock Security**
   - Verify user owns lock before payment
   - Auto-release on timeout
   - Prevent lock abuse (max 2 concurrent locks)

3. **QR Code Security**
   - One-time use (scan invalidates)
   - Include booking hash for verification
   - Expire after booking time

---

## UI/UX Notes

1. **Calendar Design**
   - Month view, swipe to navigate
   - Today highlighted
   - Available dates in green
   - Selected date with circle

2. **Time Slots Grid**
   - 1-hour slots (or 30-min if court allows)
   - Visual distinction for states
   - Multi-select capability
   - Show price per slot

3. **Countdown Timer**
   - Prominent at top
   - Color change when < 2 min
   - Explain why timer exists

4. **Payment Form**
   - Card input with formatting
   - Card type detection (Visa, MC)
   - Clear CTAs for wallets

5. **Success Screen**
   - Celebratory animation
   - QR prominent
   - Easy add to calendar
   - Share option

6. **Booking Detail**
   - QR large and scannable
   - All booking info
   - Clear cancel policy
   - Navigation to court
