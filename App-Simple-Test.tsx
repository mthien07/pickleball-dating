import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const SUPABASE_URL = 'https://ytwcalyalpnmnqsmoilt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0d2NhbHlhbHBubW5xc21vaWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMDY2MzgsImV4cCI6MjA4Mjg4MjYzOH0.h4izbxyGU07sw6SeBCKI58K4rckjo66-Ow0Ml5u78T0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function App() {
  const [log, setLog] = useState<string[]>(['App started']);

  const addLog = (message: string) => {
    setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    try {
      setLog(['=== TEST BẮT ĐẦU ===']);

      addLog('✅ Supabase client created');
      addLog(`URL: ${SUPABASE_URL}`);
      addLog(`Key: ${SUPABASE_ANON_KEY.substring(0, 30)}...`);

      addLog('');
      addLog('--- TEST 1: Ping Supabase URL ---');

      try {
        const response = await fetch(SUPABASE_URL);
        addLog(`✅ Fetch OK: ${response.status} ${response.statusText}`);
      } catch (e) {
        addLog(`❌ Fetch FAILED: ${e}`);
      }

      addLog('');
      addLog('--- TEST 2: List ALL tables (no filter) ---');

      try {
        // Try to get any data from Supabase REST API directly
        const testUrl = `${SUPABASE_URL}/rest/v1/`;
        const testResponse = await fetch(testUrl, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          }
        });
        addLog(`✅ REST API response: ${testResponse.status}`);
        const text = await testResponse.text();
        addLog(`Response: ${text.substring(0, 100)}...`);
      } catch (e) {
        addLog(`❌ REST API FAILED: ${e}`);
      }

      addLog('');
      addLog('--- TEST 3: Query courts table ---');

      try {
        const { data, error, status, statusText } = await supabase
          .from('courts')
          .select('*')
          .limit(1);

        addLog(`Status: ${status} ${statusText || ''}`);

        if (error) {
          addLog(`❌ ERROR: ${error.message}`);
          addLog(`Code: ${error.code || 'N/A'}`);
          addLog(`Details: ${error.details || 'N/A'}`);
          addLog(`Hint: ${error.hint || 'N/A'}`);
        } else {
          addLog(`✅ SUCCESS! Got ${data?.length || 0} rows`);
          if (data && data.length > 0) {
            addLog(`Data: ${JSON.stringify(data[0]).substring(0, 100)}...`);
          }
        }
      } catch (e) {
        addLog(`❌ EXCEPTION: ${e}`);
      }

      addLog('');
      addLog('--- TEST 4: Query coaches table ---');

      try {
        const { data, error, status } = await supabase
          .from('coaches')
          .select('*')
          .limit(1);

        addLog(`Status: ${status}`);

        if (error) {
          addLog(`❌ ERROR: ${error.message}`);
        } else {
          addLog(`✅ SUCCESS! Got ${data?.length || 0} rows`);
        }
      } catch (e) {
        addLog(`❌ EXCEPTION: ${e}`);
      }

      addLog('');
      addLog('=== TEST HOÀN THÀNH ===');

    } catch (error) {
      addLog(`❌ FATAL ERROR: ${error}`);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔧 Supabase Debug Test</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={testConnection}>
        <Text style={styles.buttonText}>🚀 CHẠY TEST</Text>
      </TouchableOpacity>

      <ScrollView style={styles.logContainer}>
        {log.map((line, index) => (
          <Text key={index} style={styles.logText}>
            {line}
          </Text>
        ))}
      </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    backgroundColor: '#FF6B35',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  logContainer: {
    flex: 1,
    backgroundColor: '#000',
    padding: 15,
  },
  logText: {
    fontSize: 12,
    color: '#0f0',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
});
