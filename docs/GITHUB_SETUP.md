# GitHub Setup & Push Guide

## Status

✅ **Commit đã hoàn thành:** All changes committed to local git repository
❌ **Push failed:** Permission denied to `tungdtfgw/pickle-ball-starter.git`

---

## Issue

Bạn đang cố push với user `mthien07` nhưng repository là `tungdtfgw/pickle-ball-starter`.

**Error:**
```
remote: Permission to tungdtfgw/pickle-ball-starter.git denied to mthien07.
fatal: unable to access 'https://github.com/tungdtfgw/pickle-ball-starter.git/': The requested URL returned error: 403
```

---

## Solutions (Chọn 1 trong 3)

### Option 1: Push to Your Own Repository (Recommended)

Tạo repository mới dưới account của bạn:

**Step 1: Create new repository trên GitHub**
1. Đăng nhập GitHub với account `mthien07`
2. Vào https://github.com/new
3. Điền thông tin:
   - **Repository name:** `pickleball-dating-app` (hoặc tên khác)
   - **Description:** PickleBall Dating App - Full Stack MVP (React Native + Supabase)
   - **Visibility:** Private hoặc Public
   - **DON'T** initialize with README (vì đã có code local)
4. Click "Create repository"

**Step 2: Change remote URL**
```bash
cd /Users/ht/Desktop/pickle-ball-starter

# Remove old remote
git remote remove origin

# Add new remote (REPLACE với repository URL của bạn)
git remote add origin https://github.com/mthien07/pickleball-dating-app.git

# Verify
git remote -v
```

**Step 3: Push**
```bash
# Push to main branch
git push -u origin main

# Nếu gặp authentication issue, xem "Authentication Methods" bên dưới
```

---

### Option 2: Request Access to tungdtfgw Repository

Nếu bạn muốn push vào repository `tungdtfgw/pickle-ball-starter`:

1. **Contact repository owner** (tungdtfgw)
2. Request **Collaborator access** với **Write** permission
3. Owner cần:
   - Vào repository Settings → Collaborators
   - Add `mthien07` as collaborator
4. Sau khi được add, bạn sẽ nhận email/notification
5. Accept invitation
6. Retry push:
   ```bash
   git push origin main
   ```

---

### Option 3: Fork Repository

Fork repository về account của bạn:

**Step 1: Fork on GitHub**
1. Vào https://github.com/tungdtfgw/pickle-ball-starter
2. Click "Fork" button (góc trên phải)
3. Chọn account `mthien07` để fork về

**Step 2: Change remote**
```bash
# Remove old remote
git remote remove origin

# Add forked repository
git remote add origin https://github.com/mthien07/pickle-ball-starter.git

# Add upstream (để sync với original repo sau này)
git remote add upstream https://github.com/tungdtfgw/pickle-ball-starter.git

# Verify
git remote -v
```

**Step 3: Push**
```bash
git push -u origin main
```

---

## Authentication Methods

Khi push, GitHub có thể yêu cầu authentication:

### Method 1: Personal Access Token (Recommended)

**Create Token:**
1. Vào GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Điền:
   - **Note:** "PickleBall Dating App Development"
   - **Expiration:** 90 days (hoặc custom)
   - **Scopes:** Check `repo` (full control of private repositories)
4. Click "Generate token"
5. **COPY TOKEN NGAY** (chỉ hiện 1 lần!)

**Use Token:**
```bash
# When prompted for password, paste the token
git push origin main

# Username: mthien07
# Password: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (paste token)
```

**Store Credentials (Optional - để không nhập lại):**
```bash
# macOS - use Keychain
git config --global credential.helper osxkeychain

# Next time you enter token, it will be saved
```

### Method 2: SSH Key (Advanced)

**Generate SSH Key:**
```bash
# Generate new SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Press Enter to accept default location (~/.ssh/id_ed25519)
# Enter passphrase (optional but recommended)

# Start ssh-agent
eval "$(ssh-agent -s)"

# Add SSH key
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub
# Copy output
```

**Add to GitHub:**
1. GitHub → Settings → SSH and GPG keys → New SSH key
2. Paste public key
3. Save

