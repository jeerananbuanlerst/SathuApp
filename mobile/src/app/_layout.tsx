import { Slot } from 'expo-router';
import * as Linking from 'expo-linking';
import { useEffect } from 'react';

export default function Layout() {
  const scheme = Linking.createURL('/');

  useEffect(() => {
    // ฟังก์ชันนี้จะคอยฟังว่ามี URL แปลกๆ ส่งเข้ามาที่แอปไหม
    const subscription = Linking.addEventListener('url', (event) => {
      let { path } = Linking.parse(event.url);
      console.log('Deep link received:', path);
    });

    return () => subscription.remove();
  }, []);

  return <Slot />;
}