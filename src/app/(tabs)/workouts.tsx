import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, X, Calendar, Clock, MapPin, Dumbbell, Users } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { cn } from '@/lib/cn';
import { useData } from '@/contexts/DataContext';

type WorkoutType = 'PT' | 'Strength' | 'Cardio' | 'Sports' | 'Other';

export default function WorkoutsScreen() {
  const { workouts, addWorkout, deleteWorkout } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newType, setNewType] = useState<WorkoutType>('PT');
  const [isMultiStep, setIsMultiStep] = useState(false);
  const [steps, setSteps] = useState<string[]>(['']);

  const workoutTypes: { type: WorkoutType; icon: any; color: string }[] = [
    { type: 'PT', icon: Users, color: '#4A90D9' },
    { type: 'Strength', icon: Dumbbell, color: '#FF6B35' },
    { type: 'Cardio', icon: Clock, color: '#32D74B' },
    { type: 'Sports', icon: Users, color: '#AF52DE' },
    { type: 'Other', icon: MapPin, color: '#FFCC00' },
  ];

  const sortedWorkouts = useMemo(() => {
    return [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [workouts]);

  const resetForm = () => {
    setNewName('');
    setNewDate('');
    setNewTime('');
    setNewLocation('');
    setNewType('PT');
    setIsMultiStep(false);
    setSteps(['']);
  };

  const handleAddWorkout = () => {
    if (!newName.trim() || !newDate.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    addWorkout({
      name: newName.trim(),
      date: newDate.trim(),
      time: newTime.trim(),
      location: newLocation.trim(),
      type: newType,
      isMultiStep,
      steps: isMultiStep ? steps.filter(s => s.trim()) : [],
      attendees: [],
    });

    setShowAddModal(false);
    resetForm();
  };

  const addStep = () => {
    setSteps(prev => [...prev, '']);
  };

  const updateStep = (index: number, value: string) => {
    setSteps(prev => prev.map((s, i) => (i === index ? value : s)));
  };

  const removeStep = (index: number) => {
    setSteps(prev => prev.filter((_, i) => i !== index));
  };

  const canSubmit = newName.trim().length > 0 && (!isMultiStep || steps.some(s => s.trim()));

  return (
    <View className="flex-1">
      <LinearGradient colors={['#0A1628', '#001F5C', '#0A1628']} className="flex-1">
        <SafeAreaView className="flex-1">
          <View className="px-6 py-4 flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-white mb-2">Workouts</Text>
              <Text className="text-white/70">Schedule and manage PT sessions</Text>
            </View>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowAddModal(true);
              }}
              className="bg-af-accent/20 p-3 rounded-2xl border border-af-accent/30"
            >
              <Plus size={24} color="#4A90D9" />
            </Pressable>
          </View>

          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            {sortedWorkouts.length === 0 ? (
              <View className="flex-1 items-center justify-center py-20">
                <Dumbbell size={48} color="#A0A0A0" />
                <Text className="text-white/70 text-lg mt-4 text-center">No workouts scheduled yet</Text>
                <Text className="text-white/50 text-sm mt-2 text-center">
                  Tap the + button to add your first workout
                </Text>
              </View>
            ) : (
              <View className="mb-6">
                {sortedWorkouts.map((workout, index) => {
                  const typeInfo = workoutTypes.find(t => t.type === workout.type) || workoutTypes[0];
                  const IconComponent = typeInfo.icon;

                  return (
                    <Animated.View
                      key={workout.id}
                      entering={FadeInDown.delay(index * 100).springify()}
                      className="bg-white/10 rounded-2xl p-4 mb-4 border border-white/20"
                    >
                      <View className="flex-row items-start justify-between mb-3">
                        <View className="flex-row items-center flex-1">
                          <View
                            className="p-2 rounded-xl mr-3"
                            style={{ backgroundColor: `${typeInfo.color}20` }}
                          >
                            <IconComponent size={20} color={typeInfo.color} />
                          </View>
                          <View className="flex-1">
                            <Text className="text-white font-semibold text-lg">{workout.name}</Text>
                            <Text className="text-white/50 text-sm">{workout.type}</Text>
                          </View>
                        </View>

                        <Pressable
                          onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            deleteWorkout(workout.id);
                          }}
                          className="p-2"
                        >
                          <X size={20} color="#FF3B30" />
                        </Pressable>
                      </View>

                      <View className="flex-row items-center mb-2">
                        <Calendar size={16} color="#A0A0A0" />
                        <Text className="text-white/70 ml-2">{workout.date}</Text>
                      </View>

                      {workout.time ? (
                        <View className="flex-row items-center mb-2">
                          <Clock size={16} color="#A0A0A0" />
                          <Text className="text-white/70 ml-2">{workout.time}</Text>
                        </View>
                      ) : null}

                      {workout.location ? (
                        <View className="flex-row items-center mb-3">
                          <MapPin size={16} color="#A0A0A0" />
                          <Text className="text-white/70 ml-2">{workout.location}</Text>
                        </View>
                      ) : null}

                      <View className="flex-row items-center justify-between pt-3 border-t border-white/10">
                        <Text className="text-white/50 text-sm">
                          {workout.attendees.length} attending
                        </Text>
                        <Pressable className="bg-af-accent/20 px-3 py-1 rounded-full">
                          <Text className="text-af-accent text-sm font-medium">View Details</Text>
                        </Pressable>
                      </View>
                    </Animated.View>
                  );
                })}
              </View>
            )}

            <View className="h-24" />
          </ScrollView>

          <Modal visible={showAddModal} transparent animationType="fade">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
              <View className="flex-1 bg-black/70 items-center justify-center px-6">
                <Animated.View entering={FadeInRight.springify()} className="bg-af-navy rounded-3xl w-full max-w-md border border-white/20 overflow-hidden">
                  <LinearGradient colors={['#0A1628', '#001F5C']} className="p-6">
                    <View className="flex-row items-center justify-between mb-4">
                      <Text className="text-xl font-bold text-white">Add Workout</Text>
                      <Pressable
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setShowAddModal(false);
                          resetForm();
                        }}
                        className="p-2"
                      >
                        <X size={20} color="#FFFFFF" />
                      </Pressable>
                    </View>

                    <View className="mb-4">
                      <Text className="text-white/70 text-sm mb-2">Workout Name</Text>
                      <TextInput
                        value={newName}
                        onChangeText={setNewName}
                        placeholder="e.g., Squadron PT"
                        placeholderTextColor="#A0A0A0"
                        className="bg-white/10 text-white px-4 py-3 rounded-2xl border border-white/20"
                      />
                    </View>

                    <View className="flex-row gap-3 mb-4">
                      <View className="flex-1">
                        <Text className="text-white/70 text-sm mb-2">Date</Text>
                        <TextInput
                          value={newDate}
                          onChangeText={setNewDate}
                          placeholder="YYYY-MM-DD"
                          placeholderTextColor="#A0A0A0"
                          className="bg-white/10 text-white px-4 py-3 rounded-2xl border border-white/20"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-white/70 text-sm mb-2">Time</Text>
                        <TextInput
                          value={newTime}
                          onChangeText={setNewTime}
                          placeholder="HH:MM"
                          placeholderTextColor="#A0A0A0"
                          className="bg-white/10 text-white px-4 py-3 rounded-2xl border border-white/20"
                        />
                      </View>
                    </View>

                    <View className="mb-4">
                      <Text className="text-white/70 text-sm mb-2">Location</Text>
                      <TextInput
                        value={newLocation}
                        onChangeText={setNewLocation}
                        placeholder="e.g., Base Gym"
                        placeholderTextColor="#A0A0A0"
                        className="bg-white/10 text-white px-4 py-3 rounded-2xl border border-white/20"
                      />
                    </View>

                    <View className="mb-4">
                      <Text className="text-white/70 text-sm mb-3">Workout Type</Text>
                      <View className="flex-row flex-wrap gap-2">
                        {workoutTypes.map(type => (
                          <Pressable
                            key={type.type}
                            onPress={() => {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              setNewType(type.type);
                            }}
                            className={cn(
                              "flex-row items-center px-3 py-2 rounded-xl border",
                              newType === type.type
                                ? "bg-af-accent/20 border-af-accent"
                                : "bg-white/5 border-white/20"
                            )}
                          >
                            <type.icon size={16} color={newType === type.type ? '#4A90D9' : '#A0A0A0'} />
                            <Text className={cn(
                              "ml-2 text-sm font-medium",
                              newType === type.type ? "text-af-accent" : "text-white/70"
                            )}>
                              {type.type}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    </View>

                    <View className="mb-4">
                      <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-white/70 text-sm">Multi-Step Workout</Text>
                        <Pressable
                          onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setIsMultiStep(!isMultiStep);
                          }}
                          className={cn(
                            "w-12 h-6 rounded-full border",
                            isMultiStep ? "bg-af-accent border-af-accent" : "bg-white/10 border-white/20"
                          )}
                        >
                          <View
                            className={cn(
                              "w-5 h-5 rounded-full bg-white absolute top-0.5",
                              isMultiStep ? "right-0.5" : "left-0.5"
                            )}
                          />
                        </Pressable>
                      </View>

                      {isMultiStep && (
                        <View>
                          <Text className="text-white/50 text-xs mb-2">Add workout steps</Text>
                          {steps.map((step, index) => (
                            <View key={index} className="flex-row items-center mb-2">
                              <TextInput
                                value={step}
                                onChangeText={value => updateStep(index, value)}
                                placeholder={`Step ${index + 1}`}
                                placeholderTextColor="#A0A0A0"
                                className="flex-1 bg-white/10 text-white px-4 py-3 rounded-2xl border border-white/20"
                              />
                              {steps.length > 1 && (
                                <Pressable
                                  onPress={() => removeStep(index)}
                                  className="ml-2 p-2"
                                >
                                  <X size={16} color="#FF3B30" />
                                </Pressable>
                              )}
                            </View>
                          ))}
                          <Pressable onPress={addStep} className="flex-row items-center mt-2">
                            <Plus size={16} color="#4A90D9" />
                            <Text className="text-af-accent text-sm ml-2">Add Step</Text>
                          </Pressable>
                        </View>
                      )}
                    </View>

                    <Pressable
                      onPress={handleAddWorkout}
                      disabled={!canSubmit}
                      className={cn(
                        "py-4 rounded-2xl items-center",
                        canSubmit ? "bg-af-accent" : "bg-white/10"
                      )}
                    >
                      <Text className={cn(
                        "font-semibold text-base",
                        canSubmit ? "text-white" : "text-white/50"
                      )}>
                        Add Workout
                      </Text>
                    </Pressable>
                  </LinearGradient>
                </Animated.View>
              </View>
            </KeyboardAvoidingView>
          </Modal>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
