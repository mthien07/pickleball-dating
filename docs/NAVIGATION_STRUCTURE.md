# Navigation Structure - PickleBall Dating App

**Version**: 1.0
**Last Updated**: 2026-01-02

## Overview

App sử dụng **React Navigation v6** với Stack và Bottom Tab navigators. Navigation architecture được thiết kế để tối ưu user experience với clear hierarchy và smooth transitions.

---

## Navigation Architecture

```
RootNavigator (Stack)
├── SplashScreen
├── AuthStack (Stack - No header)
│   ├── LoginRegister
│   ├── EmailSignup
│   ├── PhoneSignup
│   └── ProfileSetup (4 steps)
└── MainTabs (Bottom Tabs)
    ├── HomeTab → HomeSwipeScreen
    ├── MatchesTab → MatchesNavigator (Stack)
    │   ├── MatchesList
    │   └── ChatScreen
    ├── CourtsTab → CourtsNavigator (Stack)
    │   ├── CourtDiscovery
    │   ├── CourtDetail
    │   ├── CourtBooking
    │   ├── PaymentMethod
    │   └── BookingConfirmation
    └── ProfileTab → ProfileNavigator (Stack)
        ├── ProfileMe
        ├── EditProfile
        ├── Settings
        ├── BookingHistory
        ├── BookingDetail
        ├── CoachDirectory
        └── CoachDetail
```

---

## Screen List (22 Screens)

### Auth Flow (5 screens)
1. **01-splash-screen** - App startup
2. **02-login-register** - Login/register selection
3. **03-email-signup** - Email signup flow
4. **04-phone-signup** - Phone signup + OTP
5. **05-profile-setup** - 4-step profile creation

### Main Tabs (4 tabs)
6. **06-home-swipe** - Swipe cards (Home Tab)
7. **07-matches-list** - Matches list (Matches Tab)
8. **08-chat-screen** - 1-on-1 chat
9. **09-court-discovery** - Court search (Courts Tab)
10. **10-profile-me** - User profile (Profile Tab)

### Court Booking Flow (5 screens)
11. **11-court-detail** - Court details
12. **12-court-booking** - Select date/time slots
13. **13-payment-method** - Payment selection
14. **14-booking-confirmation** - Booking success

### Match & Chat (2 screens)
15. **15-match-detail** - Other user profile
16. **22-rating-screen** - Rate user after match

### Booking Management (2 screens)
17. **16-booking-history** - User's bookings list
18. **17-booking-detail** - Booking QR code

### Coach Features (2 screens)
19. **18-coach-directory** - Browse coaches
20. **19-coach-detail** - Coach profile

### Profile & Settings (2 screens)
21. **20-settings** - App settings
22. **21-edit-profile** - Edit user profile

---

## Deep Linking Structure

```
// Auth
myapp://login
myapp://signup/email
myapp://signup/phone

// Main
myapp://home
myapp://matches
myapp://courts
myapp://profile

// Court booking
myapp://courts/:courtId
myapp://courts/:courtId/booking
myapp://bookings/:bookingId

// Chat
myapp://matches/:matchId/chat

// Coaches
myapp://coaches
myapp://coaches/:coachId

// Profile
myapp://profile/edit
myapp://profile/settings
myapp://profile/bookings
```

---

## Tab Bar Configuration

```typescript
// Bottom Tab Navigator
const MainTabs = createBottomTabNavigator();

<MainTabs.Navigator
  screenOptions={{
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.textTertiary,
    tabBarStyle: {
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
      height: 56 + safeAreaInsets.bottom,
      paddingBottom: safeAreaInsets.bottom,
    },
    tabBarLabelStyle: {
      fontSize: 10,
      fontWeight: '600',
    },
    headerShown: false,
  }}
>
  <MainTabs.Screen
    name="HomeTab"
    component={HomeSwipeScreen}
    options={{
      tabBarLabel: 'Home',
      tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
    }}
  />
  {/* ... other tabs */}
</MainTabs.Navigator>
```

