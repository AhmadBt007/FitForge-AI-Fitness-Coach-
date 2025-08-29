import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


export default function MyWorkouts() {

  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  interface WorkoutPlan {
    id?: string;
    title: string;
    duration: string;
    muscleGroup: string;
    calories: string;
    exercises: string[];
  }
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const uid = await AsyncStorage.getItem('uid');
      if (!uid) return;
      const res = await fetch(`https://fitapp-20272-default-rtdb.firebaseio.com/CustomWorkouts/${uid}.json`);
      const data = await res.json();
      if (data) {
        const arr = Object.keys(data)
          .filter(key => data[key])
          .map(key => ({ id: key, ...data[key] }));
        setWorkouts(arr);
      } else {
        setWorkouts([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const deleteWorkout = async (id?: string) => {
    if (!id) return;
    try {
      const uid = await AsyncStorage.getItem('uid');
      if (!uid) return;
      const res = await fetch(`https://fitapp-20272-default-rtdb.firebaseio.com/CustomWorkouts/${uid}/${id}.json`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await load();
      } else {
        console.warn('Delete workout failed');
      }
    } catch (e) {
      console.warn('Failed to delete workout', e);
    }
  };

  const renderItem = ({ item }: { item: WorkoutPlan }) => (
    <View style={[styles.card, { backgroundColor: '#232323' }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity onPress={() => (navigation as any).navigate('CreateWorkout', { workout: item })}>
            <Text style={{ color: '#27ae60', fontSize: 16 }}>✏️ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteWorkout(item.id)}>
            <Text style={{ color: '#e74c3c', fontSize: 16 }}>🗑️ Delete</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ color: '#27ae60' }}>{item.duration}</Text>
      </View>
      <Text style={{ color: '#fff', marginBottom: 8 }}>Muscle: {item.muscleGroup}</Text>
      <Text style={{ color: '#fff', marginBottom: 8 }}>Calories: {item.calories}</Text>
      <Text style={styles.subheading}>Exercises:</Text>
      {item.exercises.map((ex: string, idx: number) => (
        <Text key={idx} style={{ color: '#fff', marginLeft: 8 }}>• {ex}</Text>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#27ae60" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {workouts.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: '#fff', marginBottom: 16 }}>No custom workouts yet.</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CreateWorkout' as never)}>
            <Text style={{ color: '#27ae60', fontSize: 16 }}>➕ Create Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={workouts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id || Math.random().toString()}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181818' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#181818' },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  subheading: { fontWeight: '600', marginBottom: 4 },
});
