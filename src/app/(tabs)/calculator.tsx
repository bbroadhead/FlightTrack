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

interface ComponentCardProps {
  title: string;
  icon: React.ElementType;
  score: number;
  maxScore: number;
  color: string;
  children: React.ReactNode;
  delay: number;
}

function ComponentCard({ title, icon: Icon, score, maxScore, color, children, delay }: ComponentCardProps) {
  const progressWidth = useSharedValue(0);

  React.useEffect(() => {
    progressWidth.value = withSpring((score / maxScore) * 100, { damping: 15 });
  }, [score, maxScore]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify()}
      className="bg-white/5 rounded-2xl p-5 mb-4 border border-white/10"
    >
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: color + '20' }}>
            <Icon size={20} color={color} />
          </View>
          <Text className="text-white font-semibold text-lg">{title}</Text>
        </View>
        <View className="bg-white/10 px-3 py-1 rounded-full">
          <Text className="text-white font-bold">{score}/{maxScore}</Text>
        </View>
      </View>

      <View className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
        <Animated.View
          style={[animatedProgressStyle, { backgroundColor: color }]}
          className="h-full rounded-full"
        />
      </View>

      {children}
    </Animated.View>
  );
}

function formatMmSs(totalSeconds: number) {
  const s = Math.max(0, Math.round(totalSeconds));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function CalculatorScreen() {
  const [ageYears, setAgeYears] = useState(34);
  const [gender, setGender] = useState<Gender>('male');

  const [waistIn, setWaistIn] = useState(34);
  const [heightIn, setHeightIn] = useState(70);

  const [cardioTest, setCardioTest] = useState<CardioTest>('run_2mile');
  const [strengthTest, setStrengthTest] = useState<StrengthTest>('pushups');
  const [coreTest, setCoreTest] = useState<CoreTest>('situps');

  // Component values
  const [runSec, setRunSec] = useState(16 * 60 + 0);
  const [walkSec, setWalkSec] = useState(17 * 60 + 0);
  const [hamrShuttles, setHamrShuttles] = useState(60);

  const [pushupReps, setPushupReps] = useState(40);
  const [coreReps, setCoreReps] = useState(40);
  const [plankSec, setPlankSec] = useState(120);

  const cardioValue = cardioTest === 'run_2mile' ? runSec : cardioTest === 'walk_2k' ? walkSec : hamrShuttles;
  const coreValue = coreTest === 'plank' ? plankSec : coreReps;

  const scores = useMemo(() => {
    return scoreTotal({
      ageYears,
      gender,
      waistIn,
      heightIn,
      strengthTest,
      strengthReps: pushupReps,
      coreTest,
      coreValue,
      cardioTest,
      cardioValue,
    });
  }, [ageYears, gender, waistIn, heightIn, strengthTest, pushupReps, coreTest, coreValue, cardioTest, cardioValue]);

  const getScoreStatus = (total: number) => {
    if (total >= 90) return { label: 'Excellent', color: '#22C55E' };
    if (total >= 80) return { label: 'Satisfactory', color: '#4A90D9' };
    if (total >= 75) return { label: 'Pass', color: '#F59E0B' };
    return { label: 'Fail', color: '#EF4444' };
  };

  const status = getScoreStatus(scores.total);

  return (
      <View className="flex-1">
        <LinearGradient
          colors={['#0A1628', '#001F5C', '#0A1628']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        />

        <SafeAreaView edges={['top']} className="flex-1">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              entering={FadeInDown.delay(100).springify()}
              className="px-6 pt-4 pb-2"
            >
              <Text className="text-white text-2xl font-bold">PFRA Calculator</Text>
              <Text className="text-af-silver text-sm mt-1">USAF Physical Fitness Readiness Assessment (Effective 1 Mar 26)</Text>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(150).springify()}
              className="mx-6 mt-4 bg-white/10 rounded-2xl p-6 border border-white/20"
            >
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 rounded-full bg-af-blue/20 items-center justify-center mr-4">
                    <Target size={24} color="#4A90D9" />
                  </View>
                  <View>
                    <Text className="text-white text-2xl font-bold">{scores.total.toFixed(1)}</Text>
                    <Text className="text-af-silver text-sm">Total Score (max 100)</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="font-bold text-lg" style={{ color: status.color }}>{status.label}</Text>
                  <Text className="text-af-silver text-xs">Goal: 75+</Text>
                </View>
              </View>

              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-af-silver text-xs">WHtR</Text>
                  <Text className="text-white font-semibold">{scores.waist.toFixed(1)}/20</Text>
                </View>
                <View className="items-center">
                  <Text className="text-af-silver text-xs">Strength</Text>
                  <Text className="text-white font-semibold">{scores.strength.toFixed(1)}/15</Text>
                </View>
                <View className="items-center">
                  <Text className="text-af-silver text-xs">Core</Text>
                  <Text className="text-white font-semibold">{scores.core.toFixed(1)}/15</Text>
                </View>
                <View className="items-center">
                  <Text className="text-af-silver text-xs">Cardio</Text>
                  <Text className="text-white font-semibold">{scores.cardio.toFixed(1)}/50</Text>
                </View>
              </View>
            </Animated.View>

            {/* Basics */}
            <Animated.View
              entering={FadeInDown.delay(200).springify()}
              className="mx-6 mt-6 bg-white/5 rounded-2xl p-5 border border-white/10"
            >
              <Text className="text-white font-semibold text-lg mb-4">Profile</Text>

              <View className="mb-5">
                <Text className="text-af-silver text-sm mb-2">Age: {ageYears}</Text>
                <SmartSlider
                  value={ageYears}
                  onValueChange={(v) => setAgeYears(Math.round(v))}
                  minimumValue={17}
                  maximumValue={65}
                  step={1}
                />
              </View>

              <View className="mb-5">
                <Text className="text-af-silver text-sm mb-2">Gender</Text>
                <View className="flex-row bg-white/10 rounded-lg p-1">
                  <Pressable
                    onPress={() => { setGender('male'); Haptics.selectionAsync(); }}
                    className={cn("flex-1 py-3 rounded-lg", gender === 'male' && "bg-af-blue")}
                  >
                    <Text className={cn("text-center font-semibold", gender === 'male' ? "text-white" : "text-white/60")}>Male</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => { setGender('female'); Haptics.selectionAsync(); }}
                    className={cn("flex-1 py-3 rounded-lg", gender === 'female' && "bg-af-blue")}
                  >
                    <Text className={cn("text-center font-semibold", gender === 'female' ? "text-white" : "text-white/60")}>Female</Text>
                  </Pressable>
                </View>
              </View>

              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="text-af-silver text-sm mb-2">Height: {heightIn.toFixed(1)} in</Text>
                  <SmartSlider
                    value={heightIn}
                    onValueChange={(v) => setHeightIn(Number(v))}
                    minimumValue={55}
                    maximumValue={80}
                    step={0.5}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-af-silver text-sm mb-2">Waist: {waistIn.toFixed(1)} in</Text>
                  <SmartSlider
                    value={waistIn}
                    onValueChange={(v) => setWaistIn(Number(v))}
                    minimumValue={20}
                    maximumValue={60}
                    step={0.5}
                  />
                </View>
              </View>
              <Text className="text-white/60 text-xs mt-2">WHtR = waist ÷ height</Text>
            </Animated.View>

            {/* WHtR */}
            <View className="px-6 mt-6">
              <ComponentCard
                title="Body Composition (WHtR)"
                icon={Heart}
                score={scores.waist}
                maxScore={20}
                color="#F59E0B"
                delay={250}
              >
                <Text className="text-af-silver text-sm mb-2">Current WHtR: {(waistIn / heightIn).toFixed(2)}</Text>
                <Text className="text-white/70 text-xs">Score comes directly from the WHtR table.</Text>
              </ComponentCard>
            </View>

            {/* Strength */}
            <View className="px-6">
              <ComponentCard
                title="Muscular Strength"
                icon={Dumbbell}
                score={scores.strength}
                maxScore={15}
                color="#4A90D9"
                delay={300}
              >
                <View className="flex-row bg-white/10 rounded-lg p-1 mb-4">
                  <Pressable
                    onPress={() => { setStrengthTest('pushups'); Haptics.selectionAsync(); }}
                    className={cn("flex-1 py-2 rounded-lg", strengthTest === 'pushups' && "bg-af-blue")}
                  >
                    <Text className={cn("text-center text-sm font-semibold", strengthTest === 'pushups' ? "text-white" : "text-white/60")}>Push-ups</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => { setStrengthTest('hand_release_pushups'); Haptics.selectionAsync(); }}
                    className={cn("flex-1 py-2 rounded-lg", strengthTest === 'hand_release_pushups' && "bg-af-blue")}
                  >
                    <Text className={cn("text-center text-sm font-semibold", strengthTest === 'hand_release_pushups' ? "text-white" : "text-white/60")}>Hand-Release</Text>
                  </Pressable>
                </View>

                <Text className="text-af-silver text-sm mb-2">Reps: {pushupReps}</Text>
                <SmartSlider
                  value={pushupReps}
                  onValueChange={(v) => setPushupReps(Math.round(v))}
                  minimumValue={0}
                  maximumValue={80}
                  step={1}
                />
              </ComponentCard>
            </View>

            {/* Core */}
            <View className="px-6">
              <ComponentCard
                title="Core Endurance"
                icon={Activity}
                score={scores.core}
                maxScore={15}
                color="#22C55E"
                delay={350}
              >
                <View className="flex-row bg-white/10 rounded-lg p-1 mb-4">
                  <Pressable
                    onPress={() => { setCoreTest('situps'); Haptics.selectionAsync(); }}
                    className={cn("flex-1 py-2 rounded-lg", coreTest === 'situps' && "bg-af-blue")}
                  >
                    <Text className={cn("text-center text-sm font-semibold", coreTest === 'situps' ? "text-white" : "text-white/60")}>Sit-ups</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => { setCoreTest('cross_leg_reverse_crunch'); Haptics.selectionAsync(); }}
                    className={cn("flex-1 py-2 rounded-lg", coreTest === 'cross_leg_reverse_crunch' && "bg-af-blue")}
                  >
                    <Text className={cn("text-center text-sm font-semibold", coreTest === 'cross_leg_reverse_crunch' ? "text-white" : "text-white/60")}>Reverse Crunch</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => { setCoreTest('plank'); Haptics.selectionAsync(); }}
                    className={cn("flex-1 py-2 rounded-lg", coreTest === 'plank' && "bg-af-blue")}
                  >
                    <Text className={cn("text-center text-sm font-semibold", coreTest === 'plank' ? "text-white" : "text-white/60")}>Plank</Text>
                  </Pressable>
                </View>

                {coreTest === 'plank' ? (
                  <>
                    <Text className="text-af-silver text-sm mb-2">Time: {formatMmSs(plankSec)}</Text>
                    <SmartSlider
                      value={plankSec}
                      onValueChange={(v) => setPlankSec(Math.round(v))}
                      minimumValue={0}
                      maximumValue={5 * 60}
                      step={1}
                    />
                  </>
                ) : (
                  <>
                    <Text className="text-af-silver text-sm mb-2">Reps: {coreReps}</Text>
                    <SmartSlider
                      value={coreReps}
                      onValueChange={(v) => setCoreReps(Math.round(v))}
                      minimumValue={0}
                      maximumValue={80}
                      step={1}
                    />
                  </>
                )}
              </ComponentCard>
            </View>

            {/* Cardio */}
            <View className="px-6">
              <ComponentCard
                title="Cardiorespiratory Fitness"
                icon={Timer}
                score={scores.cardio}
                maxScore={50}
                color="#A855F7"
                delay={400}
              >
                <View className="flex-row bg-white/10 rounded-lg p-1 mb-4">
                  <Pressable
                    onPress={() => { setCardioTest('run_2mile'); Haptics.selectionAsync(); }}
                    className={cn("flex-1 py-2 rounded-lg", cardioTest === 'run_2mile' && "bg-af-blue")}
                  >
                    <Text className={cn("text-center text-sm font-semibold", cardioTest === 'run_2mile' ? "text-white" : "text-white/60")}>2-Mile Run</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => { setCardioTest('hamr_20m'); Haptics.selectionAsync(); }}
                    className={cn("flex-1 py-2 rounded-lg", cardioTest === 'hamr_20m' && "bg-af-blue")}
                  >
                    <Text className={cn("text-center text-sm font-semibold", cardioTest === 'hamr_20m' ? "text-white" : "text-white/60")}>20m HAMR</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => { setCardioTest('walk_2k'); Haptics.selectionAsync(); }}
                    className={cn("flex-1 py-2 rounded-lg", cardioTest === 'walk_2k' && "bg-af-blue")}
                  >
                    <Text className={cn("text-center text-sm font-semibold", cardioTest === 'walk_2k' ? "text-white" : "text-white/60")}>2.0 km Walk</Text>
                  </Pressable>
                </View>

                {cardioTest === 'hamr_20m' ? (
                  <>
                    <Text className="text-af-silver text-sm mb-2">Shuttles: {hamrShuttles}</Text>
                    <SmartSlider
                      value={hamrShuttles}
                      onValueChange={(v) => setHamrShuttles(Math.round(v))}
                      minimumValue={0}
                      maximumValue={120}
                      step={1}
                    />
                  </>
                ) : cardioTest === 'walk_2k' ? (
                  <>
                    <Text className="text-af-silver text-sm mb-2">Time: {formatMmSs(walkSec)}</Text>
                    <SmartSlider
                      value={walkSec}
                      onValueChange={(v) => setWalkSec(Math.round(v))}
                      minimumValue={12 * 60}
                      maximumValue={30 * 60}
                      step={1}
                    />
                    <Text className="text-white/60 text-xs mt-2">The chart provides a maximum time standard for the walk (no graded points).</Text>
                  </>
                ) : (
                  <>
                    <Text className="text-af-silver text-sm mb-2">Time: {formatMmSs(runSec)}</Text>
                    <SmartSlider
                      value={runSec}
                      onValueChange={(v) => setRunSec(Math.round(v))}
                      minimumValue={10 * 60}
                      maximumValue={35 * 60}
                      step={1}
                    />
                  </>
                )}
              </ComponentCard>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
  );
}
