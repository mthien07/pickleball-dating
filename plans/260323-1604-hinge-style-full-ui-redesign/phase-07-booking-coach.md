# Phase 7: Booking & Coach

## Context Links
- Depends on: [Phase 1](phase-01-design-system-foundation.md), [Phase 2](phase-02-core-components-redesign.md)
- BookingScreen: `src/screens/court/booking/BookingScreen.tsx`
- BookingConfirmation: `src/screens/court/booking-confirmation/BookingConfirmationScreen.tsx`
- PaymentScreen: `src/screens/court/payment/PaymentScreen.tsx`, `payment-form-section.tsx`
- BookingHistoryScreen: `src/screens/booking/booking-history/BookingHistoryScreen.tsx`, `booking-history-components.tsx`
- BookingDetailScreen: `src/screens/booking/booking-detail/BookingDetailScreen.tsx`
- CoachDirectoryScreen: `src/screens/coach/coach-directory/CoachDirectoryScreen.tsx`, `coach-directory-components.tsx`
- CoachDetailScreen: `src/screens/coach/coach-detail/CoachDetailScreen.tsx`
- CalendarPicker: `src/components/calendar-picker/CalendarPicker.tsx`, `CalendarDay.tsx`
- TimeSlotPicker: `src/components/time-slot-picker/TimeSlotPicker.tsx`, `TimeSlotItem.tsx`

## Overview
- **Priority**: P2
- **Status**: pending
- **Effort**: 3h
- **Description**: Restyle booking flow, payment, history, and coach screens to editorial aesthetic. Clean calendar/time pickers, refined payment form, elegant coach cards.

## Key Insights
- BookingScreen has CalendarPicker + TimeSlotPicker + court info
- PaymentScreen has card form + order summary
- BookingHistory shows list of past/upcoming bookings
- CoachDirectory shows grid/list of coaches with filters
- CoachDetail shows full coach profile with booking CTA
- CalendarPicker and TimeSlotPicker are custom components (not third-party)

## Requirements

### Functional
1. BookingScreen: Clean calendar + time slots, editorial court summary
2. BookingConfirmation: Elegant confirmation with check icon + booking details
3. PaymentScreen: Refined card form, clean order summary
4. BookingHistory: Clean list with status badges
5. BookingDetail: Editorial booking details
6. CoachDirectory: Editorial coach cards, clean filters
7. CoachDetail: Full-bleed coach photo, editorial bio, booking CTA
8. CalendarPicker: Softer colors, rounder day cells
9. TimeSlotPicker: Pill-style time slots, muted selection color

### Non-Functional
- All booking/payment logic unchanged
- Coach data flow unchanged

## Architecture

### CalendarPicker Restyle
```
BEFORE: Bold blue selected day, sport-style grid
AFTER:  Muted primary selected day (softer fill)
        Rounder day cells (full circle, not square)
        Subtle border on today
        Barlow font for month name
```

### TimeSlotPicker Restyle
```
BEFORE: Sport-style bold slot buttons
AFTER:  Pill-shaped slots (borderRadius.full)
        Muted primary fill on selected
        Clean border on available
        Disabled: light gray, no interaction
```

## Related Code Files

### Files to Modify
| File | Change |
|------|--------|
| `src/screens/court/booking/BookingScreen.tsx` | Clean layout, serif court name, refined pickers |
| `src/screens/court/booking-confirmation/BookingConfirmationScreen.tsx` | Elegant confirmation, check icon |
| `src/screens/court/payment/PaymentScreen.tsx` | Clean payment layout |
| `src/screens/court/payment/payment-form-section.tsx` | Refined card form inputs |
| `src/screens/booking/booking-history/BookingHistoryScreen.tsx` | Clean history list |
| `src/screens/booking/booking-history/booking-history-components.tsx` | Refined list items, status badges |
| `src/screens/booking/booking-detail/BookingDetailScreen.tsx` | Editorial booking details |
| `src/screens/coach/coach-directory/CoachDirectoryScreen.tsx` | Editorial coach cards |
| `src/screens/coach/coach-directory/coach-directory-components.tsx` | Refined coach card, filter chips |
| `src/screens/coach/coach-detail/CoachDetailScreen.tsx` | Full-bleed hero, editorial layout |
| `src/components/calendar-picker/CalendarPicker.tsx` | Softer colors, rounder cells |
| `src/components/calendar-picker/CalendarDay.tsx` | Circle day cells, muted selection |
| `src/components/time-slot-picker/TimeSlotPicker.tsx` | Container styling |
| `src/components/time-slot-picker/TimeSlotItem.tsx` | Pill-style slots |

