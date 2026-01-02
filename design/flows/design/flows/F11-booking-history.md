# Activity Diagram: Booking History (F11)

## Feature Overview
Cho phep nguoi dung xem lich su dat san, theo doi trang thai booking, huy booking theo chinh sach, va dat lai tu booking cu.

## Actors
- **Primary**: Authenticated User (da co bookings)
- **Secondary**:
  - Booking System
  - Payment System (refunds)

---

## Main Flow

### Flow 1: Xem Danh Sach Bookings

```mermaid
flowchart TD
    A[User tap 'Lich su dat san'] --> B[Fetch booking history]
    B --> C{Cache valid?}
    C -->|Co| D[Show cached + background refresh]
    C -->|Chua| E[Show loading]
    E --> F[Fetch from server]
    D --> G[Display booking list]
    F --> G
    G --> H[Tab filters:]
    H --> I[Tab 1: Sap toi]
    H --> J[Tab 2: Da hoan thanh]
    H --> K[Tab 3: Da huy]

    I --> L[Show upcoming bookings]
    L --> M[Sort: Nearest first]
    J --> N[Show completed bookings]
    N --> O[Sort: Recent first]
    K --> P[Show cancelled bookings]
    P --> Q[Sort: Recent first]
```

---

### Flow 2: Xem Chi Tiet Booking

```mermaid
flowchart TD
    A[User tap booking card] --> B[Navigate to Booking Detail]
    B --> C[Fetch booking details]
    C --> D[Display info:]
    D --> E[- Ma booking: PB-XXXXXX]
    D --> F[- Trang thai badge]
    D --> G[- QR Code - neu upcoming]
    D --> H[- San: Ten + dia chi]
    D --> I[- Ngay: DD/MM/YYYY]
    D --> J[- Gio: HH:MM - HH:MM]
    D --> K[- Thoi luong: X gio]
    D --> L[- Thanh toan: XXX.XXXd]
    D --> M[- Phuong thuc thanh toan]

    G --> N{Status = Upcoming?}
    N -->|Co| O[Show QR large]
    N -->|Khong| P[Hide QR]

    D --> Q[Actions based on status:]
    Q --> R{Status?}
    R -->|Upcoming| S[- Huy booking]
    R -->|Upcoming| T[- Chi duong]
    R -->|Completed| U[- Danh gia san]
    R -->|Completed| V[- Dat lai]
    R -->|Cancelled| W[- Dat lai]
```

---

### Flow 3: Huy Booking

```mermaid
flowchart TD
    A[User tap 'Huy booking'] --> B[Check cancellation eligibility]
    B --> C{Time until booking?}
    C -->|< 2h| D[Cannot cancel]
    D --> E[Show: 'Khong the huy truoc 2h']
    C -->|>= 2h| F[Calculate refund]
    F --> G{Time check}
    G -->|> 24h| H[100% refund]
    G -->|12-24h| I[50% refund]
    G -->|2-12h| J[0% refund]

    H --> K[Show refund amount]
    I --> K
    J --> K
    K --> L[Confirmation dialog]
    L --> M['Xac nhan huy booking?']
    M --> N[Show refund info]
    N --> O{User confirm?}
    O -->|Cancel| P[Close dialog]
    O -->|Confirm| Q[API: Cancel booking]
    Q --> R{Success?}
    R -->|Co| S[Process refund]
    S --> T[Update booking status]
    T --> U[Send confirmation email]
    U --> V[Show: 'Da huy thanh cong']
    V --> W[Refund in 3-5 ngay]
    R -->|Loi| X[Show error]
    X --> Y[Retry or contact support]
```

---

### Flow 4: Dat Lai (Rebook)

```mermaid
flowchart TD
    A[User tap 'Dat lai'] --> B[Load court info]
    B --> C{Court still active?}
    C -->|Khong| D[Show: 'San nay da ngung hoat dong']
    D --> E[Suggest similar courts]
    C -->|Co| F[Navigate to Booking Screen]
    F --> G[Pre-select court]
    G --> H[Show calendar]
    H --> I[User select new date/time]
    I --> J[Continue normal booking flow]
```

---

### Flow 5: Nhan QR Code

```mermaid
flowchart TD
    A[User vao Booking Detail - Upcoming] --> B[Show QR Code]
    B --> C[QR contains:]
    C --> D[- Booking reference]
    C --> E[- User ID hash]
    C --> F[- Timestamp]
    C --> G[- Signature]

    B --> H[User actions:]
    H --> I[Tap 'Phong to']
    I --> J[Full screen QR]
    J --> K[Increase brightness]
    K --> L[Easy scan]

    H --> M[Tap 'Luu anh']
    M --> N[Save QR to gallery]
    N --> O[Show confirmation]

    H --> P[Tap 'Chia se']
    P --> Q[Share QR image]
```

---

### Flow 6: Chi Duong Den San

```mermaid
flowchart TD
    A[User tap 'Chi duong'] --> B[Get court location]
    B --> C{Maps app available?}
    C -->|Google Maps| D[Open Google Maps]
    C -->|Apple Maps| E[Open Apple Maps]
    C -->|Khong co| F[Show in-app map]
    D --> G[Navigate to court]
    E --> G
    F --> H[Show court on map]
    H --> I[Option to copy address]
```

