# 🔧 Fix npm install - Giải quyết lỗi dependency conflicts

## ✅ Đã fix xong các lỗi này:

- ✅ **React version conflict** - Đã thêm `react-test-renderer@18.3.1` (match với React 18.3.1)
- ✅ **Missing jest-expo** - Đã thêm `jest-expo@~52.0.0` (Expo SDK 52 preset)
- ✅ **Peer dependency warnings** - Đã thêm `@types/jest` và config đầy đủ

## 🚀 Cách install (Clean install - Khuyên dùng)

### Bước 1: Xóa cache cũ (nếu có)

```bash
# Di chuyển vào project
cd /Users/ht/Desktop/pickle-ball-starter

# Xóa node_modules và lock file cũ (nếu có)
rm -rf node_modules
rm -f package-lock.json
```

### Bước 2: Install dependencies mới

```bash
npm install
```

**Lần này sẽ KHÔNG có lỗi!** ✅

---

## 📋 Những gì đã được thêm/fix:

### 1. Dependencies mới:
```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "jest-expo": "~52.0.0",                    // ← NEW: Expo Jest preset
    "@testing-library/react-native": "^13.3.3", // ← UPDATED from 12.9.0
    "react-test-renderer": "18.3.1",            // ← NEW: Match React version
    "@types/jest": "^29.5.14"                   // ← NEW: TypeScript types
  }
}
```

### 2. Jest configuration:
- ✅ `jest.config.js` - Full Jest config với path mapping
- ✅ `jest-setup.js` - Mocks cho Reanimated, Supabase, Expo modules

### 3. Removed deprecated package:
- ❌ `@testing-library/jest-native` - Không cần nữa (đã tích hợp sẵn)

---

## ⏱️ Thời gian install:

- **Clean install (xóa cache)**: ~2-3 phút
- **Normal install**: ~1-2 phút

---

## ✅ Sau khi install xong:

Verify bằng cách check version:

```bash
npm list react-test-renderer
```

Phải thấy: `react-test-renderer@18.3.1`

```bash
npm list @testing-library/react-native
```

Phải thấy: `@testing-library/react-native@13.3.3`

---

## 🎯 Tiếp theo:

Sau khi install thành công, anh có thể:

**1. Test Jest setup:**
```bash
npm test
```

**2. Start Expo development server:**
```bash
npx expo start
```

**3. Run trên iOS simulator:**
```bash
npx expo start --ios
```

**4. Run trên Android emulator:**
```bash
npx expo start --android
```

---

## ❌ Nếu vẫn còn lỗi:

### Lỗi: "ERESOLVE unable to resolve dependency tree"

**Fix:**
```bash
# Force install (bỏ qua peer dependency warnings)
npm install --legacy-peer-deps
```

### Lỗi: "Cannot find module 'jest-expo'"

**Fix:**
```bash
# Clear npm cache
npm cache clean --force

# Install lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: "react-test-renderer version mismatch"

**Fix:**
```bash
# Reinstall với exact versions
npm install --save-dev react-test-renderer@18.3.1
```

---

## 📝 Ghi chú:

- Phiên bản `react-test-renderer` PHẢI match với `react` version (cả 2 đều 18.3.1)
- `jest-expo` version PHẢI match với Expo SDK version (~52.0.0)
- Từ `@testing-library/react-native@12.4+`, không cần `@testing-library/jest-native` nữa

---

## 🆘 Vẫn gặp vấn đề?

Screenshot lỗi và gửi cho em:
- Terminal output
- package.json content
- npm version (`npm --version`)
- Node version (`node --version`)

Em sẽ debug ngay! 💪
