/**
 * CourtMapView (Web)
 *
 * Web-optimized map view using Google Maps JavaScript API
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

interface Court {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface CourtMapViewProps {
  courts: Court[];
  selectedCourt?: Court;
  onCourtSelect?: (court: Court) => void;
  userLocation?: { latitude: number; longitude: number };
}

export const CourtMapView: React.FC<CourtMapViewProps> = ({
  courts,
  selectedCourt,
  onCourtSelect,
  userLocation,
}) => {
  // Web implementation placeholder
  // In a full implementation, you would use Google Maps JavaScript API
  // or a library like @react-google-maps/api

  if (Platform.OS !== 'web') {
    // This file should only be used on web
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        {/* Placeholder for Google Maps embed or React Google Maps component */}
        <iframe
          title="Court Map"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          src={`https://www.google.com/maps/embed/v1/search?key=YOUR_API_KEY&q=pickleball+courts`}
          allowFullScreen
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
