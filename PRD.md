# Product Requirements Document (PRD)
## PickleBall Dating App

**Version**: 2.0
**Last Updated**: 2025-12-30
**Author**: Agent-BA

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Feature Table](#feature-table)
3. [User Stories & Acceptance Criteria](#user-stories--acceptance-criteria)
4. [Non-functional Requirements](#non-functional-requirements)
5. [Assumptions & Constraints](#assumptions--constraints)

---

## Executive Summary

### Vision
PickleBall Dating App là ứng dụng mobile kết hợp hai nhu cầu của người chơi pickleball: **tìm partner chơi thể thao** và **hẹn hò lãng mạn**. App sử dụng cơ chế swipe-based matching để kết nối những người chơi có cùng skill level, lịch trình và sở thích.

### Goals
1. **Primary**: Giúp người chơi pickleball tìm được đối thủ/partner phù hợp một cách nhanh chóng và thú vị
2. **Secondary**: Tạo nền tảng đặt sân pickleball trực tuyến với thanh toán tiện lợi
3. **Tertiary**: Xây dựng cộng đồng pickleball tại Việt Nam

### Target Users
- **Độ tuổi**: 18-60
- **Đặc điểm**: Người chơi pickleball ở mọi skill level (beginner đến advanced)
- **Khu vực**: Việt Nam (ban đầu tập trung các thành phố lớn: HCM, Hà Nội, Đà Nẵng)
- **Nhu cầu**: Tìm partner chơi, tìm đối thủ cạnh tranh, kết bạn/hẹn hò, đặt sân

### Success Metrics
| Metric | Target | Timeframe |
|--------|--------|-----------|
| User Acquisition | 10,000 users | 6 tháng đầu |
| Match Rate | 30% swipe right → match | Ongoing |
| Booking Conversion | 20% users đặt sân qua app | Monthly |
| User Retention | 40% quay lại trong 7 ngày | Weekly |

---

## Feature Table

| ID | Feature Name | Priority | Description | Dependencies |
|----|--------------|----------|-------------|--------------|
| F01 | User Registration & Authentication | Must Have | Đăng ký/đăng nhập qua email, phone hoặc social login (Google, Facebook, Apple) | None |
| F02 | User Profile (Player) | Must Have | Profile người chơi với thông tin cá nhân, skill level, phong cách chơi, lịch rảnh, ảnh | F01 |
| F03 | Swipe-based Matching | Must Have | Tìm và match với người chơi khác bằng cơ chế swipe (like Tinder) | F01, F02 |
| F04 | Match Management | Must Have | Quản lý danh sách matches, unmatch, xem thông tin người đã match | F03 |
| F05 | Chat/Messaging | Must Have | Nhắn tin 1-1 với người đã match | F03, F04 |
| F06 | Court Discovery | Must Have | Hiển thị danh sách sân pickleball gần vị trí người dùng | F01 |
| F07 | Court Booking | Must Have | Đặt sân với lịch trống, chọn thời gian, thanh toán online | F01, F06 |
| F08 | Push Notifications | Should Have | Thông báo match mới, tin nhắn, nhắc booking, khuyến mãi | F01 |
| F09 | Rating & Review | Should Have | Đánh giá đối thủ sau khi chơi (skill, thái độ, đúng giờ); đánh giá sân | F04, F07 |
| F10 | Coach Directory | Could Have | Hiển thị danh sách HLV với thông tin cơ bản (tên, ảnh, skill, giá, liên hệ) | F01 |
| F11 | Booking History | Should Have | Lịch sử đặt sân, trạng thái booking, hủy booking | F07 |
| F12 | User Settings | Must Have | Cài đặt tài khoản, privacy, notifications, logout | F01 |

### MoSCoW Summary
| Priority | Count | Features |
|----------|-------|----------|
| Must Have | 8 | F01, F02, F03, F04, F05, F06, F07, F12 |
| Should Have | 3 | F08, F09, F11 |
| Could Have | 1 | F10 |
| Won't Have | 0 | - |

---

## User Stories & Acceptance Criteria

### F01: User Registration & Authentication

**User Story**: Là người dùng mới, tôi muốn đăng ký tài khoản nhanh chóng để bắt đầu tìm partner chơi pickleball.

**Acceptance Criteria**:
- [ ] User có thể đăng ký bằng email + password
- [ ] User có thể đăng ký bằng số điện thoại + OTP
- [ ] User có thể đăng nhập qua Google OAuth
- [ ] User có thể đăng nhập qua Facebook OAuth
- [ ] User có thể đăng nhập qua Apple Sign In (iOS)
- [ ] Hệ thống validate email/phone format trước khi submit
- [ ] Hệ thống hiển thị lỗi rõ ràng khi đăng ký thất bại
- [ ] User được redirect đến màn hình tạo profile sau khi đăng ký thành công
- [ ] Session được lưu để user không cần đăng nhập lại
- [ ] User có thể reset password qua email/phone

**Edge Cases**:
- Email/phone đã tồn tại trong hệ thống
- OTP nhập sai quá 5 lần → khóa 15 phút
- Mất kết nối khi đang xác thực

---

### F02: User Profile (Player)

**User Story**: Là người chơi pickleball, tôi muốn tạo profile đầy đủ thông tin để người khác có thể đánh giá và quyết định match với tôi.

**Acceptance Criteria**:
- [ ] User có thể upload tối đa 6 ảnh (ít nhất 1 ảnh bắt buộc)
- [ ] User có thể nhập thông tin cơ bản: tên, tuổi, giới tính, bio
- [ ] User có thể chọn skill level: Beginner / Intermediate / Advanced / Pro
- [ ] User có thể chọn phong cách chơi: Competitive / Casual / Social
- [ ] User có thể chọn mục đích: Tìm đối thủ / Tìm partner doubles / Hẹn hò / Tất cả
- [ ] User có thể thiết lập lịch rảnh (theo ngày trong tuần + khung giờ)
- [ ] User có thể chọn vị trí ưa thích (quận/khu vực)
- [ ] User có thể chỉnh sửa profile bất kỳ lúc nào
- [ ] Profile hiển thị badge verified nếu user đã xác thực phone/email
- [ ] Profile có thể preview trước khi publish

**Profile Data Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| display_name | String | Yes | Tên hiển thị |
| avatar_urls | Array[URL] | Yes (min 1) | Tối đa 6 ảnh |
| date_of_birth | Date | Yes | Ngày sinh |
| gender | Enum | Yes | Male/Female/Other |
| bio | Text | No | Giới thiệu bản thân (max 500 chars) |
| skill_level | Enum | Yes | Beginner/Intermediate/Advanced/Pro |
| play_style | Enum | Yes | Competitive/Casual/Social |
| looking_for | Array[Enum] | Yes | Opponent/DoublesPartner/Dating/All |
| availability | JSON | No | Lịch rảnh theo ngày/giờ |
| preferred_location | GeoPoint | No | Vị trí ưa thích |

---

### F03: Swipe-based Matching

**User Story**: Là người dùng, tôi muốn duyệt qua các profiles và swipe để tìm người chơi phù hợp với mình.

**Acceptance Criteria**:
- [ ] Hệ thống hiển thị profile cards có thể swipe left (skip) hoặc right (like)
- [ ] Profile card hiển thị: ảnh chính, tên, tuổi, skill level, phong cách chơi, khoảng cách
- [ ] User có thể tap vào card để xem full profile
- [ ] User có thể undo swipe gần nhất (1 lần)
- [ ] Khi cả 2 users swipe right, tạo match và hiển thị thông báo "It's a Match!"
- [ ] Hệ thống filter profiles theo: skill level (±1 level), khoảng cách (trong radius user cài đặt), lịch rảnh trùng
- [ ] Hệ thống không hiển thị profiles đã swipe left
- [ ] Hệ thống ưu tiên hiển thị profiles có nhiều tiêu chí phù hợp
- [ ] Animation swipe mượt mà, 60fps

**Matching Algorithm Priority**:
1. Lịch rảnh trùng (ít nhất 1 slot chung)
2. Khoảng cách gần (trong radius user setting)
3. Skill level tương đương (±1 level)
4. Looking_for phù hợp

---

### F04: Match Management

**User Story**: Là người dùng, tôi muốn quản lý danh sách người đã match để dễ dàng kết nối.

**Acceptance Criteria**:
- [ ] User có thể xem danh sách tất cả matches
- [ ] Matches được sắp xếp theo thời gian match (mới nhất trước)
- [ ] Mỗi match item hiển thị: ảnh, tên, thời gian match, tin nhắn cuối (nếu có)
- [ ] User có thể tap vào match để vào màn hình chat
- [ ] User có thể tap vào avatar để xem full profile của match
- [ ] User có thể unmatch (với xác nhận dialog)
- [ ] User có thể report match (spam, fake, harassment)
- [ ] Badge hiển thị số tin nhắn chưa đọc

---

### F05: Chat/Messaging

**User Story**: Là người đã match, tôi muốn nhắn tin để trao đổi và lên kế hoạch chơi cùng.

**Acceptance Criteria**:
- [ ] User có thể gửi tin nhắn text
- [ ] User có thể gửi emoji
- [ ] User có thể gửi ảnh từ gallery hoặc camera
- [ ] Tin nhắn hiển thị realtime (không cần refresh)
- [ ] Tin nhắn hiển thị trạng thái: đã gửi, đã nhận, đã đọc
- [ ] User có thể xem lịch sử chat (load more khi scroll up)
- [ ] Hệ thống hiển thị timestamp theo nhóm (hôm nay, hôm qua, ngày cụ thể)
- [ ] User có thể block người chat
- [ ] User nhận push notification khi có tin nhắn mới (nếu không đang trong app)

**Message Data**:
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Message ID |
| conversation_id | UUID | Conversation reference |
| sender_id | UUID | Sender user ID |
| content | Text | Message text |
| image_urls | Array[URL] | Attached images |
| status | Enum | sent/delivered/read |
| created_at | DateTime | Timestamp |

---

### F06: Court Discovery

**User Story**: Là người chơi, tôi muốn tìm sân pickleball gần tôi để đặt chơi.

**Acceptance Criteria**:
- [ ] Hệ thống hiển thị danh sách sân dạng list và map view
- [ ] Mỗi sân hiển thị: ảnh, tên, địa chỉ, rating, giá/giờ, khoảng cách
- [ ] User có thể filter theo: khoảng cách, giá, rating, loại sân (indoor/outdoor)
- [ ] User có thể search sân theo tên hoặc địa chỉ
- [ ] User có thể tap vào sân để xem chi tiết
- [ ] Chi tiết sân bao gồm: gallery ảnh, mô tả, tiện ích, giờ hoạt động, reviews
- [ ] User có thể xem directions đến sân (mở Google Maps)
- [ ] Sân có badge "Đối tác" nếu là sân hợp tác với app

**Court Data** (managed by app admin):
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Court ID |
| name | String | Tên sân |
| address | String | Địa chỉ |
| location | GeoPoint | Tọa độ GPS |
| images | Array[URL] | Gallery ảnh |
| description | Text | Mô tả |
| amenities | Array[String] | Tiện ích |
| price_per_hour | Decimal | Giá/giờ |
| court_type | Enum | indoor/outdoor |
| operating_hours | JSON | Giờ hoạt động |
| rating | Float | Rating trung bình |
| is_partner | Boolean | Sân đối tác |

---

### F07: Court Booking

**User Story**: Là người chơi, tôi muốn đặt sân trực tuyến và thanh toán qua app để tiết kiệm thời gian.

**Acceptance Criteria**:
- [ ] User có thể xem lịch trống của sân (calendar view)
- [ ] User có thể chọn ngày và khung giờ muốn đặt
- [ ] Hệ thống hiển thị rõ ràng giá tiền cho slot đã chọn
- [ ] User có thể đặt nhiều slot liên tiếp
- [ ] User có thể chọn phương thức thanh toán: Thẻ nội địa, Visa/Master, MoMo, ZaloPay
- [ ] Hệ thống hiển thị tóm tắt booking trước khi thanh toán
- [ ] User nhận xác nhận booking qua app notification và email/SMS
- [ ] Booking có mã QR để check-in tại sân
- [ ] User có thể hủy booking (theo chính sách hoàn tiền của sân)
- [ ] Hệ thống giữ slot trong 10 phút khi user đang thanh toán

**Booking Flow**:
1. Select court → View calendar
2. Select date → View available slots
3. Select slot(s) → Review summary
4. Choose payment method → Pay
5. Receive confirmation + QR code

---

### F08: Push Notifications

**User Story**: Là người dùng, tôi muốn nhận thông báo để không bỏ lỡ matches, tin nhắn và booking.

**Acceptance Criteria**:
- [ ] User nhận notification khi có match mới
- [ ] User nhận notification khi có tin nhắn mới
- [ ] User nhận notification nhắc booking trước 2 giờ
- [ ] User nhận notification khi booking được xác nhận/hủy
- [ ] User nhận notification khuyến mãi từ app (nếu bật)
- [ ] User có thể bật/tắt từng loại notification trong Settings
- [ ] Notification có deep link đến screen tương ứng
- [ ] Badge count hiển thị trên app icon

**Notification Types**:
| Type | Trigger | Deep Link |
|------|---------|-----------|
| NEW_MATCH | 2 users match | Match screen |
| NEW_MESSAGE | Receive message | Chat screen |
| BOOKING_CONFIRMED | Booking confirmed | Booking detail |
| BOOKING_REMINDER | 2h before booking | Booking detail |
| PROMOTION | Admin push | Promo screen |

---

### F09: Rating & Review

**User Story**: Là người chơi, tôi muốn đánh giá đối thủ và sân để cộng đồng có thông tin tham khảo.

**Acceptance Criteria**:
- [ ] User có thể rate đối thủ sau khi chơi (1-5 sao)
- [ ] Rating đối thủ bao gồm: skill accuracy, thái độ, đúng giờ
- [ ] User có thể viết review text cho đối thủ
- [ ] User có thể rate sân sau booking (1-5 sao)
- [ ] Rating sân bao gồm: chất lượng sân, dịch vụ, vệ sinh
- [ ] User có thể viết review text và upload ảnh cho sân
- [ ] Reviews hiển thị công khai trên profile/court detail
- [ ] User không thể tự review chính mình
- [ ] Hệ thống nhắc review sau 24 giờ kể từ khi booking kết thúc

---

### F10: Coach Directory

**User Story**: Là người muốn cải thiện kỹ năng, tôi muốn tìm HLV pickleball để học.

**Acceptance Criteria**:
- [ ] Hệ thống hiển thị danh sách HLV (data managed by admin)
- [ ] Mỗi HLV hiển thị: ảnh, tên, chứng chỉ, kinh nghiệm, giá/giờ, rating
- [ ] User có thể filter HLV theo: khu vực, giá, rating
- [ ] User có thể xem profile chi tiết HLV
- [ ] Profile HLV bao gồm: bio, thành tích, gallery, reviews
- [ ] User có thể liên hệ HLV qua số điện thoại (tap to call)

**Note**: Booking/payment với HLV nằm ngoài scope MVP. User liên hệ trực tiếp.

---

### F11: Booking History

**User Story**: Là người dùng, tôi muốn xem lịch sử đặt sân để theo dõi và quản lý.

**Acceptance Criteria**:
- [ ] User có thể xem danh sách tất cả bookings
- [ ] Bookings được phân loại: Sắp tới, Đã hoàn thành, Đã hủy
- [ ] Mỗi booking hiển thị: sân, ngày giờ, trạng thái, giá tiền
- [ ] User có thể xem chi tiết booking (mã QR, thông tin sân)
- [ ] User có thể hủy booking sắp tới (theo chính sách)
- [ ] User có thể đặt lại (rebook) từ booking cũ

---

### F12: User Settings

**User Story**: Là người dùng, tôi muốn quản lý tài khoản và cài đặt app theo ý mình.

**Acceptance Criteria**:
- [ ] User có thể chỉnh sửa thông tin tài khoản (email, phone)
- [ ] User có thể thay đổi password
- [ ] User có thể cài đặt discovery preferences:
  - Distance radius (1-50 km)
  - Age range (18-60)
  - Skill level filter
- [ ] User có thể bật/tắt từng loại notification
- [ ] User có thể cài đặt privacy (ẩn profile, ẩn online status)
- [ ] User có thể xem Terms of Service và Privacy Policy
- [ ] User có thể liên hệ Support
- [ ] User có thể logout
- [ ] User có thể xóa tài khoản (với xác nhận và grace period 30 ngày)

---

## Non-functional Requirements

### Performance
| Metric | Target |
|--------|--------|
| App launch time | < 3 giây |
| Screen transition | < 300ms |
| Swipe animation | 60 FPS |
| API response time | < 500ms (P95) |
| Image load time | < 2 giây (với lazy loading) |
| Chat message delivery | < 1 giây |

### Security
| Requirement | Implementation |
|-------------|----------------|
| Data in transit | HTTPS/TLS 1.3 |
| Authentication | JWT + Refresh tokens |
| Token expiry | Access: 15 min, Refresh: 7 days |
| Password storage | bcrypt (cost 12) |
| Rate limiting | 5 login attempts / 15 min |
| Input validation | Server-side + Client-side |
| Payment | PCI DSS compliant (Stripe) |
| User data | GDPR compliant |

### Scalability
| Aspect | Approach |
|--------|----------|
| Backend | Horizontal scaling via Supabase |
| Database | PostgreSQL with read replicas |
| Static assets | CDN (Supabase Storage) |
| Real-time | Supabase Realtime |
| Target | 100,000 concurrent users |

### Usability
- Onboarding flow: tối đa 5 screens
- Core actions: tối đa 3 taps
- Responsive: support mọi screen sizes
- Dark mode: có
- Accessibility: VoiceOver/TalkBack support
- Offline: xem matches, chat history (read-only)

### Availability
- Uptime target: 99.9%
- Maintenance window: 2-4 AM (low traffic)
- Graceful degradation: khi third-party down

---

## Assumptions & Constraints

### Assumptions

**User Behavior**:
1. Users sẵn sàng tạo profile chi tiết để cải thiện match quality
2. Users familiar với swipe-based UI (từ Tinder, Bumble)
3. Users sẽ book sân qua app nếu có ưu đãi/tiện lợi

**Market**:
1. Pickleball đang phát triển nhanh tại Việt Nam
2. Có đủ số lượng sân để partnership
3. Users có smartphone và comfortable với mobile payment

**Technical**:
1. GPS accuracy đủ tốt cho location features
2. Internet connectivity ổn định ở target areas
3. Third-party services available tại VN (Google Maps, Stripe)

### Constraints

**Technical**:
- Cross-platform: iOS + Android (React Native/Expo)
- Backend: Supabase (PostgreSQL, Auth, Realtime, Storage)
- MVP timeline: 3-4 tháng

**Resource**:
- Dev team: 1-2 developers
- Limited marketing budget
- Court partnerships need BD effort

**Legal/Compliance**:
- Tuân thủ luật bảo vệ dữ liệu cá nhân VN
- Payment gateway phải được cấp phép tại VN
- Age verification: 18+

**Scope**:
- MVP focus: matching + booking
- Out of scope: tournament, video call, in-app coach booking

---

## Appendix

### Glossary
| Term | Definition |
|------|------------|
| Match | Khi cả 2 users swipe right cho nhau |
| Skill Level | Trình độ chơi: Beginner, Intermediate, Advanced, Pro |
| Doubles | Hình thức chơi 2v2 |
| Singles | Hình thức chơi 1v1 |
| Swipe Right | Like một profile |
| Swipe Left | Skip một profile |
| Partner | Người chơi cùng team trong doubles |
| Opponent | Đối thủ thi đấu |

### Related Documents
- Activity Diagrams: `design/flows/`
- Screen Designs: `design/screens/`
- Database Schema: `design/database/schema.md` (Phase 4)
- API Documentation: `design/api/endpoints.md` (Phase 4)

---

*Document End*
