# Mobile App Deployment Guide
## PickleBall Dating App

**Last Updated**: 2026-01-02
**Platform**: React Native (Expo)
**Target**: iOS + Android

---

## Overview

Hướng dẫn này mô tả cách deploy **PickleBall Dating mobile app** lên App Store (iOS) và Google Play (Android).

### Deployment Options

| Platform | Purpose | Timeline |
|----------|---------|----------|
| **Expo EAS Build** | Cloud build service (Recommended) | ~15-30 minutes/build |
| **TestFlight** | iOS beta testing | Submit instantly after build |
| **Google Play Internal Testing** | Android beta | Submit instantly after build |
| **App Store** | iOS production release | 1-3 days review |
| **Google Play** | Android production release | Few hours review |

---

## Prerequisites

### 1. Accounts Required

| Account | Cost | Purpose |
|---------|------|---------|
| **Apple Developer** | $99/year | Required for iOS distribution |
| **Google Play Console** | $25 one-time | Required for Android distribution |
| **Expo Account** | Free | Build & submit automation |

### 2. Development Environment

```bash
# Node.js 18+ installed
node --version

# Expo CLI installed globally
npm install -g eas-cli expo-cli

# Login to Expo
eas login
```

### 3. App Store Assets Preparation

**App Icon:**
- 1024x1024px PNG (no transparency, no rounded corners)
- Use tools: https://appicon.co or https://makeappicon.com

**Screenshots Required:**

**iOS:**
- iPhone 6.7" (1290x2796px) - iPhone 14 Pro Max - 3-10 screenshots
- iPhone 6.5" (1242x2688px) - iPhone 11 Pro Max - Optional
- iPad Pro 12.9" (2048x2732px) - If supporting iPad - Optional

**Android:**
- Phone (1080x1920px minimum) - 2-8 screenshots
- 7-inch tablet (1024x600px) - Optional
- 10-inch tablet (1280x800px) - Optional

**Feature Graphic (Android only):**
- 1024x500px JPG/PNG

**App Store Listing Content:**
- App name (30 characters max)
- Subtitle (30 characters max)
- Description (Vietnamese + English)
- Keywords (100 characters, comma-separated)
- Privacy Policy URL
- Support URL

---

## Step 1: Configure Expo Project

### 1.1. Create/Update `app.json`

```json
{
  "expo": {
    "name": "PickleBall Dating",
    "slug": "pickleball-dating",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FF6B35"
    },
    "updates": {
      "fallbackToCacheTimeout": 0,
      "url": "https://u.expo.dev/[your-project-id]"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.pickleballdating",
      "buildNumber": "1",
      "infoPlist": {
        "NSCameraUsageDescription": "PickleBall Dating needs camera access to take profile photos.",
        "NSPhotoLibraryUsageDescription": "PickleBall Dating needs photo library access to upload profile pictures.",
        "NSLocationWhenInUseUsageDescription": "PickleBall Dating needs your location to find nearby courts and players.",
        "NSLocationAlwaysAndWhenInUseUsageDescription": "PickleBall Dating needs your location to suggest nearby matches."
      },
      "config": {
        "googleMapsApiKey": "YOUR_IOS_GOOGLE_MAPS_API_KEY"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.yourcompany.pickleballdating",
      "versionCode": 1,
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ],
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_ANDROID_GOOGLE_MAPS_API_KEY"
        }
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "[GET_FROM_EAS_BUILD_CONFIGURE]"
      }
    },
    "owner": "your-expo-username",
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "Allow PickleBall Dating to access your photos."
        }
      ]
    ]
  }
}
```

**IMPORTANT:**
- Replace `com.yourcompany.pickleballdating` with your actual bundle ID
- Get Google Maps API keys from Google Cloud Console
- `projectId` will be generated when you run `eas build:configure`

### 1.2. Create `eas.json`

```bash
# Initialize EAS configuration
eas build:configure
```

This creates `eas.json`:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium",
        "bundler": "metro"
      },
      "android": {
        "buildType": "aab",
        "gradleCommand": ":app:bundleRelease"
      },
      "env": {
        "SUPABASE_URL": "https://your-project.supabase.co",
        "SUPABASE_ANON_KEY": "your-anon-key"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCDE12345"
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json",
        "track": "production"
      }
    }
  }
}
```

### 1.3. Environment Variables

**Option A: eas.json (shown above)**

**Option B: EAS Secrets (Recommended for sensitive data)**

```bash
# Set secrets
eas secret:create --scope project --name SUPABASE_URL --value https://xxx.supabase.co
eas secret:create --scope project --name SUPABASE_ANON_KEY --value eyJhbG...

