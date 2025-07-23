
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].text} />
        </TouchableOpacity>
        <ThemedText type="title">Profile</ThemedText>
        <ThemedView style={styles.placeholder} />
      </ThemedView>

      {/* Profile Content */}
      <ThemedView style={styles.content}>
        <ThemedView style={styles.profileSection}>
          <ThemedView style={[styles.largeProfilePicture, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
            <IconSymbol name="person.fill" size={48} color="white" />
          </ThemedView>
          <ThemedText type="title" style={styles.userName}>John Doe</ThemedText>
          <ThemedText style={styles.userEmail}>john.doe@example.com</ThemedText>
        </ThemedView>

        <ThemedView style={styles.statsSection}>
          <ThemedView style={styles.statItem}>
            <ThemedText type="subtitle">24</ThemedText>
            <ThemedText style={styles.statLabel}>Tasks Completed</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statItem}>
            <ThemedText type="subtitle">5</ThemedText>
            <ThemedText style={styles.statLabel}>Active Projects</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statItem}>
            <ThemedText type="subtitle">78%</ThemedText>
            <ThemedText style={styles.statLabel}>Completion Rate</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <IconSymbol name="bell" size={24} color={Colors[colorScheme ?? 'light'].text} />
            <ThemedText style={styles.menuText}>Notifications</ThemedText>
            <IconSymbol name="chevron.right" size={20} color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <IconSymbol name="gear" size={24} color={Colors[colorScheme ?? 'light'].text} />
            <ThemedText style={styles.menuText}>Settings</ThemedText>
            <IconSymbol name="chevron.right" size={20} color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <IconSymbol name="questionmark.circle" size={24} color={Colors[colorScheme ?? 'light'].text} />
            <ThemedText style={styles.menuText}>Help & Support</ThemedText>
            <IconSymbol name="chevron.right" size={20} color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 4,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  largeProfilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    marginBottom: 8,
  },
  userEmail: {
    opacity: 0.7,
    fontSize: 16,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
    paddingVertical: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  menuSection: {
    gap: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  menuText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '500',
  },
});
