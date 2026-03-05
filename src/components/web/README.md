# Web-Specific Components

This directory contains components optimized for web platform.

## Platform-Specific Files

React Native supports platform-specific file extensions:
- `.web.tsx` - Used only on web
- `.native.tsx` - Used on iOS/Android
- `.tsx` - Default, used on all platforms

## Components

### CourtMapView.web.tsx
Web-optimized map view using Google Maps JavaScript API.

## Usage

```tsx
// React Native automatically uses .web.tsx on web, .native.tsx on native
import { CourtMapView } from '../components/CourtMapView';

// Component will use:
// - CourtMapView.web.tsx on web
// - CourtMapView.native.tsx on iOS/Android
// - CourtMapView.tsx as fallback
```

## Creating Web-Specific Components

1. Create component with `.web.tsx` extension
2. Ensure same prop interface as native version
3. Use web-specific libraries/APIs when needed
4. Test on both mobile and desktop browsers
