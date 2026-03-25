# Theme Screenshot Tests Setup Guide

## 📦 Install Dependencies

Chạy lệnh sau để cài đặt các dependencies cần thiết cho automated screenshot tests:

```bash
npm install --save-dev jest-image-snapshot react-native-view-shot
```

## ⚙️ Configuration

### 1. Update `jest.config.js`

Thêm setup file vào config:

```javascript
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
};
```

### 2. Create `jest.setup.js`

Tạo file `jest.setup.js` ở root directory:

```javascript
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

// Silence console warnings during tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
```

## 🧪 Run Tests

```bash
# Run all tests
npm test

# Run theme tests specifically
npm test -- theme-screenshots

# Update snapshots
npm test -- -u

# Run tests in watch mode
npm test -- --watch
```

## 📸 Snapshot Location

Snapshots sẽ được lưu trong:
```
__tests__/__image_snapshots__/
├── onboarding-screen-light-snap.png
├── onboarding-screen-dark-snap.png
├── login-screen-light-snap.png
├── login-screen-dark-snap.png
└── ...
```

## ✅ Success Criteria

Tests pass khi:
- Tất cả screens render successfully trong cả light và dark mode
- Snapshots match với baseline images
- Không có visual regressions khi theme thay đổi

## 🔄 CI/CD Integration

Để integrate vào GitHub Actions:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: image-snapshots
          path: __tests__/__image_snapshots__/
```