# List secrets
eas secret:list
```

Then access in code:
```typescript
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.SUPABASE_URL;
```

---

## Step 2: Build for iOS

### 2.1. Prepare iOS Build

**Create App in App Store Connect:**
1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+" → "New App"
3. Fill details:
   - Platform: iOS
   - Name: PickleBall Dating
   - Primary Language: Vietnamese
   - Bundle ID: Select from dropdown (must match app.json)
   - SKU: unique identifier (e.g., pickleballdating-2026)
4. Click "Create"
5. Note the **App ID** (10-digit number in URL or App Information)

**Get Team ID:**
1. Go to https://developer.apple.com/account
2. Click "Membership" in sidebar
3. Copy **Team ID** (10-character code)

### 2.2. Run iOS Build

```bash
# First build - will prompt for credentials
eas build --platform ios --profile production

# Follow prompts:
# - Apple ID: your-apple-id@example.com
# - Password: your-apple-password
# - Team ID: ABCDE12345
# - Generate new credentials? Yes (first time)
```

**What happens:**
1. EAS uploads your code
2. Installs dependencies
3. Generates iOS credentials (distribution certificate, provisioning profile)
4. Builds IPA file (~15-30 minutes)
5. Returns download link

**Download IPA:**
```bash
# Build completes, you'll get URL like:
https://expo.dev/accounts/[account]/projects/[project]/builds/[build-id]

# Or list builds:
eas build:list --platform ios
```

### 2.3. Submit to App Store

**Option A: Auto-submit via EAS**

```bash
eas submit --platform ios --latest

# Or specify build ID:
eas submit --platform ios --id [build-id]

# Will prompt for:
# - Apple ID
# - App-specific password (generate at appleid.apple.com)
# - ASC App ID (from App Store Connect)
```

**Option B: Manual upload via Transporter**

1. Download IPA from EAS build
2. Download **Transporter** app (Mac App Store)
3. Open Transporter
4. Drag IPA file
5. Click "Deliver"

### 2.4. Complete App Store Connect Listing

1. Go to App Store Connect → Your App
2. Click version (e.g., "1.0 Prepare for Submission")
3. Fill all required info:

**App Information:**
- Name: PickleBall Dating
- Subtitle: Tìm đối thủ & hẹn hò với người chơi pickleball
- Privacy Policy URL: https://yoursite.com/privacy
- Category: Lifestyle, Social Networking

**Pricing:**
- Price: Free
- Availability: All countries (or select Vietnam)

**Version Information:**
- Screenshots: Upload for each device size
- Description:
```
PickleBall Dating là ứng dụng kết nối người chơi pickleball tại Việt Nam.
Tìm đối thủ phù hợp, đặt sân trực tuyến, và kết bạn với cộng đồng pickleball.

Tính năng:
• Swipe để tìm đối thủ theo skill level
• Chat với người đã match
• Đặt sân pickleball trực tuyến
• Tìm HLV cá nhân
• Đánh giá sân và người chơi
```
- Keywords: pickleball, dating, sports, tennis, badminton, hẹn hò
- Support URL: https://yoursite.com/support
- Marketing URL (optional)

**App Review Information:**
- Contact: Your email, phone
- Demo account (if login required):
  - Username: demo@pickleballdating.com
  - Password: Demo123!
- Notes: "Dating app for pickleball players in Vietnam"

**Version Release:**
- Automatically release this version (recommended)
- Or manually release after approval

4. Click "Add for Review"
5. Submit for review
6. Wait 1-3 days for approval

---

## Step 3: Build for Android

### 3.1. Prepare Android Build

**Create App in Google Play Console:**
1. Go to https://play.google.com/console
2. Click "Create app"
3. Fill details:
   - App name: PickleBall Dating
   - Default language: Vietnamese (Tiếng Việt)
   - App or game: App
   - Free or paid: Free
4. Accept declarations
5. Click "Create app"

**Set up your app:**
1. **Dashboard:** Complete all tasks in setup checklist
2. **App access:** All functionalities available without restrictions (or specify login needed)
3. **Ads:** Does not contain ads (or select if using ads)
4. **Content rating:**
   - Start questionnaire
   - Category: Dating
   - Answer questions honestly
   - Get rating (likely Teen or Mature 17+)
5. **Target audience:**
   - Age: 18+
6. **News app:** No
7. **COVID-19 contact tracing:** No
8. **Data safety:**
   - Collect location: Yes (approximate location for finding courts)
   - Collect personal info: Yes (name, email, photos)
   - Collect photos: Yes (profile photos)
   - Data encrypted in transit: Yes
   - Users can request deletion: Yes
9. **Government apps:** No

### 3.2. Get Google Play Service Account Key

For auto-submit, you need service account:

1. Go to Google Play Console → Setup → API access
2. Click "Create new service account"
3. Follow link to Google Cloud Console
4. Create service account:
   - Name: eas-submit
   - Role: Service Account User
5. Create key (JSON format)
6. Download JSON file
7. Save as `google-play-service-account.json` in project root
8. Back in Play Console, grant access:
   - Select service account
   - Grant "Admin" role (or "Release Manager")

### 3.3. Run Android Build

```bash
# Build AAB (Android App Bundle)
eas build --platform android --profile production

