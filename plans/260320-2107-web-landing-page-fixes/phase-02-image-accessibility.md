# Phase 2: Image Accessibility

## Priority: Medium
## Status: TODO

## Problem
All images on the site have zero alt text — screen readers see nothing.

## Related Code Files
- `src/screens/auth/onboarding/onboarding-animated-components.tsx` — FloatingCard images
- `src/components/SwipeCard.tsx` — profile card images
- `src/components/Avatar.tsx` — avatar component
- All screens using `expo-image` Image component

## Implementation Steps

### 1. Add accessibilityLabel to FloatingCard images
- Onboarding cards: "Profile photo of [name]" or "Sample profile photo"

### 2. Add alt text to SwipeCard profile images
- Pattern: "{display_name}'s profile photo"

### 3. Add alt text to Avatar component
- Accept `alt` or `accessibilityLabel` prop
- Default: "User avatar"

### 4. Audit all Image usages across screens
- Search for `<Image` and `expo-image` usage
- Ensure each has `accessibilityLabel` or `alt`

## Todo List
- [ ] Fix FloatingCard images in onboarding
- [ ] Fix SwipeCard profile images
- [ ] Fix Avatar component
- [ ] Audit remaining Image usages

## Success Criteria
- No images without alt text
- Screen reader announces meaningful descriptions
