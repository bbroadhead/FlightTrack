import React from 'react';
import { View } from 'react-native';
import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TabSwipeProvider, useTabSwipe } from '@/contexts/TabSwipeContext';

const { Navigator } = createMaterialTopTabNavigator();
const Tabs = withLayoutContext(Navigator);

function TabNavigator() {
  const { swipeEnabled } = useTabSwipe();

  return (
    <Tabs
      tabBarPosition="bottom"
      screenOptions={{
        headerShown: false,

        // Smooth swipe + animated transitions (web + native)
        swipeEnabled,
        animationEnabled: true,
        lazy: true,

        tabBarActiveTintColor: '#4A90D9',
        tabBarInactiveTintColor: '#A0A0A0',
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'rgba(10, 22, 40, 0.95)',
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          borderTopWidth: 1,
          height: 85,
          paddingTop: 10,
          paddingBottom: 25,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          textTransform: 'none',
        },
        tabBarIndicatorStyle: {
          // Hide the usual “top tabs” indicator line
          height: 0,
        },
        tabBarBackground: () => <View className="absolute inset-0 bg-af-navy/95" />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? 'bg-af-accent/20 p-2 rounded-xl' : 'p-2'}>
              <Ionicons name="trophy-outline" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? 'bg-af-accent/20 p-2 rounded-xl' : 'p-2'}>
              <Ionicons name="barbell-outline" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Attendance',
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? 'bg-af-accent/20 p-2 rounded-xl' : 'p-2'}>
              <Ionicons name="clipboard-outline" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          title: 'Calculator',
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? 'bg-af-accent/20 p-2 rounded-xl' : 'p-2'}>
              <Ionicons name="calculator-outline" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? 'bg-af-accent/20 p-2 rounded-xl' : 'p-2'}>
              <Ionicons name="settings-outline" size={22} color={color} />
            </View>
          ),
        }}
      />

      {/* Hidden route used elsewhere in the app */}
      <Tabs.Screen name="two" options={{ href: null }} />
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <TabSwipeProvider>
      <TabNavigator />
    </TabSwipeProvider>
  );
}
