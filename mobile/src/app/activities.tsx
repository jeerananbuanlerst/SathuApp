import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, TouchableOpacity, Image, Pressable, Dimensions } from 'react-native';
import { supabase } from '../../supabase';
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function ActivitiesScreen() {
  const router = useRouter();
  const [activities, setActivities] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // สร้าง Array วันที่สำหรับปฏิทิน 7 วันล่วงหน้า
  const generateDates = () => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return {
        fullDate: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('th-TH', { weekday: 'short' }),
        dayNum: date.getDate(),
      };
    });
  };

  useEffect(() => {
    fetchActivities();
  }, [selectedDate]);

  const fetchActivities = async () => {
    const { data } = await supabase
      .from('activities')
      .select('*')
      .gte('start_time', `${selectedDate}T00:00:00`)
      .lte('start_time', `${selectedDate}T23:59:59`);
    setActivities(data || []);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={styles.headerTitle}>หน้ากิจกรรม</Text>
        
        {/* ปฏิทินที่เลือกวันได้จริง */}
        <FlatList
          horizontal
          data={generateDates()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarStrip}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.dayBox, selectedDate === item.fullDate && styles.activeDay]}
              onPress={() => setSelectedDate(item.fullDate)}
            >
              <Text style={[styles.dayText, selectedDate === item.fullDate && {color: '#fff'}]}>{item.dayName}</Text>
              <Text style={[styles.dateText, selectedDate === item.fullDate && {color: '#fff'}]}>{item.dayNum}</Text>
              {selectedDate === item.fullDate && <View style={styles.dot} />}
            </TouchableOpacity>
          )}
        />

        <FlatList
          data={activities}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image_url }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardTime}>{new Date(item.start_time).toLocaleDateString('th-TH')}</Text>
              </View>
            </View>
          )}
        />
      </SafeAreaView>

      {/* Bottom Nav ที่คุณต้องการ */}
      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem} onPress={() => router.push('/home')}><Feather name="home" size={24} color="#666" /><Text style={styles.navText}>หน้าหลัก</Text></Pressable>
        <Pressable style={styles.navItem}><FontAwesome5 name="running" size={24} color="#000" /><Text style={styles.navTextActive}>กิจกรรม</Text></Pressable>
        <Pressable style={styles.navItem} onPress={() => router.push('/merit')}><MaterialCommunityIcons name="hands-pray" size={24} color="#666" /><Text style={styles.navText}>ทำบุญ</Text></Pressable>
        <Pressable style={styles.navItem} onPress={() => router.push('/explore')}><Feather name="compass" size={24} color="#666" /><Text style={styles.navText}>สำรวจ</Text></Pressable>
        <Pressable style={styles.navItem} onPress={() => router.push('/profile')}><Feather name="user" size={24} color="#666" /><Text style={styles.navText}>โปรไฟล์</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBF8' }, // สีพื้นหลังนวลๆ
  headerTitle: { fontSize: 26, fontWeight: 'bold', marginHorizontal: 25, marginTop: 20, marginBottom: 15 },
  calendarStrip: { paddingHorizontal: 20, marginBottom: 20, height: 90 },
  dayBox: { width: 65, height: 80, backgroundColor: '#fff', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  activeDay: { backgroundColor: '#E08E8E' },
  dayText: { fontSize: 12, color: '#666' },
  dateText: { fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff', marginTop: 6 },
  listContent: { paddingHorizontal: 25, paddingBottom: 120 },
  card: { backgroundColor: '#fff', borderRadius: 25, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 5 },
  cardImage: { width: '100%', height: 180, borderTopLeftRadius: 25, borderTopRightRadius: 25 },
  cardContent: { padding: 20 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  cardTime: { fontSize: 13, color: '#888' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', paddingVertical: 15, position: 'absolute', bottom: 0, width: '100%', borderTopLeftRadius: 30, borderTopRightRadius: 30, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 20 },
  navItem: { alignItems: 'center' },
  navTextActive: { fontSize: 10, fontWeight: 'bold', color: '#000', marginTop: 4 },
  navText: { fontSize: 10, color: '#888', marginTop: 4 },
});