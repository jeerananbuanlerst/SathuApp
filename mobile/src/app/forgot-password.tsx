import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../supabase';
import { useRouter } from 'expo-router';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!email) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกอีเมลก่อนครับ');
      return;
    }
    setLoading(true);
    // ส่งลิงก์รีเซ็ตไปที่อีเมล โดยระบุว่าพอกดแล้วให้เปิดแอปที่เส้นทาง mobile://reset-password
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'mobile://reset-password',
    });

    if (error) {
      Alert.alert('ผิดพลาด', error.message);
    } else {
      Alert.alert('สำเร็จ', 'ตรวจสอบอีเมลของคุณเพื่อตั้งรหัสผ่านใหม่');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ลืมรหัสผ่าน</Text>
      <Text style={styles.subtitle}>กรอกอีเมลของคุณเพื่อรับลิงก์รีเซ็ต</Text>
      <TextInput 
        style={styles.input} 
        placeholder="example@gmail.com" 
        value={email} 
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>ถัดไป →</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 12, marginBottom: 20, fontSize: 16 },
  button: { backgroundColor: '#ffb6c1', padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});