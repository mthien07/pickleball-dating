# FlatList Optimization Guide

Hướng dẫn tối ưu hiệu năng FlatList cho PickleBall Dating App.

---

## 1. Performance Props (Luôn luôn sử dụng)

### Basic Optimization Props

```tsx
<FlatList
  data={courts}
  renderItem={renderCourtCard}
  keyExtractor={(item) => item.id} // CRITICAL: Unique stable keys

  // Performance props
  removeClippedSubviews={true}      // Unmount off-screen views
  maxToRenderPerBatch={10}          // Render 10 items per batch
  windowSize={5}                    // Render 5 screens worth of items
  initialNumToRender={10}           // Render 10 items initially
  updateCellsBatchingPeriod={50}    // Batch updates every 50ms

  // Better scrolling
  decelerationRate="fast"
  showsVerticalScrollIndicator={false}
/>
```

---

## 2. Memoization (Tránh re-render không cần thiết)

### Memoize renderItem

```tsx
// ❌ BAD: Re-creates function on every render
<FlatList
  renderItem={({ item }) => <CourtCard court={item} onPress={() => nav(item.id)} />}
/>

// ✅ GOOD: Memoized component
const RenderCourtCard = React.memo<{ item: Court }>(({ item }) => {
  const navigation = useNavigation();
  const handlePress = useCallback(() => {
    navigation.navigate('CourtDetail', { courtId: item.id });
  }, [item.id]);

  return <CourtCard court={item} onPress={handlePress} />;
}, (prev, next) => prev.item.id === next.item.id);

<FlatList
  renderItem={({ item }) => <RenderCourtCard item={item} />}
/>
```

### Memoize Data

```tsx
// ✅ Use useMemo for derived data
const sortedCourts = useMemo(() => {
  return courts.sort((a, b) => a.distance_km - b.distance_km);
}, [courts]);

<FlatList data={sortedCourts} />
```

---

## 3. getItemLayout (Nếu item có fixed height)

```tsx
// If all items have same height (e.g., 120px)
const ITEM_HEIGHT = 120;
const SEPARATOR_HEIGHT = 16;

<FlatList
  data={courts}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: (ITEM_HEIGHT + SEPARATOR_HEIGHT) * index,
    index,
  })}
/>
```

---

## 4. Image Optimization

### Use expo-image with caching

```tsx
import { Image } from 'expo-image';

<Image
  source={{ uri: court.images[0] }}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk" // Cache aggressively
  placeholder={blurhash}    // Progressive loading
/>
```

### Resize images

```tsx
// Don't load full-res images in lists
const thumbnailUrl = `${court.image_url}?w=400&h=300&fit=crop`;

<Image source={{ uri: thumbnailUrl }} />
```

---

## 5. Avoid Inline Styles & Functions

```tsx
// ❌ BAD
<FlatList
  renderItem={({ item }) => (
    <View style={{ padding: 16 }}> // Creates new object
      <TouchableOpacity onPress={() => handlePress(item)}> // Creates new function
        <CourtCard court={item} />
      </TouchableOpacity>
    </View>
  )}
/>

// ✅ GOOD
const styles = StyleSheet.create({
  itemContainer: { padding: 16 },
});

const RenderItem = React.memo(({ item }) => {
  const handlePress = useCallback(() => {
    // Handle press
  }, [item.id]);

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={handlePress}>
        <CourtCard court={item} />
      </TouchableOpacity>
    </View>
  );
});
```

---

## 6. useFlatListOptimization Hook

```tsx
// src/hooks/useFlatListOptimization.ts
import { useMemo, useCallback } from 'react';

export const useFlatListOptimization = <T extends { id: string }>(
  data: T[],
  itemHeight?: number
) => {
  // Memoize key extractor
  const keyExtractor = useCallback((item: T) => item.id, []);

  // Memoize getItemLayout if height provided
  const getItemLayout = useMemo(() => {
    if (!itemHeight) return undefined;

    return (_data: T[] | null | undefined, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    });
  }, [itemHeight]);

  // Performance props
  const performanceProps = useMemo(() => ({
    removeClippedSubviews: true,
    maxToRenderPerBatch: 10,
    windowSize: 5,
    initialNumToRender: 10,
    updateCellsBatchingPeriod: 50,
  }), []);

  return {
    keyExtractor,
    getItemLayout,
    ...performanceProps,
  };
};

// Usage
const CourtList = () => {
  const optimizationProps = useFlatListOptimization(courts, 120);

  return (
    <FlatList
      data={courts}
      renderItem={renderItem}
      {...optimizationProps}
    />
  );
};
```

---

## 7. Virtualization Best Practices

### Keep item counts reasonable

```tsx
// Implement pagination
const ITEMS_PER_PAGE = 20;

const [page, setPage] = useState(1);
const displayedCourts = courts.slice(0, page * ITEMS_PER_PAGE);

<FlatList
  data={displayedCourts}
  onEndReached={() => setPage(p => p + 1)}
  onEndReachedThreshold={0.5}
/>
```

### Use blank space technique

```tsx
// Instead of scrollToIndex (which calculates all items)
<FlatList
  ListHeaderComponent={<View style={{ height: headerOffset }} />}
/>
```

---

## 8. Skeleton Loaders for Loading States

```tsx
import { SkeletonList } from '@/components/SkeletonLoaders';

<FlatList
  data={courts}
  renderItem={renderItem}
  ListEmptyComponent={
    isLoading ? <SkeletonList type="court" count={5} /> : <EmptyCourtList />
  }
/>
```

