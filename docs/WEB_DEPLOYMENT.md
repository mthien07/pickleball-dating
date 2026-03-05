# Web Deployment Guide

## Responsive Design

This app uses Tinder-style responsive design for web:

### Desktop (> 1024px)
- Centered content with max-width 500px
- Keyboard shortcuts for swipe actions:
  - `←` Left arrow: Pass
  - `→` Right arrow: Like
  - `↑` Up arrow or `Space`: Super Like
- Touch gestures disabled on desktop (click interactions preferred)

### Tablet (768px - 1024px)
- Max-width 600px
- Touch-enabled

### Mobile (< 768px)
- Full width
- Optimized for touch

## Development

### Run Web Development Server

```bash
npm run web
# or
npx expo start --web
```

### Build for Web Production

```bash
npx expo export:web
```

Output will be in `web-build/` directory.

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
npx expo export:web
cd web-build
vercel --prod
```


### Static Hosting

The `web-build/` folder is a static site. Deploy to:
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting
- Any static hosting service

## Environment Variables

Create `.env` file for production:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
```

## Responsive Utilities

### useResponsive Hook

```tsx
import { useResponsive } from '@/hooks/useResponsive';

const { isMobile, isTablet, isDesktop, maxContentWidth } = useResponsive();
```

### useWebUtils Hook

```tsx
import { useWebUtils } from '@/hooks/useWebUtils';

const { isWeb, shouldEnableKeyboard, showWebUI } = useWebUtils();
```

### Web Styles

```tsx
import { webStyles } from '@/theme/webStyles';

<View style={[styles.container, webStyles.centeredContainer]} />
```

## Testing

### Cross-Browser Testing

Test on:
- Chrome/Edge (Chromium)
- Firefox
- Safari (macOS/iOS)

### Responsive Testing

1. Chrome DevTools responsive mode
2. Test at breakpoints: 375px, 768px, 1024px, 1440px
3. Test keyboard shortcuts on desktop
4. Test touch gestures on mobile

## Performance

### Bundle Size Optimization

```bash
# Analyze bundle
npx expo export:web --dump-sourcemap
npx source-map-explorer web-build/static/js/*.js
```

### Lazy Loading

Platform-specific components (`.web.tsx`) are automatically code-split.

## Known Limitations

- Google Maps requires API key configuration
- Push notifications not supported on web (use Web Push API)
- Some React Native Animated features may perform differently
- Camera/file upload uses browser APIs (different from native)
