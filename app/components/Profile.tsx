import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Profile screen fetches and displays current logged-in user's data (Name, Age, Gender)
export default function Profile() {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [bmiCategory, setBmiCategory] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Calculate BMI when weight or height changes
  useEffect(() => {
    if (weight && height) {
      const w = parseFloat(weight);
      const hCm = parseFloat(height);
      if (!isNaN(w) && !isNaN(hCm) && hCm > 0) {
        const hM = hCm / 100;
        const bmiVal = w / (hM * hM);
        const rounded = bmiVal.toFixed(1);
        setBmi(rounded);
        // Determine BMI category
        if (bmiVal < 18.5) setBmiCategory('Underweight');
        else if (bmiVal < 25) setBmiCategory('Normal');
        else if (bmiVal < 30) setBmiCategory('Overweight');
        else setBmiCategory('Obese');
      } else {
        setBmi('');
        setBmiCategory('');
      }
    } else {
      setBmi('');
      setBmiCategory('');
    }
  }, [weight, height]);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // Retrieve UID saved after successful login
        const uid = await AsyncStorage.getItem('uid');
        if (!uid) return; // If UID not present, skip fetch

        // Fetch basic user data
        const userRes = await fetch(`https://fitapp-20272-default-rtdb.firebaseio.com/Users/${uid}.json`);
        const userData = await userRes.json();

        // Fetch weight/height from dedicated UserProfile node
        const profileRes = await fetch(`https://fitapp-20272-default-rtdb.firebaseio.com/UserProfile/${uid}.json`);
        const profileData = await profileRes.json();

        if (userData) {
          setFullName(userData.fullName || '');
          setAge(userData.age ? String(userData.age) : '');
          setGender(userData.gender || '');
        }

        if (profileData) {
          setWeight(profileData.weight ? String(profileData.weight) : '');
          setHeight(profileData.height ? String(profileData.height) : '');
          if (profileData.bmi) setBmi(String(profileData.bmi));
        }
      } catch (e) {
        console.error('Failed to load user profile', e);
      }
    };
    loadUserProfile();
  }, []);

  const handleSave = async () => {
    // Ensure weight and height are provided and valid numbers
    if (!weight || !height) {
      Alert.alert('Missing Data', 'Please enter both weight and height before saving.');
      return;
    }

    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      Alert.alert('Invalid Input', 'Weight and height must be positive numbers.');
      return;
    }

    try {
      const uid = await AsyncStorage.getItem('uid');
      if (!uid) throw new Error('User not logged in');

      const payload = {
        weight: w,
        height: h,
        bmi: bmi ? parseFloat(bmi) : null,
        updatedAt: new Date().toISOString(),
      };

      await fetch(`https://fitapp-20272-default-rtdb.firebaseio.com/UserProfile/${uid}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Show visual confirmation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save user profile', err);
      Alert.alert('Error', 'Failed to save profile. Please try again later.');
    }
  };

  const getBmiColor = () => {
    if (bmiCategory === 'Underweight') return '#3498db';
    if (bmiCategory === 'Normal') return '#27ae60';
    if (bmiCategory === 'Overweight') return '#f1c40f';
    return '#e74c3c';
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          
          <Text style={styles.userName}>{fullName || 'User Name'}</Text>
          <Text style={styles.userSubtitle}>Health Profile</Text>
        </View>

        {/* Personal Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="account-circle" size={24} color="#27ae60" />
            <Text style={styles.cardTitle}>Personal Information</Text>
          </View>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <MaterialCommunityIcons name="account" size={20} color="#27ae60" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{fullName || 'Not set'}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <MaterialCommunityIcons name="calendar" size={20} color="#27ae60" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>{age || 'Not set'} years</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <MaterialCommunityIcons name="gender-male-female" size={20} color="#27ae60" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Gender</Text>
                <Text style={styles.infoValue}>{gender || 'Not set'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Health Metrics Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="heart-pulse" size={24} color="#27ae60" />
            <Text style={styles.cardTitle}>Health Metrics</Text>
          </View>

          <View style={styles.metricsContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Weight (kg)</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="weight-kilogram" size={20} color="#27ae60" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="Enter weight"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Height (cm)</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="human-male-height" size={20} color="#27ae60" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={height}
                  onChangeText={setHeight}
                  placeholder="Enter height"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </View>

        {/* BMI Card */}
        {bmi && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="chart-line" size={24} color="#27ae60" />
              <Text style={styles.cardTitle}>BMI Analysis</Text>
            </View>

            <View style={styles.bmiContainer}>
              <View style={styles.bmiMainDisplay}>
                <Text style={styles.bmiValue}>{bmi}</Text>
                <Text style={[styles.bmiCategory, { color: getBmiColor() }]}>{bmiCategory}</Text>
              </View>

              <View style={styles.bmiMeterContainer}>
                <View style={styles.bmiMeter}>
                  <View
                    style={[
                      styles.bmiMeterFill,
                      {
                        width: `${Math.min(parseFloat(bmi), 40) / 40 * 100}%`,
                        backgroundColor: getBmiColor(),
                      },
                    ]}
                  />
                </View>
                <View style={styles.bmiScale}>
                  <Text style={styles.bmiScaleText}>18.5</Text>
                  <Text style={styles.bmiScaleText}>25</Text>
                  <Text style={styles.bmiScaleText}>30</Text>
                  <Text style={styles.bmiScaleText}>40+</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
          <MaterialCommunityIcons name="content-save" size={20} color="#fff" style={styles.saveButtonIcon} />
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>

        {/* Success Message */}
        {showSuccess && (
          <View style={styles.successContainer}>
            <MaterialCommunityIcons name="check-circle" size={20} color="#27ae60" />
            <Text style={styles.successText}>Profile updated successfully!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#27ae60',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#27ae60',
    borderWidth: 3,
    borderColor: '#181818',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  userSubtitle: {
    fontSize: 16,
    color: '#bbb',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#232323',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
    letterSpacing: 0.3,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e3a2e',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#bbb',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  metricsContainer: {
    gap: 20,
  },
  inputContainer: {
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 14,
    color: '#bbb',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    paddingVertical: 12,
    fontWeight: '500',
  },
  bmiContainer: {
    alignItems: 'center',
  },
  bmiMainDisplay: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#333',
  },
  bmiValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 8,
    letterSpacing: 1,
  },
  bmiCategory: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bmiMeterContainer: {
    width: '100%',
  },
  bmiMeter: {
    height: 12,
    backgroundColor: '#333',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  bmiMeterFill: {
    height: '100%',
    borderRadius: 6,
  },
  bmiScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  bmiScaleText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27ae60',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e3a2e',
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27ae60',
  },
  successText: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: '600',
    marginLeft: 8,
  },
});