# Activity Diagram: User Settings (F12)

## Feature Overview
Cho phep nguoi dung quan ly tai khoan, cai dat discovery preferences, notifications, privacy, va cac tuy chon khac nhu logout va xoa tai khoan.

## Actors
- **Primary**: Authenticated User
- **Secondary**:
  - Auth System (password, logout, delete)
  - Notification System (preferences)

---

## Main Flow

### Flow 1: Truy Cap Settings

```mermaid
flowchart TD
    A[User tap Profile tab] --> B[Profile Screen]
    B --> C[Tap gear icon / 'Cai dat']
    C --> D[Settings Screen]
    D --> E[Sections:]
    E --> F[1. Tai khoan]
    E --> G[2. Discovery Preferences]
    E --> H[3. Thong bao]
    E --> I[4. Quyen rieng tu]
    E --> J[5. Ho tro]
    E --> K[6. Phap ly]
    E --> L[7. Dang xuat / Xoa tai khoan]
```

---

### Flow 2: Quan Ly Tai Khoan

```mermaid
flowchart TD
    A[Tap 'Tai khoan'] --> B[Account Settings]
    B --> C[- Email: user@email.com]
    B --> D[- So dien thoai: 09xx xxx xxx]
    B --> E[- Doi mat khau]
    B --> F[- Lien ket tai khoan]

    C --> G[Tap Email]
    G --> H[Edit Email Screen]
    H --> I[Enter new email]
    I --> J[Verify with password]
    J --> K[Send verification to new email]
    K --> L[Confirm change]

    D --> M[Tap Phone]
    M --> N[Edit Phone Screen]
    N --> O[Enter new phone]
    O --> P[Send OTP]
    P --> Q[Verify OTP]
    Q --> R[Update phone]

    E --> S[Tap 'Doi mat khau']
    S --> T[Change Password Screen]
    T --> U[Enter current password]
    U --> V[Enter new password]
    V --> W[Confirm new password]
    W --> X{Passwords match & valid?}
    X -->|Co| Y[API: Update password]
    Y --> Z[Success - all sessions logged out]
    X -->|Khong| AA[Show error]

    F --> AB[Linked Accounts]
    AB --> AC[Show: Google, Facebook, Apple]
    AC --> AD[User can link/unlink]
```

---

### Flow 3: Discovery Preferences

```mermaid
flowchart TD
    A[Tap 'Discovery Preferences'] --> B[Discovery Settings]
    B --> C[Settings:]
    C --> D[1. Khoang cach toi da]
    C --> E[2. Do tuoi]
    C --> F[3. Skill level]
    C --> G[4. Play style]

    D --> H[Distance Slider: 1-50 km]
    H --> I[Current: 25 km]
    I --> J[User adjusts]
    J --> K[Preview: ~X profiles]

    E --> L[Age Range Slider]
    L --> M[Min: 18 - Max: 60]
    M --> N[Current: 20-35]
    N --> O[User adjusts]

    F --> P[Skill Checkboxes]
    P --> Q[- Beginner]
    P --> R[- Intermediate]
    P --> S[- Advanced]
    P --> T[- Pro]
    Q --> U[Multi-select]
    R --> U
    S --> U
    T --> U

    G --> V[Play Style Checkboxes]
    V --> W[- Competitive]
    V --> X[- Casual]
    V --> Y[- Social]

    U --> Z[Auto-save on change]
    Z --> AA[Affect swipe queue]
```

---

### Flow 4: Cai Dat Thong Bao

```mermaid
flowchart TD
    A[Tap 'Thong bao'] --> B[Notification Settings]
    B --> C[Master Toggle: Bat/Tat]
    C --> D{Master = On?}
    D -->|Off| E[All notifications disabled]
    D -->|On| F[Show individual toggles]
    F --> G[- Match moi: On/Off]
    F --> H[- Tin nhan: On/Off]
    F --> I[- Nhac booking: On/Off]
    F --> J[- Khuyen mai: On/Off]
    F --> K[- Am thanh: On/Off]
    F --> L[- Rung: On/Off]

    G --> M[User toggles]
    M --> N[Auto-save]
    N --> O[Sync to server]
```

