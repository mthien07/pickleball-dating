# Mobile Testing Guide - PickleBall Dating App

**Quick guide to test app on physical device or emulator**

---

## Option A: Physical Device (Recommended - Fastest)

### Step 1: Install Expo Go
- **iOS**: App Store → "Expo Go"
- **Android**: Play Store → "Expo Go"

**Note**: Phone must be on **same WiFi** as computer.

### Step 2: Start Expo Server

```bash
cd /Users/ht/Desktop/pickle-ball-starter
npx expo start
```

### Step 3: Scan QR Code

**iPhone:**
1. Open Expo Go app → "Scan QR Code"
2. Or use Camera app → tap notification

**Android:**
1. Open Expo Go app → "Scan QR Code"

App loads in ~10 seconds.

---

## Option B: iOS Simulator (macOS only)

```bash
# Requires Xcode installed
npx expo start --ios
```

---

## Option C: Android Emulator

1. Open Android Studio → Device Manager → Start emulator
2. Run: `npx expo start --android`

---

## Test Supabase Connection

Replace `App.tsx` content with this test code:

```typescript
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [courts, setCourts] = useState<any[]>([]);

  useEffect(() => {
    testSupabase();
  }, []);

  async function testSupabase() {
    try {
      const { data, error } = await supabase.from('courts').select('*');
      if (error) throw error;
      setCourts(data || []);
      setConnected(true);
    } catch (err: any) {
      console.error('Error:', err);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text>Connecting...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>PickleBall Dating</Text>
        {connected ? (
          <>
            <Text style={styles.success}>Connected! Found {courts.length} courts</Text>
            {courts.map((c, i) => (
              <Text key={i}>{c.name}</Text>
            ))}
          </>
        ) : (
          <Text style={styles.error}>Connection Failed</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  success: { color: '#4CAF50', fontSize: 18 },
  error: { color: '#F44336', fontSize: 18 },
});
```

**Expected Result**: "Connected! Found 4 courts"

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| QR code not scanning | Same WiFi? Restart: `npx expo start --clear` |
| Network request failed | Check internet, verify Supabase is running |
| Red screen error | Check terminal for details, run `npm install` |
| Blank screen | Wait 10-20 seconds, shake phone → Reload |
| Module not found | `rm -rf node_modules && npm install` |

---

## Hot Reload

1. Edit code in `App.tsx`
2. Save file
3. App auto-reloads on device

**Debug Menu**: Shake phone → Shows reload, inspector, performance options

---

## Resources

- [Expo Docs](https://docs.expo.dev)
- [Supabase Docs](https://supabase.com/docs)
- [docs/SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) - Full setup guide
