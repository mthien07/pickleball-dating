# Activity Diagram: Coach Directory (F10)

## Feature Overview
Hien thi danh sach huan luyen vien (HLV) pickleball voi thong tin co ban de nguoi dung tim va lien he truc tiep. Data duoc quan ly boi admin, khong co booking qua app (MVP scope).

## Actors
- **Primary**: Authenticated User
- **Secondary**:
  - Admin (quan ly data HLV)
  - Phone dialer (call HLV)

---

## Main Flow

### Flow 1: Xem Danh Sach HLV

```mermaid
flowchart TD
    A[User tap 'HLV' tab/menu] --> B[Fetch coach list]
    B --> C{Data cached?}
    C -->|Co| D[Show cached + background refresh]
    C -->|Chua| E[Show loading]
    E --> F[Fetch from server]
    D --> G[Display coach cards]
    F --> G
    G --> H[Each card shows:]
    H --> I[- Anh HLV]
    H --> J[- Ten]
    H --> K[- Chung chi/Cap bac]
    H --> L[- Kinh nghiem: X nam]
    H --> M[- Gia: XXXk/gio]
    H --> N[- Rating: X.X stars]
    H --> O[- Khu vuc]
```

---

### Flow 2: Filter HLV

```mermaid
flowchart TD
    A[User tap Filter] --> B[Show filter options]
    B --> C[Filters:]
    C --> D[- Khu vuc: Dropdown]
    C --> E[- Gia: Range slider]
    C --> F[- Rating: Min stars]
    C --> G[- Skill focus: Beginner/Advanced]

    D --> H[User selects]
    E --> H
    F --> H
    G --> H
    H --> I[Preview count: X HLV]
    I --> J[User tap 'Ap dung']
    J --> K[Apply filters]
    K --> L[Update list]
```

---

### Flow 3: Xem Chi Tiet HLV

```mermaid
flowchart TD
    A[User tap coach card] --> B[Navigate to Coach Detail]
    B --> C[Fetch full profile]
    C --> D[Display:]
    D --> E[- Photo gallery]
    D --> F[- Ten + Chung chi]
    D --> G[- Bio chi tiet]
    D --> H[- Kinh nghiem]
    D --> I[- Thanh tich]
    D --> J[- Chuyen mon: Skills taught]
    D --> K[- Gia: XXXk - XXXk/gio]
    D --> L[- Khu vuc hoat dong]
    D --> M[- Rating + Reviews]
    D --> N[- So dien thoai - hidden]

    M --> O[User tap 'Xem reviews']
    O --> P[Show coach reviews]

    D --> Q[CTA: 'Lien he']
    Q --> R[Show contact options]
```

---

### Flow 4: Lien He HLV

```mermaid
flowchart TD
    A[User tap 'Lien he'] --> B[Show contact sheet]
    B --> C[- Goi dien]
    B --> D[- Nhan tin SMS]
    B --> E[- Copy so dien thoai]

    C --> F[Tap 'Goi dien']
    F --> G[Open phone dialer]
    G --> H[Pre-filled with coach phone]

    D --> I[Tap 'Nhan tin']
    I --> J[Open SMS app]
    J --> K[Pre-filled recipient]

    E --> L[Tap 'Copy']
    L --> M[Copy to clipboard]
    M --> N[Show 'Da copy']
```

**Note**: Booking/Payment voi HLV nam ngoai scope MVP. User tu lien he va thanh toan truc tiep.

---

### Flow 5: Xem Reviews HLV

```mermaid
flowchart TD
    A[Coach Reviews Screen] --> B[Show overall rating]
    B --> C[Rating breakdown]
    C --> D[- Chuyen mon: 4.8]
    C --> E[- Giao tiep: 4.5]
    C --> F[- Dung gio: 4.7]
    D --> G[List reviews]
    E --> G
    F --> G
    G --> H[Each review:]
    H --> I[- Student avatar/name]
    H --> J[- Stars]
    H --> K[- Comment]
    H --> L[- Date]
```

**Note (MVP)**: Coach reviews managed by admin. Users cannot submit reviews yet.

---

## Alternative Flows

### Alt 1: No Coaches in Area
**Trigger**: Filter returns empty
1. Show "Chua co HLV trong khu vuc nay"
2. Suggest nearby areas
3. CTA: "Xem tat ca HLV"

### Alt 2: Coach Unavailable
**Trigger**: Coach tam nghi
1. Show "Tam nghi nhan hoc vien"
2. Gray out contact button
3. Show expected return date (neu co)

---

## Error Handling

### Error 1: Load Failed
- **Trigger**: Network error
- **System**: Show cached data (neu co)
- **User**: Pull to refresh
- **Fallback**: Error screen + retry

### Error 2: Phone Call Failed
- **Trigger**: No phone capability (iPad, no SIM)
- **System**: Show "Copy so dien thoai"
- **User**: Copy va goi tu thiet bi khac

### Error 3: Coach Profile Missing
- **Trigger**: Coach removed sau khi cached
- **System**: Show "HLV khong con hoat dong"
- **User**: Navigate back

---

## Edge Cases

1. **No rating yet**: Show "Chua co danh gia"
2. **Multiple locations**: Show list cua coach's areas
3. **Price varies**: Show range "200k - 500k/gio"
4. **Long bio**: Truncate voi "Xem them"
5. **No photos**: Show placeholder
6. **Inactive coach**: Hide tu list, redirect if direct access

---

## Dependencies

- **Requires**:
  - F01 (Authentication)
- **Required by**: None
- **Integrates with**:
  - Phone/SMS native features
  - Admin panel (data management)

---

## Data Structure

### Coach Object
```typescript
interface Coach {
  id: string;
  name: string;
  avatar_url: string;
  images?: string[];
  bio: string;
  certifications: string[];
  experience_years: number;
  achievements?: string[];
  specialties: string[]; // Beginner training, Advanced techniques, etc.
  price_per_hour: number;
  price_range?: { min: number; max: number };
  phone: string;
  areas: string[]; // Quan 1, Quan 7, etc.
  rating: number;
  review_count: number;
  is_active: boolean;
  is_available: boolean; // Accepting new students
  created_at: DateTime;
  updated_at: DateTime;
}
```

### Coach Review (Admin-managed)
```typescript
interface CoachReview {
  id: string;
  coach_id: string;
  reviewer_name: string; // May be anonymous
  expertise_rating: number;
  communication_rating: number;
  punctuality_rating: number;
  overall_rating: number;
  comment: string;
  created_at: DateTime;
}
```

---

## Admin Features (Out of MVP Scope)

Future admin capabilities:
1. Add/Edit/Remove coaches
2. Manage coach reviews
3. Feature/Highlight certain coaches
4. Analytics on coach views and contacts

---

## UI/UX Notes

1. **Coach Card**
   - Horizontal layout
   - Photo prominent
   - Key info at glance
   - Rating visible

2. **Coach Detail**
   - Hero photo/gallery
   - Sticky contact button
   - Collapsible sections
   - Share button

3. **Contact Sheet**
   - Bottom sheet
   - Large tap targets
   - Clear icons

4. **Filter**
   - Simple dropdown/sliders
   - Quick apply
   - Easy reset

5. **Empty State**
   - Friendly message
   - Suggest actions
   - Illustration

6. **Loading**
   - Skeleton cards
   - Pull to refresh indicator
