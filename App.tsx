import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Supabase configuration from .env
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://ytwcalyalpnmnqsmoilt.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0d2NhbHlhbHBubW5xc21vaWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMDY2MzgsImV4cCI6MjA4Mjg4MjYzOH0.h4izbxyGU07sw6SeBCKI58K4rckjo66-Ow0Ml5u78T0';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface Court {
  id: string;
  name: string;
  address: string;
  rating?: number;
}

interface Coach {
  id: string;
  full_name: string;
  specialty: string;
  rating?: number;
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [connectionStatus, setConnectionStatus] = useState('Đang kết nối...');

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const testSupabaseConnection = async () => {
    try {
      setConnectionStatus('Đang test kết nối Supabase...');

      // Test 1: Fetch courts
      const { data: courtsData, error: courtsError } = await supabase
        .from('courts')
        .select('id, name, address, rating')
        .limit(5);

      if (courtsError) {
        console.error('Courts error:', courtsError);
        throw new Error(`Lỗi khi lấy danh sách sân: ${courtsError.message}`);
      }

      // Test 2: Fetch coaches
      const { data: coachesData, error: coachesError } = await supabase
        .from('coaches')
        .select('id, full_name, specialty, rating')
        .limit(5);

      if (coachesError) {
        console.error('Coaches error:', coachesError);
        throw new Error(`Lỗi khi lấy danh sách HLV: ${coachesError.message}`);
      }

      // Success
      setCourts(courtsData || []);
      setCoaches(coachesData || []);
      setConnectionStatus('✅ Kết nối thành công!');
      setError(null);
    } catch (err) {
      console.error('Connection error:', err);
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      setConnectionStatus('❌ Kết nối thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FF6B35" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🎾 PickleBall Dating</Text>
        <Text style={styles.subtitle}>Test Supabase Connection</Text>
      </View>

      {/* Connection Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{connectionStatus}</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B35" />
            <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>❌ Lỗi</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.errorHint}>
              Kiểm tra lại:
              {'\n'}• Supabase URL và API Key trong .env
              {'\n'}• Đã chạy migrations trong Supabase Dashboard
              {'\n'}• Tables 'courts' và 'coaches' đã tồn tại
            </Text>
          </View>
        ) : (
          <>
            {/* Success Message */}
            <View style={styles.successContainer}>
              <Text style={styles.successTitle}>🎉 Thành công!</Text>
              <Text style={styles.successText}>
                App đã kết nối thành công với Supabase!
              </Text>
            </View>

            {/* Courts Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                🏟️ Sân Pickleball ({courts.length})
              </Text>
              {courts.length === 0 ? (
                <Text style={styles.emptyText}>
                  Chưa có dữ liệu sân. Chạy migration 004_seed_data.sql để thêm dữ liệu mẫu.
                </Text>
              ) : (
                courts.map((court) => (
                  <View key={court.id} style={styles.card}>
                    <Text style={styles.cardTitle}>{court.name}</Text>
                    <Text style={styles.cardSubtitle}>{court.address}</Text>
                    {court.rating && (
                      <Text style={styles.cardRating}>⭐ {court.rating.toFixed(1)}</Text>
                    )}
                  </View>
                ))
              )}
            </View>

            {/* Coaches Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                👨‍🏫 Huấn luyện viên ({coaches.length})
              </Text>
              {coaches.length === 0 ? (
                <Text style={styles.emptyText}>
                  Chưa có dữ liệu HLV. Chạy migration 004_seed_data.sql để thêm dữ liệu mẫu.
                </Text>
              ) : (
                coaches.map((coach) => (
                  <View key={coach.id} style={styles.card}>
                    <Text style={styles.cardTitle}>{coach.full_name}</Text>
                    <Text style={styles.cardSubtitle}>{coach.specialty}</Text>
                    {coach.rating && (
                      <Text style={styles.cardRating}>⭐ {coach.rating.toFixed(1)}</Text>
                    )}
                  </View>
                ))
              )}
            </View>

            {/* Next Steps */}
            <View style={styles.nextStepsContainer}>
              <Text style={styles.nextStepsTitle}>📋 Bước tiếp theo:</Text>
              <Text style={styles.nextStepsText}>
                ✅ Supabase đã hoạt động!
                {'\n'}✅ Database có dữ liệu!
                {'\n\n'}
                Giờ anh có thể:
                {'\n'}1. Bắt đầu implement các screens
                {'\n'}2. Thêm authentication flow
                {'\n'}3. Build các features chính
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FF6B35',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  statusContainer: {
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#718096',
  },
  errorContainer: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FC8181',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C53030',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#C53030',
    marginBottom: 12,
    lineHeight: 20,
  },
  errorHint: {
    fontSize: 13,
    color: '#744210',
    lineHeight: 20,
    backgroundColor: '#FFFAF0',
    padding: 12,
    borderRadius: 8,
  },
  successContainer: {
    backgroundColor: '#F0FFF4',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#9AE6B4',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#276749',
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    color: '#276749',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#718096',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 8,
  },
  cardRating: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF6B35',
  },
  nextStepsContainer: {
    backgroundColor: '#EBF8FF',
    borderRadius: 12,
    padding: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#90CDF4',
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C5282',
    marginBottom: 8,
  },
  nextStepsText: {
    fontSize: 14,
    color: '#2C5282',
    lineHeight: 22,
  },
});
