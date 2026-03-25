# Phase 5: Matches, Chat & Social

## Context Links
- Depends on: [Phase 1](phase-01-design-system-foundation.md), [Phase 2](phase-02-core-components-redesign.md)
- MatchesListScreen: `src/screens/matches/matches-list/MatchesListScreen.tsx`, `matches-list-items.tsx`
- ChatScreen: `src/screens/matches/chat/ChatScreen.tsx`
- MatchDetailScreen: `src/screens/matches/MatchDetailScreen/index.tsx`
- RatingScreen: `src/screens/matches/RatingScreen/index.tsx`, `StarRating.tsx`, `RatingCategory.tsx`
- MatchCelebration: `src/components/match-celebration/MatchCelebration.tsx`, `confetti-particle.tsx`
- MessageBubble: `src/components/message-bubble/MessageBubble.tsx`
- MessageInput: `src/components/message-input/MessageInput.tsx`

## Overview
- **Priority**: P2
- **Status**: pending
- **Effort**: 4h
- **Description**: Restyle matches list, chat, match detail, rating, and celebration screens to Hinge editorial aesthetic. Clean conversation list, refined messaging UI, elegant match animation.

## Key Insights
- MatchesListScreen shows list of matched users with avatar + last message preview
- ChatScreen has message bubbles + input bar + typing indicator
- MatchDetailScreen shows full profile of a matched user
- RatingScreen has star rating + category ratings (post-match feedback)
- MatchCelebration uses confetti particles + heart animation on new match
- Hinge messaging is minimal: clean bubbles, read receipts, no flashy decorations

## Requirements

### Functional
1. MatchesListScreen: Clean conversation list. Small avatar, name, last message, timestamp. No colored backgrounds.
2. ChatScreen: Refined message bubbles (softer radius, muted sent-color). Clean input bar. Subtle typing indicator.
3. MatchDetailScreen: Full editorial profile view (reuse EditorialProfileCard layout)
4. RatingScreen: Sophisticated star rating. Serif prompt for each category. Clean submit button.
5. MatchCelebration: Replace confetti with elegant animation. Serif "It's a match!" text. Subtle pulse, no fireworks.

### Non-Functional
- All message logic, real-time subscriptions, and data flow unchanged
- MatchCelebration should feel "understated celebratory" not "Las Vegas"

## Architecture

### MatchesListScreen Layout
```
┌─────────────────────────────────┐
│  "Matches" (Barlow-SemiBold)    │  <- Header
├─────────────────────────────────┤
│ [Avatar] Jane, 28               │  <- Clean list item
│          Last message preview... │     Muted text, timestamp right
├─────────────────────────────────┤
│ [Avatar] Mike, 32               │
│          Sounds great! When...   │
├─────────────────────────────────┤
│ ...                             │
└─────────────────────────────────┘
```

### Chat Message Bubble
```
BEFORE: Bold blue/rose bubbles with sport styling
AFTER:  Muted blue (sent) / light gray (received), softer radius
        Read receipt dots (subtle, small)
        Typing indicator: 3 animated dots, gentle pulse
```

### MatchCelebration
```
BEFORE: Confetti explosion + heart particles + bold text
AFTER:  Clean white/dark overlay
        PlayfairDisplay-Bold "It's a Match!"
        Two profile photos side by side
        Subtle scale-up animation (spring)
        "Send a message" CTA button
```

## Related Code Files

