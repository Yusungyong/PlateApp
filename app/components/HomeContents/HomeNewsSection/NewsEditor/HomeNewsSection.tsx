import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import HomeNewsCard from './HomeNewsCard';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../../auth/AuthProvider';
import LoginRequiredModal from '../../../../auth/LoginRequiredModal';

interface NewsItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  mainContent: string; 
}

interface Props {
  newsList: NewsItem[];
}

const HomeNewsSection: React.FC<Props> = ({ newsList }) => {
  const navigation = useNavigation();
  const { isLoggedIn, role } = useAuth();
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const handleRegisterPress = () => {
    if (!isLoggedIn || role === 'ROLE_GUEST') {
      setLoginModalVisible(true);
      return;
    }

    navigation.navigate('CustomNewsEditor');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>주변 소식</Text>
        <TouchableOpacity onPress={handleRegisterPress}>
          <Text style={styles.addButton}>+ 등록</Text>
        </TouchableOpacity>
      </View>

      {newsList.map((item) => (
        <HomeNewsCard
          key={item.id}
          imageUrl={item.imageUrl}
          title={item.title}
          description={item.description}
          mainContent={item.mainContent}
          onPress={() =>
            navigation.navigate('NewsDetailScreen', {
              mainContent: item.mainContent,
            })
          }
        />
      ))}

      <LoginRequiredModal
        visible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    fontSize: 16,
    color: '#007AFF',
  },
});

export default HomeNewsSection;
