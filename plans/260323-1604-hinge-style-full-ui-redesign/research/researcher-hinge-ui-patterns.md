# Hinge Dating App UI/UX Design Patterns

## Design Language
- **Color**: Black + White (90% of space), muted natural palette (purples, greens, warm neutrals)
- **Typography**: Serif for prompts + onboarding; sans-serif for profiles/chat
- **Philosophy**: "Designed to be deleted" — sophisticated, minimal vs Tinder's bold energy

## Profile Architecture
- **Vertical Scroll Model** (NOT card stacking): Instagram-like experience scrolling through content
- **Editorial Layout**: Photos scattered with facts (job/age/location), then personal prompts
- **Content Liking**: Users like/comment on **specific photos or prompts**, not entire profile
- **Capacity**: 6 media + 3 prompts (vs Tinder's 10 photos + hidden prompts)

## Navigation & Components
- No swipe gestures (eliminates fatigue)
- Pill-style selection buttons for questionnaires
- Like/comment toggles appear inline with specific content
- Read receipts + typing indicators in messaging (minimal UI)

## Hinge vs Tinder Key Differences

| Feature | Hinge | Tinder |
|---------|-------|--------|
| Navigation | Vertical scroll | Card stack + swipe |
| Interaction | Like specific sections | Like entire profile |
| Prompts | Visible + editable | Hidden behind expand |
| Color Tone | Muted, natural | Bold, energetic |

## Animations
- Subtle fade-ins on scroll (no bouncy animations)
- Light pulse for likes (not celebratory)
- Lazy-load media during scroll
- Toast/badge notifications (no modals)

## React Native Implementation Patterns
1. Use FlatList + vertical ScrollView (replace swipe-stack)
2. Inline like/comment buttons per section
3. Serif typeface for prompts (Georgia), sans-serif for metadata (Inter)
4. 90% neutral + 10% accent color ratio
5. 48px+ tap targets, 16px+ content padding
6. Haptic feedback instead of animations

## Sources
- Tina Yan - Hinge UX Case Study
- Hinge Brand Resources (hinge.co)
- Hinge vs Tinder Design - ROAST
- Medium - Hinge Design Critique
- Design Week - Hinge Rebrand
