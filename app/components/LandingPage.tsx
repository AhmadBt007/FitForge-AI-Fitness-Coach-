import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';



type DrawerNav = DrawerNavigationProp<any>;

export default function LandingPage() {
  const navigation = useNavigation<DrawerNav>();
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Logo and Title */}
      <View style={styles.logoRow}>
        <Text style={styles.logoText}>FitForge</Text>
        <Image source={require('../../assets/images/FitLogo.png')} style={styles.logoImg} resizeMode="contain" />
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heading1}>
          Track Every <Text style={styles.h1Head}>Rep</Text>
        </Text>
        <Text style={styles.heading1}>
          Achieve Every <Text style={styles.h1Head}>Goal</Text>
        </Text>
        <Text style={styles.subHead1}>
          Your ultimate fitness companion. Stay on track, stay active with FitForge.
        </Text>
        <TouchableOpacity style={styles.getStartedBtn} onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.getStartedBtnText}>Get Started</Text>
        </TouchableOpacity>
        {/* Login Link for existing users */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
          <Text style={{ color: '#bbb', fontSize: 16 }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: '#27ae60', fontSize: 16, fontWeight: 'bold' }}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Feature Cards */}
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🏋️ Find Your Perfect Workout</Text>
          <Text style={styles.cardText}>
            Create workout routines that are uniquely yours. Select from our comprehensive exercise database to craft plans that fit your goals, schedule, and fitness level.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📋 Tailor-Made Fitness Plans</Text>
          <Text style={styles.cardText}>
            Adjust sets, reps, and duration to match your progress. With the ability to personalize your fitness journey, reaching your goals has never been more attainable.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💪 Log As You Lift</Text>
          <Text style={styles.cardText}>
            Stay focused and on track with real-time workout tracking. Log every rep, set, and the weight you lift with ease. Immediate feedback keeps you motivated.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📈 Visualize Your Victory</Text>
          <Text style={styles.cardText}>
            Watch your fitness journey unfold with detailed progress tracking. Set goals, monitor achievements, and celebrate every improvement.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
    paddingHorizontal: 0,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
    gap: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
    flex: 1,
  },
  logoImg: {
    width: 60,
    height: 60,
  },
  heroSection: {
    backgroundColor: '#232323',
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  heading1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  h1Head: {
    color: '#27ae60',
  },
  subHead1: {
    color: '#bbb',
    fontSize: 16,
    marginVertical: 12,
    textAlign: 'center',
  },
  getStartedBtn: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 8,
  },
  getStartedBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    gap: 12,
  },
  card: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '47%',
    borderWidth: 1,
    borderColor: '#333',
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  cardText: {
    color: '#ccc',
    fontSize: 14,
  },
}); 