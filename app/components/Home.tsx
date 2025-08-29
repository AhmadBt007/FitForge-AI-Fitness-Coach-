import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const motivationalQuotes = [
  "Push yourself, because no one else is going to do it for you.",
  "Success starts with self-discipline.",
  "The only bad workout is the one that didn't happen.",
  "Strive for progress, not perfection.",
  "You are one workout away from a good mood.",
  "Don't limit your challenges. Challenge your limits.",
  "Sweat is just fat crying.",
  "Believe in yourself and all that you are.",
  "Great things never come from comfort zones.",
  "Your body can stand almost anything. It's your mind that you have to convince."
];

export default function Home() {
  
  const [userName] = useState('Athlete');
  
  const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

 
  const totalCalories = 2200;
  const caloriesEaten = 1200;
  const caloriesLeft = totalCalories - caloriesEaten;
  const caloriesBurned = 350; 
  const caloriesLeftAfterWorkout = caloriesLeft - caloriesBurned;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.welcomeTitle}>Welcome{userName ? `, ${userName}` : ''}!</Text>
      <Text style={styles.motivationLabel}>Motivation for you:</Text>
      <View style={styles.quoteCard}>
        <Text style={styles.quoteText}>
          "{quote}"
        </Text>
      </View>
    <Text style={{color: 'white'}}>Just dummy data</Text>
      {/* Calorie Summary Section */}
      <View style={styles.calorieCard}>
        <Text style={styles.calorieTitle}>Today's Calorie Summary</Text>
        <View style={styles.calorieRow}>
          <Text style={styles.calorieLabel}>Total Intake:</Text>
          <Text style={styles.calorieValue}>{totalCalories} kcal</Text>
        </View>
        <View style={styles.calorieRow}>
          <Text style={styles.calorieLabel}>Eaten:</Text>
          <Text style={styles.calorieValue}>{caloriesEaten} kcal</Text>
        </View>
        <View style={styles.calorieRow}>
          <Text style={styles.calorieLabel}>Left:</Text>
          <Text style={styles.calorieValue}>{caloriesLeft} kcal</Text>
        </View>
        <View style={styles.calorieRow}>
          <Text style={styles.calorieLabel}>Burned (Workout):</Text>
          <Text style={styles.calorieValue}>{caloriesBurned} kcal</Text>
        </View>
        <View style={[styles.calorieRow, { borderTopWidth: 1, borderTopColor: '#333', marginTop: 8, paddingTop: 8 }]}> 
          <Text style={[styles.calorieLabel, { fontWeight: 'bold' }]}>Left After Workout:</Text>
          <Text style={[styles.calorieValue, { fontWeight: 'bold' }]}>{caloriesLeftAfterWorkout} kcal</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
    paddingHorizontal: 16,
  },
  welcomeTitle: {
    color: '#27ae60',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 48,
    marginBottom: 12,
    textAlign: 'center',
  },
  motivationLabel: {
    color: '#bbb',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 12,
  },
  quoteCard: {
    backgroundColor: '#232323',
    borderRadius: 14,
    padding: 24,
    marginHorizontal: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  quoteText: {
    color: '#fff',
    fontSize: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  calorieCard: {
    backgroundColor: '#232323',
    borderRadius: 14,
    padding: 24,
    marginHorizontal: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  calorieTitle: {
    color: '#27ae60',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  calorieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calorieLabel: {
    color: '#bbb',
    fontSize: 16,
  },
  calorieValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 