---

### Flow 5: Cai Dat Quyen Rieng Tu

```mermaid
flowchart TD
    A[Tap 'Quyen rieng tu'] --> B[Privacy Settings]
    B --> C[Options:]
    C --> D[1. An profile - Pause discovery]
    C --> E[2. An trang thai online]
    C --> F[3. An tuoi chinh xac]
    C --> G[4. An khoang cach chinh xac]

    D --> H[Toggle: An profile]
    H --> I{On?}
    I -->|Co| J[Profile khong hien thi trong swipe]
    I -->|Khong| K[Profile visible]
    J --> L[Warning: 'Ban se khong match moi']

    E --> M[Toggle: An online status]
    M --> N{On?}
    N -->|Co| O[Always show 'Offline']
    N -->|Khong| P[Show real status]

    F --> Q[Toggle: An tuoi]
    Q --> R{On?}
    R -->|Co| S[Show range: '25-30']
    R -->|Khong| T[Show exact: '27']

    G --> U[Toggle: An khoang cach]
    U --> V{On?}
    V -->|Co| W[Show: 'Gan day']
    V -->|Khong| X[Show exact: '5 km']
```

---

### Flow 6: Ho Tro

```mermaid
flowchart TD
    A[Tap 'Ho tro'] --> B[Support Options]
    B --> C[- FAQ]
    B --> D[- Lien he ho tro]
    B --> E[- Bao cao su co]

    C --> F[FAQ Screen]
    F --> G[Searchable list]
    G --> H[Categorized questions]

    D --> I[Contact Options]
    I --> J[- Email: support@app.com]
    I --> K[- In-app chat - future]
    J --> L[Open email client]

    E --> M[Report Issue]
    M --> N[Select category]
    N --> O[Describe issue]
    O --> P[Attach screenshot - optional]
    P --> Q[Submit]
    Q --> R[Confirmation]
```

---

### Flow 7: Phap Ly

```mermaid
flowchart TD
    A[Tap 'Phap ly'] --> B[Legal Documents]
    B --> C[- Dieu khoan su dung]
    B --> D[- Chinh sach quyen rieng tu]
    B --> E[- Giay phep]

    C --> F[Terms Screen]
    F --> G[WebView/Markdown]

    D --> H[Privacy Policy Screen]
    H --> I[WebView/Markdown]

    E --> J[Licenses Screen]
    J --> K[Open source licenses]
```

---

### Flow 8: Dang Xuat

```mermaid
flowchart TD
    A[Tap 'Dang xuat'] --> B[Confirmation Dialog]
    B --> C['Ban muon dang xuat?']
    C --> D{Confirm?}
    D -->|Cancel| E[Close dialog]
    D -->|Dang xuat| F[API: Logout]
    F --> G[Clear local session]
    G --> H[Clear cached data]
    H --> I[Unregister push token]
    I --> J[Navigate to Welcome Screen]
```

---

### Flow 9: Xoa Tai Khoan

```mermaid
flowchart TD
    A[Tap 'Xoa tai khoan'] --> B[Warning Screen]
    B --> C[Explain consequences:]
    C --> D[- Profile se bi xoa vinh vien]
    C --> E[- Matches va tin nhan se mat]
    C --> F[- Bookings sap toi se bi huy]
    C --> G[- Khong the khoi phuc]
    D --> H[Grace period: 30 ngay]
    H --> I[User tap 'Tiep tuc']
    I --> J[Confirm identity]
    J --> K{Auth method?}
    K -->|Password| L[Enter password]
    K -->|Social| M[Re-authenticate with provider]
    L --> N{Correct?}
    M --> N
    N -->|Khong| O[Show error]
    N -->|Co| P[Final confirmation]
    P --> Q['Xac nhan xoa tai khoan?']
    Q --> R{Confirm?}
    R -->|Cancel| S[Back to Settings]
    R -->|Xoa| T[API: Delete account]
    T --> U[Mark account for deletion]
    U --> V[Send confirmation email]
    V --> W[Logout user]
    W --> X[Navigate to Welcome]
    X --> Y[Show: 'Tai khoan se bi xoa sau 30 ngay']
```