---

## 9. Debounce Search/Filter

```tsx
import { useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

const CourtsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);

  const filteredCourts = useMemo(() => {
    if (!debouncedQuery) return courts;
    return courts.filter(c => c.name.includes(debouncedQuery));
  }, [courts, debouncedQuery]);

  return (
    <FlatList data={filteredCourts} />
  );
};
```

---

## 10. Performance Monitoring

### React DevTools Profiler

```tsx
import { Profiler } from 'react';

<Profiler id="CourtList" onRender={(id, phase, actualDuration) => {
  if (__DEV__) {
    console.log(`${id} (${phase}) took ${actualDuration}ms`);
  }
}}>
  <FlatList data={courts} />
</Profiler>
```

### Monitor Frame Drops

```tsx
import { PerformanceMonitor } from '@/utils/performance';

// Check if FPS drops below 60
PerformanceMonitor.start('court-list-scroll');
```

---

## 11. Common Mistakes to Avoid

### ❌ Don't do this:

```tsx
// 1. Anonymous functions in renderItem
renderItem={({ item }) => <CourtCard onPress={() => nav(item)} />}

// 2. Inline object styles
style={{ marginBottom: 16 }}

// 3. Non-memoized data transformations
data={courts.filter(c => c.rating > 4).sort(...)}

// 4. Missing keyExtractor
// (Falls back to index, causes bugs)

// 5. Heavy computations in renderItem
renderItem={({ item }) => {
  const distance = calculateDistance(item.location); // Expensive!
  return <CourtCard distance={distance} />;
}}
```

### ✅ Do this instead:

```tsx
// 1. Memoized render function
const renderItem = useCallback(({ item }) => (
  <MemoizedCourtCard court={item} />
), []);

// 2. StyleSheet styles
const styles = StyleSheet.create({ container: { marginBottom: 16 } });

// 3. useMemo for transformations
const filteredCourts = useMemo(() =>
  courts.filter(c => c.rating > 4).sort(...),
  [courts]
);

// 4. Always provide keyExtractor
keyExtractor={(item) => item.id}

// 5. Pre-compute in data layer
const courtsWithDistance = useMemo(() =>
  courts.map(c => ({ ...c, distance: calculateDistance(c.location) })),
  [courts, userLocation]
);
```

---

## 12. Benchmarks

### Target Metrics

- **Initial Render**: < 200ms
- **Scroll FPS**: 60 FPS sustained
- **Memory Usage**: < 100MB for 1000 items

### Measuring Performance

```bash
# React Native Performance Monitor
# Shake device → Show Perf Monitor

# Expected results:
# - JS Frame Rate: 60 FPS
# - UI Frame Rate: 60 FPS
# - RAM: < 100MB
```

---

## 13. Checklist

Before deploying any FlatList:

- [ ] Unique `keyExtractor` provided
- [ ] `renderItem` is memoized
- [ ] Data is memoized (useMemo)
- [ ] Callbacks are memoized (useCallback)
- [ ] Performance props configured
- [ ] Images use expo-image with caching
- [ ] No inline styles or functions
- [ ] Skeleton loader for loading state
- [ ] Tested with 100+ items
- [ ] Profiled with React DevTools

---

## 14. Example: Optimized Court List

```tsx
// src/screens/CourtListScreen.tsx
import React, { useMemo, useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { CourtCard } from '@/components/Card';
import { SkeletonList } from '@/components/SkeletonLoaders';
import { EmptyCourtList } from '@/components/EmptyState';
import { useRefresh } from '@/hooks/useRefresh';
import { useFlatListOptimization } from '@/hooks/useFlatListOptimization';

const ITEM_HEIGHT = 120;

export const CourtListScreen = () => {
  const { data: courts, isLoading, refetch } = useCourts();
  const navigation = useNavigation();

  // Memoize sorted data
  const sortedCourts = useMemo(() => {
    return courts.sort((a, b) => a.distance_km - b.distance_km);
  }, [courts]);

  // Refresh control
  const { refreshControl } = useRefresh(refetch);

  // Optimization props
  const optimizationProps = useFlatListOptimization(sortedCourts, ITEM_HEIGHT);

  // Memoized render
  const renderItem = useCallback(({ item }) => {
    const handlePress = () => navigation.navigate('CourtDetail', { id: item.id });
    const handleBook = () => navigation.navigate('Booking', { courtId: item.id });

    return (
      <CourtCard
        court={item}
        onPress={handlePress}
        onBookPress={handleBook}
      />
    );
  }, [navigation]);

  // Empty component
  const ListEmptyComponent = useMemo(() => {
    if (isLoading) return <SkeletonList type="court" count={5} />;
    return <EmptyCourtList onRetry={refetch} />;
  }, [isLoading, refetch]);

  return (
    <FlatList
      data={sortedCourts}
      renderItem={renderItem}
      ListEmptyComponent={ListEmptyComponent}
      refreshControl={refreshControl}
      contentContainerStyle={styles.contentContainer}
      {...optimizationProps}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
  },
});
```

---

## Summary

**Luôn làm:**
1. ✅ Unique keyExtractor
2. ✅ Memoize renderItem, callbacks, data
3. ✅ Use performance props
4. ✅ Optimize images
5. ✅ Avoid inline functions/styles

**Kết quả:**
- 60 FPS scrolling
- Fast initial render
- Low memory usage
- Smooth user experience

Happy optimizing! 🚀
