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

interface DietPlan {
  id?: string;
  planName: string;
  createdAt?: string;
  meals?: { [key: string]: string };
}

export default function MyDietPlan() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<DietPlan[]>([]);

  const load = useCallback(async () => {
    try {
      const uid = await AsyncStorage.getItem('uid');
      if (!uid) return;
      const res = await fetch(
        `https://fitapp-20272-default-rtdb.firebaseio.com/UserCustomDietPlan/${uid}.json`
      );
      const data = await res.json();
      if (data) {
        const arr = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setPlans(arr);
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

  const deletePlan = async (id?: string) => {
    if (!id) return;
    try {
      const uid = await AsyncStorage.getItem('uid');
      if (!uid) return;
      const res = await fetch(`https://fitapp-20272-default-rtdb.firebaseio.com/UserCustomDietPlan/${uid}/${id}.json`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await load();
      } else {
        console.warn('Delete diet plan failed');
      }
    } catch (e) {
      console.warn('Failed to delete diet plan', e);
    }
  };

  const renderItem = ({ item }: { item: DietPlan }) => (
    <View style={[styles.card, { backgroundColor: '#232323' }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.planName}</Text>
        {item.createdAt && <Text style={{ color: '#27ae60', marginRight: 8 }}>{item.createdAt}</Text>}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity onPress={() => (navigation as any).navigate('CreateDietPlan', { plan: item })}>
            <Text style={{ color: '#27ae60', fontSize: 16 }}>✏️ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deletePlan(item.id)}>
            <Text style={{ color: '#e74c3c', fontSize: 16 }}>🗑️ Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      {item.meals && Object.entries(item.meals).map(([type, content]) => {
        if (!content?.trim()) return null;
        return (
          <View key={type} style={{ marginBottom: 8 }}>
            <Text style={{ color: '#27ae60', fontWeight: '600' }}>{type[0].toUpperCase() + type.slice(1)}:</Text>
            {content.split('\n').map((line, idx) => line.trim() && (
              <Text key={idx} style={{ color: '#fff', marginLeft: 8 }}>• {line.trim()}</Text>
            ))}
          </View>
        );
      })}
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
      {plans.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: '#fff', marginBottom: 16 }}>No diet plans yet.</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CreateDietPlan' as never)}>
            <Text style={{ color: '#27ae60', fontSize: 16 }}>➕ Create Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={plans}
          renderItem={renderItem}
          keyExtractor={item => item.id || Math.random().toString()}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181818' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#181818',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
});