**Account Deletion Details:**
- 30-day grace period
- User can login within 30 days to cancel deletion
- After 30 days, data permanently deleted
- Active bookings refunded according to policy

---

## Alternative Flows

### Alt 1: Reactivate Account
**Trigger**: User logs in during 30-day deletion period
1. Show "Tai khoan dang cho xoa"
2. Option: "Huy xoa tai khoan"
3. If confirmed, reactivate account
4. All data preserved

### Alt 2: Cannot Change Email (Social Account)
**Trigger**: Account created via Google/Facebook
1. Email tied to social provider
2. Show explanation
3. Option to add password login first

### Alt 3: Forgot Current Password
**Trigger**: User wants to change password but forgot current
1. Link to "Quen mat khau"
2. Reset via email
3. Then can set new password

---

## Error Handling

### Error 1: Update Failed
- **Trigger**: Network error
- **System**: Show error toast
- **User**: Retry
- **Note**: Don't lose form data

### Error 2: Invalid Password
- **Trigger**: Wrong current password
- **System**: "Mat khau hien tai khong dung"
- **User**: Re-enter or reset

### Error 3: Email Already Used
- **Trigger**: New email exists in system
- **System**: "Email nay da duoc su dung"
- **User**: Use different email

### Error 4: Social Unlink Failed
- **Trigger**: Only one login method remaining
- **System**: "Khong the go lien ket - can it nhat 1 phuong thuc dang nhap"
- **User**: Link another method first

### Error 5: Logout Failed
- **Trigger**: Network error during logout
- **System**: Clear local data anyway
- **User**: Token invalidated on next server sync

---

## Edge Cases

1. **Only social login**: Cannot change password (no password set)
2. **Multiple social accounts**: Can unlink all except one
3. **Email = phone login**: Both update together
4. **Settings sync across devices**: Real-time via backend
5. **Old app version**: Show upgrade prompt
6. **Legal document updated**: Show "Updated" badge
7. **Support response**: Via email, no in-app tracking yet

---

## Dependencies

- **Requires**:
  - F01 (Authentication)
- **Required by**: None
- **Integrates with**:
  - F03 (Discovery - preferences affect swipe)
  - F08 (Notifications - settings)
  - F02 (Profile - privacy affects display)

---

## Data Structure

### User Settings
```typescript
interface UserSettings {
  user_id: string;

  // Discovery preferences
  discovery: {
    max_distance_km: number;
    age_range: { min: number; max: number };
    skill_levels: SkillLevel[];
    play_styles: PlayStyle[];
  };

  // Notification preferences
  notifications: {
    enabled: boolean;
    new_match: boolean;
    new_message: boolean;
    booking_reminder: boolean;
    promotions: boolean;
    sound: boolean;
    vibration: boolean;
  };

  // Privacy settings
  privacy: {
    hide_profile: boolean;
    hide_online_status: boolean;
    hide_exact_age: boolean;
    hide_exact_distance: boolean;
  };

  updated_at: DateTime;
}
```

### Account Deletion Request
```typescript
interface AccountDeletionRequest {
  user_id: string;
  requested_at: DateTime;
  scheduled_deletion_at: DateTime; // +30 days
  status: 'pending' | 'cancelled' | 'completed';
  cancelled_at?: DateTime;
}
```

---

## UI/UX Notes

1. **Settings List**
   - Grouped sections
   - Icons for each item
   - Chevron for drill-down
   - Toggle inline for simple settings

2. **Sliders**
   - Show current value
   - Snap to increments
   - Preview count update

3. **Toggles**
   - iOS-style switch
   - Immediate feedback
   - Auto-save

4. **Destructive Actions**
   - Red text/button
   - Confirmation required
   - Clear consequences

5. **Account Deletion**
   - Multi-step process
   - Clear warnings
   - Easy to cancel

6. **Legal Documents**
   - Readable font
   - Scroll indicator
   - Last updated date
