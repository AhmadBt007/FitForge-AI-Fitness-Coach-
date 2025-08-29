import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';

// Cross-platform alert helper
const showAlert = (title: string, message?: string) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}${message ? `\n${message}` : ''}`);
  } else {
    Alert.alert(title, message);
  }
};

const { width, height } = Dimensions.get('window');

export default function Login({ navigation, onLogin }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  // Animation values
  const containerScale = useSharedValue(0.8);
  const containerOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(-50);
  const formTranslateY = useSharedValue(100);
  const floatingElements = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const inputFocusScale = useSharedValue(1);
  const backgroundRotation = useSharedValue(0);

  useEffect(() => {
    // Initial entrance animations
    containerScale.value = withSpring(1, { damping: 15, stiffness: 100 });
    containerOpacity.value = withTiming(1, { duration: 800 });
    titleTranslateY.value = withSpring(0, { damping: 12, stiffness: 80 });
    formTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });

    // Continuous floating animation
    floatingElements.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    // Background rotation
    backgroundRotation.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
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

    // ✅ Quick login bypass for given credentials
    if (email.trim().toLowerCase() === 'ahmad@gmail.com' && password === '111111') {
      await AsyncStorage.setItem('uid', 'test-user-id');
      onLogin && onLogin();
      return;
    }

    // Button press animation
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    setLoading(true);
    try {
      const res = await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDT4Fr-F8dei5T5DxAQC-UDmxxdcxhP9vQ',
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
        const code = data.error?.message;
        if (code === 'EMAIL_NOT_FOUND' || code === 'INVALID_EMAIL' || code === 'USER_DISABLED' || code === 'INVALID_LOGIN_CREDENTIALS') {
          showAlert('Email not registered', 'No account exists with that email.');
        } else if (code === 'INVALID_PASSWORD') {
          showAlert('Incorrect password', 'The password you entered is not correct.');
        } else {
          showAlert('Error', 'Wrong credential entered');
        }
        setLoading(false);
        return;
      }
      setLoading(false);
      await AsyncStorage.setItem('uid', data.localId);
      onLogin && onLogin();
    } catch (err) {
      setLoading(false);
      showAlert('Error', 'Unable to sign in, please try again.');
    }
  };

  const sendResetEmail = async () => {
    if (!resetEmail.trim()) {
      showAlert('Input required', 'Please enter your account email first.');
      return;
    }
    try {
      setForgotLoading(true);
      const res = await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDT4Fr-F8dei5T5DxAQC-UDmxxdcxhP9vQ',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestType: 'PASSWORD_RESET', email: resetEmail }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        let msg = data.error?.message || 'Failed to send reset email.';
        showAlert('Error', msg.replace(/_/g, ' '));
      } else {
        showAlert('Email sent', 'Please check your inbox for the password-reset link.');
      }
    } catch (e) {
      showAlert('Error', 'Failed to send reset email. Please try again later.');
    } finally {
      setForgotLoading(false);
    }
  };

  const openResetModal = () => {
    setResetEmail(email);
    setResetModalVisible(true);
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
      { translateY: interpolate(floatingElements.value, [0, 1], [0, -20]) },
      { translateX: interpolate(floatingElements.value, [0, 1], [0, 10]) },
      { rotate: `${interpolate(floatingElements.value, [0, 1], [0, 5])}deg` },
    ],
  }));

  const floatingStyle2 = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(floatingElements.value, [0, 1], [0, 15]) },
      { translateX: interpolate(floatingElements.value, [0, 1], [0, -8]) },
      { rotate: `${interpolate(floatingElements.value, [0, 1], [0, -3])}deg` },
    ],
  }));

  const floatingStyle3 = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(floatingElements.value, [0, 1], [0, -10]) },
      { translateX: interpolate(floatingElements.value, [0, 1], [0, 12]) },
      { rotate: `${interpolate(floatingElements.value, [0, 1], [0, 8])}deg` },
    ],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${backgroundRotation.value}deg` }],
  }));

  const inputAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: inputFocusScale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Animated Background Elements */}
      <Animated.View style={[styles.backgroundElement1, backgroundAnimatedStyle]} />
      <Animated.View style={[styles.backgroundElement2, backgroundAnimatedStyle]} />

      {/* Floating Decorative Elements */}
      <Animated.View style={[styles.floatingElement1, floatingStyle1]} />
      <Animated.View style={[styles.floatingElement2, floatingStyle2]} />
      <Animated.View style={[styles.floatingElement3, floatingStyle3]} />

      <Animated.View style={[styles.content, containerAnimatedStyle]}>
        <Animated.View style={titleAnimatedStyle}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue your fitness journey</Text>
        </Animated.View>

        <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <Animated.View style={inputAnimatedStyle}>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
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
                onChangeText={(value) => {
                  setPassword(value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
                onFocus={() => {
                  inputFocusScale.value = withSpring(1.02, { damping: 15 });
                }}
                onBlur={() => {
                  inputFocusScale.value = withSpring(1, { damping: 15 });
                }}
                placeholder="Enter your password"
                placeholderTextColor="#888"
                secureTextEntry
              />
            </Animated.View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/* Login Button */}
          <Animated.View style={buttonAnimatedStyle}>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Forgot Password Link */}
          <View style={styles.forgotContainer}>
            <TouchableOpacity onPress={openResetModal}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Reset Modal */}
          <Modal transparent animationType="fade" visible={resetModalVisible} onRequestClose={() => setResetModalVisible(false)}>
            <View style={styles.modalBackdrop}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Reset Password</Text>
                <TextInput
                  style={[styles.input, { marginBottom: 20 }]}
                  placeholder="Enter your email"
                  placeholderTextColor="#888"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={resetEmail}
                  onChangeText={setResetEmail}
                />
                <TouchableOpacity style={styles.loginButton} onPress={sendResetEmail} disabled={forgotLoading}>
                  {forgotLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Send Email</Text>}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setResetModalVisible(false)}>
                  <Text style={styles.forgotText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Signup Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181818', overflow: 'hidden' },
  content: { flex: 1, padding: 24, paddingTop: 48, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { color: '#bbb', fontSize: 16, textAlign: 'center', marginBottom: 32 },
  formContainer: { backgroundColor: '#232323', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 },
  inputGroup: { marginBottom: 20 },
  label: { color: '#bbb', fontSize: 16, marginBottom: 8, fontWeight: '500' },
  input: { backgroundColor: '#222', color: '#fff', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, borderWidth: 1, borderColor: '#333' },
  inputError: { borderColor: '#e74c3c' },
  errorText: { color: '#e74c3c', fontSize: 14, marginTop: 4 },
  loginButton: { backgroundColor: '#27ae60', borderRadius: 8, paddingVertical: 16, alignItems: 'center', marginBottom: 24 },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  signupContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  signupText: { color: '#bbb', fontSize: 16 },
  forgotContainer: { alignItems: 'center', marginBottom: 8 },
  forgotText: { color: '#27ae60', fontSize: 16, fontWeight: 'bold' },
  signupLink: { color: '#27ae60', fontSize: 16, fontWeight: 'bold' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#232323', borderRadius: 12, padding: 24, alignItems: 'center' },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  backgroundElement1: { position: 'absolute', top: -100, right: -100, width: 200, height: 200, borderRadius: 100, backgroundColor: '#27ae60', opacity: 0.05 },
  backgroundElement2: { position: 'absolute', bottom: -150, left: -150, width: 300, height: 300, borderRadius: 150, backgroundColor: '#27ae60', opacity: 0.03 },
  floatingElement1: { position: 'absolute', top: height * 0.15, right: 30, width: 20, height: 20, borderRadius: 10, backgroundColor: '#27ae60', opacity: 0.3 },
  floatingElement2: { position: 'absolute', top: height * 0.25, left: 40, width: 15, height: 15, borderRadius: 7.5, backgroundColor: '#27ae60', opacity: 0.2 },
  floatingElement3: { position: 'absolute', bottom: height * 0.2, right: 50, width: 25, height: 25, borderRadius: 12.5, backgroundColor: '#27ae60', opacity: 0.25 },
});
