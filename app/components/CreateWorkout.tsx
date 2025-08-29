import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CreateWorkout({ route }: any) {
  const existingWorkout = route?.params?.workout; 
  const navigation = useNavigation();

  const [title, setTitle] = useState(existingWorkout?.title || '');
  const [category, setCategory] = useState<'gym' | 'home'>(existingWorkout?.category || 'gym');
  const [muscleGroup, setMuscleGroup] = useState(existingWorkout?.muscleGroup || '');
  const [duration, setDuration] = useState(existingWorkout?.duration || '');
  const [calories, setCalories] = useState(existingWorkout?.calories || '');
  const [exercises, setExercises] = useState(existingWorkout?.exercises?.join(', ') || ''); // comma-separated list
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !muscleGroup.trim() || !duration.trim() || !calories.trim() || !exercises.trim()) {
      Alert.alert('Please fill in all fields');
      return;
    }

    setSaving(true);
    try {
      const uid = await AsyncStorage.getItem('uid');
      if (!uid) throw new Error('User not logged in');

      const payload = {
        id: Date.now(),
        title: title.trim(),
        category,
        muscleGroup: muscleGroup.trim(),
        duration: duration.trim(),
        calories: calories.trim(),
        exercises: exercises.split(',').map((e: string) => e.trim()).filter(Boolean),
        createdAt: new Date().toISOString(),
      };

      const urlBase = `https://fitapp-20272-default-rtdb.firebaseio.com/CustomWorkouts/${uid}`;
      const url = existingWorkout?.id ? `${urlBase}/${existingWorkout.id}.json` : `${urlBase}.json`;
      await fetch(url, {
        method: existingWorkout?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setShowModal(true);
    } catch (err) {
      console.error('Failed to save workout', err);
      Alert.alert('Error saving workout');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Create Custom Workout</Text>

      <TextInput
        style={styles.input}
        placeholder="Workout Title"
        placeholderTextColor="#777"
        value={title}
        onChangeText={setTitle}
      />

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, category === 'gym' && styles.toggleButtonActive]}
          onPress={() => setCategory('gym')}
        >
          <Text style={styles.toggleButtonText}>Gym</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, category === 'home' && styles.toggleButtonActive]}
          onPress={() => setCategory('home')}
        >
          <Text style={styles.toggleButtonText}>Home</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Primary Muscle Group (e.g., Legs)"
        placeholderTextColor="#777"
        value={muscleGroup}
        onChangeText={setMuscleGroup}
      />

      <TextInput
        style={styles.input}
        placeholder="Duration (e.g., 30 mins)"
        placeholderTextColor="#777"
        value={duration}
        onChangeText={setDuration}
      />

      <TextInput
        style={styles.input}
        placeholder="Calories (e.g., 200 kcal)"
        placeholderTextColor="#777"
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Exercises (comma separated)"
        placeholderTextColor="#777"
        value={exercises}
        onChangeText={setExercises}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
        <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Workout'}</Text>
      </TouchableOpacity>
    </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ color: '#fff', fontSize: 18, marginBottom: 16 }}>
              {existingWorkout ? 'Workout updated!' : 'Workout created!'}
            </Text>
            <TouchableOpacity
              style={[styles.saveButton, { alignSelf: 'stretch' }]}
              onPress={() => {
                setShowModal(false);
                navigation.goBack();
              }}
            >
              <Text style={styles.saveButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
  },
  content: {
    padding: 24,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#232323',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    marginBottom: 16,
  },
  textArea: {
    height: 100,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    justifyContent: 'center',
  },
  toggleButton: {
    backgroundColor: '#555',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  toggleButtonActive: {
    backgroundColor: '#27ae60',
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#232323',
    padding: 24,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
  },
});
