# Activity Diagram: User Profile (F02)

## Feature Overview
Cho phep nguoi dung tao va quan ly profile ca nhan voi thong tin pickleball (skill level, phong cach choi, lich ranh), anh dai dien, va cac tuy chon hien thi de thu hut nguoi choi khac.

## Actors
- **Primary**: Authenticated User
- **Secondary**:
  - Storage System (Supabase Storage - upload anh)
  - CDN (serve images)

---

## Main Flow

### Flow 1: Tao Profile Lan Dau (Onboarding)

```mermaid
flowchart TD
    A[User hoan thanh Auth] --> B[Redirect Create Profile]
    B --> C[Step 1: Thong tin co ban]
    C --> D[User nhap Ten hien thi]
    D --> E[User chon Ngay sinh]
    E --> F{Tuoi >= 18?}
    F -->|Khong| G[Hien thi loi tuoi]
    G --> E
    F -->|Co| H[User chon Gioi tinh]
    H --> I[User tap 'Tiep tuc']
    I --> J[Step 2: Upload anh]
    J --> K[User tap 'Them anh']
    K --> L{Chon nguon}
    L -->|Camera| M[Mo Camera]
    L -->|Gallery| N[Mo Photo Library]
    M --> O[Chup anh]
    N --> P[Chon anh]
    O --> Q[Preview + Crop]
    P --> Q
    Q --> R[Upload to Storage]
    R --> S{Upload thanh cong?}
    S -->|Co| T[Hien thi anh trong grid]
    S -->|Khong| U[Hien thi loi upload]
    U --> K
    T --> V{Da co >= 1 anh?}
    V -->|Chua| W[Button 'Tiep tuc' disabled]
    W --> K
    V -->|Co| X[Button 'Tiep tuc' enabled]
    X --> Y[User tap 'Tiep tuc']
    Y --> Z[Step 3: Skill & Style]
    Z --> AA[User chon Skill Level]
    AA --> AB[User chon Play Style]
    AB --> AC[User chon Looking For]
    AC --> AD[User tap 'Tiep tuc']
    AD --> AE[Step 4: Lich ranh - Optional]
    AE --> AF{User muon them lich?}
    AF -->|Co| AG[Chon ngay trong tuan]
    AG --> AH[Chon khung gio]
    AH --> AI[User tap 'Hoan thanh']
    AF -->|Khong| AI
    AI --> AJ{API: Save Profile}
    AJ -->|Thanh cong| AK[Hien thi Success Animation]
    AK --> AL[Redirect Home Screen]
    AJ -->|Loi| AM[Hien thi loi]
    AM --> AI
```

#### Onboarding Steps
1. **Step 1: Basic Info** (Required)
   - Ten hien thi (2-30 ky tu)
   - Ngay sinh (must be 18+)
   - Gioi tinh (Male/Female/Other)

2. **Step 2: Photos** (Required min 1)
   - Upload 1-6 anh
   - First photo = avatar
   - Support crop/rotate

3. **Step 3: Pickleball Info** (Required)
   - Skill level: Beginner/Intermediate/Advanced/Pro
   - Play style: Competitive/Casual/Social
   - Looking for: Opponent/Doubles Partner/Dating/All (multi-select)

4. **Step 4: Availability** (Optional)
   - Chon ngay trong tuan
   - Chon khung gio (sang/chieu/toi)
   - Co the skip

---

### Flow 2: Xem Profile Cua Minh

```mermaid
flowchart TD
    A[User tap Profile Tab] --> B[Load Profile Data]
    B --> C{Data cached?}
    C -->|Co| D[Hien thi tu cache]
    C -->|Chua| E[Fetch tu server]
    D --> F[Hien thi Profile Screen]
    E --> F
    F --> G[Profile Content]
    G --> H[- Avatar carousel]
    G --> I[- Ten, tuoi, gioi tinh]
    G --> J[- Bio]
    G --> K[- Skill level badge]
    G --> L[- Play style]
    G --> M[- Looking for tags]
    G --> N[- Lich ranh]
    G --> O[- Rating va so reviews]
    F --> P[User tap 'Edit Profile']
    P --> Q[Redirect Edit Profile Screen]
    F --> R[User tap 'Preview']
    R --> S[Hien thi profile nhu nguoi khac thay]
```

---

### Flow 3: Chinh Sua Profile

```mermaid
flowchart TD
    A[User vao Edit Profile] --> B[Load current data]
    B --> C[Hien thi Edit Form]
    C --> D{User chon section?}
    D -->|Photos| E[Edit Photos Section]
    D -->|Basic Info| F[Edit Basic Info]
    D -->|Pickleball| G[Edit Pickleball Info]
    D -->|Bio| H[Edit Bio]
    D -->|Availability| I[Edit Availability]

    E --> E1[Reorder photos - drag]
    E --> E2[Delete photo]
    E --> E3[Add new photo]
    E1 --> J[Mark changes]
    E2 --> J
    E3 --> J

    F --> F1[Edit ten]
    F --> F2[Edit gioi tinh]
    F1 --> J
    F2 --> J

    G --> G1[Change skill level]
    G --> G2[Change play style]
    G --> G3[Change looking for]
    G1 --> J
    G2 --> J
    G3 --> J

    H --> H1[Edit bio text]
    H1 --> J

    I --> I1[Toggle days]
    I --> I2[Toggle time slots]
    I1 --> J
    I2 --> J

    J --> K[Enable 'Save' button]
    K --> L[User tap 'Save']
    L --> M[Validate all fields]
    M --> N{Valid?}
    N -->|Khong| O[Highlight errors]
    O --> C
    N -->|Co| P{API: Update Profile}
    P -->|Thanh cong| Q[Show success toast]
    Q --> R[Navigate back]
    P -->|Loi| S[Show error]
    S --> C
```