# Follow prompts:
# - Generate new keystore? Yes (first time)
```

**What happens:**
1. Generates Android keystore (signing key)
2. Builds AAB file (~15-30 minutes)
3. Returns download link

### 3.4. Submit to Google Play

**Option A: Auto-submit via EAS**

```bash
eas submit --platform android --latest

# Will use service account key from eas.json
```

**Option B: Manual upload**

1. Download AAB from EAS build
2. Go to Play Console → Your App → Production
3. Click "Create new release"
4. Upload AAB
5. Fill release notes:
```
Initial release of PickleBall Dating app
- Find pickleball partners by skill level
- Book courts online
- Chat with matches
```
6. Review release
7. Click "Start rollout to Production"

### 3.5. Complete Google Play Store Listing

1. Go to Play Console → Your App → Store presence → Main store listing

**App details:**
- App name: PickleBall Dating
- Short description (80 chars):
```
Tìm đối thủ pickleball, đặt sân, hẹn hò cùng cộng đồng pickleball Việt Nam
```
- Full description (4000 chars):
```
PickleBall Dating - Ứng dụng kết nối người chơi pickleball #1 tại Việt Nam

🎾 TÌM ĐỐI THỦ PHÙ HỢP
Swipe để tìm người chơi cùng skill level, lịch rảnh, và sở thích

💬 CHAT & KẾT NỐI
Nhắn tin trực tiếp với người đã match để lên lịch chơi

🏟️ ĐẶT SÂN TRỰC TUYẾN
Tìm và đặt sân pickleball gần bạn với giá tốt nhất

👨‍🏫 TÌM HLV
Kết nối với HLV pickleball chuyên nghiệp

⭐ ĐÁNH GIÁ & REVIEW
Đánh giá sân và người chơi sau mỗi trận đấu

Tải ngay để tham gia cộng đồng pickleball sôi động nhất Việt Nam!
```

**Graphics:**
- App icon: 512x512px
- Feature graphic: 1024x500px
- Phone screenshots: 2-8 images (1080x1920px)
- 7-inch tablet (optional)
- 10-inch tablet (optional)

**Contact details:**
- Email: support@pickleballdating.com
- Phone (optional)
- Website: https://yourwebsite.com

**Privacy Policy:**
- URL: https://yourwebsite.com/privacy

2. Click "Save"

---

## Step 4: OTA Updates (Over-The-Air)

After app is live, push updates WITHOUT going through stores:

### 4.1. Configure Updates

Already configured in `app.json`:
```json
"updates": {
  "url": "https://u.expo.dev/[project-id]"
}
```

### 4.2. Publish Update

```bash
# Create update channel
eas update:configure

# Publish update to production
eas update --branch production --message "Bug fixes and performance improvements"

# Users get update on next app restart (no store review needed)
```

**What can be updated via OTA:**
✅ JavaScript code changes
✅ Assets (images, fonts)
✅ Bug fixes
✅ New features (JS only)

**What requires new build:**
❌ Native code changes (new libraries with native modules)
❌ app.json changes (permissions, icon, splash)
❌ Expo SDK version upgrade

### 4.3. Rollback

```bash
# List updates
eas update:list --branch production

