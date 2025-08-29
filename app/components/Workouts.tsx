import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type DrawerNav = DrawerNavigationProp<any>;

const workouts = [
  // --- Gym Workouts ---
  {
    id: 101,
    category: 'gym',
    muscleGroup: 'Chest',
    title: 'Chest (Push)',
    exercises: [
      'Barbell Bench Press – 3–4 sets of 8–12',
      'Incline Dumbbell Press – 3–4 sets of 8–12',
      'Cable Crossover – 3–4 sets of 10–15',
      'Chest Dips – 3–4 sets of 8–12'
    ],
    duration: '45–60 minutes',
    calories: '350–500 kcal'
  },
  {
    id: 102,
    category: 'gym',
    muscleGroup: 'Back',
    title: 'Back (Pull)',
    exercises: [
      'Deadlifts – 3–4 sets of 8–12',
      'Lat Pulldown – 3–4 sets of 8–12',
      'Seated Cable Rows – 3–4 sets of 8–12',
      'Bent-Over Barbell Rows – 3–4 sets of 8–12'
    ],
    duration: '45–60 minutes',
    calories: '350–500 kcal'
  },
  {
    id: 103,
    category: 'gym',
    muscleGroup: 'Shoulders',
    title: 'Shoulders',
    exercises: [
      'Overhead Barbell Press – 3–4 sets of 10–15',
      'Dumbbell Lateral Raises – 3–4 sets of 10–15',
      'Rear Delt Fly – 3–4 sets of 10–15',
      'Arnold Press – 3–4 sets of 10–15'
    ],
    duration: '40–50 minutes',
    calories: '300–450 kcal'
  },
  {
    id: 104,
    category: 'gym',
    muscleGroup: 'Biceps',
    title: 'Biceps (Pull)',
    exercises: [
      'Barbell Curl – 3–4 sets of 10–15',
      'Dumbbell Hammer Curl – 3–4 sets of 10–15',
      'Preacher Curl – 3–4 sets of 10–15',
      'Cable Rope Curl – 3–4 sets of 10–15'
    ],
    duration: '35–45 minutes',
    calories: '250–400 kcal'
  },
  {
    id: 105,
    category: 'gym',
    muscleGroup: 'Triceps',
    title: 'Triceps (Push)',
    exercises: [
      'Close-Grip Bench Press – 3–4 sets of 10–15',
      'Tricep Rope Pushdown – 3–4 sets of 10–15',
      'Overhead Dumbbell Extension – 3–4 sets of 10–15',
      'Skull Crushers – 3–4 sets of 10–15'
    ],
    duration: '35–45 minutes',
    calories: '250–400 kcal'
  },
  {
    id: 106,
    category: 'gym',
    muscleGroup: 'Legs',
    title: 'Legs',
    exercises: [
      'Barbell Back Squat – 3–5 sets of 8–15',
      'Leg Press – 3–5 sets of 8–15',
      'Romanian Deadlift – 3–5 sets of 8–15',
      'Leg Curl – 3–5 sets of 8–15'
    ],
    duration: '50–70 minutes',
    calories: '400–600 kcal'
  },
  // --- Home Workouts (existing) ---
  {
    id: 1,
    title: "Quick Burn Full Body",
    exercises: ["Jumping Jacks – 3 min", "Push-ups – 3 sets of 12", "Bodyweight Squats – 3 sets of 15"],
    duration: "20 minutes",
    calories: "180–220 kcal"
  },
  {
    id: 2,
    title: "Strength & Core Blast",
    exercises: ["Burpees – 3 sets of 10", "Lunges – 3 sets of 12 (each leg)", "Plank – 3 × 45 sec hold"],
    duration: "25 minutes",
    calories: "220–270 kcal"
  },
  {
    id: 3,
    title: "HIIT Circuit (3 Rounds)",
    exercises: ["Jump Squats", "Mountain Climbers", "High Knees", "Push-ups", "Plank to Push-up"],
    duration: "30 minutes",
    calories: "300–350 kcal"
  },
  {
    id: 4,
    title: "Cardio Crusher Combo",
    exercises: ["Jump Rope – 5 min", "High Knees – 2 min", "Burpees – 3 sets of 12"],
    duration: "22 minutes",
    calories: "200–250 kcal"
  },
  {
    id: 5,
    title: "Core & Stability Builder",
    exercises: ["Plank – 1 min", "Russian Twists – 3 sets of 20", "Leg Raises – 3 sets of 15"],
    duration: "20 minutes",
    calories: "160–200 kcal"
  },
  {
    id: 6,
    title: "Fat Blaster Routine",
    exercises: ["Mountain Climbers – 2 min", "Squat Jumps – 3 sets of 15", "Push-up to Plank – 3 sets of 10"],
    duration: "25 minutes",
    calories: "230–280 kcal"
  },
  {
    id: 7,
    title: "Endurance Full Body Set",
    exercises: ["Jog in Place – 5 min", "Wall Sit – 3 × 45 sec", "Bicycle Crunch – 3 sets of 20"],
    duration: "28 minutes",
    calories: "240–290 kcal"
  },
  {
    id: 8,
    title: "Explosive Power Builder",
    exercises: ["Jump Lunges – 3 sets of 12", "Push-ups – 3 sets of 15", "Plank Jacks – 3 sets of 20"],
    duration: "30 minutes",
    calories: "270–330 kcal"
  },
  {
    id: 9,
    title: "Ultimate Full Body Finisher",
    exercises: ["Jump Squats", "Burpees", "Mountain Climbers", "Push-ups", "Plank – 1 min", "Lunges"],
    duration: "35 minutes",
    calories: "330–400 kcal"
  }
];

