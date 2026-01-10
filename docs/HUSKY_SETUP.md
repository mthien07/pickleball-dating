# 🐶 Husky Git Hooks Setup

Husky được cấu hình để tự động chạy code quality checks trước khi commit và push.

## 📦 Cài Đặt

Husky đã được setup sẵn! Khi bạn chạy `npm install`, Husky sẽ tự động được cài đặt.

## 🎯 Git Hooks Được Kích Hoạt

### 1. **Pre-Commit Hook** (Trước khi commit)

Chạy `lint-staged` để check và fix code cho các files đã staged:

**Đối với `.js, .jsx, .ts, .tsx` files:**
- ✅ ESLint auto-fix
- ✅ Prettier format

**Đối với `.json, .md` files:**
- ✅ Prettier format

**Ví dụ:**
```bash
git add src/components/Button.tsx
git commit -m "feat(ui): add new button component"

# Husky sẽ tự động:
# 1. Run eslint --fix on Button.tsx
# 2. Run prettier --write on Button.tsx
# 3. Nếu có lỗi không thể fix → commit bị reject
# 4. Nếu ok → commit thành công
```

### 2. **Commit-Msg Hook** (Validate commit message)

Đảm bảo commit message follow **Conventional Commits** format:

**Format:**
```
type(scope): subject

type: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert
scope: tên module/feature (optional)
subject: mô tả ngắn gọn
```

**Ví dụ hợp lệ:**
```bash
✅ feat(auth): add login screen
✅ fix(api): handle null user data
✅ docs: update README
✅ refactor(hooks): simplify useAnimation
✅ test(utils): add validation tests
```

**Ví dụ KHÔNG hợp lệ:**
```bash
❌ "added login screen"
❌ "fixed bug"
❌ "WIP"
❌ "update"
```

## 🚫 Bypass Hooks (Không Khuyến Khích)

Trong trường hợp khẩn cấp, bạn có thể skip hooks:

```bash
# Skip pre-commit
git commit --no-verify -m "fix: emergency hotfix"

# Skip cả pre-commit và commit-msg
git commit -n -m "emergency fix"
```

**⚠️ CHÚ Ý:** Chỉ dùng khi thực sự cần thiết!

## 🔧 Tùy Chỉnh

### Thêm commands vào pre-commit

Edit `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "jest --findRelatedTests" // Thêm test
    ]
  }
}
```

### Tạo hook mới

```bash
# Tạo pre-push hook
echo '#!/bin/sh
npm run type-check
npm test' > .husky/pre-push

chmod +x .husky/pre-push
```

## 📊 Workflow

```
┌─────────────────────────────────────────────────┐
│  Developer writes code                          │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  git add src/components/Button.tsx              │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  git commit -m "feat(ui): add button"           │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  🎣 PRE-COMMIT HOOK TRIGGERED                   │
│  ├─ Run ESLint --fix                            │
│  ├─ Run Prettier --write                        │
│  └─ Stage fixed files                           │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  🎣 COMMIT-MSG HOOK TRIGGERED                   │
│  └─ Validate commit message format              │
└────────────────┬────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
    ✅ Pass           ❌ Fail
        │                 │
        ▼                 ▼
  Commit OK        Commit Rejected
                   (Fix issues)
```

## 🎓 Best Practices

### 1. **Commit Nhỏ, Thường Xuyên**
```bash
# Good ✅
git commit -m "feat(auth): add login form validation"
git commit -m "feat(auth): add password strength check"

# Bad ❌
git commit -m "feat(auth): add entire authentication system"
```

### 2. **Mô Tả Rõ Ràng**
```bash
# Good ✅
git commit -m "fix(api): handle 401 unauthorized error in user endpoint"

# Bad ❌
git commit -m "fix: bug"
```

### 3. **Scope Cụ Thể**
```bash
# Good ✅
git commit -m "refactor(hooks/useAnimation): extract common logic"

# Bad ❌
git commit -m "refactor: code cleanup"
```

### 4. **Breaking Changes**
```bash
# Breaking change
git commit -m "feat(api)!: change user response format

BREAKING CHANGE: User API now returns camelCase instead of snake_case"
```

## 🐛 Troubleshooting

### Husky không chạy?

```bash
# Reinstall husky
npm run prepare
```

### Lint-staged không hoạt động?

```bash
# Check lint-staged config
npx lint-staged --debug
```

### Hook bị permission denied?

```bash
# Make hooks executable
chmod +x .husky/*
```

### Skip hooks tạm thời

```bash
# Set env variable
HUSKY=0 git commit -m "..."
```

## 📚 Tài Liệu Tham Khảo

- [Husky Official Docs](https://typicode.github.io/husky/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [lint-staged](https://github.com/okonet/lint-staged)

## ✨ Benefits

- ✅ **Code Quality**: Tự động fix linting errors
- ✅ **Consistency**: Đảm bảo code style đồng nhất
- ✅ **Clean History**: Commit messages có format chuẩn
- ✅ **Prevent Bugs**: Catch errors trước khi push
- ✅ **Team Collaboration**: Cả team follow cùng standards

---

Made with ❤️ by Claude Code
