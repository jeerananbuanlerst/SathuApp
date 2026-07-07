import React, { useRef, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Platform,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import BottomSheet, {
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import { Feather, Ionicons } from '@expo/vector-icons';

let MapView: any;

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
}

export default function MapScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['30%', '85%'], []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>

        {Platform.OS !== 'web' && MapView ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 14.979,
              longitude: 102.105,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          />
        ) : (
          <View style={styles.webPlaceholder}>
            <Text style={{ fontSize: 16 }}>
              ระบบแผนที่แสดงผลเฉพาะบนแอปมือถือ
            </Text>
          </View>
        )}

        <View style={styles.searchContainer}>
          <Feather
            name="search"
            size={20}
            color="#888"
          />

          <TextInput
            style={styles.searchInput}
            placeholder="ค้นหาวัดใกล้คุณ..."
            placeholderTextColor="#999"
          />

          <TouchableOpacity>
            <Ionicons
              name="options-outline"
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose={false}
          backgroundStyle={styles.sheetBackground}
        >
          <BottomSheetScrollView
            contentContainerStyle={styles.contentContainer}
          >
            <Text style={styles.sectionTitle}>
              วัดใกล้คุณ
            </Text>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                วัดศาลาลอย
              </Text>

              <Text style={styles.distance}>
                ระยะทาง 12 กม.
              </Text>

              <Text style={styles.address}>
                X4J8+6JP ซอยท้าวสุระ 3 ตำบลในเมือง
                อำเภอเมืองนครราชสีมา จังหวัดนครราชสีมา
              </Text>

              <View style={styles.ratingBox}>
                <Ionicons
                  name="star"
                  size={16}
                  color="#FFD700"
                />

                <Text style={styles.ratingText}>
                  4.6
                </Text>
              </View>
            </View>
          </BottomSheetScrollView>
        </BottomSheet>

      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  map: {
    flex: 1,
  },

  webPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },

  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#fff',

    borderRadius: 25,

    paddingHorizontal: 15,
    paddingVertical: 12,

    elevation: 5,

    zIndex: 10,
  },

  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },

  sheetBackground: {
    backgroundColor: '#FFFBF8',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  contentContainer: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,

    elevation: 3,

    marginBottom: 15,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },

  distance: {
    fontSize: 13,
    color: '#777',
    marginTop: 5,
  },

  address: {
    marginTop: 8,
    color: '#666',
    lineHeight: 22,
  },

  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },

  ratingText: {
    marginLeft: 6,
    fontWeight: '600',
    color: '#333',
  },
});