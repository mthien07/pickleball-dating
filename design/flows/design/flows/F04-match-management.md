# Activity Diagram: Match Management (F04)

## Feature Overview
Quan ly danh sach nguoi da match - xem, sap xep, truy cap nhanh vao chat, xem profile, unmatch hoac report nguoi dung khong phu hop.

## Actors
- **Primary**: Authenticated User (da co matches)
- **Secondary**:
  - Moderation System (xu ly reports)

---

## Main Flow

### Flow 1: Xem Danh Sach Matches

```mermaid
flowchart TD
    A[User tap Matches Tab] --> B[Fetch Matches List]
    B --> C{Cache valid?}
    C -->|Co| D[Show cached + background refresh]
    C -->|Chua| E[Show loading skeleton]
    E --> F[Fetch from server]
    D --> G[Display Match List]
    F --> G
    G --> H{Matches count?}
    H -->|0| I[Show Empty State]
    I --> J['Chua co match nao']
    J --> K[CTA: 'Bat dau swipe']
    K --> L[Navigate to Discovery]
    H -->|> 0| M[Show Match Cards]
    M --> N[Sort by: recent match first]
    N --> O[Each card shows:]
    O --> P[- Avatar]
    O --> Q[- Name]
    O --> R[- Match time]
    O --> S[- Last message preview]
    O --> T[- Unread badge]
```

---

### Flow 2: Tuong Tac Voi Match Item

```mermaid
flowchart TD
    A[User xem Match List] --> B{User action?}

    B -->|Tap match card| C[Navigate to Chat]
    C --> C1[Load conversation]
    C1 --> C2[Mark messages as read]

    B -->|Tap avatar| D[View Full Profile]
    D --> D1[Show profile modal/screen]
    D1 --> D2[All photos, bio, stats]
    D2 --> D3{User action on profile?}
    D3 -->|Close| D4[Back to list]
    D3 -->|Message| C
    D3 -->|Unmatch| E

    B -->|Long press| E[Show Action Sheet]
    E --> E1[- View Profile]
    E --> E2[- Unmatch]
    E --> E3[- Report]
    E --> E4[- Cancel]
    E1 --> D
    E2 --> F[Unmatch Flow]
    E3 --> G[Report Flow]
    E4 --> A

    B -->|Swipe left on card| H[Reveal action buttons]
    H --> H1[Unmatch button]
    H --> H2[Report button]
    H1 --> F
    H2 --> G
```

---

### Flow 3: Unmatch

```mermaid
flowchart TD
    A[User tap Unmatch] --> B[Show Confirmation Dialog]
    B --> C{'Ban chac chan muon unmatch?'}
    C --> D[- Cuoc tro chuyen se bi xoa]
    C --> E[- Khong the hoan tac]
    D --> F{User confirm?}
    E --> F
    F -->|Cancel| G[Close dialog]
    F -->|Confirm| H[API: Unmatch]
    H --> I{Success?}
    I -->|Co| J[Remove from list]
    J --> K[Show toast 'Da unmatch']
    K --> L[Update UI]
    I -->|Loi| M[Show error toast]
    M --> N[Keep in list]
```

**Unmatch Effects:**
- Conversation deleted for both users
- Match record removed
- Cannot swipe each other again for 30 days
- No notification to other user

---

### Flow 4: Report User

```mermaid
flowchart TD
    A[User tap Report] --> B[Show Report Options]
    B --> C[Select reason:]
    C --> D[- Spam]
    C --> E[- Fake profile]
    C --> F[- Harassment]
    C --> G[- Inappropriate content]
    C --> H[- Other]
    D --> I[User selects reason]
    E --> I
    F --> I
    G --> I
    H --> I
    I --> J{Reason = Other?}
    J -->|Co| K[Show text input]
    K --> L[User nhap chi tiet]
    L --> M[Tap Submit]
    J -->|Khong| M
    M --> N[API: Submit Report]
    N --> O{Success?}
    O -->|Co| P[Show confirmation]
    P --> Q['Cam on ban da bao cao']
    Q --> R{Auto unmatch?}
    R -->|Co - Harassment| S[Unmatch + Block]
    R -->|Khong| T[Keep match, under review]
    S --> U[Update UI]
    T --> U
    O -->|Loi| V[Show error]
    V --> W[Retry option]
```

**Report Flow Details:**
- Harassment/Inappropriate: Auto unmatch + block
- Other reasons: Review by moderation team
- User can optionally block after reporting
- Report logged with timestamp, reason, context

---

### Flow 5: Search/Filter Matches