### Tab Icons
- **Home**: Heart icon (swipe/match)
- **Matches**: Chat bubble icon
- **Courts**: Location/Map pin icon
- **Profile**: User icon

---

## Navigation Flows

### 1. First-Time User Flow
```
Splash → Login/Register → Email/Phone Signup → Profile Setup (4 steps) → Home Swipe
```

### 2. Returning User Flow
```
Splash → Check Auth → Home Swipe (if logged in) OR Login (if not)
```

### 3. Court Booking Flow
```
Court Discovery → Court Detail → Court Booking → Payment Method → Booking Confirmation → Booking History
```

### 4. Match & Chat Flow
```
Home Swipe → (Swipe Right) → Match Modal → Send Message → Chat Screen
Matches List → Tap Match → Chat Screen
```

### 5. Coach Booking Flow (Future)
```
Coach Directory → Coach Detail → Chat with Coach
```

---

## Transition Animations

### Stack Transitions
- **iOS**: Slide from right (default)
- **Android**: Fade + slide from right
- **Duration**: 350ms
- **Easing**: ease-in-out

### Modal Transitions
- **Present**: Slide up from bottom
- **Dismiss**: Slide down
- **Duration**: 300ms
- **Backdrop**: Fade in/out (opacity 0 → 0.5)

### Tab Transitions
- **Switch**: Cross-fade (no slide)
- **Duration**: 200ms

---

## Navigation Guards

### Authentication Guard
```typescript
// Implemented via AuthContext
const { isAuthenticated, isLoading } = useAuth();

// RootNavigator checks auth state and renders appropriate stack
if (isLoading) return <SplashScreen />;
return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
```

### Profile Completion Guard
Handled post-login in screens. After user authenticates:
- `profileLoading` tracks profile fetch status
- `profileError` provides feedback if profile load fails
- Components can check profile completion status

**Key Implementation Detail**: Profile loading is non-blocking to allow immediate navigation to main app after auth success. Profile errors are surfaced via `profileError` state for UI feedback.

---

## Navigation Params

### Common Params
```typescript
type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  EmailSignup: undefined;
  PhoneSignup: undefined;
  ProfileSetup: { step?: number };

  MainTabs: undefined;
  HomeSwipe: undefined;
  MatchesList: undefined;
  ChatScreen: { conversationId: string; matchId: string };

  CourtDiscovery: { searchQuery?: string };
  CourtDetail: { courtId: string };
  CourtBooking: { courtId: string };
  PaymentMethod: { bookingData: BookingData };
  BookingConfirmation: { bookingId: string };

  MatchDetail: { userId: string };
  RatingScreen: { userId: string; matchId: string };

  BookingHistory: undefined;
  BookingDetail: { bookingId: string };

  CoachDirectory: undefined;
  CoachDetail: { coachId: string };

  ProfileMe: undefined;
  EditProfile: undefined;
  Settings: undefined;
};
```

---

## Accessibility

- **Screen Readers**: All screens announced with clear titles
- **Focus Management**: Auto-focus on main content when navigating
- **Keyboard Navigation**: Support for external keyboards (tab order)
- **Back Button**: Consistent back navigation (Android hardware button)

---

## Implementation Notes

### Dependencies
```json
{
  "@react-navigation/native": "^6.x.x",
  "@react-navigation/stack": "^6.x.x",
  "@react-navigation/bottom-tabs": "^6.x.x",
  "react-native-screens": "^3.x.x",
  "react-native-safe-area-context": "^4.x.x",
  "react-native-gesture-handler": "^2.x.x"
}
```

### Setup
```typescript
// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const RootStack = createStackNavigator();
const MainTabs = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Splash" component={SplashScreen} />
        {/* ... other screens */}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
```

---

**End of Navigation Structure**
