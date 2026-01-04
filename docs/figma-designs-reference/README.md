# Figma Designs Reference

## Mục đích
Folder này chứa các file export từ Figma design (web-based React components) dùng làm **reference only**.

## ⚠️ Lưu ý quan trọng
- **KHÔNG SỬ DỤNG** code trong folder này trực tiếp trong app
- Đây là **web-based components** (sử dụng Tailwind CSS, motion/react, lucide-react)
- Code thật của app ở folder `/src` (React Native components)

## Quá trình chuyển đổi
Các thiết kế Figma đã được convert sang React Native:

### ✅ Đã hoàn thành
1. **SplashScreen.tsx** → `/src/screens/auth/WelcomeScreen.tsx`
   - Animated blobs với gradient
   - Pickleball logo
   - Gradient buttons

2. **OnboardingScreen.tsx** → `/src/screens/auth/OnboardingScreen.tsx`
   - Floating profile cards
   - Pulsing heart logo
   - Get Started CTA

3. **LoginScreen.tsx** → `/src/screens/auth/LoginScreen.tsx`
   - Dark theme (#0a0a0a)
   - Red email label, gray password label
   - Circular back button

4. **SignUpScreen.tsx** → `/src/screens/auth/EmailSignupScreen.tsx`
   - Role cards với icons (business, people, school)
   - Gradient selected state
   - Dark theme

5. **SwipeCard.tsx** → Enhanced `/src/components/Card.tsx` (ProfileCard)
   - Match percentage badge
   - Online status indicator
   - Image progress indicators
   - Interest tags
   - Action buttons (Reject, Super Like, Like)

## Khi nào sử dụng folder này?
- Khi cần **tham khảo chi tiết thiết kế** từ Figma
- Khi cần **verify màu sắc, spacing, layout** trước khi implement
- Khi cần **hiểu flow và interactions** của design gốc

## Không sử dụng để
- ❌ Copy-paste code trực tiếp
- ❌ Import components vào app
- ❌ Build hoặc run các file này

---

**Last updated:** 2026-01-03
**Purpose:** Reference only - web-based Figma exports
