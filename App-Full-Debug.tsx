import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Supabase configuration - hardcoded for testing
const SUPABASE_URL = 'https://ytwcalyalpnmnqsmoilt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0d2NhbHlhbHBubW5xc21vaWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMDY2MzgsImV4cCI6MjA4Mjg4MjYzOH0.h4izbxyGU07sw6SeBCKI58K4rckjo66-Ow0Ml5u78T0';

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
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const testSupabaseConnection = async () => {
    try {
      setConnectionStatus('🔍 Bước 1: Kiểm tra Supabase URL...');
      setDebugInfo(`URL: ${SUPABASE_URL}\nKey: ${SUPABASE_ANON_KEY.substring(0, 20)}...`);

      await new Promise(resolve => setTimeout(resolve, 500));

      setConnectionStatus('🔍 Bước 2: Test kết nối database...');

      // Test basic connection first
      const { error: healthError } = await supabase
        .from('courts')
        .select('count', { count: 'exact', head: true });

      if (healthError) {
        console.error('Health check error:', healthError);
        throw new Error(`Database health check failed: ${healthError.message}\nCode: ${healthError.code}\nDetails: ${healthError.details}`);
      }

      setConnectionStatus('✅ Kết nối database OK! Đang lấy dữ liệu...');

      // Test 1: Fetch courts
      setConnectionStatus('📍 Đang lấy danh sách sân...');
      const { data: courtsData, error: courtsError } = await supabase
        .from('courts')
        .select('id, name, address, rating')
        .limit(10);

      if (courtsError) {
        console.error('Courts error:', courtsError);
        throw new Error(`Lỗi khi lấy sân:\n${courtsError.message}\nCode: ${courtsError.code}\nHint: ${courtsError.hint || 'N/A'}`);
      }

      setCourts(courtsData || []);
      setConnectionStatus(`✅ Đã lấy ${courtsData?.length || 0} sân!`);

      // Test 2: Fetch coaches
      setConnectionStatus('👨‍🏫 Đang lấy danh sách HLV...');
      const { data: coachesData, error: coachesError } = await supabase
        .from('coaches')
        .select('id, full_name, specialty, rating')
        .limit(10);

      if (coachesError) {
        console.error('Coaches error:', coachesError);
        throw new Error(`Lỗi khi lấy HLV:\n${coachesError.message}\nCode: ${coachesError.code}`);
      }

      setCoaches(coachesData || []);
      setConnectionStatus(`✅ Hoàn thành! ${courtsData?.length || 0} sân, ${coachesData?.length || 0} HLV`);
      setError(null);

    } catch (err) {
      console.error('Connection error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      setError(errorMessage);
      setConnectionStatus('❌ Kết nối thất bại');

      // Add debug info
      setDebugInfo(prev => prev + `\n\nLỖI:\n${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const retryConnection = () => {
    setLoading(true);
    setError(null);
    setCourts([]);
    setCoaches([]);
    setConnectionStatus('Đang thử lại...');
    testSupabaseConnection();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FF6B35" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🎾 PickleBall Dating</Text>
        <Text style={styles.subtitle}>Supabase Connection Test</Text>
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
            <Text style={styles.loadingText}>Đang kết nối Supabase...</Text>
            <Text style={styles.debugTextSmall}>{debugInfo}</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>❌ Lỗi kết nối</Text>
            <Text style={styles.errorText}>{error}</Text>

            <View style={styles.debugContainer}>
              <Text style={styles.debugTitle}>🔍 Debug Info:</Text>
              <Text style={styles.debugText}>{debugInfo}</Text>
            </View>

            <View style={styles.troubleshootContainer}>
              <Text style={styles.troubleshootTitle}>💡 Kiểm tra:</Text>
              <Text style={styles.troubleshootText}>
                1. Đã chạy migrations chưa?{'\n'}
                   → Vào Supabase Dashboard{'\n'}
                   → SQL Editor{'\n'}
                   → Chạy file supabase/ALL_MIGRATIONS.sql
                {'\n\n'}
                2. Table 'courts' có tồn tại không?{'\n'}
                   → Vào Table Editor{'\n'}
                   → Kiểm tra table 'courts' và 'coaches'
                {'\n\n'}
                3. RLS Policies{'\n'}
                   → Table có RLS enabled?{'\n'}
                   → Có policy cho anonymous access không?
              </Text>
            </View>

            <TouchableOpacity style={styles.retryButton} onPress={retryConnection}>
              <Text style={styles.retryButtonText}>🔄 Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Success Message */}
            <View style={styles.successContainer}>
              <Text style={styles.successTitle}>🎉 Kết nối thành công!</Text>
              <Text style={styles.successText}>
                App đã kết nối thành công với Supabase và lấy được dữ liệu!
              </Text>
            </View>

            {/* Courts Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                🏟️ Sân Pickleball ({courts.length})
              </Text>
              {courts.length === 0 ? (
                <Text style={styles.emptyText}>
                  Chưa có dữ liệu sân.{'\n'}
                  Chạy migration 004_seed_data.sql để thêm dữ liệu mẫu.
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
                  Chưa có dữ liệu HLV.{'\n'}
                  Chạy migration 004_seed_data.sql để thêm dữ liệu mẫu.
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
                ✅ Supabase hoạt động!{'\n'}
                ✅ Database có {courts.length} sân và {coaches.length} HLV!
                {'\n\n'}
                Giờ có thể:{'\n'}
                1. Bắt đầu implement screens{'\n'}
                2. Thêm authentication{'\n'}
                3. Build features chính
              </Text>
            </View>

            <TouchableOpacity style={styles.retryButton} onPress={retryConnection}>
              <Text style={styles.retryButtonText}>🔄 Refresh</Text>
            </TouchableOpacity>
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
    fontSize: 13,
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
  debugTextSmall: {
    marginTop: 12,
    fontSize: 11,
    color: '#A0AEC0',
    fontFamily: 'monospace',
  },
  errorContainer: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FC8181',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C53030',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 13,
    color: '#C53030',
    marginBottom: 16,
    lineHeight: 20,
    fontFamily: 'monospace',
  },
  debugContainer: {
    backgroundColor: '#2D3748',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#68D391',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 11,
    color: '#E2E8F0',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  troubleshootContainer: {
    backgroundColor: '#FFFAF0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  troubleshootTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#744210',
    marginBottom: 8,
  },
  troubleshootText: {
    fontSize: 12,
    color: '#744210',
    lineHeight: 18,
  },
  retryButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  successContainer: {
    backgroundColor: '#F0FFF4',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
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
    fontSize: 13,
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
    fontSize: 13,
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
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#90CDF4',
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C5282',
    marginBottom: 8,
  },
  nextStepsText: {
    fontSize: 13,
    color: '#2C5282',
    lineHeight: 22,
  },
});
