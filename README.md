# PickleBall Dating App

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-Expo-blue?logo=expo" alt="React Native Expo">
  <img src="https://img.shields.io/badge/Backend-Supabase-green?logo=supabase" alt="Supabase">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License">
</p>

**Dating app kết nối người chơi pickleball tại Việt Nam** - Tìm đối thủ phù hợp, đặt sân trực tuyến, và kết bạn với cộng đồng pickleball.

> **Design:** Hinge-style editorial UI — serif + sans-serif typography, vertical scrollable profiles with section-level likes, sophisticated muted color palette.

---

## ✨ Features

- 🎾 **Editorial Profile Matching** - Duyệt profile kiểu Hinge: cuộn dọc, like từng ảnh/prompt cụ thể
- 💬 **Chat Realtime** - Nhắn tin trực tiếp với người đã match
- 🏟️ **Đặt Sân Trực Tuyến** - Tìm và đặt sân pickleball gần bạn
- 👨‍🏫 **Tìm HLV** - Kết nối với HLV pickleball chuyên nghiệp
- ⭐ **Rating & Review** - Đánh giá sân và người chơi
- 🔔 **Push Notifications** - Thông báo match, tin nhắn, booking
- 🗺️ **Geo-spatial Search** - Tìm sân và người chơi gần vị trí của bạn
- 🔐 **Multi-Auth** - Email, Phone OTP

---

## 🏗️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Mobile** | React Native (Expo) | SDK 54 |
| **Language** | TypeScript | 5.x |
| **Backend** | Supabase | Latest |
| **Database** | PostgreSQL + PostGIS | 15+ |
| **Auth** | Supabase Auth | Latest |
| **Realtime** | Supabase Realtime | Latest |
| **Storage** | Supabase Storage | Latest |
| **State** | Zustand + TanStack Query | Latest |
| **Navigation** | React Navigation | v6 |
| **Animation** | React Native Reanimated | v4 |
| **Typography** | PlayfairDisplay (serif) + Barlow (sans) | Google Fonts |
| **Forms** | React Hook Form + Zod | Latest |

---

## 📁 Project Structure

```
pickleball-dating/
├── PRD.md                      # Product Requirements
├── FRONTEND_SPEC.md            # Frontend Specification
├── PROJECT_STATUS.md           # Project Status
├── data/mockData.ts            # Mock Data (1,087 lines)
├── design/
│   ├── uiuxguides.md          # UI/UX Guidelines
│   ├── flows/                 # 12 Activity Diagrams
│   ├── screens/               # 22 Screen Descriptions
│   ├── database/schema.md     # 14 Tables Schema
│   └── api/endpoints.md       # 50+ API Endpoints
├── docs/
│   ├── SETUP_INSTRUCTIONS.md
│   ├── SUPABASE_SETUP.md
│   ├── BACKEND_INTEGRATION.md
│   ├── MOBILE_DEPLOYMENT.md
│   └── references/            # 11 Tech Docs
├── src/
│   ├── theme/tokens.ts        # Design Tokens (Hinge palette)
│   ├── theme/animation-presets.ts # Spring animation configs
│   ├── components/            # 30+ Components (inc. EditorialProfileCard)
│   └── services/              # API Services
└── supabase/
    ├── migrations/            # 4 SQL Files
    └── storage/               # Buckets Config
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org))
- **Expo CLI**: `npm install -g expo-cli eas-cli`
- **Supabase Account** ([Sign up](https://supabase.com))

### Installation

```bash
# 1. Clone repository
git clone https://github.com/mthien07/pickleball-dating.git
cd pickleball-dating

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Start development
npx expo start
```

### Run on Device

```bash
# iOS Simulator (macOS only)
npx expo start --ios

# Android Emulator
npx expo start --android

# Scan QR with Expo Go app
npx expo start
```

### Troubleshooting

```bash
# Module not found / Metro bundler issues
rm -rf node_modules && npm install && npx expo start --clear

# iOS Simulator not opening (macOS)
xcrun simctl erase all && npx expo start --ios