---

### Flow 4: Upload/Manage Photos

```mermaid
flowchart TD
    A[User tap Add Photo] --> B{So anh hien tai}
    B -->|>= 6| C[Hien thi 'Toi da 6 anh']
    B -->|< 6| D[Show action sheet]
    D --> E{Chon nguon}
    E -->|Camera| F[Request camera permission]
    F --> F1{Permission granted?}
    F1 -->|Co| F2[Mo camera]
    F1 -->|Khong| F3[Show permission guide]
    F2 --> G[Chup anh]
    E -->|Gallery| H[Request photo permission]
    H --> H1{Permission granted?}
    H1 -->|Co| H2[Mo photo picker]
    H1 -->|Khong| H3[Show permission guide]
    H2 --> I[Chon anh]
    G --> J[Show crop screen]
    I --> J
    J --> K[User crop/rotate]
    K --> L[User tap 'Done']
    L --> M[Compress image]
    M --> N[Upload to Supabase Storage]
    N --> O{Upload status}
    O -->|Success| P[Add URL to profile]
    P --> Q[Update UI]
    O -->|Failed| R[Show retry option]
    R --> S{User retry?}
    S -->|Co| N
    S -->|Khong| T[Cancel]

    subgraph Delete Flow
    U[User tap X on photo] --> V{Anh cuoi cung?}
    V -->|Co| W[Block delete - show warning]
    V -->|Khong| X[Show confirm dialog]
    X --> Y{Confirm?}
    Y -->|Co| Z[Delete from storage]
    Z --> AA[Update profile]
    Y -->|Khong| AB[Cancel]
    end
```

---

## Alternative Flows

### Alt 1: Skip Optional Fields
**Trigger**: User khong muon dien day du
- Bio: co the de trong
- Availability: co the skip
- Location: co the skip (dung GPS khi can)
- Profile van hoan thanh nhung match quality thap hon

### Alt 2: Change Avatar
**Trigger**: User muon doi anh dai dien
1. Vao edit photos
2. Drag anh muon lam avatar len vi tri dau
3. Hoac tap "Set as main" tren anh

### Alt 3: Profile Not Complete
**Trigger**: User roi app giua onboarding
1. Luu draft profile
2. Khi quay lai, hien thi "Hoan thanh profile"
3. Resume tu buoc dang dien

---

## Error Handling

### Error 1: Image Upload Failed
- **Trigger**: Network error hoac file qua lon
- **System**:
  - Retry 3 lan tu dong
  - Neu van fail, show error
- **User**: Thu lai voi anh khac hoac kiem tra mang
- **Limit**: Max 5MB per image

### Error 2: Invalid Image Format
- **Trigger**: File khong phai image
- **System**: "Chi ho tro dinh dang JPG, PNG, HEIC"
- **User**: Chon file khac

### Error 3: Profile Save Failed
- **Trigger**: Server error khi save
- **System**:
  - Luu local draft
  - "Khong the luu. Thu lai sau."
- **User**: Thu lai hoac tiep tuc dung (data duoc luu local)

### Error 4: Duplicate Display Name
- **Trigger**: Ten da duoc su dung (neu enforce unique)
- **System**: "Ten nay da duoc su dung"
- **Note**: Hien tai khong enforce unique, chi validate length

### Error 5: Camera/Photo Permission Denied
- **Trigger**: User denied permission
- **System**: Show guide cach bat permission trong Settings
- **User**: Vao Settings -> App -> Permissions

---

## Edge Cases

1. **Tuoi thay doi qua nam moi**: Hien thi tuoi hien tai, tinh tu DOB
2. **User muon an tuoi**: Privacy setting - hien thi range thay vi exact
3. **Anh bi xoa tren storage**: Show placeholder, prompt re-upload
4. **Bio qua dai**: Max 500 chars voi counter
5. **Special characters trong ten**: Allow Unicode, filter emojis
6. **User thay doi skill sau match**: Khong affect existing matches
7. **Multiple looking_for options**: Store as array, match neu co giao
8. **Timezone khac nhau**: Luu availability theo local time cua user

---

## Dependencies

- **Requires**: F01 (User Authentication)
- **Required by**: F03 (Swipe Matching), F04 (Match Management), F09 (Rating)
- **Integrates with**:
  - Supabase Storage (images)
  - Image compression library
  - Date picker component
  - Photo cropper component

---

## Data Validation Rules

| Field | Rules |
|-------|-------|
| display_name | 2-30 chars, no leading/trailing spaces |
| date_of_birth | Must be 18+ years old |
| gender | Enum: male, female, other |
| bio | Max 500 chars |
| skill_level | Enum: beginner, intermediate, advanced, pro |
| play_style | Enum: competitive, casual, social |
| looking_for | Array of: opponent, doubles_partner, dating |
| avatar_urls | 1-6 URLs, valid image format |
| availability | JSON: {day: [time_slots]} |

---

## UI/UX Notes

1. **Onboarding Progress**
   - Progress bar o tren
   - Step indicator (1/4, 2/4...)
   - Back button de quay lai step truoc
   - Skip button cho optional steps

2. **Photo Grid**
   - 2x3 grid layout
   - First slot luon la main photo
   - Empty slots show "+" icon
   - Drag to reorder

3. **Skill Level Selection**
   - Visual cards voi icon
   - Brief description cho moi level
   - Highlight selected

4. **Availability Picker**
   - Week view
   - Tap to toggle day
   - Time slots: Morning/Afternoon/Evening
   - Visual feedback khi selected

5. **Profile Preview**
   - Swipe through photos
   - Exact layout nhu nguoi khac thay
   - "This is how others see you"
