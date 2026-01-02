# API Endpoints Design - PickleBall Dating App

**Version**: 1.0
**Created**: 2026-01-02
**Backend**: Supabase (PostgreSQL + Auth + Realtime + Storage)

---

## Table of Contents

1. [API Architecture Overview](#1-api-architecture-overview)
2. [Authentication Endpoints](#2-authentication-endpoints)
3. [User Profile Endpoints](#3-user-profile-endpoints)
4. [Discovery & Matching Endpoints](#4-discovery--matching-endpoints)
5. [Chat & Messaging Endpoints](#5-chat--messaging-endpoints)
6. [Court Endpoints](#6-court-endpoints)
7. [Booking Endpoints](#7-booking-endpoints)
8. [Coach Endpoints](#8-coach-endpoints)
9. [Review Endpoints](#9-review-endpoints)
10. [Notification Endpoints](#10-notification-endpoints)
11. [Real-time Subscriptions](#11-real-time-subscriptions)
12. [File Upload (Storage)](#12-file-upload-storage)
13. [Error Handling](#13-error-handling)

---

## 1. API Architecture Overview

### 1.1 Base URL

```
Production:  https://[project-id].supabase.co
Development: https://[project-id].supabase.co
```

### 1.2 API Approaches

Supabase provides two ways to access data:

| Method | Use Case | Example |
|--------|----------|---------|
| **REST API** | CRUD operations, simple queries | `/rest/v1/users?id=eq.xxx` |
| **RPC Functions** | Complex business logic | `/rest/v1/rpc/get_swipe_profiles` |

### 1.3 Authentication Strategy

```
Authorization: Bearer <access_token>
apikey: <anon_key>
```

- **Access Token**: JWT from Supabase Auth (15 min expiry)
- **Refresh Token**: Long-lived token (7 days expiry)
- **Anonymous Key**: For public endpoints and authentication

### 1.4 Request/Response Format

```
Content-Type: application/json
Accept: application/json
```

### 1.5 Pagination Strategy

**Cursor-based pagination** (preferred for realtime data):
```json
{
  "data": [...],
  "cursor": "eyJpZCI6Inh4eCIsImNyZWF0ZWRfYXQiOiIyMDI1LTAxLTAxIn0=",
  "has_more": true
}
```

**Offset pagination** (for static lists):
```
?offset=0&limit=20
```

### 1.6 Rate Limiting

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Auth endpoints | 5 requests | 15 minutes |
| API endpoints | 100 requests | 1 minute |
| File uploads | 10 requests | 1 minute |

---

## 2. Authentication Endpoints

### 2.1 Email Registration

```http
POST /auth/v1/signup
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "data": {
    "display_name": "John Doe"
  }
}
```

**Response 200 OK**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 900,
  "refresh_token": "xxxxx-xxxxx-xxxxx",
  "user": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "email": "user@example.com",
    "email_confirmed_at": null,
    "user_metadata": {
      "display_name": "John Doe"
    },
    "created_at": "2026-01-02T10:00:00Z"
  }
}
```

**Error Responses**:
- `400`: Email already registered
- `422`: Invalid email format / Weak password

---

### 2.2 Phone Registration (OTP)

**Step 1: Request OTP**
```http
POST /auth/v1/otp
```

**Request Body**:
```json
{
  "phone": "+84901234567"
}
```

**Response 200 OK**:
```json
{
  "message_id": "msg_xxx"
}
```

**Step 2: Verify OTP**
```http
POST /auth/v1/verify
```

**Request Body**:
```json
{
  "phone": "+84901234567",
  "token": "123456",
  "type": "sms"
}
```

**Response 200 OK**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 900,
  "refresh_token": "xxxxx-xxxxx-xxxxx",
  "user": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "phone": "+84901234567",
    "phone_confirmed_at": "2026-01-02T10:00:00Z"
  }
}
```

**Error Responses**:
- `400`: Invalid OTP
- `429`: Too many attempts (5 tries / 15 min)

---

### 2.3 Email Login

```http
POST /auth/v1/token?grant_type=password
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response 200 OK**: Same as signup response

**Error Responses**:
- `400`: Invalid credentials
- `429`: Too many login attempts

---

### 2.4 OAuth Login (Google/Facebook/Apple)

```http
GET /auth/v1/authorize?provider=google&redirect_to=myapp://auth/callback
```

**Providers**: `google`, `facebook`, `apple`

**Response**: Redirects to provider's OAuth flow

**Callback URL** (configured in Supabase):
```
myapp://auth/callback
```

---

### 2.5 Token Refresh

```http
POST /auth/v1/token?grant_type=refresh_token
```

**Request Body**:
```json
{
  "refresh_token": "xxxxx-xxxxx-xxxxx"
}
```

**Response 200 OK**: New access_token and refresh_token

---

### 2.6 Logout

```http
POST /auth/v1/logout
Authorization: Bearer <access_token>
```

**Response 200 OK**: Empty body (session invalidated)

---

### 2.7 Get Current Session

```http
GET /auth/v1/user
Authorization: Bearer <access_token>
```

**Response 200 OK**:
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "email": "user@example.com",
  "phone": "+84901234567",
  "email_confirmed_at": "2026-01-02T10:00:00Z",
  "phone_confirmed_at": "2026-01-02T10:05:00Z",
  "user_metadata": {
    "display_name": "John Doe"
  },
  "created_at": "2026-01-02T10:00:00Z"
}
```

---

### 2.8 Password Reset

**Step 1: Request Reset**
```http
POST /auth/v1/recover
```

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response 200 OK**: Email sent with reset link

**Step 2: Update Password** (after clicking email link)
```http
PUT /auth/v1/user
Authorization: Bearer <access_token_from_reset_link>
```

**Request Body**:
```json
{
  "password": "NewSecurePass123!"
}
```

---

## 3. User Profile Endpoints

### 3.1 Get Current User Profile

```http
GET /rest/v1/users?id=eq.{user_id}&select=*
Authorization: Bearer <access_token>
```

**Alternative RPC Function**:
```http
POST /rest/v1/rpc/get_my_profile
Authorization: Bearer <access_token>
```

**Response 200 OK**:
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "created_at": "2026-01-02T10:00:00Z",
  "updated_at": "2026-01-02T12:00:00Z",
  "email": "user@example.com",
  "phone": "+84901234567",
  "display_name": "John Doe",
  "date_of_birth": "1995-01-15",
  "gender": "male",
  "bio": "Love playing pickleball!",
  "avatar_urls": [
    "https://storage.supabase.co/profile-photos/xxx-1.jpg",
    "https://storage.supabase.co/profile-photos/xxx-2.jpg"
  ],
  "skill_level": "intermediate",
  "play_style": "competitive",
  "looking_for": ["opponent", "dating"],
  "availability": {
    "monday": ["morning", "evening"],
    "wednesday": ["afternoon"]
  },
  "preferred_location": {
    "type": "Point",
    "coordinates": [106.660172, 10.762622]
  },
  "preferred_address": "District 1, HCMC",
  "phone_verified": true,
  "email_verified": true,
  "matches_count": 24,
  "games_played": 12,
  "average_rating": 4.8,
  "is_online": true,
  "last_active": "2026-01-02T14:30:00Z",
  "profile_complete": true,
  "is_active": true
}
```

---

### 3.2 Create/Complete Profile

```http
POST /rest/v1/rpc/create_profile
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "display_name": "John Doe",
  "date_of_birth": "1995-01-15",
  "gender": "male",
  "bio": "Love playing pickleball!",
  "avatar_urls": [
    "https://storage.supabase.co/profile-photos/xxx-1.jpg"
  ],
  "skill_level": "intermediate",
  "play_style": "competitive",
  "looking_for": ["opponent", "dating"],
  "availability": {
    "monday": ["morning", "evening"],
    "wednesday": ["afternoon"]
  },
  "preferred_lat": 10.762622,
  "preferred_lng": 106.660172,
  "preferred_address": "District 1, HCMC"
}
```

**Response 200 OK**:
```json
{
  "success": true,
  "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Error Responses**:
- `400`: Missing required fields
- `409`: Profile already exists

---

### 3.3 Update Profile

```http
PATCH /rest/v1/users?id=eq.{user_id}
Authorization: Bearer <access_token>
```

**Request Body** (partial update):
```json
{
  "bio": "Updated bio!",
  "skill_level": "advanced",
  "avatar_urls": [
    "https://storage.supabase.co/profile-photos/xxx-1.jpg",
    "https://storage.supabase.co/profile-photos/xxx-2.jpg",
    "https://storage.supabase.co/profile-photos/xxx-3.jpg"
  ]
}
```

**Response 200 OK**: Updated user object

---

### 3.4 Update Online Status

```http
POST /rest/v1/rpc/update_online_status
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "is_online": true
}
```

**Response 200 OK**: Empty (status updated)

---

### 3.5 Get User by ID (Public Profile)

```http
GET /rest/v1/users?id=eq.{user_id}&select=id,display_name,avatar_urls,gender,skill_level,play_style,bio,average_rating,matches_count,is_online
Authorization: Bearer <access_token>
```

**Response 200 OK**: Public profile fields only (RLS enforced)

---

## 4. Discovery & Matching Endpoints

### 4.1 Get Swipe Profiles

```http
POST /rest/v1/rpc/get_swipe_profiles
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "limit_count": 20,
  "max_distance_km": 25,
  "skill_filter": null,
  "cursor": null
}
```

**Response 200 OK**:
```json
{
  "profiles": [
    {
      "id": "user-uuid-1",
      "display_name": "Sarah Chen",
      "date_of_birth": "1997-03-22",
      "gender": "female",
      "avatar_urls": ["https://..."],
      "bio": "Beginner looking to learn!",
      "skill_level": "beginner",
      "play_style": "social",
      "looking_for": ["doubles_partner", "dating"],
      "availability": {...},
      "preferred_address": "District 2, HCMC",
      "average_rating": 4.5,
      "distance_km": 3.2,
      "is_online": true,
      "common_availability_slots": 2
    },
    ...
  ],
  "cursor": "eyJpZCI6Inh4eCJ9",
  "has_more": true
}
```

**RPC Function Logic**:
```sql
CREATE OR REPLACE FUNCTION get_swipe_profiles(
  limit_count INT DEFAULT 20,
  max_distance_km FLOAT DEFAULT 50,
  skill_filter TEXT DEFAULT NULL,
  cursor_id UUID DEFAULT NULL
)
RETURNS JSON AS $$
  -- Filter out:
  -- 1. Current user
  -- 2. Already swiped users
  -- 3. Blocked users
  -- 4. Users who blocked current user
  -- 5. Inactive users
  -- Order by:
  -- 1. Common availability slots
  -- 2. Distance
  -- 3. Skill level proximity
$$;
```

---

### 4.2 Swipe Action

```http
POST /rest/v1/swipes
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "swiped_id": "target-user-uuid",
  "direction": "right"
}
```

**Response 201 Created**:
```json
{
  "id": "swipe-uuid",
  "swiper_id": "current-user-uuid",
  "swiped_id": "target-user-uuid",
  "direction": "right",
  "created_at": "2026-01-02T14:30:00Z",
  "is_match": true,
  "match": {
    "id": "match-uuid",
    "matched_user": {
      "id": "target-user-uuid",
      "display_name": "Sarah Chen",
      "avatar_urls": ["https://..."]
    },
    "conversation_id": "conv-uuid"
  }
}
```

**Note**: `is_match` and `match` only returned when mutual swipe detected

---

### 4.3 Undo Last Swipe

```http
POST /rest/v1/rpc/undo_last_swipe
Authorization: Bearer <access_token>
```

**Response 200 OK**:
```json
{
  "success": true,
  "undone_swipe": {
    "swiped_id": "user-uuid",
    "direction": "left"
  }
}
```

**Error Responses**:
- `400`: No swipe to undo (within 30 seconds)
- `429`: Already used undo (1 per session)

---

### 4.4 Get Matches

```http
GET /rest/v1/rpc/get_my_matches
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "limit_count": 50,
  "cursor": null
}
```

**Response 200 OK**:
```json
{
  "matches": [
    {
      "id": "match-uuid",
      "matched_at": "2026-01-02T10:00:00Z",
      "conversation_id": "conv-uuid",
      "is_active": true,
      "matched_user": {
        "id": "user-uuid",
        "display_name": "Sarah Chen",
        "avatar_urls": ["https://..."],
        "is_online": true,
        "last_active": "2026-01-02T14:00:00Z"
      },
      "last_message": {
        "content": "Hey! Let's play this weekend?",
        "sent_at": "2026-01-02T13:00:00Z",
        "sender_id": "user-uuid",
        "type": "text"
      },
      "unread_count": 3,
      "is_new": false
    },
    ...
  ],
  "cursor": "eyJpZCI6Inh4eCJ9",
  "has_more": false
}
```

---

### 4.5 Unmatch

```http
PATCH /rest/v1/matches?id=eq.{match_id}
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "is_active": false
}
```

**Response 200 OK**: Updated match object

---

### 4.6 Report User

```http
POST /rest/v1/user_reports
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "reported_id": "user-uuid",
  "reason": "harassment",
  "description": "Sent inappropriate messages"
}
```

**Response 201 Created**: Report created

---

### 4.7 Block User

```http
POST /rest/v1/user_blocks
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "blocked_id": "user-uuid"
}
```

**Response 201 Created**: Block created (also unmatches if matched)

---

## 5. Chat & Messaging Endpoints

### 5.1 Get Conversation Messages

```http
GET /rest/v1/messages?conversation_id=eq.{conv_id}&order=created_at.desc&limit=30&offset=0
Authorization: Bearer <access_token>
```

**Alternative with cursor**:
```http
POST /rest/v1/rpc/get_conversation_messages
```

**Request Body**:
```json
{
  "conversation_id": "conv-uuid",
  "limit_count": 30,
  "before_cursor": null
}
```

**Response 200 OK**:
```json
{
  "messages": [
    {
      "id": "msg-uuid",
      "conversation_id": "conv-uuid",
      "sender_id": "user-uuid",
      "content": "Hey! Let's play this weekend?",
      "message_type": "text",
      "image_url": null,
      "status": "delivered",
      "created_at": "2026-01-02T13:00:00Z",
      "read_at": null
    },
    ...
  ],
  "cursor": "eyJpZCI6Inh4eCJ9",
  "has_more": true
}
```

---

### 5.2 Send Message

```http
POST /rest/v1/messages
Authorization: Bearer <access_token>
```

**Request Body (Text)**:
```json
{
  "conversation_id": "conv-uuid",
  "content": "Sounds great! What time?",
  "message_type": "text"
}
```

**Request Body (Image)**:
```json
{
  "conversation_id": "conv-uuid",
  "message_type": "image",
  "image_url": "https://storage.supabase.co/message-images/xxx.jpg"
}
```

**Response 201 Created**:
```json
{
  "id": "msg-uuid",
  "conversation_id": "conv-uuid",
  "sender_id": "current-user-uuid",
  "content": "Sounds great! What time?",
  "message_type": "text",
  "status": "sent",
  "created_at": "2026-01-02T14:00:00Z"
}
```

---

### 5.3 Mark Messages as Read

```http
POST /rest/v1/rpc/mark_messages_read
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "conversation_id": "conv-uuid"
}
```

**Response 200 OK**:
```json
{
  "marked_count": 5
}
```

---

### 5.4 Get Unread Count

```http
POST /rest/v1/rpc/get_unread_count
Authorization: Bearer <access_token>
```

**Response 200 OK**:
```json
{
  "total_unread": 8,
  "by_conversation": [
    {"conversation_id": "conv-1", "unread_count": 5},
    {"conversation_id": "conv-2", "unread_count": 3}
  ]
}
```

---

## 6. Court Endpoints

### 6.1 Search Courts

```http
POST /rest/v1/rpc/search_courts
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "user_lat": 10.762622,
  "user_lng": 106.660172,
  "max_distance_km": 25,
  "court_type": null,
  "min_rating": null,
  "max_price": null,
  "is_partner_only": false,
  "search_query": null,
  "limit_count": 20,
  "offset": 0
}
```

**Response 200 OK**:
```json
{
  "courts": [
    {
      "id": "court-uuid",
      "name": "Premium Pickleball Center",
      "address": "123 Nguyen Hue St, District 1, HCMC",
      "images": ["https://..."],
      "price_per_hour": 200000,
      "price_range": {"min": 150000, "max": 300000},
      "court_type": "indoor",
      "rating": 4.8,
      "review_count": 156,
      "is_partner": true,
      "distance_km": 2.3
    },
    ...
  ],
  "total_count": 45,
  "has_more": true
}
```

---

### 6.2 Get Court Details

```http
GET /rest/v1/courts?id=eq.{court_id}&select=*
Authorization: Bearer <access_token>
```

**Response 200 OK**:
```json
{
  "id": "court-uuid",
  "name": "Premium Pickleball Center",
  "address": "123 Nguyen Hue St, District 1, HCMC",
  "location": {
    "type": "Point",
    "coordinates": [106.7011, 10.7763]
  },
  "images": [
    "https://storage.supabase.co/court-images/court1-1.jpg",
    "https://storage.supabase.co/court-images/court1-2.jpg"
  ],
  "description": "Modern indoor facility with 6 professional courts...",
  "amenities": ["Parking", "Locker", "Canteen", "Equipment Rental", "Showers", "Wi-Fi"],
  "price_per_hour": 200000,
  "price_min": 150000,
  "price_max": 300000,
  "court_type": "indoor",
  "operating_hours": {
    "monday": {"open": "06:00", "close": "22:00"},
    "tuesday": {"open": "06:00", "close": "22:00"},
    ...
  },
  "rating": 4.8,
  "review_count": 156,
  "is_partner": true
}
```

---

### 6.3 Get Court Availability

```http
POST /rest/v1/rpc/get_court_availability
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "court_id": "court-uuid",
  "date": "2026-01-05"
}
```

**Response 200 OK**:
```json
{
  "court_id": "court-uuid",
  "date": "2026-01-05",
  "operating_hours": {"open": "06:00", "close": "22:00"},
  "slots": [
    {"start_time": "06:00", "end_time": "07:00", "price": 150000, "is_available": true, "locked_by": null},
    {"start_time": "07:00", "end_time": "08:00", "price": 150000, "is_available": true, "locked_by": null},
    {"start_time": "08:00", "end_time": "09:00", "price": 200000, "is_available": false, "locked_by": null},
    {"start_time": "09:00", "end_time": "10:00", "price": 200000, "is_available": true, "locked_by": "other-user"},
    ...
  ]
}
```

**Note**: `locked_by` shows if slot is being held during payment

---

## 7. Booking Endpoints

### 7.1 Lock Slots (Pre-payment)

```http
POST /rest/v1/rpc/lock_slots
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "court_id": "court-uuid",
  "date": "2026-01-05",
  "slots": [
    {"start_time": "18:00", "end_time": "19:00"},
    {"start_time": "19:00", "end_time": "20:00"}
  ]
}
```

**Response 200 OK**:
```json
{
  "lock_id": "lock-uuid",
  "locked_until": "2026-01-02T14:40:00Z",
  "slots": [
    {"start_time": "18:00", "end_time": "19:00", "price": 250000},
    {"start_time": "19:00", "end_time": "20:00", "price": 250000}
  ],
  "total_amount": 500000,
  "expires_in_seconds": 600
}
```

**Error Responses**:
- `409`: One or more slots not available

---

### 7.2 Create Booking (After Payment)

```http
POST /rest/v1/rpc/create_booking
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "lock_id": "lock-uuid",
  "payment_method": "credit_card",
  "payment_reference": "pi_xxx_stripe"
}
```

**Response 201 Created**:
```json
{
  "id": "booking-uuid",
  "user_id": "user-uuid",
  "court_id": "court-uuid",
  "booking_date": "2026-01-05",
  "start_time": "18:00",
  "end_time": "20:00",
  "slots": [
    {"start_time": "18:00", "end_time": "19:00", "price": 250000},
    {"start_time": "19:00", "end_time": "20:00", "price": 250000}
  ],
  "total_amount": 500000,
  "status": "confirmed",
  "payment_method": "credit_card",
  "qr_code": "data:image/png;base64,iVBORw0...",
  "created_at": "2026-01-02T14:35:00Z",
  "court": {
    "name": "Premium Pickleball Center",
    "address": "123 Nguyen Hue St...",
    "images": ["https://..."]
  }
}
```

**Error Responses**:
- `400`: Lock expired
- `409`: Slots no longer available (race condition)

---

### 7.3 Cancel Lock

```http
POST /rest/v1/rpc/cancel_lock
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "lock_id": "lock-uuid"
}
```

**Response 200 OK**: Lock released

---

### 7.4 Get User Bookings

```http
GET /rest/v1/rpc/get_my_bookings
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "status_filter": null,
  "limit_count": 20,
  "offset": 0
}
```

**Response 200 OK**:
```json
{
  "bookings": [
    {
      "id": "booking-uuid",
      "booking_date": "2026-01-05",
      "start_time": "18:00",
      "end_time": "20:00",
      "total_amount": 500000,
      "status": "confirmed",
      "qr_code": "data:image/png;base64,...",
      "created_at": "2026-01-02T14:35:00Z",
      "court": {
        "id": "court-uuid",
        "name": "Premium Pickleball Center",
        "address": "123 Nguyen Hue St...",
        "images": ["https://..."]
      }
    },
    ...
  ],
  "total_count": 15
}
```

---

### 7.5 Get Booking Details

```http
GET /rest/v1/bookings?id=eq.{booking_id}&select=*,court:courts(*)
Authorization: Bearer <access_token>
```

**Response 200 OK**: Full booking object with court details

---

### 7.6 Cancel Booking

```http
POST /rest/v1/rpc/cancel_booking
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "booking_id": "booking-uuid"
}
```

**Response 200 OK**:
```json
{
  "success": true,
  "refund_amount": 500000,
  "refund_policy": "Full refund (cancelled 24+ hours before)"
}
```

**Error Responses**:
- `400`: Cannot cancel (less than X hours before)
- `404`: Booking not found or not owned by user

---

## 8. Coach Endpoints

### 8.1 List Coaches

```http
GET /rest/v1/coaches?is_active=eq.true&order=rating.desc&limit=20
Authorization: Bearer <access_token>
```

**With filters via RPC**:
```http
POST /rest/v1/rpc/search_coaches
```

**Request Body**:
```json
{
  "user_lat": 10.762622,
  "user_lng": 106.660172,
  "max_distance_km": 25,
  "min_rating": 4.0,
  "max_hourly_rate": 600000,
  "limit_count": 20,
  "offset": 0
}
```

**Response 200 OK**:
```json
{
  "coaches": [
    {
      "id": "coach-uuid",
      "display_name": "Coach Alex Tran",
      "avatar_url": "https://...",
      "bio": "Professional coach with 10 years...",
      "experience_years": 10,
      "certifications": ["IPTPA Certified", "PPR Certified Pro"],
      "skill_level": "pro",
      "hourly_rate": 500000,
      "rating": 4.9,
      "review_count": 34,
      "address": "District 1, HCMC",
      "phone": "+84 901 234 567",
      "distance_km": 1.5
    },
    ...
  ],
  "total_count": 12
}
```

---

### 8.2 Get Coach Details

```http
GET /rest/v1/coaches?id=eq.{coach_id}&select=*
Authorization: Bearer <access_token>
```

**Response 200 OK**: Full coach profile

---

## 9. Review Endpoints

### 9.1 Create User Review

```http
POST /rest/v1/reviews
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "reviewee_id": "user-uuid",
  "rating": 5,
  "skill_accuracy": 5,
  "attitude": 5,
  "punctuality": 4,
  "comment": "Great player! Very skilled and friendly."
}
```

**Response 201 Created**: Review object

**Error Responses**:
- `400`: Cannot review yourself
- `409`: Already reviewed this user

---

### 9.2 Create Court Review

```http
POST /rest/v1/reviews
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "court_id": "court-uuid",
  "rating": 5,
  "court_quality": 5,
  "service": 5,
  "cleanliness": 4,
  "comment": "Excellent facility!",
  "images": [
    "https://storage.supabase.co/review-images/xxx.jpg"
  ]
}
```

**Response 201 Created**: Review object

---

### 9.3 Get User Reviews

```http
GET /rest/v1/reviews?reviewee_id=eq.{user_id}&select=*,reviewer:users(display_name,avatar_urls)&order=created_at.desc&limit=20
Authorization: Bearer <access_token>
```

**Response 200 OK**:
```json
[
  {
    "id": "review-uuid",
    "reviewer_id": "reviewer-uuid",
    "rating": 5,
    "skill_accuracy": 5,
    "attitude": 5,
    "punctuality": 5,
    "comment": "Great player!",
    "created_at": "2026-01-01T10:00:00Z",
    "reviewer": {
      "display_name": "Mike Johnson",
      "avatar_urls": ["https://..."]
    }
  },
  ...
]
```

---

### 9.4 Get Court Reviews

```http
GET /rest/v1/reviews?court_id=eq.{court_id}&select=*,reviewer:users(display_name,avatar_urls)&order=created_at.desc&limit=20
Authorization: Bearer <access_token>
```

**Response 200 OK**: Similar structure with court-specific fields

---

## 10. Notification Endpoints

### 10.1 Get Notifications

```http
GET /rest/v1/notifications?user_id=eq.{user_id}&order=created_at.desc&limit=50
Authorization: Bearer <access_token>
```

**Response 200 OK**:
```json
[
  {
    "id": "notif-uuid",
    "notification_type": "new_match",
    "title": "New Match!",
    "body": "You matched with Sarah Chen",
    "data": {
      "match_id": "match-uuid",
      "user_id": "user-uuid"
    },
    "is_read": false,
    "created_at": "2026-01-02T14:00:00Z"
  },
  ...
]
```

---

### 10.2 Mark Notification as Read

```http
PATCH /rest/v1/notifications?id=eq.{notif_id}
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "is_read": true
}
```

---

### 10.3 Mark All Notifications as Read

```http
POST /rest/v1/rpc/mark_all_notifications_read
Authorization: Bearer <access_token>
```

**Response 200 OK**:
```json
{
  "marked_count": 5
}
```

---

### 10.4 Get Unread Notification Count

```http
GET /rest/v1/notifications?user_id=eq.{user_id}&is_read=eq.false&select=count
Authorization: Bearer <access_token>
Prefer: count=exact
```

**Response 200 OK**:
```
Content-Range: 0-0/8
```

---

### 10.5 Update Notification Settings

```http
PATCH /rest/v1/users?id=eq.{user_id}
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "notification_settings": {
    "new_match": true,
    "new_message": true,
    "booking_reminder": true,
    "promotion": false
  }
}
```

---

## 11. Real-time Subscriptions

### 11.1 New Messages (Supabase Realtime)

```typescript
// Client-side subscription
const subscription = supabase
  .channel(`conversation:${conversationId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `conversation_id=eq.${conversationId}`
  }, (payload) => {
    console.log('New message:', payload.new);
  })
  .subscribe();
```

**Payload**:
```json
{
  "new": {
    "id": "msg-uuid",
    "conversation_id": "conv-uuid",
    "sender_id": "user-uuid",
    "content": "Hello!",
    "message_type": "text",
    "status": "sent",
    "created_at": "2026-01-02T14:00:00Z"
  }
}
```

---

### 11.2 Message Status Updates

```typescript
const subscription = supabase
  .channel(`conversation:${conversationId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'messages',
    filter: `conversation_id=eq.${conversationId}`
  }, (payload) => {
    console.log('Message updated:', payload.new.status);
  })
  .subscribe();
```

---

### 11.3 New Matches

```typescript
const subscription = supabase
  .channel(`matches:${userId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'matches',
    filter: `user_id_1=eq.${userId}`
  }, handleNewMatch)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'matches',
    filter: `user_id_2=eq.${userId}`
  }, handleNewMatch)
  .subscribe();
```

---

### 11.4 Typing Indicator (Broadcast)

```typescript
// Send typing status
const channel = supabase.channel(`typing:${conversationId}`);

channel.send({
  type: 'broadcast',
  event: 'typing',
  payload: { user_id: currentUserId, is_typing: true }
});

// Listen for typing
channel.on('broadcast', { event: 'typing' }, (payload) => {
  console.log(`${payload.user_id} is typing: ${payload.is_typing}`);
}).subscribe();
```

---

### 11.5 Online Presence

```typescript
const presenceChannel = supabase.channel('online-users');

// Track my presence
presenceChannel.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
    await presenceChannel.track({
      user_id: currentUserId,
      online_at: new Date().toISOString()
    });
  }
});

// Listen for presence changes
presenceChannel.on('presence', { event: 'sync' }, () => {
  const state = presenceChannel.presenceState();
  console.log('Online users:', state);
});
```

---

## 12. File Upload (Storage)

### 12.1 Storage Buckets

| Bucket | Access | Max Size | Allowed Types | Purpose |
|--------|--------|----------|---------------|---------|
| `profile-photos` | Public read, Auth write | 5 MB | image/jpeg, image/png, image/webp | User avatars |
| `message-images` | Private (RLS) | 10 MB | image/jpeg, image/png, image/gif | Chat images |
| `court-images` | Public read, Admin write | 10 MB | image/jpeg, image/png | Court gallery |
| `review-images` | Public read, Auth write | 5 MB | image/jpeg, image/png | Review attachments |

---

### 12.2 Upload Profile Photo

```typescript
// Client-side upload
const { data, error } = await supabase.storage
  .from('profile-photos')
  .upload(`${userId}/${Date.now()}.jpg`, file, {
    contentType: 'image/jpeg',
    upsert: false
  });

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('profile-photos')
  .getPublicUrl(data.path);
```

**Response**:
```json
{
  "path": "a1b2c3d4/1704200000000.jpg",
  "publicUrl": "https://[project].supabase.co/storage/v1/object/public/profile-photos/a1b2c3d4/1704200000000.jpg"
}
```

---

### 12.3 Upload Chat Image

```typescript
// Private upload with RLS
const { data, error } = await supabase.storage
  .from('message-images')
  .upload(`${conversationId}/${Date.now()}.jpg`, file, {
    contentType: 'image/jpeg'
  });

// Get signed URL (expires in 1 year)
const { data: { signedUrl } } = await supabase.storage
  .from('message-images')
  .createSignedUrl(data.path, 31536000);
```

---

### 12.4 Delete Photo

```typescript
const { error } = await supabase.storage
  .from('profile-photos')
  .remove([`${userId}/old-photo.jpg`]);
```

---

### 12.5 Image Processing Guidelines

**Before upload (client-side)**:
1. Compress image to max 1024px width
2. Convert to JPEG at 80% quality
3. Strip EXIF data for privacy
4. Generate thumbnail (400x400) for avatars

---

## 13. Error Handling

### 13.1 Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  }
}
```

### 13.2 HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PATCH, RPC |
| 201 | Created | Successful POST (new resource) |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input, validation error |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | RLS policy denied |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate, already exists |
| 422 | Unprocessable | Semantic error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Error | Server error |

### 13.3 Error Codes

| Code | Description |
|------|-------------|
| `AUTH_INVALID_CREDENTIALS` | Email/password incorrect |
| `AUTH_EMAIL_EXISTS` | Email already registered |
| `AUTH_PHONE_EXISTS` | Phone already registered |
| `AUTH_OTP_INVALID` | Invalid or expired OTP |
| `AUTH_OTP_LIMIT` | Too many OTP attempts |
| `PROFILE_INCOMPLETE` | Profile setup required |
| `SWIPE_SELF` | Cannot swipe on yourself |
| `SWIPE_EXISTS` | Already swiped this user |
| `MATCH_NOT_FOUND` | Match doesn't exist |
| `CONVERSATION_ACCESS_DENIED` | Not participant |
| `SLOT_UNAVAILABLE` | Court slot not available |
| `LOCK_EXPIRED` | Booking lock expired |
| `BOOKING_CANCEL_DENIED` | Too late to cancel |
| `REVIEW_SELF` | Cannot review yourself |
| `REVIEW_EXISTS` | Already reviewed |
| `BLOCK_SELF` | Cannot block yourself |
| `RATE_LIMIT` | Too many requests |

---

## Appendix: RPC Function Signatures

### A.1 Discovery Functions

```sql
-- Get profiles for swiping
CREATE FUNCTION get_swipe_profiles(
  limit_count INT DEFAULT 20,
  max_distance_km FLOAT DEFAULT 50,
  skill_filter TEXT DEFAULT NULL,
  cursor_id UUID DEFAULT NULL
) RETURNS JSON;

-- Undo last swipe
CREATE FUNCTION undo_last_swipe() RETURNS JSON;
```

### A.2 Match Functions

```sql
-- Get user's matches with last message
CREATE FUNCTION get_my_matches(
  limit_count INT DEFAULT 50,
  cursor_id UUID DEFAULT NULL
) RETURNS JSON;
```

### A.3 Messaging Functions

```sql
-- Get conversation messages with cursor pagination
CREATE FUNCTION get_conversation_messages(
  conversation_id UUID,
  limit_count INT DEFAULT 30,
  before_cursor UUID DEFAULT NULL
) RETURNS JSON;

-- Mark all messages in conversation as read
CREATE FUNCTION mark_messages_read(
  conversation_id UUID
) RETURNS JSON;

-- Get total unread count
CREATE FUNCTION get_unread_count() RETURNS JSON;
```

### A.4 Court & Booking Functions

```sql
-- Search courts with geo filter
CREATE FUNCTION search_courts(
  user_lat FLOAT,
  user_lng FLOAT,
  max_distance_km FLOAT DEFAULT 25,
  court_type TEXT DEFAULT NULL,
  min_rating FLOAT DEFAULT NULL,
  max_price INT DEFAULT NULL,
  is_partner_only BOOLEAN DEFAULT FALSE,
  search_query TEXT DEFAULT NULL,
  limit_count INT DEFAULT 20,
  offset_count INT DEFAULT 0
) RETURNS JSON;

-- Get court availability for a date
CREATE FUNCTION get_court_availability(
  court_id UUID,
  date DATE
) RETURNS JSON;

-- Lock slots for payment
CREATE FUNCTION lock_slots(
  court_id UUID,
  date DATE,
  slots JSONB
) RETURNS JSON;

-- Create booking after payment
CREATE FUNCTION create_booking(
  lock_id UUID,
  payment_method TEXT,
  payment_reference TEXT
) RETURNS JSON;

-- Cancel booking
CREATE FUNCTION cancel_booking(
  booking_id UUID
) RETURNS JSON;

-- Get user's booking history
CREATE FUNCTION get_my_bookings(
  status_filter TEXT DEFAULT NULL,
  limit_count INT DEFAULT 20,
  offset_count INT DEFAULT 0
) RETURNS JSON;
```

### A.5 Profile Functions

```sql
-- Create new profile after signup
CREATE FUNCTION create_profile(
  display_name TEXT,
  date_of_birth DATE,
  gender TEXT,
  bio TEXT,
  avatar_urls TEXT[],
  skill_level TEXT,
  play_style TEXT,
  looking_for TEXT[],
  availability JSONB,
  preferred_lat FLOAT,
  preferred_lng FLOAT,
  preferred_address TEXT
) RETURNS JSON;

-- Update online status and last_active
CREATE FUNCTION update_online_status(
  is_online BOOLEAN
) RETURNS VOID;

-- Get current user profile
CREATE FUNCTION get_my_profile() RETURNS JSON;
```

### A.6 Coach Functions

```sql
-- Search coaches with geo filter
CREATE FUNCTION search_coaches(
  user_lat FLOAT,
  user_lng FLOAT,
  max_distance_km FLOAT DEFAULT 25,
  min_rating FLOAT DEFAULT NULL,
  max_hourly_rate INT DEFAULT NULL,
  limit_count INT DEFAULT 20,
  offset_count INT DEFAULT 0
) RETURNS JSON;
```

### A.7 Notification Functions

```sql
-- Mark all notifications as read
CREATE FUNCTION mark_all_notifications_read() RETURNS JSON;
```

---

*Document End*