**Change remote to SSH:**
```bash
# Remove HTTPS remote
git remote remove origin

# Add SSH remote (REPLACE with your repo)
git remote add origin git@github.com:mthien07/pickleball-dating-app.git

# Push
git push -u origin main
```

### Method 3: GitHub CLI (Easiest)

```bash
# Install GitHub CLI
brew install gh

# Login
gh auth login
# Follow prompts to authenticate

# Push (will auto-authenticate)
git push origin main
```

---

## Verify Push Success

Sau khi push thành công:

```bash
# Check remote status
git status

# Should show: "Your branch is up to date with 'origin/main'"

# View on GitHub
# https://github.com/YOUR_USERNAME/YOUR_REPO_NAME
```

Trên GitHub web, bạn sẽ thấy:
- ✅ All files uploaded
- ✅ Commit message displayed
- ✅ 93 files changed, 32513 insertions
- ✅ Project structure visible

---

## Next Steps After Push

### 1. Update README.md

Tạo file `README.md` với project overview:

```markdown
# PickleBall Dating App

Dating app kết nối người chơi pickleball tại Việt Nam.

## Features
- Swipe matching theo skill level
- Chat realtime
- Đặt sân trực tuyến
- Tìm HLV
- Rating & reviews

## Tech Stack
- React Native (Expo)
- Supabase (Backend)
- React Navigation v6
- Reanimated v4

## Documentation
- [Product Requirements](PRD.md)
- [Frontend Specification](FRONTEND_SPEC.md)
- [Database Schema](design/database/schema.md)
- [API Endpoints](design/api/endpoints.md)
- [Setup Instructions](docs/SETUP_INSTRUCTIONS.md)
- [Deployment Guide](docs/MOBILE_DEPLOYMENT.md)

## Quick Start
See [docs/SETUP_INSTRUCTIONS.md](docs/SETUP_INSTRUCTIONS.md)

## License
MIT
```

Push README:
```bash
git add README.md
git commit -m "docs: Add README.md with project overview"
git push origin main
```

### 2. Add Topics/Tags

Trên GitHub repository page:
- Click ⚙️ Settings icon (góc phải)
- Add topics: `react-native`, `expo`, `supabase`, `dating-app`, `pickleball`, `mobile-app`, `typescript`

### 3. Enable GitHub Actions (Optional)

Nếu muốn CI/CD automation, create `.github/workflows/` (đã có guide trong `docs/MOBILE_DEPLOYMENT.md`)

### 4. Protect Main Branch (Optional)

Repository Settings → Branches → Add rule:
- Branch name pattern: `main`
- ✅ Require pull request before merging
- ✅ Require status checks to pass

---

## Troubleshooting

### Error: "Updates were rejected because the remote contains work"

```bash
# Pull first, then push
git pull origin main --rebase
git push origin main
```

### Error: "fatal: refusing to merge unrelated histories"

```bash
git pull origin main --allow-unrelated-histories
git push origin main
```

### Large File Warning

If you get large file warnings:
```bash
# Add to .gitignore
echo "node_modules/" >> .gitignore
echo "*.log" >> .gitignore

# Remove from git (keep local)
git rm -r --cached node_modules/

# Commit and push
git commit -m "chore: Update .gitignore"
git push origin main
```

---

## Current Commit Info

**Commit:** `2afcdac`
**Message:** "feat: Complete PickleBall Dating App - Full Stack MVP"
**Stats:**
- 93 files changed
- 32,513 insertions
- 6,292 deletions

**Files Ready to Push:**
- All documentation
- Database schemas
- API specifications
- Frontend components
- Backend migrations
- Deployment guides

---

## Recommended Action

**Tôi recommend Option 1:** Tạo repository mới dưới account `mthien07` của bạn.

**Steps:**
1. Create new repo: https://github.com/new
2. Copy repository URL (e.g., `https://github.com/mthien07/pickleball-dating-app.git`)
3. Run:
   ```bash
   git remote remove origin
   git remote add origin https://github.com/mthien07/YOUR_REPO_NAME.git
   git push -u origin main
   ```

---

Bạn muốn tôi guide chi tiết option nào? (1, 2, hoặc 3)
