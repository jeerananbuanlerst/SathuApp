import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qzjtscqztphllkfyrgbw.supabase.co';
const supabaseAnonKey = 'sb_publishable_C8VA6z8PYeKKyYLGVFCjPQ_TTTO5ys2'; 

// สร้าง Storage แบบกำหนดเอง เพื่อป้องกัน Error "window is not defined"
const customStorage = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return Promise.resolve(null);
    return AsyncStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return Promise.resolve();
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return Promise.resolve();
    return AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage, // เปลี่ยนมาใช้ customStorage ที่เราสร้างไว้
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});