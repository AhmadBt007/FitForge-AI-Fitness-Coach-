import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type RouteParams = {
  UserDashboard: {
    userData?: {
      name: string;
      weight: number;
      height: number;
      age: number;
      gender: string;
      bmi: string;
    };
  };
};

export default function UserDashboard() {
  const route = useRoute<RouteProp<RouteParams, 'UserDashboard'>>();
  const navigation = useNavigation<any>();
  const [selectedGoal, setSelectedGoal] = useState('');
  const [userData, setUserData] = useState({
    name: '',
    weight: 0,
    height: 0,
    age: 0,
    gender: '',
    bmi: '',
  });
  const [bmr, setBmr] = useState(0);
  const [dailyCalories, setDailyCalories] = useState(0);
  const [calorieSaved, setCalorieSaved] = useState(false);

  // Get user data from backend if not provided via navigation
  useEffect(() => {
    const fetchUser = async () => {
      if (route.params?.userData) {
        setUserData(route.params.userData);
        return;
      }
      try {
        const uid = await AsyncStorage.getItem('uid');
        if (!uid) return;

        // Fetch basic user info
        const userRes = await fetch(`https://fitapp-20272-default-rtdb.firebaseio.com/Users/${uid}.json`);
        const basic = await userRes.json();

        // Fetch weight/height/BMI
        const profRes = await fetch(`https://fitapp-20272-default-rtdb.firebaseio.com/UserProfile/${uid}.json`);
        const prof = await profRes.json();

        setUserData({
          name: basic?.fullName || 'User',
          weight: prof?.weight || 0,
          height: prof?.height || 0,
          age: basic?.age || 0,
          gender: basic?.gender || '',
          bmi: prof?.bmi ? String(prof.bmi) : '',
        });

        // Preselect goal if previously saved
        if (prof?.GoalSelected) {
          setSelectedGoal(prof.GoalSelected);
          // Wait for state to settle before computing calories/BMR
          setTimeout(() => {
            const cal = calculateDailyCalories(prof.GoalSelected);
            setDailyCalories(cal);
            setBmr(calculateBMR());
          }, 0);
        }
      } catch (e) {
        console.error('Failed to load dashboard user data', e);
      }
    };

    fetchUser();
  }, [route.params]);

  // Calculate BMR based on gender
  const calculateBMR = () => {
    const { weight, height, age, gender } = userData;
    
    if (weight <= 0 || height <= 0 || age <= 0 || !gender) {
      return 0;
    }

    let calculatedBMR = 0;
    
    if (gender === 'male') {
      calculatedBMR = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender === 'female') {
      calculatedBMR = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    return Math.round(calculatedBMR);
  };

  // Calculate daily calorie needs based on goal
  const calculateDailyCalories = (goal: string) => {
    const baseBMR = calculateBMR();
    
    switch (goal) {
      case 'weight_loss':
        return baseBMR - 500;
      case 'weight_gain':
        return baseBMR + 500;
      case 'maintain':
        return baseBMR;
      default:
        return baseBMR;
    }
  };

  const saveCalories = async () => {
    try {
      const uid = await AsyncStorage.getItem('uid');
      if (!uid) throw new Error('User not logged in');
      await fetch(`https://fitapp-20272-default-rtdb.firebaseio.com/UserProfile/${uid}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalCalories: dailyCalories, GoalSelected: selectedGoal }),
      });
      setCalorieSaved(true);
      setTimeout(() => setCalorieSaved(false), 3000);
    } catch (e) {
      console.error('Failed to save calories', e);
      Alert.alert('Error', 'Could not save calories. Try again later.');
    }
  };

  const handleGoalSelection = (goal: string) => {
    setSelectedGoal(goal);
    const calories = calculateDailyCalories(goal);
    setDailyCalories(calories);
    setBmr(calculateBMR());
  };

  const getGoalDescription = (goal: string) => {
    switch (goal) {
      case 'weight_loss':
        return 'Reduce daily calorie intake by 500 calories to lose weight safely';
      case 'weight_gain':
        return 'Increase daily calorie intake by 500 calories to gain weight';
      case 'maintain':
        return 'Maintain current weight with calculated BMR calories';
      default:
        return '';
    }
  };

  const getGoalTitle = (goal: string) => {
    switch (goal) {
      case 'weight_loss':
        return 'Weight Loss';
      case 'weight_gain':
        return 'Weight Gain';
      case 'maintain':
        return 'Maintain Weight';
      default:
        return '';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Your Dashboard</Text>
        
        {/* User Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Your Profile</Text>
          <View style={styles.userInfo}>
            <Text style={styles.infoText}>Name: {userData.name}</Text>
            <Text style={styles.infoText}>Weight: {userData.weight} kg</Text>
            <Text style={styles.infoText}>Height: {userData.height} cm</Text>
            <Text style={styles.infoText}>Age: {userData.age} years</Text>
            <Text style={styles.infoText}>Gender: {userData.gender}</Text>
            <Text style={styles.infoText}>BMI: {userData.bmi}</Text>
          </View>
        </View>

        {/* Goal Selection */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎯 Select Your Goal</Text>
          <Text style={styles.cardSubtitle}>Choose your fitness objective</Text>
          
          <View style={styles.goalContainer}>
            <TouchableOpacity
              style={[
                styles.goalButton,
                selectedGoal === 'weight_loss' && styles.goalButtonActive
              ]}
              onPress={() => handleGoalSelection('weight_loss')}
            >
              <Text style={styles.goalIcon}>📉</Text>
              <Text style={[
                styles.goalButtonText,
                selectedGoal === 'weight_loss' && styles.goalButtonTextActive
              ]}>Weight Loss</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.goalButton,
                selectedGoal === 'maintain' && styles.goalButtonActive
              ]}
              onPress={() => handleGoalSelection('maintain')}
            >
              <Text style={styles.goalIcon}>⚖️</Text>
              <Text style={[
                styles.goalButtonText,
                selectedGoal === 'maintain' && styles.goalButtonTextActive
              ]}>Maintain Weight</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.goalButton,
                selectedGoal === 'weight_gain' && styles.goalButtonActive
              ]}
              onPress={() => handleGoalSelection('weight_gain')}
            >
              <Text style={styles.goalIcon}>📈</Text>
              <Text style={[
                styles.goalButtonText,
                selectedGoal === 'weight_gain' && styles.goalButtonTextActive
              ]}>Weight Gain</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BMR and Calorie Results */}
        {selectedGoal && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🔥 Your Calorie Plan</Text>
            
            <View style={styles.resultContainer}>
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>BMR (Basal Metabolic Rate)</Text>
                <Text style={styles.resultValue}>{bmr} calories/day</Text>
                <Text style={styles.resultDescription}>
                  Calories your body needs at rest
                </Text>
              </View>

              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Daily Calorie Target</Text>
                <Text style={styles.resultValue}>{dailyCalories} calories/day</Text>
                <Text style={styles.resultDescription}>
                  {getGoalDescription(selectedGoal)}
                </Text>
              </View>

              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Weekly Goal</Text>
                <Text style={styles.resultValue}>
                  {selectedGoal === 'weight_loss' ? '-0.5 kg' : 
                   selectedGoal === 'weight_gain' ? '+0.5 kg' : 'Maintain'}
                </Text>
                <Text style={styles.resultDescription}>
                  Expected weekly weight change
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={saveCalories} activeOpacity={0.85}>
              <Text style={styles.saveButtonText}>Save Daily Calories</Text>
            </TouchableOpacity>
            {calorieSaved && <Text style={styles.saveSuccess}>Calories saved!</Text>}
          </View>
        )}

        {/* Tips Card */}
        {selectedGoal && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>💡 Tips for Success</Text>
            <View style={styles.tipsContainer}>
              <Text style={styles.tipText}>• Track your daily calorie intake</Text>
              <Text style={styles.tipText}>• Stay consistent with your plan</Text>
              <Text style={styles.tipText}>• Combine with regular exercise</Text>
              <Text style={styles.tipText}>• Monitor your progress weekly</Text>
              <Text style={styles.tipText}>• Stay hydrated throughout the day</Text>
            </View>
          </View>
        )}

        {/* Dashboard Bottom Buttons */}
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Diet')}>
            <Text style={styles.bottomButtonText}>Explore Diet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Workouts')}>
            <Text style={styles.bottomButtonText}>Show Workout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
  },
  content: {
    padding: 24,
    paddingTop: 48,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardSubtitle: {
    color: '#bbb',
    fontSize: 14,
    marginBottom: 20,
  },
  userInfo: {
    gap: 8,
  },
  infoText: {
    color: '#bbb',
    fontSize: 16,
  },
  goalContainer: {
    gap: 12,
  },
  goalButton: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    gap: 12,
  },
  goalButtonActive: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
  },
  goalIcon: {
    fontSize: 24,
  },
  goalButtonText: {
    color: '#bbb',
    fontSize: 16,
    fontWeight: '600',
  },
  goalButtonTextActive: {
    color: '#fff',
  },
  resultContainer: {
    gap: 20,
  },
  resultItem: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  resultLabel: {
    color: '#bbb',
    fontSize: 14,
    marginBottom: 4,
  },
  resultValue: {
    color: '#27ae60',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultDescription: {
    color: '#888',
    fontSize: 12,
  },
  tipsContainer: {
    gap: 8,
  },
  tipText: {
    color: '#bbb',
    fontSize: 14,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    gap: 16,
  },
  bottomButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  saveButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  saveSuccess: {
    color: '#27ae60',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
}); 