### Files to Modify
| File | Change |
|------|--------|
| `src/screens/matches/matches-list/MatchesListScreen.tsx` | Clean list layout, serif section title |
| `src/screens/matches/matches-list/matches-list-items.tsx` | Refined list item: avatar + name + preview |
| `src/screens/matches/chat/ChatScreen.tsx` | Clean chat layout, refined header |
| `src/components/message-bubble/MessageBubble.tsx` | Softer bubbles, muted colors, rounder |
| `src/components/message-bubble/TypingIndicator.tsx` | Gentle pulse animation |
| `src/components/message-input/MessageInput.tsx` | Clean input bar, subtle send button |
| `src/screens/matches/MatchDetailScreen/index.tsx` | Editorial profile layout (reuse Phase 2 components) |
| `src/screens/matches/RatingScreen/index.tsx` | Serif prompts, clean layout |
| `src/screens/matches/RatingScreen/StarRating.tsx` | Refined star styling, muted gold |
| `src/screens/matches/RatingScreen/RatingCategory.tsx` | Clean category cards |
| `src/components/match-celebration/MatchCelebration.tsx` | Elegant match animation |
| `src/components/match-celebration/confetti-particle.tsx` | Replace confetti with subtle particles or remove |

### Files to Create
None.

## Implementation Steps

1. **MatchesListScreen**: Update list header with Barlow-SemiBold "Matches" (not serif -- conversational context). Clean background. Remove any gradient or colored headers.

2. **matches-list-items**: Each item: Avatar (48px, neutral border) + name (Barlow-SemiBold, 15pt) + preview text (Barlow-Regular, 13pt, muted) + timestamp (right-aligned, caption size). Remove colored badges. Simple divider between items.

3. **ChatScreen**: Clean header with avatar + name + back button. Remove gradient header background. White/off-white chat background. Message list with proper spacing.

4. **MessageBubble**: Sent messages: muted primary color (light blue, not electric). Received: light warm gray. BorderRadius: 18px (larger, softer). Remove shadow from bubbles. Text: Barlow-Regular, 15pt.

5. **TypingIndicator**: Three small dots with gentle opacity pulse animation using `withRepeat(withTiming(...))`. Muted gray color.

6. **MessageInput**: Clean input field with neutral border. Send button: small, filled primary color circle with arrow icon. No gradient.

7. **MatchDetailScreen**: Reuse EditorialProfileCard layout from Phase 2 for showing matched user's full profile. Add "Send Message" CTA at bottom.

8. **RatingScreen**: Serif prompt for each rating category (e.g. "How was the game?"). Star rating with muted gold color. Clean category cards with neutral background. Submit button: muted primary.

9. **StarRating**: Stars use muted gold (not bright amber). Smooth fill animation on tap. Larger tap targets.

10. **MatchCelebration**: Replace confetti with clean overlay. White/dark bg with PlayfairDisplay "It's a Match!" at center. Two circular profile photos. Subtle spring scale animation (0.8 -> 1.0). CTA button below photos. Dismiss by tapping background.

## Todo List
- [ ] Restyle MatchesListScreen (clean list layout)
- [ ] Restyle matches-list-items (avatar + name + preview)
- [ ] Restyle ChatScreen (clean header, white background)
- [ ] Restyle MessageBubble (muted colors, softer radius)
- [ ] Update TypingIndicator (gentle pulse)
- [ ] Restyle MessageInput (clean field, subtle send button)
- [ ] Restyle MatchDetailScreen (editorial profile view)
- [ ] Restyle RatingScreen (serif prompts, clean layout)
- [ ] Restyle StarRating (muted gold, smooth animation)
- [ ] Restyle RatingCategory (clean cards)
- [ ] Restyle MatchCelebration (elegant overlay, no confetti)
- [ ] Update confetti-particle (subtle or remove)
- [ ] Compile check all modified files
- [ ] Visual review: matches list -> chat -> rating flow

## Success Criteria
- Matches list is clean conversation-style list
- Chat bubbles are muted, soft, readable
- Match celebration feels sophisticated (not flashy)
- Rating screen uses serif prompts
- All screens work in light + dark mode
- No message logic or real-time subscription changes

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| MatchCelebration simplification feels underwhelming | Low | Keep subtle scale animation; ensure it still feels celebratory |
| Chat bubble color change reduces readability | Medium | Test contrast ratios; ensure text is legible on muted backgrounds |

## Security Considerations
- No changes to message handling, encryption, or authentication

## Next Steps
- Independent of Phase 4, 6, 7
