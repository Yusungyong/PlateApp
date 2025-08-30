import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Section = ({ label, value }) => (
  <View style={styles.sectionRow}>
    <Text style={styles.sectionLabel}>{label}</Text>
    <Text style={styles.sectionValue}>{value}</Text>
  </View>
);

const StoreInfoSection = ({ item }) => (
  <>
    <Section label="이름" value={item.storeName} />
    <Section label="주소" value={item.address} />
    <Section label="작성자" value={item.username} />
    <Section label="유형" value={item.type === 'video' ? '영상' : '피드'} />
    {item.distance && <Section label="거리" value={item.distance} />}
  </>
);

const styles = StyleSheet.create({
  sectionRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  sectionLabel: {
    minWidth: 70,
    color: '#888',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionValue: {
    color: '#222',
    fontSize: 16,
    flex: 1,
    flexWrap: 'wrap',
  },
});

export default StoreInfoSection;