export default function Workouts() {
  const navigation = useNavigation<DrawerNav>();
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isRestPeriod, setIsRestPeriod] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const [restDuration, setRestDuration] = useState(60); // 60 seconds rest between sets
  const intervalRef = useRef<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'gym' | 'home'>('gym');
  const [searchTerm, setSearchTerm] = useState('');
  const [customWorkouts, setCustomWorkouts] = useState<any[]>([]);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [burnedCalories, setBurnedCalories] = useState<number | null>(null);

  useEffect(() => {
    const loadCustom = async () => {
      try {
        const uid = await AsyncStorage.getItem('uid');
        if (!uid) return;
        const res = await fetch(`https://fitapp-20272-default-rtdb.firebaseio.com/CustomWorkouts/${uid}.json`);
        const data = await res.json();
        if (data) {
          const list = Object.values(data) as any[];
          setCustomWorkouts(list);
        }
      } catch (e) {
        console.warn('Failed to load custom workouts', e);
      }
    };
    loadCustom();
  }, []);

  // Merge built-in and custom
  const allWorkouts = [...workouts, ...customWorkouts];

  // Filter workouts based on selected category and search term
  const displayedWorkouts = allWorkouts.filter(
    w =>
      (w.category ?? 'home') === selectedCategory &&
      (searchTerm.trim() === '' ||
        (w.muscleGroup ?? '').toLowerCase().includes(searchTerm.trim().toLowerCase()))
  );


  useEffect(() => {
    if (isTimerRunning) {
      intervalRef.current = setInterval(() => {
        if (isRestPeriod) {
          setRestTimeRemaining(prev => {
            if (prev <= 1) {
              setIsRestPeriod(false);
              return 0;
            }
            return prev - 1;
          });
        } else {
          setTimeElapsed(prev => prev + 1);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTimerRunning, isRestPeriod]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleWorkoutSelect = (workout: any) => {
    setSelectedWorkout(workout);
    setTimeElapsed(0);
    setCurrentExerciseIndex(0);
    setIsTimerRunning(false);
    setIsRestPeriod(false);
    setRestTimeRemaining(0);
  };

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeElapsed(0);
    setCurrentExerciseIndex(0);
    setIsRestPeriod(false);
    setRestTimeRemaining(0);
  };

  const startRestPeriod = () => {
    setIsRestPeriod(true);
    setRestTimeRemaining(restDuration);
    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }
  };

  const skipRest = () => {
    setIsRestPeriod(false);
    setRestTimeRemaining(0);
  };

  const nextExercise = () => {
    if (selectedWorkout && currentExerciseIndex < selectedWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      startRestPeriod();
    }
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  const finishWorkout = async () => {
    if (!selectedWorkout) return;

    // Get calories value (use midpoint if range like "200–250 kcal")
    const calStr: string = selectedWorkout.calories;
    let caloriesNum = 0;
    const match = calStr.match(/(\d+)/g);
    if (match) {
      const nums = match.map((n: string) => parseInt(n, 10));
      caloriesNum = nums.length === 1 ? nums[0] : Math.round((nums[0] + nums[1]) / 2);
    }

    setBurnedCalories(caloriesNum);
    setShowFinishModal(true);

    // Persist to Firebase burntCalories list (append)
    try {
      const uid = await AsyncStorage.getItem('uid');
      if (uid) {
        const resp = await fetch(`https://fitapp-20272-default-rtdb.firebaseio.com/UserProfile/${uid}/burntCalories.json`);
        const existing = await resp.json();
        const total = (existing || 0) + caloriesNum;
        await fetch(`https://fitapp-20272-default-rtdb.firebaseio.com/UserProfile/${uid}/burntCalories.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(total),
        });
      }
    } catch (e) {
      console.warn('Failed to save burnt calories', e);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={{alignItems:'flex-end', marginBottom:8}}>
          <TouchableOpacity onPress={() => navigation.navigate('CreateWorkout' as never)}>
            <Text style={{color:'#27ae60',fontSize:16}}>➕ Create Workout</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Workout Routines</Text>

        {/* Finish Modal */}
        <Modal
          visible={showFinishModal}
          transparent
          animationType="slide"
          onRequestClose={() => {
            setShowFinishModal(false);
            setSelectedWorkout(null);
            resetTimer();
          }}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>🎉 Congratulations!</Text>
              <Text style={styles.modalText}>You burned approximately {burnedCalories} kcal.</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowFinishModal(false);
                  setSelectedWorkout(null);
                  resetTimer();
                }}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Text style={styles.subtitle}>Choose your workout and get started!</Text>

        {/* Category Toggle */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.categoryButton, selectedCategory === 'gym' && styles.categoryButtonActive]}
            onPress={() => setSelectedCategory('gym')}
          >
            <Text style={styles.categoryButtonText}>Gym Workout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.categoryButton, selectedCategory === 'home' && styles.categoryButtonActive]}
            onPress={() => setSelectedCategory('home')}
          >
            <Text style={styles.categoryButtonText}>Home Workout</Text>
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search body part (e.g., Legs)"
          placeholderTextColor="#777"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        {/* Timer Section - Only show when workout is selected */}
        {selectedWorkout && (
          <View style={styles.timerCard}>
            <Text style={styles.timerTitle}>{selectedWorkout.title}</Text>
            <Text style={styles.timerDisplay}>
              {isRestPeriod ? formatTime(restTimeRemaining) : formatTime(timeElapsed)}
            </Text>
            <Text style={styles.timerLabel}>
              {isRestPeriod ? 'Rest Time' : 'Workout Time'}
            </Text>

            <View style={styles.timerControls}>
              <View style={styles.timerRow}>
                {!isTimerRunning ? (
                  <TouchableOpacity style={styles.timerButton} onPress={startTimer}>
                    <Text style={styles.timerButtonText}>Start</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.timerButton} onPress={pauseTimer}>
                    <Text style={styles.timerButtonText}>Pause</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={[styles.timerButton, styles.resetButton]} onPress={resetTimer}>
                  <Text style={styles.timerButtonText}>Reset</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.timerRow}>
                {isRestPeriod && (
                  <TouchableOpacity style={[styles.timerButton, styles.skipButton]} onPress={skipRest}>
                    <Text style={styles.timerButtonText}>Skip Rest</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity 
                  style={[styles.timerButton, styles.finishButton, isRestPeriod && styles.timerButtonFull]} 
                  onPress={finishWorkout}
                >
                  <Text style={styles.timerButtonText}>Finish</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Current Exercise Display */}
            <View style={styles.exerciseProgress}>
              {isRestPeriod ? (
                <>
                  <Text style={styles.exerciseProgressTitle}>
                    Rest Period
                  </Text>
                  <Text style={styles.currentExercise}>
                    Take a break before the next exercise
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.exerciseProgressTitle}>
                    Exercise {currentExerciseIndex + 1} of {selectedWorkout.exercises.length}
                  </Text>
                  <Text style={styles.currentExercise}>
                    {selectedWorkout.exercises[currentExerciseIndex]}
                  </Text>
                </>
              )}

              <View style={styles.exerciseNavigation}>
                <TouchableOpacity
                  style={[styles.navButton, currentExerciseIndex === 0 && styles.disabledButton]}
                  onPress={previousExercise}
                  disabled={currentExerciseIndex === 0}
                >
                  <Text style={styles.navButtonText}>← Previous</Text>
                </TouchableOpacity>

                {!isRestPeriod && (
                  <TouchableOpacity
                    style={[styles.navButton, currentExerciseIndex === selectedWorkout.exercises.length - 1 && styles.disabledButton]}
                    onPress={nextExercise}
                    disabled={currentExerciseIndex === selectedWorkout.exercises.length - 1}
                  >
                    <Text style={styles.navButtonText}>Next →</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <TouchableOpacity style={styles.backButton} onPress={() => setSelectedWorkout(null)}>
              <Text style={styles.backButtonText}>← Back to Workouts</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Workout List - Only show when no workout is selected */}
        {!selectedWorkout && displayedWorkouts.map((workout: any) => (
          <TouchableOpacity
            key={workout.id}
            style={styles.workoutCard}
            onPress={() => handleWorkoutSelect(workout)}
          >
            <View style={styles.workoutHeader}>
              <Text style={styles.workoutTitle}>{workout.title}</Text>
              <View style={styles.workoutMeta}>
                <Text style={styles.workoutDuration}>⏱️ {workout.duration}</Text>
                <Text style={styles.workoutCalories}>🔥 {workout.calories}</Text>
              </View>
            </View>

            <View style={styles.exercisesContainer}>
              <Text style={styles.exercisesTitle}>Exercises:</Text>
              {workout.exercises.map((exercise: string, index: number) => (
                <Text key={index} style={styles.exerciseItem}>
                  • {exercise}
                </Text>
              ))}
            </View>

            <View style={styles.startButton}>
              <Text style={styles.startButtonText}>Start Workout</Text>
            </View>
          </TouchableOpacity>
        ))}
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
    marginBottom: 8,
  },
  subtitle: {
    color: '#bbb',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  workoutCard: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  workoutHeader: {
    marginBottom: 16,
  },
  workoutTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  workoutMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  workoutDuration: {
    color: '#27ae60',
    fontSize: 14,
    fontWeight: '500',
  },
  workoutCalories: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: '500',
  },
  exercisesContainer: {
    marginBottom: 16,
  },
  exercisesTitle: {
    color: '#bbb',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  exerciseItem: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 4,
    paddingLeft: 8,
  },
  startButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerCard: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  timerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  timerDisplay: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  timerLabel: {
    color: '#27ae60',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  timerControls: {
    marginBottom: 24,
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timerButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 0.48,
    alignItems: 'center',
    
  },
  timerButtonFull: {
    flex: 1,
  },
  timerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#e74c3c',
  },
  finishButton: {
    backgroundColor: '#e74c3c',
    
  },
  skipButton: {
    backgroundColor: '#f39c12',
  },
  exerciseProgress: {
    marginBottom: 24,
  },
  exerciseProgressTitle: {
    color: '#bbb',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  currentExercise: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  exerciseNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 0.48,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  backButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  /* --- New Styles --- */
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: '#555',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  categoryButtonActive: {
    backgroundColor: '#27ae60',
  },
  categoryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchInput: {
    backgroundColor: '#232323',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#fff',
    marginBottom: 24,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#232323',
    width: '80%',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#27ae60',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});