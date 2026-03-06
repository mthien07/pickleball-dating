/**
 * DreamyTabBar - Glassmorphism pill tab bar with gradient active indicator
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { sharedStyles } from './dreamy-ui-styles';

interface DreamyTabBarProps {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

export const DreamyTabBar: React.FC<DreamyTabBarProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <View style={sharedStyles.tabBarContainer}>
      <BlurView intensity={60} tint="light" style={sharedStyles.tabBarBlur}>
        <View style={sharedStyles.tabBarInner}>
          {tabs.map((tab, index) => (
            <Pressable
              key={tab}
              onPress={() => onTabChange(index)}
              style={({ pressed }) => [sharedStyles.tabButton, pressed && { opacity: 0.7 }]}
              android_ripple={{ color: 'rgba(37, 99, 235, 0.1)' }}
            >
              {activeTab === index && (
                <Animated.View entering={FadeIn.duration(200)} style={sharedStyles.activeTabBg}>
                  <LinearGradient
                    colors={['rgba(252, 231, 243, 0.6)', 'rgba(243, 232, 255, 0.6)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                </Animated.View>
              )}
              <Text
                style={[
                  sharedStyles.tabText,
                  activeTab === index ? sharedStyles.tabTextActive : sharedStyles.tabTextInactive,
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>
      </BlurView>
    </View>
  );
};
