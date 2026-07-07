import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// คำที่จะให้แสดงสลับกันตามลำดับ
const WORDS = ['สวัสดี', 'สาธุ', 'ยินดีต้อนรับ'];

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const runAnimation = async () => {
      for (let i = 0; i < WORDS.length; i++) {
        setWordIndex(i);
        
        // 1. เฟดข้อความปรากฏขึ้น
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();

        // 2. ค้างข้อความไว้
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // 3. เฟดข้อความหายไป (ยกเว้นคำสุดท้าย)
        if (i < WORDS.length - 1) {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start();
          
          await new Promise((resolve) => setTimeout(resolve, 600));
        }
      }

      // เสร็จสิ้นการแสดงคำทั้งหมด เด้งไปหน้าหลัก
      setTimeout(() => {
        router.replace('/home');
      }, 1000);
    };

    runAnimation();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* 
        หมายเหตุ: ถ้าต้องการให้เห็นรูปพื้นหลังดอกบัวในหน้าโหลดนี้ 
        สามารถใส่ ImageBackground ครอบ View นี้ได้ครับ
      */}
      
      <View style={styles.contentContainer}>
        <Animated.Text style={[styles.welcomeText, { opacity: fadeAnim }]}>
          {WORDS[wordIndex]}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#8DB683' // สีเขียวโทนสงบ
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 50,
    color: '#FFFFFF',
    fontWeight: '400',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 10,
    fontFamily: Platform.OS === 'ios' ? 'Thonburi' : 'sans-serif',
  },
});