# 🚀 Bắt đầu ngay - 5 phút

Em đã setup xong toàn bộ Expo project cho anh rồi! Giờ anh chỉ cần chạy 3 lệnh là xong.

## ✅ Đã có sẵn

- ✅ Expo project đã được initialize
- ✅ App.tsx test Supabase đã được tạo
- ✅ Package.json với tất cả dependencies
- ✅ TypeScript + Babel config
- ✅ .env với Supabase credentials

## 🎯 Làm ngay 3 bước này (5 phút)

### Bước 1: Cài Node.js (nếu chưa có)

**Kiểm tra xem đã có Node.js chưa:**
```bash
node --version
```

**Nếu chưa có, cài Node.js:**
- Vào https://nodejs.org
- Tải bản **LTS** (khuyên dùng)
- Install như bình thường

### Bước 2: Install dependencies

```bash
cd /Users/ht/Desktop/pickle-ball-starter
npm install
```

Lệnh này sẽ cài đặt tất cả packages (React Native, Expo, Supabase, etc.)

**Thời gian:** ~2-3 phút (tùy tốc độ mạng)

### Bước 3: Run Supabase migrations

**Option A: Qua Supabase Dashboard (Dễ nhất - Khuyên dùng)**

1. Vào https://supabase.com/dashboard
2. Chọn project: **ytwcalyalpnmnqsmoilt**
3. Vào **SQL Editor** (icon ở sidebar trái)
4. Chạy **TỪNG FILE** migration theo thứ tự:

   **File 1: `supabase/migrations/001_initial_schema.sql`**
   - Copy toàn bộ nội dung file
   - Paste vào SQL Editor
   - Click **Run**
   - Đợi thông báo "Success"

   **File 2: `supabase/migrations/002_rls_policies.sql`**
   - Làm tương tự

   **File 3: `supabase/migrations/003_functions.sql`**
   - Làm tương tự

   **File 4: `supabase/migrations/004_seed_data.sql`**
   - Làm tương tự (file này thêm data mẫu: 4 sân + 3 HLV)

5. Xong! Verify bằng cách vào **Table Editor** → Chọn table `courts` → Phải thấy 4 sân

**Option B: Qua Supabase CLI (Nâng cao)**

```bash
# Install Supabase CLI
npm install -g supabase

# Link to project
supabase link --project-ref ytwcalyalpnmnqsmoilt

# Run migrations
supabase db push
```

### Bước 4: Start Expo

```bash
npx expo start
```

**Bạn sẽ thấy:**
- QR code xuất hiện trên terminal
- Option để mở trên iOS/Android simulator
- Link để mở trên web

### Bước 5: Scan QR code bằng Expo Go

**Trên iPhone:**
- Mở **Camera** app
- Quét QR code
- Nhấn vào notification "Open in Expo Go"

**Trên Android:**
- Mở **Expo Go** app
- Nhấn **Scan QR code**
- Quét QR code từ terminal

## 🎉 Kết quả mong đợi

Sau khi app load lên phone, anh sẽ thấy:

```
┌─────────────────────────────┐
│  🎾 PickleBall Dating       │
│  Test Supabase Connection   │
├─────────────────────────────┤
│ ✅ Kết nối thành công!      │
├─────────────────────────────┤
│                             │
│  🎉 Thành công!             │
│  App đã kết nối thành công  │
│  với Supabase!              │
│                             │
│  🏟️ Sân Pickleball (4)      │
│  ┌─────────────────────┐   │
│  │ Landmark 81 Court   │   │
│  │ Vinhomes Central... │   │
│  │ ⭐ 4.5              │   │
│  └─────────────────────┘   │
│  [3 sân khác...]            │
│                             │
│  👨‍🏫 Huấn luyện viên (3)    │
│  ┌─────────────────────┐   │
│  │ Trần Văn An        │   │
│  │ Doubles Strategy   │   │
│  │ ⭐ 4.8              │   │
│  └─────────────────────┘   │
│  [2 HLV khác...]            │
│                             │
│  📋 Bước tiếp theo:         │
│  ✅ Supabase đã hoạt động!  │
│  ✅ Database có dữ liệu!    │
└─────────────────────────────┘
```

## ❌ Nếu có lỗi

### Lỗi 1: "Cannot connect to Supabase"

**Nguyên nhân:** Chưa chạy migrations

**Fix:**
- Làm Bước 3 (Run Supabase migrations)
- Restart Expo: `Ctrl+C` rồi `npx expo start` lại

### Lỗi 2: "relation 'courts' does not exist"

**Nguyên nhân:** Migrations chưa chạy hoặc chạy sai thứ tự

**Fix:**
1. Vào Supabase Dashboard → **Table Editor**
2. Kiểm tra có table `courts`, `coaches` không
3. Nếu không có → Chạy lại migration 001 và 004
4. Nếu có nhưng rỗng → Chạy lại migration 004 (seed data)

### Lỗi 3: npm install failed

**Fix:**
```bash
# Clear cache
rm -rf node_modules
rm package-lock.json

# Install lại
npm install
```

### Lỗi 4: Expo Go không quét được QR code

**Fix:**
- Đảm bảo phone và laptop cùng WiFi
- Hoặc dùng option "Tunnel": `npx expo start --tunnel`

## 📱 Sau khi test xong

Nếu app chạy thành công (thấy list sân + HLV), anh có thể:

1. **Bắt đầu develop features:**
   - Implement các screens trong `design/screens/`
   - Thay thế App.tsx bằng navigation structure
   - Add authentication flow

2. **Xem documentation:**
   - `FRONTEND_SPEC.md` - Spec đầy đủ cho frontend
   - `docs/BACKEND_INTEGRATION.md` - Hướng dẫn integrate API
   - `docs/SUPABASE_SETUP.md` - Chi tiết về Supabase

3. **Next steps:**
   ```bash
   # Create navigation structure
   mkdir -p src/navigation

   # Create screens
   mkdir -p src/screens

   # Start implementing features theo PRD.md
   ```

## 🆘 Cần help?

Nếu gặp lỗi khác hoặc cần clarification, message em:
- Screenshot lỗi
- Cho em biết đang ở bước nào
- Em sẽ debug ngay!

## 📊 Tổng kết

Toàn bộ setup chỉ cần:
- ⏱️ **5 phút** (nếu đã có Node.js)
- ⏱️ **10 phút** (nếu chưa có Node.js)

Sau đó anh có ngay:
- ✅ Expo app chạy được
- ✅ Supabase backend hoạt động
- ✅ Database với data mẫu
- ✅ Ready để develop features

Let's go! 🚀