### Files to Create
None.

## Implementation Steps

1. **CalendarPicker**: Change selected day background to muted primary with opacity (30%). Day cells: circle shape (width=height, borderRadius.full). Month header: Barlow-SemiBold. Day names: Barlow-Regular, caption size, muted.

2. **CalendarDay**: Selected state: filled circle, white text. Today: subtle border ring. Other days: clean text on transparent bg. Disabled: muted text, no background.

3. **TimeSlotPicker**: Container with section header "Select a time" (Barlow-SemiBold).

4. **TimeSlotItem**: Pill shape (borderRadius.full, horizontal padding). Selected: filled muted primary, white text. Available: outline with border, primary text. Disabled: no border, muted text.

5. **BookingScreen**: Serif court name at top. CalendarPicker section. TimeSlotPicker section. Booking summary card at bottom with price + "Book Now" CTA.

6. **BookingConfirmationScreen**: Centered layout. Large check icon (muted primary, not green). PlayfairDisplay "Booking Confirmed". Details card with date, time, court, amount. "View Booking" CTA.

7. **PaymentScreen**: Clean order summary at top. Payment form: card number, expiry, CVV with refined Input components. "Pay [amount]" primary CTA at bottom.

8. **payment-form-section**: Clean card inputs with icons. Secure payment badge (lock icon + text).

9. **BookingHistoryScreen**: Section tabs: "Upcoming" / "Past" (clean tab selector). List items with date, court name, time, status badge.

10. **booking-history-components**: Status badges: pill-style. Confirmed=muted green, Pending=muted amber, Cancelled=muted red. Clean list items.

11. **BookingDetailScreen**: Court photo at top. Booking details in clean card layout. Cancel button (muted red text, not alarming).

12. **CoachDirectoryScreen**: Grid of coach cards with photo, name, specialty, rating. Clean search/filter bar. Filter chips: pill-style.

13. **coach-directory-components**: Coach card: photo (square, rounded corners) + name (Barlow-SemiBold) + specialty + rating stars. Clean layout.

14. **CoachDetailScreen**: Full-bleed hero photo. Serif coach name. Bio in Barlow-Regular. Specialties as pill badges. Rating section. "Book Session" CTA.

## Todo List
- [ ] Restyle CalendarPicker (circle days, muted selection)
- [ ] Restyle CalendarDay (circle shape, refined states)
- [ ] Restyle TimeSlotPicker (container styling)
- [ ] Restyle TimeSlotItem (pill shape, muted colors)
- [ ] Restyle BookingScreen (serif court name, clean pickers)
- [ ] Restyle BookingConfirmationScreen (elegant confirmation)
- [ ] Restyle PaymentScreen (clean payment layout)
- [ ] Restyle payment-form-section (refined card inputs)
- [ ] Restyle BookingHistoryScreen (tab sections, clean list)
- [ ] Restyle booking-history-components (status badges)
- [ ] Restyle BookingDetailScreen (editorial details)
- [ ] Restyle CoachDirectoryScreen (editorial cards)
- [ ] Restyle coach-directory-components (refined coach cards)
- [ ] Restyle CoachDetailScreen (full-bleed hero)
- [ ] Compile check all modified files
- [ ] Visual review: booking flow + coach flow

## Success Criteria
- Calendar and time pickers have refined, Hinge-like styling
- Booking flow feels clean and professional
- Coach screens have editorial card layouts
- Status badges use muted colors
- All screens work in light + dark mode
- No booking/payment logic changes

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| CalendarDay circle layout breaks on narrow screens | Low | Use fixed size (40px) with centered text |
| TimeSlot pill overflow on many slots | Low | Wrap in horizontal ScrollView or FlexWrap |

## Security Considerations
- No changes to payment processing or sensitive data handling

## Next Steps
- Independent of Phase 3-6
