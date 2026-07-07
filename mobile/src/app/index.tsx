import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  Animated,
  ImageBackground,
  Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { supabase } from '../../supabase';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const formTranslateY = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]),
      Animated.delay(500),
      Animated.timing(formTranslateY, { toValue: 0, duration: 800, useNativeDriver: true })
    ]).start();
  }, []);

  const showAlert = (title: string, message: string, onOk?: () => void) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n${message}`);
      if (onOk) onOk();
    } else {
      Alert.alert(title, message, [{ text: 'ตกลง', onPress: onOk }]);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('แจ้งเตือน', 'กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        showAlert('สำเร็จ!', 'เข้าสู่ระบบเรียบร้อยแล้ว', () => { router.replace('/welcome'); });
      }
    } catch (error: any) {
      showAlert('เกิดข้อผิดพลาด', 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* 🌟 Path ตรงนี้คือ ../../assets/aum.png ตามโครงสร้างที่คุณมี */}
      <ImageBackground
         source={require('../../assets/images/aum.png')}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <Animated.View style={[styles.logoContainer, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
          <Image 
            source={require('../../assets/images/App Logo.png')} 
            style={{ width: 150, height: 150, resizeMode: 'contain' }} 
          />
        </Animated.View>
        
        <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: formTranslateY }] }]}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            
            <View style={styles.dragIndicator} />
            <Text style={styles.sheetTitle}>Sign in</Text>

            <View style={styles.inputContainer}>
              <Feather name="user" size={18} color="#8e8e93" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="User name (หรืออีเมล)" placeholderTextColor="#aeaeb2" autoCapitalize="none" value={email} onChangeText={setEmail} />
            </View>

            <View style={styles.inputContainer}>
              <Feather name="lock" size={18} color="#8e8e93" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#aeaeb2" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Feather name={showPassword ? "eye" : "eye-off"} size={18} color="#8e8e93" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push('/forgot-password')}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.loginBtn, isLoading && { opacity: 0.7 }]} onPress={handleLogin} disabled={isLoading}>
              <Text style={styles.loginBtnText}>{isLoading ? 'กำลังโหลด...' : 'Sign in'}</Text>
            </TouchableOpacity>

            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Don't have an account yet? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.registerLink}>Sign up</Text>
              </TouchableOpacity>
            </View>

          </KeyboardAvoidingView>
        </Animated.View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgImage: { flex: 1, width: '100%' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(141, 182, 131, 0.4)' },
  logoContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 150 },
  bottomSheet: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#ffffff', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 40, elevation: 20 },
  dragIndicator: { width: 40, height: 5, backgroundColor: '#e5e5ea', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 24, fontWeight: 'bold', color: '#000', alignSelf: 'center', marginBottom: 24 },
  inputContainer: { width: '100%', height: 50, backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#e5e5ea', borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, height: '100%', fontSize: 15, color: '#000' },
  eyeIcon: { padding: 4 },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotPasswordText: { color: '#8e8e93', fontSize: 12 },
  loginBtn: { width: '100%', height: 52, backgroundColor: '#D4AF37', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  loginBtnText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  registerRow: { flexDirection: 'row', justifyContent: 'center' },
  registerText: { fontSize: 14, color: '#8e8e93' },
  registerLink: { fontSize: 14, color: '#D4AF37', fontWeight: 'bold' },
});