---

### Flow 7: Empty States

```mermaid
flowchart TD
    A[No bookings] --> B{Which tab?}
    B -->|Sap toi| C['Chua co booking nao']
    C --> D[CTA: 'Dat san ngay']
    D --> E[Navigate to Court Discovery]

    B -->|Da hoan thanh| F['Chua co booking hoan thanh']
    F --> G[Illustration]

    B -->|Da huy| H['Khong co booking bi huy']
    H --> I[Illustration]
```

---

## Alternative Flows

### Alt 1: Booking About to Start
**Trigger**: < 30 min until booking
1. Show prominent reminder
2. Quick access to QR
3. Directions button prominent
4. Disable cancel (< 2h rule)

### Alt 2: Missed Booking
**Trigger**: User didn't show up
1. Mark as "No show" (by court staff)
2. Show in Completed tab
3. No refund
4. May affect future bookings (policy)

### Alt 3: Court Staff Cancels
**Trigger**: Court cancels booking
1. Notify user immediately
2. Full refund automatically
3. Show "Huy boi san" status
4. Suggest rebooking

---

## Error Handling

### Error 1: Load Failed
- **Trigger**: Network error
- **System**: Show cached bookings
- **User**: Pull to refresh
- **Stale indicator**: "Cap nhat luc X"

### Error 2: Cancel Failed
- **Trigger**: Server error
- **System**: Show error message
- **User**: Retry or contact support
- **Note**: Don't auto-retry (destructive)

### Error 3: Refund Processing Error
- **Trigger**: Payment gateway issue
- **System**:
  - Booking still cancelled
  - Log for manual refund
  - Notify user: "Hoan tien trong 5-7 ngay"
- **User**: Contact support if not received

### Error 4: QR Generation Failed
- **Trigger**: Service error
- **System**:
  - Booking still valid
  - Retry QR generation
  - Show booking reference as backup
- **User**: "Dung ma booking de check-in"

---

## Edge Cases

1. **Multiple bookings same day**: Show all, sort by time
2. **Very old bookings**: Paginate, load on scroll
3. **Booking in progress**: Show "Dang dien ra" badge
4. **Timezone change**: Show in court's timezone
5. **Device change**: QR available on new device (same account)
6. **Screenshot QR**: Still valid (one-time scan at court)
7. **Booking edited by admin**: Show "Da cap nhat" + changes
8. **Price changed after booking**: Honor original price

---

## Dependencies

- **Requires**:
  - F01 (Authentication)
  - F07 (Court Booking - creates bookings)
- **Required by**: None
- **Integrates with**:
  - F06 (Court Discovery - for rebooking)
  - F09 (Rating & Review - rate after completion)
  - Maps apps (directions)
  - Device calendar (export)
  - Photo gallery (save QR)

---

## Data Structure

### Booking Summary (List View)
```typescript
interface BookingSummary {
  id: string;
  reference: string;
  court_name: string;
  court_image: string;
  date: Date;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  total_amount: number;
}
```

### Booking Detail
```typescript
interface BookingDetail {
  id: string;
  reference: string;
  user_id: string;
  court: {
    id: string;
    name: string;
    address: string;
    image: string;
    location: { lat: number; lng: number };
    phone?: string;
  };
  date: Date;
  start_time: string;
  end_time: string;
  duration_hours: number;
  price_per_hour: number;
  discount_code?: string;
  discount_amount: number;
  total_amount: number;
  payment_method: string;
  payment_status: PaymentStatus;
  booking_status: BookingStatus;
  qr_code?: string;
  created_at: DateTime;
  cancelled_at?: DateTime;
  cancellation_reason?: string;
  refund_amount?: number;
  refund_status?: RefundStatus;
}

type BookingStatus = 'confirmed' | 'cancelled' | 'completed' | 'no_show';
type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'partial_refund';
type RefundStatus = 'pending' | 'processed' | 'failed';
```

---

## Cancellation Policy Display

| Condition | Refund | UI Display |
|-----------|--------|------------|
| > 24h before | 100% | "Hoan 100%" - Green |
| 12-24h before | 50% | "Hoan 50%" - Yellow |
| 2-12h before | 0% | "Khong hoan tien" - Red |
| < 2h before | N/A | "Khong the huy" - Disabled |

---

## UI/UX Notes

1. **Tab Design**
   - Pill tabs or underline
   - Badge count for upcoming
   - Swipe between tabs

2. **Booking Card**
   - Court image left
   - Key info right
   - Status badge colored
   - Subtle shadow

3. **QR Code Display**
   - Large, centered
   - White background
   - Zoom button
   - Save/Share options

4. **Status Badges**
   - Confirmed: Blue
   - Completed: Green
   - Cancelled: Red/Gray
   - No show: Orange

5. **Cancel Confirmation**
   - Clear refund info
   - Destructive button red
   - Easy cancel (back out)

6. **Empty States**
   - Friendly illustration
   - Contextual message
   - Action button

7. **Pull to Refresh**
   - Custom animation
   - Last updated time
