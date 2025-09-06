import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const LogoutButton = ({ onLogout }) => {
  return (
    <TouchableOpacity style={styles.logoutIconContainer} onPress={onLogout}>
      <Icon name="log-out-outline" size={30} color="#007AFF" />
      <Text style={styles.logoutText}>로그아웃</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 20,
    marginRight: 10,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default LogoutButton;