# Rollback to previous
eas update:republish --group [update-group-id]
```

---

## Step 5: Monitoring & Analytics

### 5.1. App Store Analytics

**iOS:**
- App Store Connect → Analytics
- Metrics: impressions, downloads, sessions, crashes

**Android:**
- Google Play Console → Statistics
- Metrics: installs, uninstalls, ratings, crashes

### 5.2. Crash Reporting (Sentry)

```bash
npm install @sentry/react-native

# Initialize
npx sentry-wizard -i reactNative -p ios android
```

`App.tsx`:
```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: __DEV__ ? 'development' : 'production',
});
```

### 5.3. User Analytics (Firebase)

```bash
npx expo install @react-native-firebase/app @react-native-firebase/analytics

# Configure google-services.json (Android) and GoogleService-Info.plist (iOS)
```

---

## Step 6: CI/CD Automation (Advanced)

### 6.1. GitHub Actions Workflow

`.github/workflows/eas-build.yml`:

```yaml
name: EAS Build & Submit

on:
  push:
    branches:
      - main
    tags:
      - 'v*'

jobs:
  build-ios:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: npm ci

      - name: Build iOS
        run: eas build --platform ios --profile production --non-interactive

      - name: Submit to App Store
        if: startsWith(github.ref, 'refs/tags/v')
        run: eas submit --platform ios --latest --non-interactive

  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: npm ci

      - name: Build Android
        run: eas build --platform android --profile production --non-interactive

      - name: Submit to Google Play
        if: startsWith(github.ref, 'refs/tags/v')
        run: eas submit --platform android --latest --non-interactive
```

**Setup secrets in GitHub:**
- `EXPO_TOKEN`: Get from `eas whoami` → Settings → Access Tokens

### 6.2. Automated Versioning

`scripts/bump-version.js`:
```javascript
const fs = require('fs');
const appJson = require('../app.json');

// Increment version
const [major, minor, patch] = appJson.expo.version.split('.').map(Number);
appJson.expo.version = `${major}.${minor}.${patch + 1}`;

// Increment build numbers
appJson.expo.ios.buildNumber = String(Number(appJson.expo.ios.buildNumber) + 1);
appJson.expo.android.versionCode += 1;

fs.writeFileSync('./app.json', JSON.stringify(appJson, null, 2));
console.log(`Version bumped to ${appJson.expo.version}`);
```

`package.json`:
```json
{
  "scripts": {
    "version:bump": "node scripts/bump-version.js"
  }
}
```

---

## Deployment Checklist

### Pre-Launch

- [ ] Test on physical iOS device
- [ ] Test on physical Android device
- [ ] All features working with production Supabase
- [ ] Remove console.logs and debug code
- [ ] Test with slow network (throttling)
- [ ] Test offline scenarios
- [ ] Privacy Policy page live
- [ ] Terms of Service page live
- [ ] Support email configured
- [ ] Error tracking (Sentry) configured
- [ ] Analytics (Firebase) configured
- [ ] App icon finalized (1024x1024px)
- [ ] Screenshots prepared (all sizes)
- [ ] App description written (Vietnamese + English)
- [ ] Version number updated

### App Store Submission

- [ ] Apple Developer account active ($99 paid)
- [ ] App created in App Store Connect
- [ ] Bundle ID matches
- [ ] Build uploaded
- [ ] All metadata filled
- [ ] Screenshots uploaded
- [ ] Privacy Policy URL added
- [ ] Contact info provided
- [ ] Age rating set (18+)
- [ ] Submitted for review

### Google Play Submission

- [ ] Google Play Console account active ($25 paid)
- [ ] App created in Play Console
- [ ] Package name matches
- [ ] AAB uploaded
- [ ] Store listing completed
- [ ] Graphics uploaded (icon, feature graphic, screenshots)
- [ ] Content rating questionnaire completed
- [ ] Data safety form completed
- [ ] Release notes written
- [ ] Production release started

### Post-Launch

- [ ] Monitor crash reports (Sentry)
- [ ] Monitor app analytics (Firebase)
- [ ] Check user reviews (respond within 24h)
- [ ] Monitor Supabase usage/quota
- [ ] Setup alerts for errors
- [ ] Plan first update/bug fixes

---

## Troubleshooting

### Common Build Errors

**Error: "Your project must include `expo` package"**
```bash
npm install expo@latest
```

**Error: "Bundle ID is already in use"**
- Change `bundleIdentifier` in app.json to unique value
- Or use reverse domain: `com.yourname.pickleballdating`

**Error: "Provisioning profile doesn't include signing certificate"**
```bash
# Delete credentials and regenerate
eas credentials
# Select iOS → Production → Delete credentials → Rebuild
```

**Error: "Google service account lacks permissions"**
- Go to Play Console → API access
- Grant "Admin" or "Release Manager" role to service account

### EAS Build Tips

**Check build status:**
```bash
eas build:list