```mermaid
flowchart TD
    A[User tap Search icon] --> B[Show search bar]
    B --> C[User types name]
    C --> D[Filter matches realtime]
    D --> E[Show filtered results]
    E --> F{Results found?}
    F -->|Co| G[Display filtered list]
    F -->|Khong| H[Show 'Khong tim thay']
    G --> I[User tap result]
    I --> J[Navigate to chat]
    H --> K[User clears search]
    K --> L[Show full list]
```

---

### Flow 6: New Match Notification

```mermaid
flowchart TD
    A[New Match created] --> B[Push notification sent]
    B --> C{User in app?}
    C -->|Co| D[In-app notification banner]
    D --> E[User tap banner]
    E --> F[Navigate to match/chat]
    C -->|Khong| G[System push notification]
    G --> H[User tap notification]
    H --> I[Open app to match screen]

    A --> J[Update matches list]
    J --> K[Add new match to top]
    K --> L[Show 'New' badge]
    L --> M[Badge disappears after viewing]
```

---

## Alternative Flows

### Alt 1: Match Expired
**Trigger**: Match khong nhan tin trong 14 ngay
- Show "Conversation expiring soon" warning
- Sau 14 ngay, gray out match
- Option: Extend hoac let expire

**Note**: Feature nay co the skip cho MVP

### Alt 2: Blocked User Tries to Match
**Trigger**: User da bi block
- Block user khong thay trong swipe queue
- Neu da match truoc do, match bi an

### Alt 3: Account Deleted
**Trigger**: Match's account bi xoa
- Match bi remove tu list
- Conversation archived (khong truy cap duoc)
- Show "User khong con tren ung dung"

---

## Error Handling

### Error 1: Load Matches Failed
- **Trigger**: Network error
- **System**: Show cached data neu co
- **User**: Pull to refresh
- **Fallback**: Error screen voi retry button

### Error 2: Unmatch Failed
- **Trigger**: Server error
- **System**: Show error toast
- **User**: Thu lai sau
- **Note**: Khong auto-retry (destructive action)

### Error 3: Report Failed
- **Trigger**: Server error
- **System**: Save report locally
- **User**: "Bao cao se duoc gui khi co mang"
- **Background**: Retry khi online

### Error 4: Real-time Update Failed
- **Trigger**: WebSocket disconnect
- **System**: Fallback to polling (30s)
- **User**: May have slight delay
- **Recovery**: Auto-reconnect

---

## Edge Cases

1. **Unmatch while chatting**: Close chat, redirect to list
2. **Both report each other**: Both reports logged, investigate
3. **Match deleted giua session**: Remove tu list, show toast
4. **100+ matches**: Paginate, load 20 at a time
5. **Duplicate reports**: Ignore, keep first report
6. **User unmatch themselves**: Not possible (filter in query)
7. **Slow connection**: Show optimistic UI, rollback if fail

---

## Dependencies

- **Requires**:
  - F01 (Authentication)
  - F03 (Swipe Matching - creates matches)
- **Required by**:
  - F05 (Chat - access via match)
- **Integrates with**:
  - F08 (Push Notifications)
  - Moderation system (reports)

---

## Data Structure

### Match Object
```typescript
interface Match {
  id: string;
  user_id: string;
  matched_user_id: string;
  matched_at: DateTime;
  conversation_id: string;
  last_message?: {
    content: string;
    sent_at: DateTime;
    sender_id: string;
  };
  unread_count: number;
  is_new: boolean; // chua xem
  matched_user: {
    id: string;
    display_name: string;
    avatar_url: string;
    is_online: boolean;
    last_active: DateTime;
  };
}
```

### Report Object
```typescript
interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  reason: 'spam' | 'fake' | 'harassment' | 'inappropriate' | 'other';
  details?: string;
  created_at: DateTime;
  status: 'pending' | 'reviewed' | 'resolved';
  action_taken?: string;
}
```

---

## UI/UX Notes

1. **Match List Design**
   - Avatar prominent (circle, 56px)
   - Name + last message preview
   - Time badge (2h ago, Yesterday)
   - Unread indicator (blue dot)
   - New match: "New" badge

2. **Empty State**
   - Friendly illustration
   - Encouraging message
   - CTA button to swipe

3. **Action Sheet**
   - View Profile
   - Unmatch (red text)
   - Report (red text)
   - Cancel

4. **Confirmation Dialog**
   - Clear consequences
   - Destructive button red
   - Cancel button prominent

5. **Real-time Updates**
   - New match appears at top
   - Message preview updates live
   - Online status dot (green/gray)

6. **Swipe Actions**
   - Swipe left reveals buttons
   - Quick unmatch/report
   - Familiar iOS pattern
