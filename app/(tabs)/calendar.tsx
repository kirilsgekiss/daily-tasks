import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface CalendarTask {
  id: string;
  title: string;
  date: string;
  project: string;
  completed: boolean;
}

export default function CalendarScreen() {
  const colorScheme = useColorScheme();
  const [tasks, setTasks] = useState<CalendarTask[]>([
    { id: '1', title: 'Team meeting', date: 'Today', project: 'Work', completed: false },
    { id: '2', title: 'Doctor appointment', date: 'Tomorrow', project: 'Health', completed: false },
    { id: '3', title: 'Weekly grocery shopping', date: 'Saturday', project: 'Personal', completed: false },
    { id: '4', title: 'Project deadline', date: 'Next Monday', project: 'Work', completed: false },
  ]);

  const addTask = () => {
    Alert.prompt(
      'Add New Task',
      'Enter task title:',
      (text) => {
        if (text && text.trim()) {
          const newTask: CalendarTask = {
            id: Date.now().toString(),
            title: text.trim(),
            date: 'Today',
            project: 'Inbox',
            completed: false
          };
          setTasks([...tasks, newTask]);
        }
      }
    );
  };

  const navigateToProfile = () => {
    router.push('/profile');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getTasksByDate = () => {
    const grouped = tasks.reduce((acc, task) => {
      if (!acc[task.date]) {
        acc[task.date] = [];
      }
      acc[task.date].push(task);
      return acc;
    }, {} as Record<string, CalendarTask[]>);
    return grouped;
  };

  const groupedTasks = getTasksByDate();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedView>
          <ThemedText type="title">Calendar</ThemedText>
          <ThemedText style={styles.subtitle}>Upcoming tasks</ThemedText>
        </ThemedView>
        <TouchableOpacity onPress={navigateToProfile} style={styles.profileButton}>
          <ThemedView style={[styles.profilePicture, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
            <IconSymbol name="person.fill" size={20} color="white" />
          </ThemedView>
        </TouchableOpacity>
      </ThemedView>

      {/* Calendar View */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          {/* Current Week Overview */}
          <ThemedView style={styles.weekOverview}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>This Week</ThemedText>
            <ThemedView style={styles.weekDays}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <ThemedView key={day} style={[
                  styles.dayCard,
                  index === 2 && { backgroundColor: Colors[colorScheme ?? 'light'].tint }
                ]}>
                  <ThemedText style={[
                    styles.dayText,
                    index === 2 && { color: 'white' }
                  ]}>
                    {day}
                  </ThemedText>
                  <ThemedText style={[
                    styles.dayNumber,
                    index === 2 && { color: 'white' }
                  ]}>
                    {15 + index}
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>

          {/* Tasks by Date */}
          {Object.entries(groupedTasks).map(([date, dateTasks]) => (
            <ThemedView key={date} style={styles.dateSection}>
              <ThemedView style={styles.dateHeader}>
                <ThemedText type="subtitle" style={styles.dateTitle}>{date}</ThemedText>
                <ThemedText style={styles.taskCount}>
                  {dateTasks.filter(t => !t.completed).length} tasks
                </ThemedText>
              </ThemedView>

              {dateTasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  style={[styles.taskItem, task.completed && styles.completedTaskItem]}
                  onPress={() => toggleTask(task.id)}
                >
                  <ThemedView style={styles.taskContent}>
                    <ThemedView style={[
                      styles.checkbox,
                      task.completed && { backgroundColor: Colors[colorScheme ?? 'light'].tint },
                      !task.completed && { borderColor: Colors[colorScheme ?? 'light'].tint }
                    ]}>
                      {task.completed && (
                        <IconSymbol name="checkmark" size={14} color="white" />
                      )}
                    </ThemedView>
                    <ThemedView style={styles.taskInfo}>
                      <ThemedText 
                        style={[
                          styles.taskTitle,
                          task.completed && styles.completedTask
                        ]}
                      >
                        {task.title}
                      </ThemedText>
                      <ThemedText style={[styles.taskProject, task.completed && styles.completedTask]}>
                        {task.project}
                      </ThemedText>
                    </ThemedView>
                    <IconSymbol 
                      name="calendar" 
                      size={16} 
                      color={Colors[colorScheme ?? 'light'].icon} 
                    />
                  </ThemedView>
                </TouchableOpacity>
              ))}
            </ThemedView>
          ))}

          {/* Empty State */}
          {Object.keys(groupedTasks).length === 0 && (
            <ThemedView style={styles.emptyState}>
              <IconSymbol name="calendar" size={48} color={Colors[colorScheme ?? 'light'].icon} />
              <ThemedText style={styles.emptyText}>No upcoming tasks</ThemedText>
              <ThemedText style={styles.emptySubtext}>Tap the + button to schedule a task</ThemedText>
            </ThemedView>
          )}
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
  calendarView: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  daySection: {
    marginBottom: 20,
  },
  dayHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.dark.info,
    borderRadius: 12,
    color: Colors.dark.text,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginVertical: 3,
    borderRadius: 12,
    backgroundColor: Colors.dark.card,
    borderLeftWidth: 4,
    borderLeftColor: Colors.dark.cyan,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: Colors.dark.text,
  },
  taskProject: {
    fontSize: 14,
    color: Colors.dark.secondary,
  },
  completedTask: {
    opacity: 0.6,
    textDecorationLine: 'line-through',
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