import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';

const SelectedLocationPreview = ({
  storeName,
  location,
  onClear,
}: {
  storeName: string;
  location: string;
  onClear: () => void;
}) => (
  <TouchableWithoutFeedback onPress={onClear}>
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.storeName}>{storeName}</Text>
      <Text style={styles.storeAddress}>{location}</Text>
    </KeyboardAvoidingView>
  </TouchableWithoutFeedback>
);

export default SelectedLocationPreview;

const styles = StyleSheet.create({
  container: { padding: 12, backgroundColor: 'white', marginBottom: 8 },
  storeName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  storeAddress: { fontSize: 14, color: '#666' },
});
