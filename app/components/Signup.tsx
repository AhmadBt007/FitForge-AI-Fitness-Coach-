import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function Signup({ navigation }: any) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Animation values
  const containerScale = useSharedValue(0.9);
  const containerOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(-30);
  const formTranslateY = useSharedValue(50);
  const floatingElements = useSharedValue(0);
  const backgroundRotation = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const inputFocusScale = useSharedValue(1);
  const genderButtonScale = useSharedValue(1);
  const pulseAnimation = useSharedValue(1);
  const sparkleRotation = useSharedValue(0);
  const waveAnimation = useSharedValue(0);
  const morphAnimation = useSharedValue(0);

  useEffect(() => {
    // Initial entrance animations
    containerScale.value = withSpring(1, { damping: 15, stiffness: 100 });
    containerOpacity.value = withTiming(1, { duration: 1000 });
    titleTranslateY.value = withSpring(0, { damping: 12, stiffness: 80 });
    formTranslateY.value = withDelay(300, withSpring(0, { damping: 15, stiffness: 100 }));
    
    // Continuous floating animation
    floatingElements.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    // Background rotation
    backgroundRotation.value = withRepeat(
      withTiming(360, { duration: 30000, easing: Easing.linear }),
      -1,
      false
    );

    // Pulse animation
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    // Sparkle rotation
    sparkleRotation.value = withRepeat(
      withTiming(360, { duration: 10000, easing: Easing.linear }),
      -1,
      false
    );

    // Wave animation
    waveAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3500, easing: Easing.inOut(Easing.sin) }),
        withTiming(-1, { duration: 3500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    // Morph animation
    morphAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 5000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (age === '' || isNaN(Number(age))) {
      newErrors.age = 'Age is required';
    } else if (Number(age) < 13 || Number(age) > 100) {
      newErrors.age = 'Please enter a valid age (13-100)';
    }
    if (!gender) {
      newErrors.gender = 'Please select your gender';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      // Shake animation on error
      buttonScale.value = withSequence(
        withTiming(0.95, { duration: 100 }),
        withTiming(1.05, { duration: 100 }),
        withTiming(0.95, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
      return;
    }

    // Button press animation
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    setLoading(true);
    try {
      // Firebase Auth API call
      const res = await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDT4Fr-F8dei5T5DxAQC-UDmxxdcxhP9vQ',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        let msg = data.error?.message || 'Failed to sign up.';
        if (msg === 'EMAIL_EXISTS') {
          msg = 'Email already in use.';
          setErrors(prev => ({ ...prev, email: msg }));
        }
        throw new Error(msg);
      }
      // Save additional user details to Realtime Database
      try {
        await fetch(`https://fitapp-20272-default-rtdb.firebaseio.com/Users/${data.localId}.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: fullName.trim(),
            age: Number(age),
            gender: gender,
          }),
        });
      } catch (e) {
        console.warn('Failed saving user profile', e);
      }
      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('Login');
    } catch (err: any) {
      Alert.alert('Sign Up Error', err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenderSelection = (selectedGender: string) => {
    // Gender button animation
    genderButtonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1.05, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    setGender(selectedGender);
  };

  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
    opacity: containerOpacity.value,
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: formTranslateY.value }],
  }));

  const floatingStyle1 = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(floatingElements.value, [0, 1], [0, -25]) },
      { translateX: interpolate(floatingElements.value, [0, 1], [0, 12]) },
      { rotate: `${interpolate(floatingElements.value, [0, 1], [0, 8])}deg` },
      { scale: interpolate(floatingElements.value, [0, 1], [1, 1.15]) },
    ],
  }));

  const floatingStyle2 = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(floatingElements.value, [0, 1], [0, 20]) },
      { translateX: interpolate(floatingElements.value, [0, 1], [0, -10]) },
      { rotate: `${interpolate(floatingElements.value, [0, 1], [0, -6])}deg` },
      { scale: interpolate(floatingElements.value, [0, 1], [1, 0.85]) },
    ],
  }));

  const floatingStyle3 = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(floatingElements.value, [0, 1], [0, -15]) },
      { translateX: interpolate(floatingElements.value, [0, 1], [0, 15]) },
      { rotate: `${interpolate(floatingElements.value, [0, 1], [0, 10])}deg` },
    ],
  }));

  const floatingStyle4 = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(floatingElements.value, [0, 1], [0, 18]) },
      { translateX: interpolate(floatingElements.value, [0, 1], [0, -8]) },
      { rotate: `${interpolate(floatingElements.value, [0, 1], [0, -4])}deg` },
      { scale: interpolate(floatingElements.value, [0, 1], [1, 1.1]) },
    ],
  }));

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${backgroundRotation.value}deg` }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const inputAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: inputFocusScale.value }],
  }));

  const genderButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: genderButtonScale.value }],
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnimation.value }],
  }));

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));

  const waveAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(waveAnimation.value, [-1, 1], [-8, 8]) },
      { translateY: interpolate(waveAnimation.value, [-1, 1], [-4, 4]) },
    ],
  }));

  const morphAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleX: interpolate(morphAnimation.value, [0, 1], [1, 1.2]) },
      { scaleY: interpolate(morphAnimation.value, [0, 1], [1, 0.8]) },
      { rotate: `${interpolate(morphAnimation.value, [0, 1], [0, 15])}deg` },
    ],
  }));

  return (
    <View style={styles.container}>
      {/* Animated Background Elements */}
      <Animated.View style={[styles.backgroundElement1, backgroundAnimatedStyle]} />
      <Animated.View style={[styles.backgroundElement2, backgroundAnimatedStyle]} />
      <Animated.View style={[styles.backgroundElement3, morphAnimatedStyle]} />
      
      {/* Floating Decorative Elements */}
      <Animated.View style={[styles.floatingElement1, floatingStyle1]} />
      <Animated.View style={[styles.floatingElement2, floatingStyle2]} />
      <Animated.View style={[styles.floatingElement3, floatingStyle3]} />
      <Animated.View style={[styles.floatingElement4, floatingStyle4]} />
      
      {/* Sparkle Elements */}
      <Animated.View style={[styles.sparkle1, sparkleAnimatedStyle]} />
      <Animated.View style={[styles.sparkle2, sparkleAnimatedStyle]} />
      <Animated.View style={[styles.sparkle3, sparkleAnimatedStyle]} />
      <Animated.View style={[styles.sparkle4, sparkleAnimatedStyle]} />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, containerAnimatedStyle]}>
          <Animated.View style={titleAnimatedStyle}>
            <Animated.View style={pulseAnimatedStyle}>
              <Text style={styles.title}>Create Account</Text>
            </Animated.View>
            <Animated.View style={waveAnimatedStyle}>
              <Text style={styles.subtitle}>Join FitForge and start your fitness journey</Text>
            </Animated.View>
          </Animated.View>
          
          <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <Animated.View style={inputAnimatedStyle}>
                <TextInput
                  style={[styles.input, errors.fullName && styles.inputError]}
                  value={fullName}
                  onChangeText={setFullName}
                  onFocus={() => {
                    inputFocusScale.value = withSpring(1.02, { damping: 15 });
                  }}
                  onBlur={() => {
                    inputFocusScale.value = withSpring(1, { damping: 15 });
                  }}
                  placeholder="Enter your full name"
                  placeholderTextColor="#888"
                />
              </Animated.View>
              {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <Animated.View style={inputAnimatedStyle}>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => {
                    inputFocusScale.value = withSpring(1.02, { damping: 15 });
                  }}
                  onBlur={() => {
                    inputFocusScale.value = withSpring(1, { damping: 15 });
                  }}
                  placeholder="Enter your email"
                  placeholderTextColor="#888"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Animated.View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <Animated.View style={inputAnimatedStyle}>
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => {
                    inputFocusScale.value = withSpring(1.02, { damping: 15 });
                  }}
                  onBlur={() => {
                    inputFocusScale.value = withSpring(1, { damping: 15 });
                  }}
                  placeholder="Create a password"
                  placeholderTextColor="#888"
                  secureTextEntry
                />
              </Animated.View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <Animated.View style={inputAnimatedStyle}>
                <TextInput
                  style={[styles.input, errors.confirmPassword && styles.inputError]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onFocus={() => {
                    inputFocusScale.value = withSpring(1.02, { damping: 15 });
                  }}
                  onBlur={() => {
                    inputFocusScale.value = withSpring(1, { damping: 15 });
                  }}
                  placeholder="Confirm your password"
                  placeholderTextColor="#888"
                  secureTextEntry
                />
              </Animated.View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            {/* Age */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age</Text>
              <Animated.View style={inputAnimatedStyle}>
                <TextInput
                  style={[styles.input, errors.age && styles.inputError]}
                  value={age === '' ? '' : String(age)}
                  onChangeText={val => setAge(val === '' ? '' : Number(val))}
                  onFocus={() => {
                    inputFocusScale.value = withSpring(1.02, { damping: 15 });
                  }}
                  onBlur={() => {
                    inputFocusScale.value = withSpring(1, { damping: 15 });
                  }}
                  placeholder="Enter your age"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                />
              </Animated.View>
              {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
            </View>

            {/* Gender */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderContainer}>
                <Animated.View style={genderButtonAnimatedStyle}>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      gender === 'male' && styles.genderButtonActive
                    ]}
                    onPress={() => handleGenderSelection('male')}
                  >
                    <Text style={[
                      styles.genderButtonText,
                      gender === 'male' && styles.genderButtonTextActive
                    ]}>Male</Text>
                  </TouchableOpacity>
                </Animated.View>
                <Animated.View style={genderButtonAnimatedStyle}>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      gender === 'female' && styles.genderButtonActive
                    ]}
                    onPress={() => handleGenderSelection('female')}
                  >
                    <Text style={[
                      styles.genderButtonText,
                      gender === 'female' && styles.genderButtonTextActive
                    ]}>Female</Text>
                  </TouchableOpacity>
                </Animated.View>
                <Animated.View style={genderButtonAnimatedStyle}>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      gender === 'other' && styles.genderButtonActive
                    ]}
                    onPress={() => handleGenderSelection('other')}
                  >
                    <Text style={[
                      styles.genderButtonText,
                      gender === 'other' && styles.genderButtonTextActive
                    ]}>Other</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
              {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
            </View>

            {/* Signup Button */}
            <Animated.View style={buttonAnimatedStyle}>
              <TouchableOpacity
                style={styles.signupButton}
                onPress={handleSignup}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.signupButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
    overflow: 'hidden',
  },
  scrollContainer: {
    flex: 1,
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
    marginBottom: 32,
  },
  formContainer: {
    backgroundColor: '#232323',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#bbb',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    backgroundColor: '#222',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    width:100
  },
  genderButtonActive: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
  },
  genderButtonText: {
    color: '#bbb',
    fontSize: 16,
    fontWeight: '500',
  },
  genderButtonTextActive: {
    color: '#fff',
  },
  signupButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#bbb',
    fontSize: 16,
  },
  loginLink: {
    color: '#27ae60',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Animated background elements
  backgroundElement1: {
    position: 'absolute',
    top: -120,
    right: -120,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#27ae60',
    opacity: 0.04,
  },
  backgroundElement2: {
    position: 'absolute',
    bottom: -180,
    left: -180,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: '#27ae60',
    opacity: 0.03,
  },
  backgroundElement3: {
    position: 'absolute',
    top: height * 0.4,
    right: -80,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#27ae60',
    opacity: 0.05,
  },
  // Floating decorative elements
  floatingElement1: {
    position: 'absolute',
    top: height * 0.12,
    right: 35,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#27ae60',
    opacity: 0.35,
  },
  floatingElement2: {
    position: 'absolute',
    top: height * 0.28,
    left: 25,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#27ae60',
    opacity: 0.25,
  },
  floatingElement3: {
    position: 'absolute',
    top: height * 0.45,
    right: 55,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#27ae60',
    opacity: 0.3,
  },
  floatingElement4: {
    position: 'absolute',
    bottom: height * 0.15,
    left: 45,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#27ae60',
    opacity: 0.28,
  },
  // Sparkle elements
  sparkle1: {
    position: 'absolute',
    top: height * 0.18,
    left: width * 0.75,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#27ae60',
    opacity: 0.6,
  },
  sparkle2: {
    position: 'absolute',
    top: height * 0.35,
    left: width * 0.15,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#27ae60',
    opacity: 0.5,
  },
  sparkle3: {
    position: 'absolute',
    top: height * 0.55,
    left: width * 0.8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#27ae60',
    opacity: 0.4,
  },
  sparkle4: {
    position: 'absolute',
    bottom: height * 0.25,
    left: width * 0.2,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#27ae60',
    opacity: 0.45,
  },
});