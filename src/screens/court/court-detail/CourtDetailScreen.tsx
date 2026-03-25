import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, StatusBar } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';

import { Button } from '../../../components/Button';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { MOCK_COURTS, MOCK_REVIEWS } from '@data/mockData';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { createStyles } from './court-detail-styles';
import {
  ImageCarousel,
  HeaderInfo,
  LocationSection,
  AmenitiesSection,
  ReviewsSection,
} from './court-detail-sections';

type CourtDetailRouteParams = {
  CourtDetail: { courtId: string };
};

const CourtDetailScreenComponent = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<CourtDetailRouteParams, 'CourtDetail'>>();
  const { courtId } = route.params || {};
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  const { getEntering } = useReducedMotion();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const court = MOCK_COURTS.find((c) => c.id === courtId) || (__DEV__ ? MOCK_COURTS[0] : null);
  if (!court) {
    return null;
  }
  const reviews = MOCK_REVIEWS.filter((r) => r.court_id === court.id);

  const handleScrollEnd = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / styles.image.width);
    setCurrentImageIndex(index);
  };

  const handleBooking = () => {
    navigation.navigate('CourtBooking', { courtId: court.id });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ImageCarousel
        court={court}
        currentImageIndex={currentImageIndex}
        scrollRef={scrollRef}
        onScrollEnd={handleScrollEnd}
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <HeaderInfo court={court} starColor={colors.starColor} />
        <LocationSection address={court.address} />
        <AmenitiesSection amenities={court.amenities} />

        <Animated.View entering={getEntering(FadeInUp.delay(250))} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Mô tả</Text>
          </View>
          <Text style={styles.description}>{court.description}</Text>
        </Animated.View>

        <Animated.View entering={getEntering(FadeInUp.delay(300))} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Giờ hoạt động</Text>
          </View>
          <Text style={styles.hours}>
            {court.operating_hours?.monday
              ? `${court.operating_hours.monday.open} - ${court.operating_hours.monday.close}`
              : '06:00 - 22:00'}
          </Text>
        </Animated.View>

        {reviews.length > 0 && <ReviewsSection reviews={reviews} starColor={colors.starColor} />}

        <View style={{ height: 120 }} />
      </ScrollView>

      <Animated.View entering={getEntering(FadeIn.delay(400))} style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Giá từ</Text>
          <Text style={styles.price}>
            {(court.price_per_hour / 1000).toFixed(0)}k<Text style={styles.priceUnit}>/giờ</Text>
          </Text>
        </View>
        <Button
          title="Đặt sân"
          onPress={handleBooking}
          variant="primary"
          style={styles.bookButton}
        />
      </Animated.View>
    </View>
  );
};

export const CourtDetailScreen = React.memo(CourtDetailScreenComponent);
export default CourtDetailScreen;
