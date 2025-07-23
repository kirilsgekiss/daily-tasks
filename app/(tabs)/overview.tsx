import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface Project {
  id: string;
  name: string;
  taskCount: number;
  completedCount: number;
  color: string;
  isInbox?: boolean;
  icon?: string;
}

export default function OverviewScreen() {
  const colorScheme = useColorScheme();
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: 'Inbox', taskCount: 5, completedCount: 1, color: '#007AFF', isInbox: true, icon: 'folder' },
    { id: '2', name: 'Work', taskCount: 12, completedCount: 8, color: '#FF3B30', icon: 'folder' },
    { id: '3', name: 'Personal', taskCount: 7, completedCount: 3, color: '#34C759', icon: 'folder' },
    { id: '4', name: 'Health', taskCount: 4, completedCount: 2, color: '#FF9500', icon: 'folder' },
    { id: '5', name: 'Learning', taskCount: 6, completedCount: 1, color: '#AF52DE', icon: 'folder' },
  ]);

  const addTask = () => {
    Alert.prompt(
      'Add New Task',
      'Enter task title:',
      (text) => {
        if (text && text.trim()) {
          // Add to Inbox project
          setProjects(projects.map(project => 
            project.isInbox 
              ? { ...project, taskCount: project.taskCount + 1 }
              : project
          ));
        }
      }
    );
  };

  const navigateToProfile = () => {
    router.push('/profile');
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const totalTasks = projects.reduce((sum, project) => sum + project.taskCount, 0);
  const totalCompleted = projects.reduce((sum, project) => sum + project.completedCount, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedView>
          <ThemedText type="title">Overview</ThemedText>
          <ThemedText style={styles.subtitle}>All your projects</ThemedText>
        </ThemedView>
        <TouchableOpacity onPress={navigateToProfile} style={styles.profileButton}>
          <ThemedView style={[styles.profilePicture, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
            <IconSymbol name="person.fill" size={20} color="white" />
          </ThemedView>
        </TouchableOpacity>
      </ThemedView>

      {/* Projects List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          {/* Overall Progress */}
          <ThemedView style={[styles.summaryCard, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
            <ThemedText style={styles.summaryTitle}>Overall Progress</ThemedText>
            <ThemedText style={styles.summaryText}>
              {totalCompleted} of {totalTasks} tasks completed
            </ThemedText>
            <ThemedView style={styles.summaryProgress}>
              <ThemedView style={styles.summaryProgressBarContainer}>
                <ThemedView 
                  style={[
                    styles.summaryProgressBar,
                    { width: `${totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0}%` }
                  ]} 
                />
              </ThemedView>
              <ThemedText style={styles.summaryPercentage}>
                {totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0}%
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedText type="subtitle" style={styles.sectionTitle}>My Projects</ThemedText>

          {projects.map((project) => (
            <TouchableOpacity key={project.id} style={styles.projectItem}>
              <ThemedView style={styles.projectContent}>
                <ThemedView style={styles.projectHeader}>
                  <ThemedView style={styles.projectTitleRow}>
                    <ThemedView style={styles.projectIconContainer}>
                      <ThemedView 
                        style={[styles.projectColor, { backgroundColor: project.color }]} 
                      />
                      {project.isInbox && (
                        <IconSymbol name="star.fill" size={14} color="#FFD700" />
                      )}
                    </ThemedView>
                    <ThemedView style={styles.projectInfo}>
                      <ThemedText style={styles.projectName}>
                        {project.name}
                        {project.isInbox && (
                          <ThemedText style={styles.inboxLabel}> (Most Important)</ThemedText>
                        )}
                      </ThemedText>
                      <ThemedText style={styles.taskCount}>
                        {project.completedCount}/{project.taskCount} tasks
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                  <ThemedText style={styles.progressText}>
                    {getProgressPercentage(project.completedCount, project.taskCount)}%
                  </ThemedText>
                </ThemedView>

                {/* Progress Bar */}
                <ThemedView style={styles.progressBarContainer}>
                  <ThemedView 
                    style={[
                      styles.progressBar,
                      { 
                        width: `${getProgressPercentage(project.completedCount, project.taskCount)}%`,
                        backgroundColor: project.color 
                      }
                    ]} 
                  />
                </ThemedView>
              </ThemedView>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={[styles.addProjectButton, { borderColor: Colors[colorScheme ?? 'light'].tint }]}>
            <IconSymbol name="plus.circle" size={24} color={Colors[colorScheme ?? 'light'].tint} />
            <ThemedText style={[styles.addProjectText, { color: Colors[colorScheme ?? 'light'].tint }]}>
              Add New Project
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
        onPress={addTask}
      >
        <IconSymbol name="plus" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  profileButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: Colors.dark.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectsList: {
    paddingHorizontal: 20,
  },
  projectItem: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderRadius: 12,
    backgroundColor: Colors.dark.card,
    borderLeftWidth: 4,
    borderLeftColor: Colors.dark.purple,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  taskCount: {
    fontSize: 14,
    color: Colors.dark.secondary,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.dark.emerald,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});