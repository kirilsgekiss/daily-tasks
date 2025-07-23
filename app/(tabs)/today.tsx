
import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, View, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface Task {
  id: string;
  title: string;
  project: string;
  dueDate: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface Project {
  id: string;
  name: string;
  color: string;
}

export default function TodayScreen() {
  const colorScheme = useColorScheme();
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Review project proposal', project: 'Work', dueDate: 'Today', completed: false, priority: 'high' },
    { id: '2', title: 'Team standup meeting', project: 'Work', dueDate: 'Today', completed: true, priority: 'medium' },
    { id: '3', title: 'Buy groceries', project: 'Personal', dueDate: 'Today', completed: false, priority: 'low' },
    { id: '4', title: 'Call mom', project: 'Personal', dueDate: 'Today', completed: false, priority: 'medium' },
    { id: '5', title: 'Workout session', project: 'Health', dueDate: 'Today', completed: false, priority: 'high' },
  ]);

  const [projects] = useState<Project[]>([
    { id: '1', name: 'Inbox', color: Colors.dark.primary },
    { id: '2', name: 'Work', color: Colors.dark.danger },
    { id: '3', name: 'Personal', color: Colors.dark.success },
    { id: '4', name: 'Health', color: Colors.dark.orange },
    { id: '5', name: 'Learning', color: Colors.dark.purple },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedProject, setSelectedProject] = useState('Inbox');
  const [selectedDueDate, setSelectedDueDate] = useState('Today');

  const addTask = () => {
    setShowAddModal(true);
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        project: selectedProject,
        dueDate: selectedDueDate,
        completed: false,
        priority: 'medium'
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setSelectedProject('Inbox');
      setSelectedDueDate('Today');
      setShowAddModal(false);
    }
  };

  const navigateToProfile = () => {
    router.push('/profile');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return Colors.dark.danger;
      case 'medium': return Colors.dark.warning;
      case 'low': return Colors.dark.success;
      default: return Colors.dark.secondary;
    }
  };

  const getProjectColor = (projectName: string) => {
    const project = projects.find(p => p.name === projectName);
    return project ? project.color : Colors.dark.primary;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      {/* Header */}
      <ThemedView style={[styles.header, { borderBottomColor: Colors[colorScheme ?? 'light'].border }]}>
        <ThemedView>
          <ThemedText type="title" style={{ color: Colors[colorScheme ?? 'light'].text }}>Today</ThemedText>
          <ThemedText style={[styles.subtitle, { color: Colors[colorScheme ?? 'light'].secondary }]}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </ThemedText>
        </ThemedView>
        <TouchableOpacity onPress={navigateToProfile} style={styles.profileButton}>
          <ThemedView style={[styles.profilePicture, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
            <IconSymbol name="person.fill" size={20} color="white" />
          </ThemedView>
        </TouchableOpacity>
      </ThemedView>

      {/* Progress Overview */}
      <ThemedView style={[styles.progressSection, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
        <ThemedText type="subtitle" style={{ color: Colors[colorScheme ?? 'light'].text }}>Today's Progress</ThemedText>
        <ThemedView style={styles.progressInfo}>
          <ThemedText style={[styles.progressText, { color: Colors[colorScheme ?? 'light'].text }]}>
            {completedTasks} of {totalTasks} tasks completed
          </ThemedText>
          <ThemedText style={[styles.progressPercentage, { color: Colors[colorScheme ?? 'light'].tint }]}>
            {progressPercentage}%
          </ThemedText>
        </ThemedView>
        <ThemedView style={[styles.progressBarContainer, { backgroundColor: Colors[colorScheme ?? 'light'].border }]}>
          <ThemedView 
            style={[
              styles.progressBar,
              { 
                width: `${progressPercentage}%`,
                backgroundColor: Colors[colorScheme ?? 'light'].tint 
              }
            ]} 
          />
        </ThemedView>
      </ThemedView>

      {/* Tasks List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Your Tasks
          </ThemedText>

          {tasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={[
                styles.taskItem,
                { backgroundColor: Colors[colorScheme ?? 'light'].card },
                task.completed && { opacity: 0.6 }
              ]}
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
                      { color: Colors[colorScheme ?? 'light'].text },
                      task.completed && styles.completedTask
                    ]}
                  >
                    {task.title}
                  </ThemedText>
                  <ThemedView style={styles.taskMeta}>
                    <ThemedView style={styles.projectTag}>
                      <ThemedView 
                        style={[styles.projectDot, { backgroundColor: getProjectColor(task.project) }]} 
                      />
                      <ThemedText style={[styles.taskProject, { color: Colors[colorScheme ?? 'light'].secondary }]}>
                        {task.project}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView style={[styles.priorityTag, { backgroundColor: getPriorityColor(task.priority) + '20' }]}>
                      <ThemedText style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                        {task.priority}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
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
      </ScrollView>

      {/* Add Task Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={[styles.modalContent, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
            <ThemedText type="subtitle" style={[styles.modalTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Add New Task
            </ThemedText>
            
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: Colors[colorScheme ?? 'light'].border
              }]}
              placeholder="Task title"
              placeholderTextColor={Colors[colorScheme ?? 'light'].secondary}
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              autoFocus
            />

            <ThemedText style={[styles.inputLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
              Project
            </ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.projectSelector}>
              {projects.map((project) => (
                <TouchableOpacity
                  key={project.id}
                  style={[
                    styles.projectOption,
                    { backgroundColor: selectedProject === project.name ? project.color + '20' : Colors[colorScheme ?? 'light'].background },
                    { borderColor: selectedProject === project.name ? project.color : Colors[colorScheme ?? 'light'].border }
                  ]}
                  onPress={() => setSelectedProject(project.name)}
                >
                  <ThemedView style={[styles.projectDot, { backgroundColor: project.color }]} />
                  <ThemedText style={[styles.projectOptionText, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {project.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ThemedText style={[styles.inputLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
              Due Date
            </ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateSelector}>
              {['Today', 'Tomorrow', 'This Week', 'Next Week'].map((date) => (
                <TouchableOpacity
                  key={date}
                  style={[
                    styles.dateOption,
                    { 
                      backgroundColor: selectedDueDate === date ? Colors[colorScheme ?? 'light'].tint + '20' : Colors[colorScheme ?? 'light'].background,
                      borderColor: selectedDueDate === date ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].border
                    }
                  ]}
                  onPress={() => setSelectedDueDate(date)}
                >
                  <ThemedText style={[styles.dateOptionText, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {date}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ThemedView style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: Colors[colorScheme ?? 'light'].border }]}
                onPress={() => setShowAddModal(false)}
              >
                <ThemedText style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Cancel
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
                onPress={handleAddTask}
              >
                <ThemedText style={[styles.modalButtonText, { color: 'white' }]}>
                  Add Task
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Modal>

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
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  profileButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicture: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSection: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  progressText: {
    fontSize: 14,
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    marginBottom: 15,
  },
  taskItem: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderRadius: 12,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  projectTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  taskProject: {
    fontSize: 12,
  },
  priorityTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 15,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  projectSelector: {
    marginBottom: 20,
  },
  projectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  projectOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateSelector: {
    marginBottom: 30,
  },
  dateOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  dateOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