# Supabase connection fails
# 1. Check .env credentials
# 2. Verify migrations ran in Supabase Dashboard
# 3. Check internet connection
```

---

## 📚 Documentation

### Product & Design
- [PRD.md](PRD.md) - Product Requirements
- [design/uiuxguides.md](design/uiuxguides.md) - UI/UX Guidelines
- [design/flows/](design/flows/) - Activity Diagrams
- [design/screens/](design/screens/) - Screen Specs

### Frontend
- [FRONTEND_SPEC.md](FRONTEND_SPEC.md) - Complete Frontend Spec
- [docs/NAVIGATION_STRUCTURE.md](docs/NAVIGATION_STRUCTURE.md) - Navigation
- [src/theme/tokens.ts](src/theme/tokens.ts) - Design Tokens

### Backend
- [design/database/schema.md](design/database/schema.md) - Database Schema
- [design/api/endpoints.md](design/api/endpoints.md) - API Endpoints
- [supabase/migrations/](supabase/migrations/) - SQL Migrations

### Setup Guides
- [docs/SETUP_INSTRUCTIONS.md](docs/SETUP_INSTRUCTIONS.md) - Complete Dev Setup
- [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) - Supabase Config
- [docs/BACKEND_INTEGRATION.md](docs/BACKEND_INTEGRATION.md) - Integration
- [docs/MOBILE_TESTING_GUIDE.md](docs/MOBILE_TESTING_GUIDE.md) - Test on Device
- [docs/MOBILE_DEPLOYMENT.md](docs/MOBILE_DEPLOYMENT.md) - Deploy Guide

---

## 🏛️ Architecture

### Database (14 Tables)
users, swipes, matches, conversations, messages, courts, court_time_slots, bookings, booking_slots, coaches, reviews, notifications, user_blocks, user_reports

### API (50+ Endpoints)
Auth (8) • Profile (5) • Matching (7) • Chat (4) • Courts (3) • Bookings (6) • Reviews (4) • Notifications (5)

### Features (12 Major)
F01: Auth • F02: Profile • F03: Swipe Matching • F04: Match Management • F05: Chat • F06: Court Discovery • F07: Booking • F08: Notifications • F09: Reviews • F10: Coaches • F11: History • F12: Settings

---

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| Files | 100+ |
| Code Lines | ~16,000+ |
| Features | 12 |
| Screens | 22 |
| Tables | 14 |
| Endpoints | 50+ |
| Components | 30+ |
| Docs | 10+ |
| Design Style | Hinge Editorial |

---

## 🎯 Development Status

✅ **Phase 1:** Requirement Analysis
✅ **Phase 2:** Design (Flows + Screens)
✅ **Phase 3:** Frontend Prototype
✅ **Phase 4:** Backend Development
✅ **Phase 5:** Hinge-Style UI Redesign (March 2026)

**Current:** Full Hinge-style editorial redesign deployed — serif typography, vertical profile feed, muted palette, dark mode

---

## 🚢 Deployment

### Mobile Apps

```bash
# Build for production
eas build --platform all --profile production

# Submit to stores
eas submit --platform all
```

See [docs/MOBILE_DEPLOYMENT.md](docs/MOBILE_DEPLOYMENT.md) for complete guide.

### Backend (Supabase)

1. Create project at https://supabase.com
2. Run migrations from `supabase/migrations/`
3. Configure auth providers
4. Setup storage buckets

See [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) for details.

---

## 🔐 Security

✅ Row-Level Security (RLS)
✅ JWT Authentication
✅ Secure Storage
✅ HTTPS Only
✅ Input Validation
✅ Rate Limiting

---

## 📝 License

MIT License

---

## 👥 Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📧 Contact

- **Repository:** https://github.com/mthien07/pickleball-dating
- **Issues:** https://github.com/mthien07/pickleball-dating/issues

---

<p align="center">
  Made by MThien for the Pickleball Community
  <br>
  🚀 Built with <a href="https://antigravity.google/">Antigravity</a>, <a href="https://cursor.com/">Cursor</a> & <a href="https://claude.ai/">Claude Code</a>
</p>
