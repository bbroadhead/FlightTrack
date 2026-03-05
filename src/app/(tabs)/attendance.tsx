import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import SmartSlider from "../../components/SmartSlider";
import { Activity, Timer, Dumbbell, Heart, Target } from 'lucide-react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { cn } from '@/lib/cn';

import { scoreTotal, type Gender } from '@/lib/pfraScoring2026';

type CardioTest = 'run_2mile' | 'hamr_20m' | 'walk_2k';
type StrengthTest = 'pushups' | 'hand_release_pushups';
type CoreTest = 'situps' | 'cross_leg_reverse_crunch' | 'plank';

export default function CalculatorScreen() {
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState<number>(30);

  const [heightIn, setHeightIn] = useState<number>(70);
  const [waistIn, setWaistIn] = useState<number>(34);

  const [strengthTest, setStrengthTest] = useState<StrengthTest>('pushups');
  const [strengthReps, setStrengthReps] = useState<number>(40);

  const [coreTest, setCoreTest] = useState<CoreTest>('plank');
  const [coreValue, setCoreValue] = useState<number>(60);

  const [cardioTest, setCardioTest] = useState<CardioTest>('hamr_20m');
  const [runTimeSec, setRunTimeSec] = useState<number>(17 * 60);
  const [hamrShuttles, setHamrShuttles] = useState<number>(40);
  const [walkTimeSec, setWalkTimeSec] = useState<number>(18 * 60);

  const scoreCardScale = useSharedValue(0.95);

  const scoreCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreCardScale.value }],
  }));

  const scores = useMemo(() => {
    return scoreTotal({
      gender,
      age,
      heightIn,
      waistIn,
      strengthTest,
      strengthReps,
      coreTest,
      coreValue,
      cardioTest,
      runTimeSec,
      hamrShuttles,
      walkTimeSec,
    });
  }, [
    gender,
    age,
    heightIn,
    waistIn,
    strengthTest,
    strengthReps,
    coreTest,
    coreValue,
    cardioTest,
    runTimeSec,
    hamrShuttles,
    walkTimeSec,
  ]);

  const triggerScoreAnimation = () => {
    scoreCardScale.value = withSpring(1.02, { damping: 12 }, () => {
      scoreCardScale.value = withSpring(0.95, { damping: 12 });
    });
  };

  const toggleGender = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setGender(prev => (prev === 'male' ? 'female' : 'male'));
  };

  const getCategory = (total: number) => {
    if (total >= 90) return { label: 'Excellent', color: 'text-green-400' };
    if (total >= 75) return { label: 'Satisfactory', color: 'text-yellow-400' };
    return { label: 'Unsatisfactory', color: 'text-red-400' };
  };

  const category = getCategory(scores.total);

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#0A1628', '#001F5C', '#0A1628']}
        className="flex-1"
      >
        <SafeAreaView className="flex-1">
          <View className="px-6 py-4">
            <Text className="text-2xl font-bold text-white mb-2">PFRA Calculator</Text>
            <Text className="text-white/70">Estimate your score from official charts</Text>
          </View>

          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            <Animated.View
              style={[scoreCardAnimatedStyle]}
              entering={FadeInDown.springify()}
              className="bg-white/10 rounded-3xl p-6 mb-6 border border-white/20"
            >
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-white font-semibold text-lg">Total Score</Text>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    triggerScoreAnimation();
                  }}
                  className="bg-af-accent/20 p-2 rounded-xl"
                >
                  <Activity size={20} color="#4A90D9" />
                </Pressable>
              </View>

              <Text className="text-4xl font-bold text-white mb-2">{scores.total.toFixed(1)}</Text>
              <Text className={cn("text-lg font-semibold mb-4", category.color)}>{category.label}</Text>

              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-white/50 text-xs">WHtR</Text>
                  <Text className="text-white font-semibold">{scores.wht.toFixed(1)}</Text>
                </View>
                <View className="items-center">
                  <Text className="text-white/50 text-xs">Strength</Text>
                  <Text className="text-white font-semibold">{scores.strength.toFixed(1)}</Text>
                </View>
                <View className="items-center">
                  <Text className="text-white/50 text-xs">Core</Text>
                  <Text className="text-white font-semibold">{scores.core.toFixed(1)}</Text>
                </View>
                <View className="items-center">
                  <Text className="text-white/50 text-xs">Cardio</Text>
                  <Text className="text-white font-semibold">{scores.cardio.toFixed(1)}</Text>
                </View>
              </View>
            </Animated.View>

            {/* Profile inputs */}
            <View className="bg-white/10 rounded-3xl p-6 mb-6 border border-white/20">
              <Text className="text-white font-semibold text-lg mb-4">Profile</Text>

              <View className="flex-row gap-3 mb-4">
                <Pressable
                  onPress={toggleGender}
                  className={cn(
                    "flex-1 py-3 rounded-2xl border items-center",
                    gender === 'male' ? "bg-af-accent/20 border-af-accent" : "bg-white/5 border-white/20"
                  )}
                >
                  <Text className={cn("font-semibold", gender === 'male' ? "text-af-accent" : "text-white/70")}>
                    Male
                  </Text>
                </Pressable>

                <Pressable
                  onPress={toggleGender}
                  className={cn(
                    "flex-1 py-3 rounded-2xl border items-center",
                    gender === 'female' ? "bg-af-accent/20 border-af-accent" : "bg-white/5 border-white/20"
                  )}
                >
                  <Text className={cn("font-semibold", gender === 'female' ? "text-af-accent" : "text-white/70")}>
                    Female
                  </Text>
                </Pressable>
              </View>

              <Text className="text-white/70 text-sm mb-2">Age: {age}</Text>
              <SmartSlider
                value={age}
                onValueChange={setAge}
                minimumValue={17}
                maximumValue={60}
                step={1}
                leftIcon={<Target size={18} color="#A0A0A0" />}
              />

              <View className="mt-4">
                <Text className="text-white/70 text-sm mb-2">Height (in): {heightIn}</Text>
                <SmartSlider
                  value={heightIn}
                  onValueChange={setHeightIn}
                  minimumValue={56}
                  maximumValue={84}
                  step={1}
                  leftIcon={<Timer size={18} color="#A0A0A0" />}
                />
              </View>

              <View className="mt-4">
                <Text className="text-white/70 text-sm mb-2">Waist (in): {waistIn}</Text>
                <SmartSlider
                  value={waistIn}
                  onValueChange={setWaistIn}
                  minimumValue={20}
                  maximumValue={60}
                  step={0.5}
                  leftIcon={<Heart size={18} color="#A0A0A0" />}
                />
              </View>
            </View>

            {/* Strength */}
            <View className="bg-white/10 rounded-3xl p-6 mb-6 border border-white/20">
              <Text className="text-white font-semibold text-lg mb-4">Strength</Text>

              <View className="flex-row gap-2 mb-4">
                <Pressable
                  onPress={() => setStrengthTest('pushups')}
                  className={cn(
                    "flex-1 py-3 rounded-2xl border items-center",
                    strengthTest === 'pushups' ? "bg-af-accent/20 border-af-accent" : "bg-white/5 border-white/20"
                  )}
                >
                  <Text className={cn("font-semibold text-sm", strengthTest === 'pushups' ? "text-af-accent" : "text-white/70")}>
                    Push-ups
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setStrengthTest('hand_release_pushups')}
                  className={cn(
                    "flex-1 py-3 rounded-2xl border items-center",
                    strengthTest === 'hand_release_pushups' ? "bg-af-accent/20 border-af-accent" : "bg-white/5 border-white/20"
                  )}
                >
                  <Text className={cn("font-semibold text-sm", strengthTest === 'hand_release_pushups' ? "text-af-accent" : "text-white/70")}>
                    HR Push-ups
                  </Text>
                </Pressable>
              </View>

              <Text className="text-white/70 text-sm mb-2">Reps: {strengthReps}</Text>
              <SmartSlider
                value={strengthReps}
                onValueChange={setStrengthReps}
                minimumValue={0}
                maximumValue={100}
                step={1}
                leftIcon={<Dumbbell size={18} color="#A0A0A0" />}
              />
            </View>

            {/* Core */}
            <View className="bg-white/10 rounded-3xl p-6 mb-6 border border-white/20">
              <Text className="text-white font-semibold text-lg mb-4">Core</Text>

              <View className="flex-row flex-wrap gap-2 mb-4">
                <Pressable
                  onPress={() => setCoreTest('situps')}
                  className={cn(
                    "px-4 py-3 rounded-2xl border",
                    coreTest === 'situps' ? "bg-af-accent/20 border-af-accent" : "bg-white/5 border-white/20"
                  )}
                >
                  <Text className={cn("font-semibold text-sm", coreTest === 'situps' ? "text-af-accent" : "text-white/70")}>
                    Sit-ups
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setCoreTest('cross_leg_reverse_crunch')}
                  className={cn(
                    "px-4 py-3 rounded-2xl border",
                    coreTest === 'cross_leg_reverse_crunch' ? "bg-af-accent/20 border-af-accent" : "bg-white/5 border-white/20"
                  )}
                >
                  <Text className={cn("font-semibold text-sm", coreTest === 'cross_leg_reverse_crunch' ? "text-af-accent" : "text-white/70")}>
                    CLRC
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setCoreTest('plank')}
                  className={cn(
                    "px-4 py-3 rounded-2xl border",
                    coreTest === 'plank' ? "bg-af-accent/20 border-af-accent" : "bg-white/5 border-white/20"
                  )}
                >
                  <Text className={cn("font-semibold text-sm", coreTest === 'plank' ? "text-af-accent" : "text-white/70")}>
                    Plank
                  </Text>
                </Pressable>
              </View>

              <Text className="text-white/70 text-sm mb-2">
                {coreTest === 'plank' ? `Seconds: ${coreValue}` : `Reps: ${coreValue}`}
              </Text>

              <SmartSlider
                value={coreValue}
                onValueChange={setCoreValue}
                minimumValue={0}
                maximumValue={coreTest === 'plank' ? 300 : 100}
                step={1}
                leftIcon={<Activity size={18} color="#A0A0A0" />}
              />
            </View>

            {/* Cardio */}
            <View className="bg-white/10 rounded-3xl p-6 mb-6 border border-white/20">
              <Text className="text-white font-semibold text-lg mb-4">Cardio</Text>

              <View className="flex-row flex-wrap gap-2 mb-4">
                <Pressable
                  onPress={() => setCardioTest('run_2mile')}
                  className={cn(
                    "px-4 py-3 rounded-2xl border",
                    cardioTest === 'run_2mile' ? "bg-af-accent/20 border-af-accent" : "bg-white/5 border-white/20"
                  )}
                >
                  <Text className={cn("font-semibold text-sm", cardioTest === 'run_2mile' ? "text-af-accent" : "text-white/70")}>
                    2-mile run
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setCardioTest('hamr_20m')}
                  className={cn(
                    "px-4 py-3 rounded-2xl border",
                    cardioTest === 'hamr_20m' ? "bg-af-accent/20 border-af-accent" : "bg-white/5 border-white/20"
                  )}
                >
                  <Text className={cn("font-semibold text-sm", cardioTest === 'hamr_20m' ? "text-af-accent" : "text-white/70")}>
                    HAMR (20m)
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setCardioTest('walk_2k')}
                  className={cn(
                    "px-4 py-3 rounded-2xl border",
                    cardioTest === 'walk_2k' ? "bg-af-accent/20 border-af-accent" : "bg-white/5 border-white/20"
                  )}
                >
                  <Text className={cn("font-semibold text-sm", cardioTest === 'walk_2k' ? "text-af-accent" : "text-white/70")}>
                    2km walk
                  </Text>
                </Pressable>
              </View>

              {cardioTest === 'run_2mile' && (
                <>
                  <Text className="text-white/70 text-sm mb-2">
                    Time (sec): {runTimeSec}
                  </Text>
                  <SmartSlider
                    value={runTimeSec}
                    onValueChange={setRunTimeSec}
                    minimumValue={0}
                    maximumValue={30 * 60}
                    step={5}
                    leftIcon={<Timer size={18} color="#A0A0A0" />}
                  />
                </>
              )}

              {cardioTest === 'hamr_20m' && (
                <>
                  <Text className="text-white/70 text-sm mb-2">Shuttles: {hamrShuttles}</Text>
                  <SmartSlider
                    value={hamrShuttles}
                    onValueChange={setHamrShuttles}
                    minimumValue={0}
                    maximumValue={120}
                    step={1}
                    leftIcon={<Activity size={18} color="#A0A0A0" />}
                  />
                </>
              )}

              {cardioTest === 'walk_2k' && (
                <>
                  <Text className="text-white/70 text-sm mb-2">
                    Time (sec): {walkTimeSec}
                  </Text>
                  <SmartSlider
                    value={walkTimeSec}
                    onValueChange={setWalkTimeSec}
                    minimumValue={0}
                    maximumValue={30 * 60}
                    step={5}
                    leftIcon={<Timer size={18} color="#A0A0A0" />}
                  />
                </>
              )}
            </View>

            <View className="h-24" />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