# View logs
eas build:view [build-id]
```

**Cancel running build:**
```bash
eas build:cancel
```

**Local builds (faster for debugging):**
```bash
eas build --platform android --profile preview --local
```

### App Store Review Rejection Reasons

Common rejections:
1. **Missing demo account** - Provide test credentials
2. **Incomplete metadata** - Fill all required fields
3. **Privacy violations** - Update Privacy Policy
4. **Crashes on launch** - Test on physical device first
5. **Placeholder content** - Use real data, not "Lorem ipsum"

If rejected:
1. Read rejection reason carefully
2. Fix issues
3. Increment build number
4. Rebuild & resubmit

---

## Alternative Deployment Methods

### Method 2: React Native CLI (Without Expo)

If you ejected from Expo or built with React Native CLI:

**iOS:**
```bash
cd ios
pod install
cd ..

# Open Xcode
open ios/PickleBallDating.xcworkspace

# In Xcode:
# 1. Select Generic iOS Device
# 2. Product → Archive
# 3. Distribute App → App Store Connect
```

**Android:**
```bash
cd android
./gradlew bundleRelease

# AAB file at:
# android/app/build/outputs/bundle/release/app-release.aab
```

### Method 3: Fastlane Automation

```bash
# Install Fastlane
gem install fastlane

# Init Fastlane
cd ios && fastlane init
cd ../android && fastlane init
```

---

## Cost Breakdown

| Item | Cost | Frequency |
|------|------|-----------|
| Apple Developer Account | $99 | Annual |
| Google Play Console | $25 | One-time |
| Expo EAS Build | Free (10 builds/month) | Monthly |
| EAS Submit | Free | - |
| EAS Updates | Free | - |
| Domain (optional) | ~$10 | Annual |
| **Total Year 1** | **~$135** | - |
| **Total Year 2+** | **~$110** | Annual |

**Notes:**
- EAS free tier: 10 builds/month, unlimited updates
- Paid EAS plans if need more builds: $29-$129/month
- Supabase: Free tier sufficient for MVP, scales with usage

---

## Next Steps After Deployment

1. **Monitor First 24 Hours:**
   - Watch for crashes
   - Check error logs (Sentry)
   - Monitor server load (Supabase)

2. **Engage Early Users:**
   - Request reviews (after positive experience)
   - Respond to feedback quickly
   - Fix critical bugs via OTA updates

3. **Iterate Based on Data:**
   - Analyze user behavior (Firebase)
   - A/B test features
   - Plan roadmap based on usage

4. **Marketing:**
   - App Store Optimization (ASO)
   - Social media promotion
   - Pickleball community outreach
   - Partnerships with courts

---

## Resources

**Official Documentation:**
- Expo EAS: https://docs.expo.dev/eas/
- App Store Connect: https://developer.apple.com/app-store-connect/
- Google Play Console: https://play.google.com/console/about/

**Tools:**
- App Icon Generator: https://appicon.co
- Screenshot Generator: https://www.screely.com
- Privacy Policy Generator: https://www.privacypolicygenerator.info

**Support:**
- Expo Discord: https://chat.expo.dev
- Expo Forums: https://forums.expo.dev
- Stack Overflow: Tag [expo] or [react-native]

---

## About "Antigravity"

**Note:** Tôi không tìm thấy deployment platform tên "Antigravity" cho mobile apps.

Nếu "Antigravity" là:
- **Internal deployment system** của công ty bạn → Cần docs từ team DevOps
- **Typo** → Các platform phổ biến cho mobile:
  - **App Center** (Microsoft) - CI/CD cho mobile
  - **Bitrise** - Mobile CI/CD
  - **CircleCI** - General CI/CD
  - **Firebase App Distribution** - Beta testing

Nếu bạn có thông tin cụ thể về "Antigravity", vui lòng cung cấp để tôi update guide!

---

**Recommended approach:** Sử dụng **Expo EAS** như hướng dẫn trên - đây là solution chính thức và được optimize cho Expo apps.

Good luck với deployment! 🚀
