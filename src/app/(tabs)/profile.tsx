import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Modal, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, LogOut, Edit, Camera, Shield, Mail, Phone } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { cn } from '@/lib/cn';
import { useData } from '@/contexts/DataContext';

export default function ProfileScreen() {
  const { currentUser, updateUser, logout } = useData();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');

  const user = currentUser;

  const getDisplayName = (u: any) => u?.name || 'Unknown';
  const getAccountTypeColor = (type?: string) => {
    switch (type) {
      case 'Admin':
        return 'text-red-400';
      case 'PTL':
        return 'text-af-accent';
      default:
        return 'text-white/70';
    }
  };

  const userAccountType = user?.accountType || 'Member';
  const displayName = user ? getDisplayName(user) : 'Unknown';
  const accountColors = getAccountTypeColor(userAccountType);

  const openEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditName(user?.name || '');
    setEditEmail(user?.email || '');
    setEditPhone(user?.phone || '');
    setShowEditModal(true);
  };

  const saveEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (user) {
      updateUser(user.id, {
        name: editName.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim(),
      });
    }
    setShowEditModal(false);
  };

  const doLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    logout();
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#0A1628', '#001F5C', '#0A1628']}
        className="flex-1"
      >
        <SafeAreaView className="flex-1">
          <View className="px-6 py-4">
            <Text className="text-2xl font-bold text-white mb-2">Profile</Text>
            <Text className="text-white/70">Manage your account and settings</Text>
          </View>

          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            <Animated.View
              entering={FadeInDown.springify()}
              className="bg-white/10 rounded-3xl p-6 mb-6 border border-white/20"
            >
              <View className="flex-row items-center mb-4">
                <View className="w-16 h-16 rounded-2xl bg-af-accent/20 items-center justify-center mr-4 border border-af-accent/30 overflow-hidden">
                  {user?.avatarUrl ? (
                    <Image source={{ uri: user.avatarUrl }} className="w-full h-full" />
                  ) : (
                    <User size={32} color="#4A90D9" />
                  )}
                </View>

                <View className="flex-1">
                  <Text className="text-white font-bold text-xl">{displayName}</Text>
                  <View className="flex-row items-center mt-1">
                    <Shield size={14} color="#A0A0A0" />
                    <Text className={cn("ml-2 text-sm font-semibold", accountColors)}>
                      {userAccountType}
                    </Text>
                  </View>
                </View>

                <Pressable onPress={openEdit} className="bg-af-accent/20 p-3 rounded-2xl">
                  <Edit size={20} color="#4A90D9" />
                </Pressable>
              </View>

              <View className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <View className="flex-row items-center mb-3">
                  <Mail size={16} color="#A0A0A0" />
                  <Text className="text-white/70 ml-3">{user?.email || 'No email set'}</Text>
                </View>
                <View className="flex-row items-center">
                  <Phone size={16} color="#A0A0A0" />
                  <Text className="text-white/70 ml-3">{user?.phone || 'No phone set'}</Text>
                </View>
              </View>
            </Animated.View>

            <View className="bg-white/10 rounded-3xl p-6 mb-6 border border-white/20">
              <Text className="text-white font-semibold text-lg mb-4">Settings</Text>

              <Pressable
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                className="flex-row items-center justify-between py-4 border-b border-white/10"
              >
                <View className="flex-row items-center">
                  <Settings size={20} color="#A0A0A0" />
                  <Text className="text-white/70 ml-3">App Settings</Text>
                </View>
                <Text className="text-white/30">›</Text>
              </Pressable>

              <Pressable
                onPress={doLogout}
                className="flex-row items-center justify-between py-4"
              >
                <View className="flex-row items-center">
                  <LogOut size={20} color="#FF3B30" />
                  <Text className="text-red-400 ml-3 font-medium">Sign Out</Text>
                </View>
                <Text className="text-white/30">›</Text>
              </Pressable>
            </View>

            <View className="h-24" />
          </ScrollView>

          <Modal visible={showEditModal} transparent animationType="fade">
            <View className="flex-1 bg-black/70 items-center justify-center px-6">
              <View className="bg-af-navy rounded-3xl w-full max-w-md border border-white/20 overflow-hidden">
                <LinearGradient colors={['#0A1628', '#001F5C']} className="p-6">
                  <Text className="text-xl font-bold text-white mb-4">Edit Profile</Text>

                  <View className="mb-4">
                    <Text className="text-white/70 text-sm mb-2">Name</Text>
                    <TextInput
                      value={editName}
                      onChangeText={setEditName}
                      placeholder="Your name"
                      placeholderTextColor="#A0A0A0"
                      className="bg-white/10 text-white px-4 py-3 rounded-2xl border border-white/20"
                    />
                  </View>

                  <View className="mb-4">
                    <Text className="text-white/70 text-sm mb-2">Email</Text>
                    <TextInput
                      value={editEmail}
                      onChangeText={setEditEmail}
                      placeholder="you@example.com"
                      placeholderTextColor="#A0A0A0"
                      className="bg-white/10 text-white px-4 py-3 rounded-2xl border border-white/20"
                    />
                  </View>

                  <View className="mb-6">
                    <Text className="text-white/70 text-sm mb-2">Phone</Text>
                    <TextInput
                      value={editPhone}
                      onChangeText={setEditPhone}
                      placeholder="(555) 555-5555"
                      placeholderTextColor="#A0A0A0"
                      className="bg-white/10 text-white px-4 py-3 rounded-2xl border border-white/20"
                    />
                  </View>

                  <View className="flex-row gap-3">
                    <Pressable
                      onPress={() => setShowEditModal(false)}
                      className="flex-1 py-4 rounded-2xl items-center bg-white/10 border border-white/20"
                    >
                      <Text className="text-white/70 font-semibold">Cancel</Text>
                    </Pressable>

                    <Pressable
                      onPress={saveEdit}
                      className="flex-1 py-4 rounded-2xl items-center bg-af-accent"
                    >
                      <Text className="text-white font-semibold">Save</Text>
                    </Pressable>
                  </View>
                </LinearGradient>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
