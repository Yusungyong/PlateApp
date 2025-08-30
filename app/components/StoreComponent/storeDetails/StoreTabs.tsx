import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const StoreTabs = ({ tabs, currentTab, onTabChange }) => (
  <View style={styles.tabs}>
    {tabs.map((name, i) => (
      <TouchableOpacity
        key={name}
        style={[styles.tabBtn, currentTab === i && styles.tabBtnActive]}
        onPress={() => onTabChange(i)}
      >
        <Text style={[styles.tabText, currentTab === i && styles.tabTextActive]}>{name}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 2,
    alignSelf: 'flex-start',
    marginLeft: 16,
  },
  tabBtn: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    backgroundColor: '#f1f1f1',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginRight: 8,
  },
  tabBtnActive: {
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderColor: '#007AFF',
  },
  tabText: {
    fontSize: 15,
    color: '#666',
  },
  tabTextActive: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default StoreTabs;
