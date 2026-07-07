import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';

import { supabase } from '../../supabase';

const { width } = Dimensions.get('window');

export default function RegisterScreen() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  // State Step 1
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAccepted, setIsAccepted] = useState(false);

  // State Step 2
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [nationality, setNationality] = useState('');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  // State สำหรับควบคุม Dropdown แบบ Modal
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownType, setDropdownType] = useState(''); 
  const [dropdownOptions, setDropdownOptions] = useState<string[]>([]);

  // ข้อมูลตัวเลือก Dropdown
  const genderOptions = ['ชาย', 'หญิง', 'ไม่ระบุ'];
  const nationalityOptions = ['ไทย', 'ต่างชาติ'];
  const provinceOptions = ['กรุงเทพมหานคร', 'สกลนคร', 'นครราชสีมา', 'เชียงใหม่', 'ภูเก็ต', 'อื่นๆ'];

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const isPasswordValid = (pw: string) => {
    const hasUpperCase = /[A-Z]/.test(pw);
    const hasLowerCase = /[a-z]/.test(pw);
    const hasNumbers = /\d/.test(pw);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pw);
    return pw.length >= 8 && hasUpperCase && hasLowerCase && hasNumbers && hasSpecial;
  };

  const handleNextStep = () => {
    if (!username || !email || !phone || !password || !confirmPassword) {
      showAlert('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }
    if (password !== confirmPassword) {
      showAlert('แจ้งเตือน', 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }
    if (!isPasswordValid(password)) {
      showAlert('แจ้งเตือน', 'รหัสผ่านไม่ตรงตามเงื่อนไขที่กำหนด');
      return;
    }
    if (!isAccepted) {
      showAlert('แจ้งเตือน', 'กรุณายอมรับข้อกำหนดการใช้งาน');
      return;
    }
    setStep(2);
  };

  const formatBirthDateForDB = (dateStr: string) => {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      let year = parseInt(parts[2], 10);
      if (year > 2400) year -= 543;
      return `${year}-${month}-${day}`;
    }
    return null;
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const formattedDate = formatBirthDateForDB(birthDate);
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              username: username,
              phone: phone,
              birth_date: formattedDate,
              gender: gender || null,
              nationality: nationality || null,
              address: address || null,
              province: province || null,
            }
          ]);

        if (profileError) throw profileError;

        showAlert('สำเร็จ!', 'สร้างบัญชีเรียบร้อยแล้ว');
       router.replace('/welcome');
      }
    } catch (error: any) {
      console.error(error);
      showAlert('เกิดข้อผิดพลาด', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // เปิด-ปิดหน้าต่างเลือก Dropdown
  const openDropdown = (type: string, options: string[]) => {
    setDropdownType(type);
    setDropdownOptions(options);
    setDropdownVisible(true);
  };

  const selectOption = (value: string) => {
    if (dropdownType === 'gender') setGender(value);
    if (dropdownType === 'nationality') setNationality(value);
    if (dropdownType === 'province') setProvince(value);
    setDropdownVisible(false);
  };

  // ปุ่มกดกลับ (หน้าแรก -> ย้อนกลับไป Login, หน้าสอง -> ย้อนกลับไปหน้าแรก)
  const handleGoBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push('/');
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ImageBackground
        source={{ uri: '/Users/aumaum/Desktop/SathuApp/mobile/assets/images/หน้าหลังสมัครบช..png' }} 
        style={styles.headerBg}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <Text style={styles.topHeaderText}>หน้าล็อกอิน</Text>
        </SafeAreaView>
      </ImageBackground>

      <View style={styles.bottomSheet}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            
            <View style={styles.cardHeaderRow}>
              <TouchableOpacity style={styles.backButtonInside} onPress={handleGoBack}>
                <FontAwesome5 name="undo" size={20} color="#4a4a4a" />
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>สร้างบัญชี</Text>
              <View style={{ width: 40 }} />
            </View>

            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFill, { width: step === 1 ? '50%' : '100%' }]} />
            </View>

            {/* STEP 1 */}
            {step === 1 && (
              <View style={{ width: '100%' }}>
                <Text style={styles.inputLabel}>ชื่อผู้ใช้*</Text>
                <TextInput style={styles.inputOutline} placeholder="Sarah Adam" placeholderTextColor="#ccc" value={username} onChangeText={setUsername} />

                <Text style={styles.inputLabel}>ที่อยู่อีเมล*</Text>
                <TextInput style={styles.inputOutline} placeholder="example@gmail.com" placeholderTextColor="#ccc" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />

                <Text style={styles.inputLabel}>หมายเลขโทรศัพท์*</Text>
                <TextInput style={styles.inputOutline} placeholder="0121211212" placeholderTextColor="#ccc" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

                <View style={styles.passwordBoxContainer}>
                  <Text style={styles.inputLabel}>รหัสผ่าน*</Text>
                  <TextInput style={styles.inputOutline} placeholder="AAbb0123456789@" placeholderTextColor="#ccc" secureTextEntry value={password} onChangeText={setPassword} />

                  <Text style={styles.inputLabel}>ยืนยันรหัสผ่าน*</Text>
                  <TextInput style={styles.inputOutline} placeholder="AAbb0123456789@" placeholderTextColor="#ccc" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

                  <View style={styles.rulesContainer}>
                    <Text style={styles.ruleTitle}>รหัสผ่านต้องมี</Text>
                    <Text style={styles.ruleItem}>• อย่างน้อย 8 ตัวอักษร</Text>
                    <Text style={styles.ruleItem}>• ตัวอักษรภาษาอังกฤษพิมพ์ใหญ่ (A-Z) อย่างน้อย 1 ตัว</Text>
                    <Text style={styles.ruleItem}>• ตัวอักษรภาษาอังกฤษพิมพ์เล็ก (a-z) อย่างน้อย 1 ตัว</Text>
                    <Text style={styles.ruleItem}>• ตัวเลข (0-9) อย่างน้อย 1 ตัว</Text>
                    <Text style={styles.ruleItem}>• อักขระพิเศษ อย่างน้อย 1 ตัว เช่น @$!%*?&</Text>
                  </View>

                  <TouchableOpacity style={styles.checkboxRow} onPress={() => setIsAccepted(!isAccepted)} activeOpacity={0.7}>
                    <Ionicons name={isAccepted ? "checkbox" : "square-outline"} size={20} color={isAccepted ? "#1877f2" : "#8e8e93"} />
                    <Text style={styles.checkboxText}>ฉันยอมรับข้อกำหนดและนโยบายความเป็นส่วนตัว</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ alignItems: 'flex-end', marginTop: 20 }}>
                  <TouchableOpacity style={styles.pinkButton} onPress={handleNextStep}>
                    <Text style={styles.pinkButtonText}>ถัดไป  →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <View style={{ width: '100%' }}>
                <View style={styles.imagePickerContainer}>
                  <View style={styles.coverPhotoPlaceholder}>
                    <TouchableOpacity style={styles.addPhotoSmallBtn}>
                      <Feather name="camera" size={14} color="#666" />
                      <Text style={styles.addPhotoSmallText}> เพิ่มรูปภาพ</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.avatarPlaceholder}>
                    <Feather name="image" size={24} color="#aaa" />
                  </View>
                </View>

                <Text style={styles.inputLabel}>วัน/เดือน/ปี เกิด</Text>
                <TextInput style={styles.inputOutline} placeholder="11/11/2525" placeholderTextColor="#ccc" value={birthDate} onChangeText={setBirthDate} />

                {/* Dropdown เพศ */}
                <Text style={styles.inputLabel}>เพศ</Text>
                <TouchableOpacity style={styles.dropdownContainer} onPress={() => openDropdown('gender', genderOptions)}>
                  <Text style={[styles.dropdownInputText, !gender && {color: '#ccc'}]}>{gender || 'เพศ'}</Text>
                  <Feather name="chevron-down" size={20} color="#888" style={{ paddingRight: 12 }} />
                </TouchableOpacity>

                {/* Dropdown สัญชาติ */}
                <Text style={styles.inputLabel}>สัญชาติ</Text>
                <TouchableOpacity style={styles.dropdownContainer} onPress={() => openDropdown('nationality', nationalityOptions)}>
                  <Text style={[styles.dropdownInputText, !nationality && {color: '#ccc'}]}>{nationality || 'สัญชาติ'}</Text>
                  <Feather name="chevron-down" size={20} color="#888" style={{ paddingRight: 12 }} />
                </TouchableOpacity>

                <Text style={styles.inputLabel}>ที่อยู่</Text>
                <TextInput style={styles.inputOutline} placeholder="111/11" placeholderTextColor="#ccc" value={address} onChangeText={setAddress} />

                {/* Dropdown จังหวัด */}
                <Text style={styles.inputLabel}>จังหวัด</Text>
                <TouchableOpacity style={styles.dropdownContainer} onPress={() => openDropdown('province', provinceOptions)}>
                  <Text style={[styles.dropdownInputText, !province && {color: '#ccc'}]}>{province || 'จังหวัด'}</Text>
                  <Feather name="chevron-down" size={20} color="#888" style={{ paddingRight: 12 }} />
                </TouchableOpacity>

                <View style={styles.step2ButtonRow}>
                  <TouchableOpacity style={styles.pinkButtonOutline} onPress={() => setStep(1)}>
                    <Text style={styles.pinkButtonText}>←  กลับ</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.pinkButton} onPress={handleRegister} disabled={isLoading}>
                    <Text style={styles.pinkButtonText}>{isLoading ? 'กำลังโหลด...' : 'สมัคร'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      {/* หน้าต่างเลือก Dropdown (Modal) */}
      <Modal visible={dropdownVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setDropdownVisible(false)} activeOpacity={1}>
          <View style={styles.modalContent}>
            {dropdownOptions.map((opt, index) => (
              <TouchableOpacity key={index} style={styles.modalOption} onPress={() => selectOption(opt)}>
                <Text style={styles.modalOptionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4a4a4a' },
  headerBg: { width: '100%', height: 250 },
  safeArea: { flex: 1 },
  topHeaderText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginTop: Platform.OS === 'ios' ? 10 : 40 },
  bottomSheet: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -40,
    paddingHorizontal: 24,
  },
  scrollContent: { paddingVertical: 24, paddingBottom: 60, alignItems: 'center' },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between', marginBottom: 20 },
  backButtonInside: { padding: 8 },
  sheetTitle: { fontSize: 20, fontWeight: 'bold', color: '#4a4a4a' },
  progressBarContainer: { width: '100%', height: 6, backgroundColor: '#e0e0e0', borderRadius: 3, marginBottom: 24, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#007AFF', borderRadius: 3 },
  inputLabel: { fontSize: 13, color: '#666', marginBottom: 6, fontWeight: '600' },
  inputOutline: {
    width: '100%', height: 45, borderWidth: 1, borderColor: '#d1d1d6',
    borderRadius: 8, paddingHorizontal: 14, fontSize: 14, color: '#333', marginBottom: 16, backgroundColor: '#fff',
  },
  dropdownContainer: {
    width: '100%', height: 45, borderWidth: 1, borderColor: '#d1d1d6',
    borderRadius: 8, flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: '#fff',
  },
  dropdownInputText: { flex: 1, paddingHorizontal: 14, fontSize: 14, color: '#333' },
  passwordBoxContainer: {
    width: '100%', borderWidth: 1, borderColor: '#f0f0f0', borderRadius: 16,
    padding: 16, marginTop: 8, backgroundColor: '#ffffff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  rulesContainer: { marginTop: -4, marginBottom: 16 },
  ruleTitle: { fontSize: 12, fontWeight: 'bold', color: '#666', marginBottom: 4 },
  ruleItem: { fontSize: 11, color: '#666', marginBottom: 2 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  checkboxText: { fontSize: 11, color: '#666', marginLeft: 8, flex: 1 },
  imagePickerContainer: { width: '100%', alignItems: 'center', marginBottom: 30 },
  coverPhotoPlaceholder: { width: '100%', height: 120, backgroundColor: '#e5e5ea', borderRadius: 12, justifyContent: 'flex-end', alignItems: 'flex-end', padding: 8 },
  addPhotoSmallBtn: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, alignItems: 'center' },
  addPhotoSmallText: { fontSize: 10, color: '#666', fontWeight: 'bold' },
  avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#d1d1d6', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: -45, borderWidth: 3, borderColor: '#fff' },
  pinkButton: {
    backgroundColor: '#ffb6c1',
    paddingVertical: 12, paddingHorizontal: 24, borderRadius: 20,
    shadowColor: '#ffb6c1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 3,
  },
  pinkButtonOutline: {
    backgroundColor: '#ffb6c1', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 20,
    shadowColor: '#ffb6c1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 3,
  },
  pinkButtonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  step2ButtonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 },
  
  // สไตล์สำหรับ Modal (Dropdown)
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#fff', borderRadius: 12, paddingVertical: 10, elevation: 5 },
  modalOption: { paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  modalOptionText: { fontSize: 16, color: '#333' },
});