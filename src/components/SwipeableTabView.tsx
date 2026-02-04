import React from 'react';
import { Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { useRouter, usePathname } from 'expo-router';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Tab order for navigation
const TAB_ORDER = [
  '/(tabs)',
  '/(tabs)/index',
  '/(tabs)/workouts',
  '/(tabs)/attendance',
  '/(tabs)/calculator',
  '/(tabs)/profile',
];

// Map path to index
const getTabIndex = (path: string): number => {
  // Handle root path
  if (path === '/' || path === '/(tabs)' || path === '/(tabs)/index') return 0;
  if (path.includes('workouts')) return 1;
  if (path.includes('attendance')) return 2;
  if (path.includes('calculator')) return 3;
  if (path.includes('profile')) return 4;
  return 0;
};

// Map index to route
const getTabRoute = (index: number): string => {
  switch (index) {
    case 0: return '/(tabs)';
    case 1: return '/(tabs)/workouts';
    case 2: return '/(tabs)/attendance';
    case 3: return '/(tabs)/calculator';
    case 4: return '/(tabs)/profile';
    default: return '/(tabs)';
  }
};

interface SwipeableTabViewProps {
  children: React.ReactNode;
}

export function SwipeableTabView({ children }: SwipeableTabViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);

  const currentIndex = getTabIndex(pathname);
  const maxIndex = 4; // 5 tabs (0-4)

  const navigateToTab = (direction: 'left' | 'right') => {
    const newIndex = direction === 'left'
      ? Math.min(currentIndex + 1, maxIndex)
      : Math.max(currentIndex - 1, 0);

    if (newIndex !== currentIndex) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.replace(getTabRoute(newIndex) as any);
    }
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20]) // Must move horizontally 20px before activating
    .failOffsetY([-10, 10]) // Fail if vertical movement exceeds 10px (for scrolling)
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      // Limit drag distance with resistance at edges
      const dragDistance = event.translationX;
      const resistance = 0.3;

      // At first tab, add resistance for right swipe (going left)
      if (currentIndex === 0 && dragDistance > 0) {
        translateX.value = dragDistance * resistance;
      }
      // At last tab, add resistance for left swipe (going right)
      else if (currentIndex === maxIndex && dragDistance < 0) {
        translateX.value = dragDistance * resistance;
      }
      // Normal drag
      else {
        translateX.value = Math.max(Math.min(dragDistance, SCREEN_WIDTH / 3), -SCREEN_WIDTH / 3);
      }
    })
    .onEnd((event) => {
      const threshold = SCREEN_WIDTH / 4;
      const velocity = event.velocityX;

      // Swipe left (go to next tab - right in tab bar)
      if ((event.translationX < -threshold || velocity < -500) && currentIndex < maxIndex) {
        runOnJS(navigateToTab)('left');
      }
      // Swipe right (go to previous tab - left in tab bar)
      else if ((event.translationX > threshold || velocity > 500) && currentIndex > 0) {
        runOnJS(navigateToTab)('right');
      }

      // Spring back
      translateX.value = withSpring(0, { damping: 20, stiffness: 300 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value * 0.3 }], // Subtle visual feedback
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
