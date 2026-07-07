import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, FontAwesome5, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* ส่วนเนื้อหาหลัก */}
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <MaterialCommunityIcons name="temple-buddhist" size={40} color="#000" />
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconBtn}>
                <Feather name="mail" size={20} color="#000" />
                <View style={styles.badge}><Text style={styles.badgeText}>99+</Text></View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileBtn}>
                <Feather name="user" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.locationTitle}>วัดศาลาลอย <Text style={styles.locationSub}>(นครราชสีมา)</Text></Text>

          {/* Greeting Card */}
          <View style={styles.greetingCard}>
            <View style={styles.greetingTextContainer}>
              <Text style={styles.sathuText}>สาธุ</Text>
              <Text style={styles.morningText}>สวัสดีตอนเช้า</Text>
              <Text style={styles.holyDayText}>พรุ่งนี้เป็นวันพระ</Text>
              <Text style={styles.holyDaySub}>วันหยุดอาสาฬหบูชา ขึ้น 15 ค่ำ เดือน 8</Text>
            </View>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1601955673967-dfc6f3764834?q=80&w=300' }} style={styles.lotusImage} />
          </View>

          {/* Stats Section */}
          <Text style={styles.sectionTitle}>บุญสะสม</Text>
          <View style={styles.statsRow}>
             <View style={styles.statBox}><Text style={styles.statLabel}>บริจาค 41 ครั้ง</Text><Text style={styles.statSub}>คะแนน: 123</Text></View>
             <View style={styles.statBox}><Text style={styles.statLabel}>เข้าวัด 2 ครั้ง</Text><Text style={styles.statSub}>คะแนน: 6</Text></View>
             <View style={styles.statBox}>
                <Text style={styles.statLabel}>คะแนนทั้งหมด: 129</Text>
                <View style={styles.stars}><FontAwesome name="star" size={14} color="#000" /><FontAwesome name="star-o" size={14} color="#000" /></View>
                <Text style={styles.redeemText}>แลกของรางวัล {">"}</Text>
             </View>
          </View>

          <Text style={styles.sectionTitle}>ชุมชน</Text>
          <View style={styles.mapContainer}>
             <View style={styles.mapInner}><Text style={styles.mapText}>แผนที่พื้นที่วัด (Community Map)</Text></View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* เมนูด้านล่าง (ย้ายออกมานอก SafeAreaView และเพิ่ม zIndex) */}
      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem} onPress={() => router.push('/home')}><Feather name="home" size={24} color="#000" /><Text style={styles.navTextActive}>หน้าหลัก</Text></Pressable>
        <Pressable style={styles.navItem} onPress={() => router.push('/activities')}><FontAwesome5 name="running" size={24} color="#666" /><Text style={styles.navText}>กิจกรรม</Text></Pressable>
        <Pressable style={styles.navItem} onPress={() => router.push('/merit')}><MaterialCommunityIcons name="hands-pray" size={24} color="#666" /><Text style={styles.navText}>ทำบุญ</Text></Pressable>
        <Pressable style={styles.navItem} onPress={() => router.push('/map')}><Feather name="compass" size={24} color="#666" /><Text style={styles.navText}>สำรวจ</Text></Pressable>
        <Pressable style={styles.navItem} onPress={() => router.push('/profile')}><Feather name="user" size={24} color="#666" /><Text style={styles.navText}>โปรไฟล์</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF2F0' },
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  // ... (Header และส่วนอื่นๆ ของคุณ) ...
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 20 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconBtn: { width: 45, height: 45, backgroundColor: '#fff', borderRadius: 22, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  badge: { position: 'absolute', top: -2, right: -2, backgroundColor: 'red', borderRadius: 10, paddingHorizontal: 5 },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  profileBtn: { width: 45, height: 45, backgroundColor: '#666', borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  locationTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  locationSub: { fontSize: 14, color: '#666' },
  greetingCard: { height: 140, backgroundColor: '#F0F5F1', borderRadius: 25, padding: 20, flexDirection: 'row', marginBottom: 20, overflow: 'hidden' },
  greetingTextContainer: { flex: 1 },
  sathuText: { fontSize: 22, fontWeight: 'bold' },
  morningText: { fontSize: 12, color: '#666', marginBottom: 10 },
  holyDayText: { fontSize: 14, fontWeight: 'bold' },
  holyDaySub: { fontSize: 11, color: '#777' },
  lotusImage: { width: 110, height: 110, resizeMode: 'contain', opacity: 0.8 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statBox: { width: '31%', height: 110, backgroundColor: '#fff', borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 2, padding: 5 },
  statLabel: { fontSize: 11, fontWeight: 'bold', textAlign: 'center' },
  statSub: { fontSize: 10, color: '#666', marginTop: 5 },
  stars: { flexDirection: 'row', marginVertical: 5 },
  redeemText: { fontSize: 9, color: '#666' },
  mapContainer: { width: '100%', height: 260, backgroundColor: '#fff', borderRadius: 25, padding: 10, elevation: 3 },
  mapInner: { flex: 1, backgroundColor: '#F9F9F9', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  mapText: { color: '#bbb' },
  // ส่วนสำคัญที่สุดสำหรับ Bottom Nav
  bottomNav: { 
    flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', 
    paddingVertical: 20, borderTopLeftRadius: 35, borderTopRightRadius: 35, 
    position: 'absolute', bottom: 0, width: '100%', elevation: 15,
    zIndex: 999 // เพิ่ม zIndex ให้สูงที่สุด
  },
  navItem: { alignItems: 'center' },
  navTextActive: { fontSize: 10, fontWeight: 'bold', marginTop: 5 },
  navText: { fontSize: 10, color: '#888', marginTop: 5 },
});