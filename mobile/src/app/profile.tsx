import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, SafeAreaView, ImageBackground, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../supabase';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data } = await supabase
          .from('profiles')
          .select('first_name, last_name, phone, birth_date, province, gender, address, avatar_url')
          .eq('id', authUser.id)
          .single();
        setUser(data);
      }
    };
    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/images/aum.png')} style={styles.bgImage}>
        <SafeAreaView style={styles.safeArea}>
          <Text style={styles.headerTitle}>หน้าโปรไฟล์</Text>
          
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <BlurView intensity={35} tint="dark" style={styles.glassCard}>
              <View style={styles.profileHeader}>
                <Image source={{ uri: user?.avatar_url || 'https://i.pravatar.cc/150' }} style={styles.avatar} />
                <TouchableOpacity style={styles.editBtn}>
                  <Feather name="edit-2" size={12} color="#fff" />
                  <Text style={styles.editText}> แก้ไข</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.name}>{user ? `${user.first_name} ${user.last_name}` : 'กำลังโหลด...'}</Text>
              
              <View style={styles.divider} />

              {[
                { label: 'วัน/เดือน/ปี เกิด', value: user?.birth_date || '-' },
                { label: 'เพศ', value: user?.gender || '-' },
                { label: 'ที่อยู่', value: user?.address || '-' },
                { label: 'จังหวัด', value: user?.province || '-' },
                { label: 'เบอร์โทรศัพท์', value: user?.phone || '-' },
              ].map((item, index) => (
                <View key={index} style={styles.infoRow}>
                  <Text style={styles.label}>{item.label}</Text>
                  <Text style={styles.value}>{item.value}</Text>
                </View>
              ))}
            </BlurView>

            <TouchableOpacity style={styles.settingBtn}>
              <Feather name="settings" size={20} color="#fff" />
              <Text style={styles.settingText}>ตั้งค่า (Setting)</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}><Feather name="home" size={24} color="#888" /><Text style={styles.navText}>หน้าหลัก</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/activities')}><FontAwesome5 name="running" size={24} color="#888" /><Text style={styles.navText}>กิจกรรม</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/merit')}><MaterialCommunityIcons name="hands-pray" size={24} color="#888" /><Text style={styles.navText}>ทำบุญ</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/explore')}><Feather name="compass" size={24} color="#888" /><Text style={styles.navText}>สำรวจ</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navItem}><Feather name="user" size={24} color="#000" /><Text style={styles.navTextActive}>โปรไฟล์</Text></TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgImage: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 120 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginLeft: 25, marginTop: 10 },
  glassCard: { borderRadius: 30, padding: 25, backgroundColor: 'rgba(255,255,255,0.15)', marginTop: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  profileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: '#fff' },
  editBtn: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  editText: { color: '#fff', fontSize: 12, marginLeft: 5 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 15 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 15 },
  infoRow: { marginBottom: 18 },
  label: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  value: { fontSize: 16, color: '#fff', marginTop: 4, fontWeight: '500' },
  settingBtn: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.3)', padding: 15, borderRadius: 20, alignItems: 'center', marginTop: 20, justifyContent: 'center' },
  settingText: { color: '#fff', marginLeft: 10, fontWeight: 'bold' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(255,255,255,0.95)', paddingVertical: 15, position: 'absolute', bottom: 0, width: '100%', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 10, color: '#888', marginTop: 4 },
  navTextActive: { fontSize: 10, fontWeight: 'bold', color: '#000', marginTop: 4 },
});